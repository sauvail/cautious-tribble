'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [role, setRole] = useState<'coach' | 'athlete' | 'both' | null>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [invitationToken, setInvitationToken] = useState('')
  const router = useRouter()

  const handleSetupProfile = async () => {
    if (!role || !fullName) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Not authenticated')
        return
      }

      // If athlete, check for invitation token
      if ((role === 'athlete' || role === 'both') && !invitationToken) {
        alert('Athletes need an invitation token from a coach')
        return
      }

      // Validate invitation token if provided
      if (invitationToken) {
        const { data: invitation } = await supabase
          .from('coach_invitations')
          .select('*')
          .eq('token', invitationToken)
          .is('used_by_athlete_id', null)
          .gt('expires_at', new Date().toISOString())
          .single()

        if (!invitation) {
          alert('Invalid or expired invitation token')
          return
        }
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          role: role,
        })

      if (profileError) throw profileError

      // If athlete with invitation, create coach-athlete relationship
      if (invitationToken) {
        const { data: invitation } = await supabase
          .from('coach_invitations')
          .select('coach_id')
          .eq('token', invitationToken)
          .single()

        if (invitation) {
          await supabase
            .from('coach_athletes')
            .insert({
              coach_id: invitation.coach_id,
              athlete_id: user.id,
            })

          // Mark invitation as used
          await supabase
            .from('coach_invitations')
            .update({ used_by_athlete_id: user.id })
            .eq('token', invitationToken)
        }
      }

      // Create athlete stats if user is an athlete
      if (role === 'athlete' || role === 'both') {
        await supabase
          .from('athlete_stats')
          .upsert({
            athlete_id: user.id,
            max_squat: null,
            max_bench: null,
            max_deadlift: null,
            total_volume: 0,
            last_program_weight: 0,
          })
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error setting up profile:', error)
      alert('Error setting up profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <main className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to StrongCoach</h1>
          <p className="mt-2 text-gray-600">Let's set up your profile</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setRole('coach')}
                className={`rounded-lg border-2 px-4 py-3 text-left transition-all ${
                  role === 'coach'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Coach</div>
                <div className="text-sm text-gray-600">Manage athletes and programs</div>
              </button>
              <button
                onClick={() => setRole('athlete')}
                className={`rounded-lg border-2 px-4 py-3 text-left transition-all ${
                  role === 'athlete'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Athlete</div>
                <div className="text-sm text-gray-600">Track workouts and progress</div>
              </button>
              <button
                onClick={() => setRole('both')}
                className={`rounded-lg border-2 px-4 py-3 text-left transition-all ${
                  role === 'both'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Both</div>
                <div className="text-sm text-gray-600">Coach others and track my own training</div>
              </button>
            </div>
          </div>

          {(role === 'athlete' || role === 'both') && (
            <div>
              <label htmlFor="invitationToken" className="block text-sm font-medium text-gray-700 mb-1">
                Invitation Token
              </label>
              <input
                id="invitationToken"
                type="text"
                value={invitationToken}
                onChange={(e) => setInvitationToken(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your coach's invitation token"
              />
              <p className="mt-1 text-xs text-gray-500">
                Get this token from your coach to connect
              </p>
            </div>
          )}

          <button
            onClick={handleSetupProfile}
            disabled={loading || !role || !fullName}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </div>
      </main>
    </div>
  )
}
