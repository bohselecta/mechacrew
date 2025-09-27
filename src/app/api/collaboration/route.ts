import { NextRequest, NextResponse } from 'next/server'

interface User {
  id: string
  name: string
  color: string
  position: [number, number, number]
  isActive: boolean
  lastSeen: Date
}

// In-memory store for demo (replace with Redis in production)
const activeUsers = new Map<string, User>()
const userMessages = new Map<string, Array<{
  id: string
  user: string
  message: string
  timestamp: Date
  type: 'chat' | 'action'
}>>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'users':
        const users = Array.from(activeUsers.values())
        return NextResponse.json({ users })

      case 'messages':
        const sessionId = searchParams.get('sessionId') || 'default'
        const messages = userMessages.get(sessionId) || []
        return NextResponse.json({ messages })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Collaboration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'join':
        const { userId, userName, color } = data
        const user: User = {
          id: userId,
          name: userName,
          color: color || '#08B0D5',
          position: [0, 0, 0],
          isActive: true,
          lastSeen: new Date()
        }
        
        activeUsers.set(userId, user)
        
        // Add join message
        const sessionId = data.sessionId || 'default'
        const messages = userMessages.get(sessionId) || []
        messages.push({
          id: `msg-${Date.now()}`,
          user: userName,
          message: 'joined the session',
          timestamp: new Date(),
          type: 'action'
        })
        userMessages.set(sessionId, messages)

        return NextResponse.json({ success: true, user })

      case 'leave':
        const { userId: leaveUserId } = data
        const userToLeave = activeUsers.get(leaveUserId)
        
        if (userToLeave) {
          activeUsers.delete(leaveUserId)
          
          // Add leave message
          const sessionId = data.sessionId || 'default'
          const messages = userMessages.get(sessionId) || []
          messages.push({
            id: `msg-${Date.now()}`,
            user: userToLeave.name,
            message: 'left the session',
            timestamp: new Date(),
            type: 'action'
          })
          userMessages.set(sessionId, messages)
        }

        return NextResponse.json({ success: true })

      case 'update_position':
        const { userId: updateUserId, position } = data
        const userToUpdate = activeUsers.get(updateUserId)
        
        if (userToUpdate) {
          userToUpdate.position = position
          userToUpdate.lastSeen = new Date()
          activeUsers.set(updateUserId, userToUpdate)
        }

        return NextResponse.json({ success: true })

      case 'send_message':
        const { userId: messageUserId, message, sessionId: msgSessionId } = data
        const messageUser = activeUsers.get(messageUserId)
        
        if (messageUser) {
          const sessionMessages = userMessages.get(msgSessionId || 'default') || []
          sessionMessages.push({
            id: `msg-${Date.now()}`,
            user: messageUser.name,
            message,
            timestamp: new Date(),
            type: 'chat'
          })
          userMessages.set(msgSessionId || 'default', sessionMessages)
        }

        return NextResponse.json({ success: true })

      case 'action':
        const { userId: actionUserId, action: userAction, sessionId: actionSessionId } = data
        const actionUser = activeUsers.get(actionUserId)
        
        if (actionUser) {
          const sessionMessages = userMessages.get(actionSessionId || 'default') || []
          sessionMessages.push({
            id: `msg-${Date.now()}`,
            user: actionUser.name,
            message: userAction,
            timestamp: new Date(),
            type: 'action'
          })
          userMessages.set(actionSessionId || 'default', sessionMessages)
        }

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Collaboration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Cleanup inactive users every 5 minutes
setInterval(() => {
  const now = new Date()
  const inactiveThreshold = 5 * 60 * 1000 // 5 minutes
  
  for (const [userId, user] of activeUsers.entries()) {
    if (now.getTime() - user.lastSeen.getTime() > inactiveThreshold) {
      activeUsers.delete(userId)
    }
  }
}, 5 * 60 * 1000)
