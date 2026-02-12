import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

// Create supabase client lazily on first access
const getSupabaseClient = () => {
  if (client) return client

  // Only access env vars in the browser to ensure proper hydration
  const supabaseUrl = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    : ''
  const supabasePublishableKey = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''
    : ''

  if (!supabaseUrl || !supabasePublishableKey) {
    // Return a minimal client that won't crash during build
    client = createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } else {
    client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  return client
}

export const supabase = getSupabaseClient()
