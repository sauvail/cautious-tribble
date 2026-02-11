// User and Authentication Types
export type UserRole = 'coach' | 'athlete' | 'both'

export interface User {
  id: string
  email: string
  fullName: string | null
  role: UserRole | null
  createdAt: string
  updatedAt: string
}

export interface CoachInvitation {
  id: string
  coachId: string
  token: string
  expiresAt: string
  usedByAthleteId: string | null
  createdAt: string
}

// Exercise Types
export interface Exercise {
  id: string
  coachId: string
  name: string
  description: string | null
  muscleGroups: string[]
  equipment: string[]
  createdAt: string
}

export interface WorkoutExercise {
  id: string
  workoutId: string
  exerciseId: string
  sets: number
  reps: number
  weight: number | null
  restTime: number // in seconds
  order: number
  exercise?: Exercise
}

// Program and Workout Types
export interface Program {
  id: string
  coachId: string
  name: string
  description: string | null
  status: 'draft' | 'in_progress' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface Workout {
  id: string
  programId: string
  name: string
  day: number
  exercises: WorkoutExercise[]
  createdAt: string
}

export interface WorkoutLog {
  id: string
  athleteId: string
  workoutId: string
  startedAt: string
  completedAt: string | null
  status: 'not_started' | 'in_progress' | 'completed'
}

export interface ExerciseLog {
  id: string
  workoutLogId: string
  workoutExerciseId: string
  setNumber: number
  reps: number
  weight: number
  completedAt: string
}

// Message Types
export interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  read: boolean
  createdAt: string
  sender?: User
  recipient?: User
}

// Stats Types (Mock for now)
export interface AthleteStats {
  athleteId: string
  maxSquat: number | null
  maxBench: number | null
  maxDeadlift: number | null
  totalVolume: number
  lastProgramWeight: number
  lastUpdated: string
}

// Athlete-Coach Relationship
export interface CoachAthlete {
  id: string
  coachId: string
  athleteId: string
  notes: string | null
  createdAt: string
  coach?: User
  athlete?: User
}

export interface CalendarEvent {
  id: string
  userId: string
  title: string
  description: string | null
  date: string
  type: 'program' | 'competition' | 'holiday' | 'other'
  createdAt: string
}
