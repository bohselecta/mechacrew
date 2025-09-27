import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for submitted components (in production, use database)
const submittedComponents = new Map<string, any[]>()

interface SubmitRequest {
  componentId: string
  sessionId: string
  userId: string
  componentData: any
  action: 'submit' | 'improve'
}

export async function POST(request: NextRequest) {
  try {
    const { componentId, sessionId, userId, componentData, action }: SubmitRequest = await request.json()

    if (!componentId || !sessionId || !userId || !componentData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get existing components for this session
    const sessionComponents = submittedComponents.get(sessionId) || []

    if (action === 'submit') {
      // Add component to mecha canvas
      const submittedComponent = {
        ...componentData,
        id: componentId,
        submittedAt: new Date(),
        submittedBy: userId,
        status: 'active'
      }

      sessionComponents.push(submittedComponent)
      submittedComponents.set(sessionId, sessionComponents)

      return NextResponse.json({
        success: true,
        message: 'Component submitted to mecha canvas!',
        component: submittedComponent,
        totalComponents: sessionComponents.length
      })
    } else if (action === 'improve') {
      // Mark component for improvement (don't add to canvas)
      return NextResponse.json({
        success: true,
        message: 'Component marked for improvement',
        component: componentData
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Component submission error:', error)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Get all submitted components for this session
    const components = submittedComponents.get(sessionId) || []

    return NextResponse.json({
      success: true,
      components,
      totalComponents: components.length
    })

  } catch (error) {
    console.error('Get components error:', error)
    return NextResponse.json({ error: 'Failed to get components' }, { status: 500 })
  }
}
