import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

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

    if (action === 'submit') {
      // Save component to database
      const component = {
        id: componentId,
        session_id: sessionId,
        type: componentData.type || 'weapon',
        name: componentData.name || 'AI Generated Component',
        description: componentData.description || `Added by ${userId}`,
        position: componentData.position || [0, 0, 0],
        rotation: componentData.rotation || [0, 0, 0],
        scale: componentData.scale || [1, 1, 1],
        color: componentData.color || '#08B0D5',
        material: componentData.material || 'steel',
        power: componentData.power || 100,
        durability: componentData.durability || 85,
        weight: componentData.weight || 50,
        created_by: userId,
        metadata: {
          addedBy: userId,
          addedAt: new Date().toISOString(),
          feature: componentData.feature || 'unknown'
        }
      }

      await DatabaseService.createComponent(component)

      return NextResponse.json({
        success: true,
        message: 'Component saved to mecha!',
        component: component
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

    // Get all components for this session from database
    const components = await DatabaseService.getSessionComponents(sessionId)

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
