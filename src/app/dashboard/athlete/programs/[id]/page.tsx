import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AthleteProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get program details
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (!program) {
    redirect('/dashboard/athlete/programs')
  }

  // Get workouts with exercises
  const { data: workouts } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises (
        *,
        exercise:exercises (*)
      )
    `)
    .eq('program_id', id)
    .order('day')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <a href="/dashboard/athlete" className="text-xl font-bold text-gray-900">
              StrongCoach
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <a
            href="/dashboard/athlete/programs"
            className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
          >
            ← Back to Programs
          </a>
          <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
          {program.description && (
            <p className="mt-1 text-gray-600">{program.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {workouts && workouts.length > 0 ? (
            workouts.map((workout: any) => (
              <div key={workout.id} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{workout.name}</h2>
                  <a
                    href={`/dashboard/athlete/workout/${workout.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Start Workout
                  </a>
                </div>

                <div className="space-y-3">
                  {workout.workout_exercises
                    .sort((a: any, b: any) => a.exercise_order - b.exercise_order)
                    .map((we: any, index: number) => (
                      <div
                        key={we.id}
                        className="flex items-center justify-between border-l-4 border-blue-500 bg-gray-50 px-4 py-3 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {index + 1}. {we.exercise?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {we.sets} sets × {we.reps} reps
                            {we.weight && ` @ ${we.weight}kg`}
                            {' • '}
                            Rest: {we.rest_time}s
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-white p-12 text-center">
              <p className="text-gray-500">No workouts in this program yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
