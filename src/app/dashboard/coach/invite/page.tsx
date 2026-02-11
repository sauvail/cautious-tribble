'use client'

import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InviteAthletePage() {
  const [invitationLink, setInvitationLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const generateInvitation = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      // Generate a random token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      // Create invitation that expires in 7 days
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const { error } = await supabase
        .from('coach_invitations')
        .insert({
          coach_id: user.id,
          token: token,
          expires_at: expiresAt.toISOString(),
        })

      if (error) throw error

      setInvitationLink(token)
    } catch (error) {
      console.error('Error generating invitation:', error)
      alert('Error generating invitation')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite an Athlete</h1>
          <p className="text-gray-600 mb-8">
            Generate an invitation token to share with your athlete. The token is valid for 7 days.
          </p>

          {!invitationLink ? (
            <button
              onClick={generateInvitation}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Invitation Token'}
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invitation Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={invitationLink}
                    readOnly
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Share this token with your athlete
                </h3>
                <p className="text-sm text-blue-800">
                  Your athlete will need to enter this token during their account setup to connect with you as their coach.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setInvitationLink('')}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Generate Another
                </button>
                <a
                  href="/dashboard/coach"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
