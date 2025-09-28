import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

interface ChatMessage {
  id: string
  session_id: string
  user_id: string
  user_name: string
  message: string
  message_type: 'chat' | 'action'
  created_at: string
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId, userName, message, messageType = 'chat' } = await request.json()

    if (!sessionId || !userId || !userName || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Save message to database
    const savedMessage = await DatabaseService.addMessage({
      id: messageId,
      session_id: sessionId,
      user_id: userId,
      user_name: userName,
      message: message.trim(),
      message_type: messageType as 'chat' | 'action'
    })

    return NextResponse.json({
      success: true,
      message: savedMessage
    })

  } catch (error) {
    console.error('Chat message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Get recent messages for this session
    const messages = await DatabaseService.getSessionMessages(sessionId, limit)

    return NextResponse.json({
      success: true,
      messages
    })

  } catch (error) {
    console.error('Get chat messages error:', error)
    return NextResponse.json({ error: 'Failed to get messages' }, { status: 500 })
  }
}
