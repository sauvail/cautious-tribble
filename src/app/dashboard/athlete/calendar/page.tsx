import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { CalendarEvent } from '@/types'
import CalendarView from '@/components/calendar/CalendarView'

async function getCalendarEvents(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .order('event_date', { ascending: true })

  if (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }

  return data.map((event: any) => ({
    id: event.id,
    userId: event.user_id,
    title: event.title,
    description: event.description,
    date: event.event_date,
    type: event.event_type,
    createdAt: event.created_at,
  })) as CalendarEvent[]
}

export default async function AthleteCalendarPage() {
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

  const events = await getCalendarEvents(user.id)

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-2 text-gray-600">
            View your training schedule and important dates
          </p>
        </div>

        <CalendarView events={events} />

        {/* Event list */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          {events.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No upcoming events
            </div>
          ) : (
            <div className="space-y-4">
              {events
                .filter(event => new Date(event.date) >= new Date())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{event.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
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
