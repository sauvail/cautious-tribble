import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function CoachExercisesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get all exercises (system-wide and coach's custom exercises)
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .or(`coach_id.is.null,coach_id.eq.${user.id}`)
    .order('name')

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
                <a href="/dashboard/coach/exercises" className="text-blue-600 font-medium">
                  Exercises
                </a>
                <a href="/dashboard/coach/programs" className="text-gray-600 hover:text-gray-900">
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
          <h2 className="text-2xl font-bold text-gray-900">Exercise Library</h2>
        </div>

        {!exercises || exercises.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No exercises available</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise: any) => (
              <div
                key={exercise.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                {exercise.description && (
                  <p className="mt-2 text-sm text-gray-600">{exercise.description}</p>
                )}
                {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Muscle Groups</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscle_groups.map((muscle: string) => (
                        <span
                          key={muscle}
                          className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Equipment</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map((equip: string) => (
                        <span
                          key={equip}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                        >
                          {equip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
