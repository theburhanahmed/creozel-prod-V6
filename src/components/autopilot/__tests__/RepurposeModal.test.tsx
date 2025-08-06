// Dev-Rules §Testing Standards: Component Tests
import { render, screen, fireEvent } from '@testing-library/react';
import { RepurposeModal } from '../RepurposeModal';

describe('RepurposeModal', () => {
  const mockOnClose = jest.fn();
  const mockOnRepurpose = jest.fn().mockResolvedValue({});
  
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    contentId: 'content-123',
    originalContent: 'Test content',
    onRepurpose: mockOnRepurpose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when isOpen is true', () => {
    render(<RepurposeModal {...defaultProps} />);
    expect(screen.getByText('Repurpose Content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <RepurposeModal {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<RepurposeModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('enables Generate button when platforms are selected', () => {
    render(<RepurposeModal {...defaultProps} />);
    
    // Initially disabled
    const generateButton = screen.getByText('Generate Variations');
    expect(generateButton).toBeDisabled();
    
    // Select a platform
    const twitterCheckbox = screen.getByLabelText('Twitter');
    fireEvent.click(twitterCheckbox);
    
    // Should be enabled now
    expect(generateButton).not.toBeDisabled();
  });

  it('calls onRepurpose with correct config when form is submitted', async () => {
    render(<RepurposeModal {...defaultProps} />);
    
    // Select options
    fireEvent.click(screen.getByLabelText('Twitter'));
    fireEvent.click(screen.getByLabelText('LinkedIn'));
    fireEvent.click(screen.getByLabelText('Include Hashtags'));
    
    // Submit form
    fireEvent.click(screen.getByText('Generate Variations'));
    
    // Check if onRepurpose was called with correct config
    expect(mockOnRepurpose).toHaveBeenCalledWith({
      targetPlatforms: ['twitter', 'linkedin'],
      includeHashtags: true,
      includeEmojis: true, // default value
    });
  });

  it('shows loading state while repurposing', async () => {
    // Create a promise that we can resolve later
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockOnRepurpose.mockReturnValueOnce(promise);
    
    render(<RepurposeModal {...defaultProps} />);
    
    // Select a platform and submit
    fireEvent.click(screen.getByLabelText('Twitter'));
    fireEvent.click(screen.getByText('Generate Variations'));
    
    // Should show loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument();
    
    // Resolve the promise
    await act(async () => {
      resolvePromise({});
      await promise;
    });
    
    // Should return to normal state
    expect(screen.queryByText('Generating...')).not.toBeInTheDocument();
  });
});
