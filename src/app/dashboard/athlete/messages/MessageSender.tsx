'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import MessageComposer from '@/components/messages/MessageComposer'
import { useRouter } from 'next/navigation'

interface MessageSenderProps {
  recipientId: string
  recipientName: string
}

export default function MessageSender({ recipientId, recipientName }: MessageSenderProps) {
  const router = useRouter()

  const handleSend = async (content: string) => {
    const { error } = await supabase.from('messages').insert({
      sender_id: (await supabase.auth.getUser()).data.user?.id,
      recipient_id: recipientId,
      content,
      read: false,
    })

    if (error) {
      throw new Error('Failed to send message')
    }

    // Refresh to show new message
    router.refresh()
  }

  return (
    <MessageComposer
      recipientId={recipientId}
      recipientName={recipientName}
      onSend={handleSend}
    />
  )
}
