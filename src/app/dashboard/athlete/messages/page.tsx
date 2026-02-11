import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Message } from '@/types'
import MessageList from '@/components/messages/MessageList'
import MessageSender from './MessageSender'

async function getMessages(userId: string, coachId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      sender_id,
      recipient_id,
      content,
      read,
      created_at,
      sender:sender_id(id, email, full_name),
      recipient:recipient_id(id, email, full_name)
    `)
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${coachId}),and(sender_id.eq.${coachId},recipient_id.eq.${userId})`)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data.map((msg: any) => ({
    id: msg.id,
    senderId: msg.sender_id,
    recipientId: msg.recipient_id,
    content: msg.content,
    read: msg.read,
    createdAt: msg.created_at,
    sender: msg.sender ? {
      id: msg.sender.id,
      email: msg.sender.email,
      fullName: msg.sender.full_name,
    } : undefined,
    recipient: msg.recipient ? {
      id: msg.recipient.id,
      email: msg.recipient.email,
      fullName: msg.recipient.full_name,
    } : undefined,
  })) as Message[]
}

async function getCoach(athleteId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('coach_athletes')
    .select(`
      coach:coach_id(id, email, full_name)
    `)
    .eq('athlete_id', athleteId)
    .single()

  if (error || !data?.coach) {
    return null
  }

  const coach = Array.isArray(data.coach) ? data.coach[0] : data.coach

  return {
    id: coach.id,
    email: coach.email,
    fullName: coach.full_name || coach.email,
  }
}

export default async function AthleteMessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/api/auth/signout')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!userProfile || (userProfile.role !== 'athlete' && userProfile.role !== 'both')) {
    redirect('/dashboard')
  }

  const coach = await getCoach(user.id)

  const messages = coach ? await getMessages(user.id, coach.id) : []

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">Communicate with your coach</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {coach ? (
            <>
              <div className="mb-6 pb-4 border-b">
                <h2 className="text-xl font-semibold">{coach.fullName}</h2>
                <p className="text-sm text-gray-500">{coach.email}</p>
              </div>

              <div className="mb-6 max-h-[500px] overflow-y-auto">
                <MessageList messages={messages} currentUserId={user.id} />
              </div>

              <MessageSender
                recipientId={coach.id}
                recipientName={coach.fullName}
              />
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>You don't have a coach yet.</p>
              <p className="text-sm mt-2">
                Ask your coach for an invitation link to get started.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <a
            href="/dashboard/athlete"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
