import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function CoachDashboard() {
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

  if (!profile || (profile.role !== 'coach' && profile.role !== 'both')) {
    redirect('/dashboard')
  }

  // Get coached athletes
  const { data: coachAthletes } = await supabase
    .from('coach_athletes')
    .select(`
      *,
      athlete:users!coach_athletes_athlete_id_fkey(*)
    `)
    .eq('coach_id', user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">StrongCoach</h1>
              <div className="flex gap-4">
                <a href="/dashboard/coach" className="text-blue-600 font-medium">
                  Athletes
                </a>
                <a href="/dashboard/coach/exercises" className="text-gray-600 hover:text-gray-900">
                  Exercises
                </a>
                <a href="/dashboard/coach/programs" className="text-gray-600 hover:text-gray-900">
                  Programs
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
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Athletes</h2>
          <a
            href="/dashboard/coach/invite"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Invite Athlete
          </a>
        </div>

        {!coachAthletes || coachAthletes.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No athletes yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by inviting your first athlete
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coachAthletes.map((ca: any) => (
              <a
                key={ca.id}
                href={`/dashboard/coach/athletes/${ca.athlete_id}`}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {ca.athlete?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{ca.athlete?.full_name}</h3>
                    <p className="text-sm text-gray-500">{ca.athlete?.email}</p>
                  </div>
                </div>
                {ca.notes && (
                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">{ca.notes}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
