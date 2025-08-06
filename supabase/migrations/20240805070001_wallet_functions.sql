-- Helper function to get a wallet with row-level locking
CREATE OR REPLACE FUNCTION get_wallet_for_update(p_user_id UUID)
RETURNS SETOF wallets AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM wallets 
  WHERE user_id = p_user_id
  FOR UPDATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reserve credits
CREATE OR REPLACE FUNCTION reserve_credits(
  p_user_id UUID,
  p_amount DECIMAL(10, 4),
  p_reference TEXT DEFAULT NULL
) 
RETURNS TABLE (reservation_id UUID) AS $$
DECLARE
  v_wallet_id UUID;
  v_available_credits DECIMAL(10, 4);
  v_transaction_id UUID;
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero' USING ERRCODE 'invalid_parameter_value';
  END IF;

  -- Start transaction
  BEGIN
    -- Get and lock the wallet
    SELECT id, credits_available 
    INTO v_wallet_id, v_available_credits
    FROM get_wallet_for_update(p_user_id);

    -- Check if wallet exists
    IF v_wallet_id IS NULL THEN
      RAISE EXCEPTION 'Wallet not found for user %', p_user_id 
      USING ERRCODE 'no_data_found';
    END IF;

    -- Check balance
    IF v_available_credits < p_amount THEN
      RAISE EXCEPTION 'Insufficient credits' 
      USING 
        ERRCODE 'insufficient_credits',
        DETAIL = json_build_object(
          'available', v_available_credits,
          'required', p_amount
        )::text;
    END IF;

    -- Create reservation transaction
    INSERT INTO transactions (
      wallet_id, 
      amount, 
      type, 
      status, 
      reference_id,
      metadata
    ) VALUES (
      v_wallet_id,
      p_amount,
      'reservation',
      'pending',
      p_reference,
      jsonb_build_object(
        'description', 'Credit reservation for content generation',
        'reserved_at', NOW()
      )
    )
    RETURNING id INTO v_transaction_id;

    -- Update wallet balance
    UPDATE wallets
    SET 
      credits_available = credits_available - p_amount,
      updated_at = NOW()
    WHERE id = v_wallet_id;

    -- Return the transaction ID
    RETURN QUERY SELECT v_transaction_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to confirm credit deduction
CREATE OR REPLACE FUNCTION confirm_credit_deduction(
  p_reservation_id UUID,
  p_actual_amount DECIMAL(10, 4)
)
RETURNS SETOF transactions AS $$
DECLARE
  v_reservation RECORD;
  v_wallet_id UUID;
  v_difference DECIMAL(10, 4);
  v_transaction_id UUID;
BEGIN
  -- Validate amount
  IF p_actual_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero' USING ERRCODE 'invalid_parameter_value';
  END IF;

  -- Start transaction
  BEGIN
    -- Get and lock the reservation
    SELECT * INTO v_reservation
    FROM transactions
    WHERE id = p_reservation_id
      AND type = 'reservation'
      AND status = 'pending'
    FOR UPDATE;

    -- Check if reservation exists
    IF v_reservation.id IS NULL THEN
      RAISE EXCEPTION 'Reservation not found or already processed' 
      USING ERRCODE 'no_data_found';
    END IF;

    -- Validate amount doesn't exceed reservation
    IF p_actual_amount > v_reservation.amount THEN
      RAISE EXCEPTION 'Actual amount exceeds reserved amount' 
      USING 
        ERRCODE 'invalid_parameter_value',
        DETAIL = json_build_object(
          'actual', p_actual_amount,
          'reserved', v_reservation.amount
        )::text;
    END IF;

    v_wallet_id := v_reservation.wallet_id;
    v_difference := v_reservation.amount - p_actual_amount;

    -- Create debit transaction
    INSERT INTO transactions (
      wallet_id,
      amount,
      type,
      status,
      reference_id,
      metadata
    ) VALUES (
      v_wallet_id,
      p_actual_amount,
      'debit',
      'completed',
      p_reservation_id,
      jsonb_build_object(
        'description', 'Credit deduction for content generation',
        'reservation_id', p_reservation_id,
        'confirmed_at', NOW()
      )
    )
    RETURNING id INTO v_transaction_id;

    -- Update reservation status
    UPDATE transactions
    SET 
      status = 'completed',
      metadata = metadata || jsonb_build_object(
        'finalized_at', NOW(),
        'actual_amount', p_actual_amount,
        'status', 'confirmed'
      )
    WHERE id = p_reservation_id;

    -- Update wallet's used credits
    UPDATE wallets
    SET 
      credits_used = credits_used + p_actual_amount,
      updated_at = NOW()
    WHERE id = v_wallet_id;

    -- Release any unused portion of the reservation
    IF v_difference > 0 THEN
      PERFORM release_credits(p_reservation_id, v_difference);
    END IF;

    -- Return the debit transaction
    RETURN QUERY SELECT * FROM transactions WHERE id = v_transaction_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to release credits
CREATE OR REPLACE FUNCTION release_credits(
  p_reservation_id UUID,
  p_amount DECIMAL(10, 4) DEFAULT NULL
)
RETURNS SETOF transactions AS $$
DECLARE
  v_reservation RECORD;
  v_wallet_id UUID;
  v_release_amount DECIMAL(10, 4);
  v_transaction_id UUID;
BEGIN
  -- Start transaction
  BEGIN
    -- Get and lock the reservation
    SELECT * INTO v_reservation
    FROM transactions
    WHERE id = p_reservation_id
      AND type = 'reservation'
      AND status = 'pending'
    FOR UPDATE;

    -- Check if reservation exists
    IF v_reservation.id IS NULL THEN
      RAISE EXCEPTION 'Reservation not found or already processed' 
      USING ERRCODE 'no_data_found';
    END IF;

    v_wallet_id := v_reservation.wallet_id;
    v_release_amount := COALESCE(p_amount, v_reservation.amount);
    
    -- Validate release amount
    IF v_release_amount <= 0 OR v_release_amount > v_reservation.amount THEN
      RAISE EXCEPTION 'Invalid release amount' 
      USING 
        ERRCODE 'invalid_parameter_value',
        DETAIL = json_build_object(
          'amount', v_release_amount,
          'reserved', v_reservation.amount
        )::text;
    END IF;

    -- Create release transaction
    INSERT INTO transactions (
      wallet_id,
      amount,
      type,
      status,
      reference_id,
      metadata
    ) VALUES (
      v_wallet_id,
      v_release_amount,
      'release',
      'completed',
      p_reservation_id,
      jsonb_build_object(
        'description', 'Credit release from reservation',
        'reservation_id', p_reservation_id,
        'released_at', NOW()
      )
    )
    RETURNING id INTO v_transaction_id;

    -- Update wallet balance
    UPDATE wallets
    SET 
      credits_available = credits_available + v_release_amount,
      updated_at = NOW()
    WHERE id = v_wallet_id;

    -- Update or delete the reservation
    IF v_release_amount = v_reservation.amount THEN
      -- Full release, mark as completed
      UPDATE transactions
      SET 
        status = 'completed',
        metadata = metadata || jsonb_build_object(
          'released_at', NOW(),
          'status', 'released'
        )
      WHERE id = p_reservation_id;
    ELSE
      -- Partial release, reduce amount
      UPDATE transactions
      SET 
        amount = amount - v_release_amount,
        metadata = metadata || jsonb_build_object(
          'partial_release', jsonb_build_object(
            'amount', v_release_amount,
            'at', NOW(),
            'remaining', amount - v_release_amount
          )
        )
      WHERE id = p_reservation_id;
    END IF;

    -- Return the release transaction
    RETURN QUERY SELECT * FROM transactions WHERE id = v_transaction_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits to a wallet
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount DECIMAL(10, 4),
  p_reference TEXT DEFAULT NULL
)
RETURNS SETOF transactions AS $$
DECLARE
  v_wallet_id UUID;
  v_transaction_id UUID;
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero' USING ERRCODE 'invalid_parameter_value';
  END IF;

  -- Start transaction
  BEGIN
    -- Get or create wallet
    INSERT INTO wallets (user_id, credits_available, credits_used)
    VALUES (p_user_id, p_amount, 0)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      credits_available = wallets.credits_available + p_amount,
      updated_at = NOW()
    RETURNING id INTO v_wallet_id;

    -- Create deposit transaction
    INSERT INTO transactions (
      wallet_id,
      amount,
      type,
      status,
      reference_id,
      metadata
    ) VALUES (
      v_wallet_id,
      p_amount,
      'deposit',
      'completed',
      p_reference,
      jsonb_build_object(
        'description', 'Credit deposit',
        'deposited_at', NOW()
      )
    )
    RETURNING id INTO v_transaction_id;

    -- Return the deposit transaction
    RETURN QUERY SELECT * FROM transactions WHERE id = v_transaction_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
