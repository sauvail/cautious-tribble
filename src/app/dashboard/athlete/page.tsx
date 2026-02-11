import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AthleteDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'athlete' && profile.role !== 'both')) {
    redirect('/dashboard')
  }

  // Get athlete stats
  const { data: stats } = await supabase
    .from('athlete_stats')
    .select('*')
    .eq('athlete_id', user.id)
    .single()

  // Get coach
  const { data: coachRelation } = await supabase
    .from('coach_athletes')
    .select(`
      *,
      coach:users!coach_athletes_coach_id_fkey(*)
    `)
    .eq('athlete_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">StrongCoach</h1>
              <div className="flex gap-4">
                <a href="/dashboard/athlete" className="text-blue-600 font-medium">
                  Dashboard
                </a>
                <a href="/dashboard/athlete/programs" className="text-gray-600 hover:text-gray-900">
                  Programs
                </a>
                <a href="/dashboard/athlete/calendar" className="text-gray-600 hover:text-gray-900">
                  Calendar
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{profile.full_name}</span>
              <form action="/api/auth/signout" method="post">
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {profile.full_name}!</h2>
          {coachRelation && (
            <p className="mt-1 text-gray-600">
              Coached by {coachRelation.coach?.full_name}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Max Squat</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats?.max_squat ? `${stats.max_squat} kg` : '-'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Max Bench</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats?.max_bench ? `${stats.max_bench} kg` : '-'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Max Deadlift</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats?.max_deadlift ? `${stats.max_deadlift} kg` : '-'}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Programs</h3>
            <div className="text-center py-8 text-gray-500">
              No active programs yet
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
