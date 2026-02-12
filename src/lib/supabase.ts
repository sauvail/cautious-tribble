import { createBrowserClient } from '@supabase/ssr'

// Create a singleton Supabase client for use in Client Components
// Use placeholder values during build if environment variables are not set
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'placeholder-key'
)
