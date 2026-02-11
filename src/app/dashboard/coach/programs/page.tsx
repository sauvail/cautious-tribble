import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function CoachProgramsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get coach's programs
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('coach_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">StrongCoach</h1>
              <div className="flex gap-4">
                <a href="/dashboard/coach" className="text-gray-600 hover:text-gray-900">
                  Athletes
                </a>
                <a href="/dashboard/coach/exercises" className="text-gray-600 hover:text-gray-900">
                  Exercises
                </a>
                <a href="/dashboard/coach/programs" className="text-blue-600 font-medium">
                  Programs
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
          <h2 className="text-2xl font-bold text-gray-900">My Programs</h2>
          <a
            href="/dashboard/coach/programs/create"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Program
          </a>
        </div>

        {!programs || programs.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No programs yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first workout program
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program: any) => (
              <a
                key={program.id}
                href={`/dashboard/coach/programs/${program.id}`}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{program.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      program.status === 'in_progress'
                        ? 'bg-green-100 text-green-800'
                        : program.status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {program.status.replace('_', ' ')}
                  </span>
                </div>
                {program.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
                )}
                <p className="mt-4 text-xs text-gray-500">
                  Created {new Date(program.created_at).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
