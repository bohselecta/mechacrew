import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for voting (in production, use Redis or database)
const activeVotes = new Map<string, any>()
const componentHistory = new Map<string, any[]>()

interface VoteRequest {
  componentId: string
  sessionId: string
  userId: string
  vote: 'approve' | 'reject'
  componentData: any
}

interface PendingComponent {
  id: string
  componentData: any
  creatorId: string
  creatorName: string
  createdAt: Date
  votes: { userId: string; vote: 'approve' | 'reject'; timestamp: Date }[]
  status: 'pending' | 'approved' | 'rejected'
  previewImage?: string
}

export async function POST(request: NextRequest) {
  try {
    const { componentId, sessionId, userId, vote, componentData }: VoteRequest = await request.json()

    if (!componentId || !sessionId || !userId || !vote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get or create pending component
    let pendingComponent = activeVotes.get(componentId)
    if (!pendingComponent) {
      pendingComponent = {
        id: componentId,
        componentData,
        creatorId: userId,
        creatorName: `User_${userId.slice(-4)}`,
        createdAt: new Date(),
        votes: [],
        status: 'pending'
      }
      activeVotes.set(componentId, pendingComponent)
    }

    // Check if user already voted
    const existingVote = pendingComponent.votes.find(v => v.userId === userId)
    if (existingVote) {
      return NextResponse.json({ error: 'User already voted' }, { status: 400 })
    }

    // Add vote
    pendingComponent.votes.push({
      userId,
      vote,
      timestamp: new Date()
    })

    // Check for majority
    const totalVotes = pendingComponent.votes.length
    const approveVotes = pendingComponent.votes.filter(v => v.vote === 'approve').length
    const rejectVotes = pendingComponent.votes.filter(v => v.vote === 'reject').length

    // Determine if majority reached (need at least 2 votes and majority approval)
    if (totalVotes >= 2) {
      if (approveVotes > rejectVotes) {
        pendingComponent.status = 'approved'
        // Add to component history
        const sessionHistory = componentHistory.get(sessionId) || []
        sessionHistory.push({
          ...pendingComponent,
          approvedAt: new Date(),
          approvedBy: pendingComponent.votes.filter(v => v.vote === 'approve').map(v => v.userId)
        })
        componentHistory.set(sessionId, sessionHistory)
        
        // Remove from active votes
        activeVotes.delete(componentId)
        
        return NextResponse.json({
          success: true,
          status: 'approved',
          component: pendingComponent,
          message: 'Component approved by majority vote!'
        })
      } else if (rejectVotes > approveVotes) {
        pendingComponent.status = 'rejected'
        activeVotes.delete(componentId)
        
        return NextResponse.json({
          success: true,
          status: 'rejected',
          component: pendingComponent,
          message: 'Component rejected by majority vote'
        })
      }
    }

    return NextResponse.json({
      success: true,
      status: 'pending',
      component: pendingComponent,
      votes: {
        total: totalVotes,
        approve: approveVotes,
        reject: rejectVotes,
        needed: Math.max(2, Math.ceil(totalVotes / 2) + 1)
      }
    })

  } catch (error) {
    console.error('Voting error:', error)
    return NextResponse.json({ error: 'Voting failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Get pending votes for this session
    const pendingVotes = Array.from(activeVotes.values()).filter(
      vote => vote.componentData.sessionId === sessionId
    )

    // Get component history for this session
    const history = componentHistory.get(sessionId) || []

    // Get user's cooldown status
    const userCooldowns = new Map<string, Date>()
    const lastRejection = history
      .filter(h => h.creatorId === userId && h.status === 'rejected')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    const cooldownEnd = lastRejection ? 
      new Date(new Date(lastRejection.createdAt).getTime() + 5 * 60 * 1000) : null

    return NextResponse.json({
      success: true,
      pendingVotes,
      history: history.slice(-20), // Last 20 changes
      userCooldown: cooldownEnd && cooldownEnd > new Date() ? cooldownEnd : null
    })

  } catch (error) {
    console.error('Get voting data error:', error)
    return NextResponse.json({ error: 'Failed to get voting data' }, { status: 500 })
  }
}
