import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get user's team
    const { data: userTeam, error: teamError } = await supabaseClient
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .single()

    if (teamError || !userTeam) {
      return new Response(JSON.stringify({ error: 'User not part of a team' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get all team members
    const { data: teamMembers, error: membersError } = await supabaseClient
      .from('team_members')
      .select(`
        id,
        role,
        status,
        created_at,
        profiles (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('team_id', userTeam.team_id)

    if (membersError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch team members' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Format the response
    const formattedMembers = teamMembers.map(member => ({
      id: member.id,
      name: member.profiles?.full_name || 'Unknown User',
      email: member.profiles?.email || '',
      avatar: member.profiles?.avatar_url || null,
      role: member.role,
      status: member.status,
      lastActive: member.created_at ? new Date(member.created_at).toLocaleDateString() : 'Unknown'
    }))

    return new Response(JSON.stringify({
      teamMembers: formattedMembers
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}) 