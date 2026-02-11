'use client'

import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Exercise {
  id: string
  name: string
  description: string | null
  muscle_groups: string[]
  equipment: string[]
}

interface WorkoutExercise {
  exerciseId: string
  sets: number
  reps: number
  weight: number | null
  restTime: number
}

interface Workout {
  name: string
  day: number
  exercises: WorkoutExercise[]
}

export default function CreateProgramPage() {
  const [programName, setProgramName] = useState('')
  const [programDescription, setProgramDescription] = useState('')
  const [workouts, setWorkouts] = useState<Workout[]>([
    { name: 'Day 1', day: 1, exercises: [] }
  ])
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('exercises')
      .select('*')
      .or(`coach_id.is.null,coach_id.eq.${user.id}`)
      .order('name')

    if (data) {
      setAvailableExercises(data)
    }
  }

  const addWorkout = () => {
    setWorkouts([...workouts, {
      name: `Day ${workouts.length + 1}`,
      day: workouts.length + 1,
      exercises: []
    }])
  }

  const removeWorkout = (index: number) => {
    setWorkouts(workouts.filter((_, i) => i !== index))
  }

  const addExerciseToWorkout = (workoutIndex: number) => {
    const updatedWorkouts = [...workouts]
    updatedWorkouts[workoutIndex].exercises.push({
      exerciseId: availableExercises[0]?.id || '',
      sets: 3,
      reps: 10,
      weight: null,
      restTime: 60
    })
    setWorkouts(updatedWorkouts)
  }

  const removeExerciseFromWorkout = (workoutIndex: number, exerciseIndex: number) => {
    const updatedWorkouts = [...workouts]
    updatedWorkouts[workoutIndex].exercises = updatedWorkouts[workoutIndex].exercises.filter(
      (_, i) => i !== exerciseIndex
    )
    setWorkouts(updatedWorkouts)
  }

  const updateWorkoutExercise = (
    workoutIndex: number,
    exerciseIndex: number,
    field: keyof WorkoutExercise,
    value: any
  ) => {
    const updatedWorkouts = [...workouts]
    updatedWorkouts[workoutIndex].exercises[exerciseIndex] = {
      ...updatedWorkouts[workoutIndex].exercises[exerciseIndex],
      [field]: value
    }
    setWorkouts(updatedWorkouts)
  }

  const handleCreateProgram = async () => {
    if (!programName) {
      alert('Please enter a program name')
      return
    }

    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Create program
      const { data: program, error: programError } = await supabase
        .from('programs')
        .insert({
          coach_id: user.id,
          name: programName,
          description: programDescription,
          status: 'draft'
        })
        .select()
        .single()

      if (programError) throw programError

      // Create workouts
      for (const workout of workouts) {
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .insert({
            program_id: program.id,
            name: workout.name,
            day: workout.day
          })
          .select()
          .single()

        if (workoutError) throw workoutError

        // Create workout exercises
        for (let i = 0; i < workout.exercises.length; i++) {
          const exercise = workout.exercises[i]
          const { error: exerciseError } = await supabase
            .from('workout_exercises')
            .insert({
              workout_id: workoutData.id,
              exercise_id: exercise.exerciseId,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              rest_time: exercise.restTime,
              exercise_order: i
            })

          if (exerciseError) throw exerciseError
        }
      }

      router.push('/dashboard/coach/programs')
    } catch (error) {
      console.error('Error creating program:', error)
      alert('Error creating program')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <a href="/dashboard/coach" className="text-xl font-bold text-gray-900">
              StrongCoach
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Program</h1>
          <p className="mt-1 text-gray-600">Build a workout program for your athletes</p>
        </div>

        <div className="space-y-6">
          {/* Program Details */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name
                </label>
                <input
                  id="programName"
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Beginner Strength Program"
                />
              </div>
              <div>
                <label htmlFor="programDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="programDescription"
                  value={programDescription}
                  onChange={(e) => setProgramDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Describe the program goals and approach"
                />
              </div>
            </div>
          </div>

          {/* Workouts */}
          <div className="space-y-4">
            {workouts.map((workout, workoutIndex) => (
              <div key={workoutIndex} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={workout.name}
                    onChange={(e) => {
                      const updated = [...workouts]
                      updated[workoutIndex].name = e.target.value
                      setWorkouts(updated)
                    }}
                    className="text-lg font-semibold text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 -ml-2"
                  />
                  <button
                    onClick={() => removeWorkout(workoutIndex)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove Day
                  </button>
                </div>

                <div className="space-y-3">
                  {workout.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Exercise
                          </label>
                          <select
                            value={exercise.exerciseId}
                            onChange={(e) => updateWorkoutExercise(workoutIndex, exerciseIndex, 'exerciseId', e.target.value)}
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          >
                            {availableExercises.map((ex) => (
                              <option key={ex.id} value={ex.id}>
                                {ex.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Sets
                          </label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateWorkoutExercise(workoutIndex, exerciseIndex, 'sets', parseInt(e.target.value))}
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Reps
                          </label>
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => updateWorkoutExercise(workoutIndex, exerciseIndex, 'reps', parseInt(e.target.value))}
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Rest (s)
                          </label>
                          <input
                            type="number"
                            value={exercise.restTime}
                            onChange={(e) => updateWorkoutExercise(workoutIndex, exerciseIndex, 'restTime', parseInt(e.target.value))}
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            min="0"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeExerciseFromWorkout(workoutIndex, exerciseIndex)}
                        className="mt-2 text-xs text-red-600 hover:text-red-700"
                      >
                        Remove Exercise
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addExerciseToWorkout(workoutIndex)}
                  disabled={availableExercises.length === 0}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                >
                  + Add Exercise
                </button>
              </div>
            ))}

            <button
              onClick={addWorkout}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + Add Workout Day
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <a
              href="/dashboard/coach/programs"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              onClick={handleCreateProgram}
              disabled={loading || !programName}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
