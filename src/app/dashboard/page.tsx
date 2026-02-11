import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check if user has set their role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile?.role) {
    redirect('/setup')
  }

  // Redirect based on role
  if (profile.role === 'coach') {
    redirect('/dashboard/coach')
  } else if (profile.role === 'athlete') {
    redirect('/dashboard/athlete')
  } else if (profile.role === 'both') {
    // Default to coach dashboard if user is both
    redirect('/dashboard/coach')
  }

  return null
}
