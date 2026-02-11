'use client'

import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WorkoutExercise {
  id: string
  exercise_id: string
  sets: number
  reps: number
  weight: number | null
  rest_time: number
  exercise_order: number
  exercise: {
    name: string
    description: string | null
  }
}

interface SetLog {
  setNumber: number
  reps: number
  weight: number
  completed: boolean
}

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [workoutId, setWorkoutId] = useState<string>('')
  const [workout, setWorkout] = useState<any>(null)
  const [workoutLog, setWorkoutLog] = useState<any>(null)
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, SetLog[]>>({})
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    params.then((p) => {
      setWorkoutId(p.id)
      loadWorkout(p.id)
    })
  }, [])

  const loadWorkout = async (id: string) => {
    try {
      const { data: workoutData } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            *,
            exercise:exercises (*)
          )
        `)
        .eq('id', id)
        .single()

      if (workoutData) {
        setWorkout(workoutData)

        // Initialize exercise logs
        const logs: Record<string, SetLog[]> = {}
        workoutData.workout_exercises
          .sort((a: any, b: any) => a.exercise_order - b.exercise_order)
          .forEach((we: WorkoutExercise) => {
            logs[we.id] = Array.from({ length: we.sets }, (_, i) => ({
              setNumber: i + 1,
              reps: we.reps,
              weight: we.weight || 0,
              completed: false,
            }))
          })
        setExerciseLogs(logs)
      }
    } catch (error) {
      console.error('Error loading workout:', error)
    } finally {
      setLoading(false)
    }
  }

  const startWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          athlete_id: user.id,
          workout_id: workoutId,
          status: 'in_progress',
        })
        .select()
        .single()

      if (error) throw error
      setWorkoutLog(data)
    } catch (error) {
      console.error('Error starting workout:', error)
      alert('Error starting workout')
    }
  }

  const updateSetLog = (exerciseId: string, setIndex: number, field: keyof SetLog, value: any) => {
    setExerciseLogs({
      ...exerciseLogs,
      [exerciseId]: exerciseLogs[exerciseId].map((log, i) =>
        i === setIndex ? { ...log, [field]: value } : log
      ),
    })
  }

  const completeSet = async (exerciseId: string, setIndex: number) => {
    if (!workoutLog) return

    const setLog = exerciseLogs[exerciseId][setIndex]

    try {
      await supabase.from('exercise_logs').insert({
        workout_log_id: workoutLog.id,
        workout_exercise_id: exerciseId,
        set_number: setLog.setNumber,
        reps: setLog.reps,
        weight: setLog.weight,
      })

      updateSetLog(exerciseId, setIndex, 'completed', true)
    } catch (error) {
      console.error('Error logging set:', error)
    }
  }

  const completeWorkout = async () => {
    if (!workoutLog) return

    try {
      await supabase
        .from('workout_logs')
        .update({
          completed_at: new Date().toISOString(),
          status: 'completed',
        })
        .eq('id', workoutLog.id)

      router.push('/dashboard/athlete')
    } catch (error) {
      console.error('Error completing workout:', error)
      alert('Error completing workout')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading workout...</p>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Workout not found</p>
      </div>
    )
  }

  const sortedExercises = workout.workout_exercises.sort(
    (a: any, b: any) => a.exercise_order - b.exercise_order
  )
  const currentExercise = sortedExercises[currentExerciseIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">{workout.name}</h1>
            {workoutLog && (
              <span className="text-sm text-green-600 font-medium">In Progress</span>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        {!workoutLog ? (
          <div className="rounded-lg bg-white p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to start?</h2>
            <p className="text-gray-600 mb-6">
              This workout has {sortedExercises.length} exercises
            </p>
            <button
              onClick={startWorkout}
              className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700"
            >
              Start Workout
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Exercise {currentExerciseIndex + 1} of {sortedExercises.length}
                </span>
                <div className="flex gap-2">
                  {sortedExercises.map((_: any, i: number) => (
                    <div
                      key={i}
                      className={`h-2 w-8 rounded ${
                        i < currentExerciseIndex
                          ? 'bg-green-500'
                          : i === currentExerciseIndex
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Current Exercise */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentExercise.exercise.name}
              </h2>
              {currentExercise.exercise.description && (
                <p className="text-gray-600 mb-4">{currentExercise.exercise.description}</p>
              )}
              <p className="text-sm text-gray-500 mb-6">
                Rest: {currentExercise.rest_time} seconds between sets
              </p>

              <div className="space-y-3">
                {exerciseLogs[currentExercise.id]?.map((setLog, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border-2 p-4 ${
                      setLog.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">Set {setLog.setNumber}</span>
                      {setLog.completed && (
                        <span className="text-sm text-green-600 font-medium">✓ Completed</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Reps
                        </label>
                        <input
                          type="number"
                          value={setLog.reps}
                          onChange={(e) =>
                            updateSetLog(currentExercise.id, index, 'reps', parseInt(e.target.value))
                          }
                          disabled={setLog.completed}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-center text-lg font-semibold disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={setLog.weight}
                          onChange={(e) =>
                            updateSetLog(currentExercise.id, index, 'weight', parseFloat(e.target.value))
                          }
                          disabled={setLog.completed}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-center text-lg font-semibold disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    {!setLog.completed && (
                      <button
                        onClick={() => completeSet(currentExercise.id, index)}
                        className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Complete Set
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                {currentExerciseIndex > 0 && (
                  <button
                    onClick={() => setCurrentExerciseIndex(currentExerciseIndex - 1)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    ← Previous Exercise
                  </button>
                )}
                {currentExerciseIndex < sortedExercises.length - 1 ? (
                  <button
                    onClick={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Next Exercise →
                  </button>
                ) : (
                  <button
                    onClick={completeWorkout}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Complete Workout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
