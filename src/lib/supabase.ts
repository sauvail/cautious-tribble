import { createBrowserClient } from '@supabase/ssr'

// Create a singleton Supabase client for use in Client Components
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)
