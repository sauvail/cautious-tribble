import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Message, User } from '@/types'
import MessageList from '@/components/messages/MessageList'
import MessageSender from './MessageSender'

async function getMessages(userId: string, recipientId: string) {
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
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`)
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

async function getAthletes(coachId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('coach_athletes')
    .select(`
      athlete:athlete_id(id, email, full_name)
    `)
    .eq('coach_id', coachId)

  if (error) {
    console.error('Error fetching athletes:', error)
    return []
  }

  return data
    .filter((item: any) => item.athlete)
    .map((item: any) => ({
      id: item.athlete.id,
      email: item.athlete.email,
      fullName: item.athlete.full_name || item.athlete.email,
    }))
}

export default async function CoachMessagesPage({
  searchParams,
}: {
  searchParams: { athlete?: string }
}) {
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

  if (!userProfile || (userProfile.role !== 'coach' && userProfile.role !== 'both')) {
    redirect('/dashboard')
  }

  const athletes = await getAthletes(user.id)
  const selectedAthleteId = searchParams.athlete || athletes[0]?.id || null
  const selectedAthlete = athletes.find((a: any) => a.id === selectedAthleteId)

  const messages = selectedAthleteId
    ? await getMessages(user.id, selectedAthleteId)
    : []

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">Communicate with your athletes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Athletes list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Athletes</h2>
              {athletes.length === 0 ? (
                <p className="text-sm text-gray-500">No athletes yet</p>
              ) : (
                <div className="space-y-2">
                  {athletes.map((athlete: any) => (
                    <a
                      key={athlete.id}
                      href={`/dashboard/coach/messages?athlete=${athlete.id}`}
                      className={`block p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                        selectedAthleteId === athlete.id
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'border border-gray-200'
                      }`}
                    >
                      <p className="font-medium text-sm">{athlete.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {athlete.email}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {selectedAthlete ? (
                <>
                  <div className="mb-6 pb-4 border-b">
                    <h2 className="text-xl font-semibold">
                      {selectedAthlete.fullName}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedAthlete.email}</p>
                  </div>

                  <div className="mb-6 max-h-[500px] overflow-y-auto">
                    <MessageList messages={messages} currentUserId={user.id} />
                  </div>

                  <MessageComposerWrapper
                    recipientId={selectedAthleteId}
                    recipientName={selectedAthlete.fullName}
                  />
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Select an athlete to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/dashboard/coach"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

function MessageComposerWrapper({
  recipientId,
  recipientName,
}: {
  recipientId: string
  recipientName: string
}) {
  return (
    <MessageSender
      recipientId={recipientId}
      recipientName={recipientName}
    />
  )
}
