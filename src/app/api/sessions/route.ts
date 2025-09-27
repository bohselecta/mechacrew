import { NextRequest, NextResponse } from 'next/server'

const sql = process.env.NEON_DATABASE_URL ? require('@neondatabase/serverless').neon(process.env.NEON_DATABASE_URL) : null

interface MechaSession {
  id: string
  name: string
  description: string
  components: any[]
  created_at: Date
  updated_at: Date
  is_public: boolean
  created_by: string
}

export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      // Get specific session
      const session = await sql`
        SELECT * FROM mecha_sessions 
        WHERE id = ${sessionId}
      `
      
      if (session.length === 0) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }

      return NextResponse.json({ session: session[0] })
    } else {
      // Get all public sessions
      const sessions = await sql`
        SELECT id, name, description, created_at, updated_at, created_by
        FROM mecha_sessions 
        WHERE is_public = true
        ORDER BY updated_at DESC
        LIMIT 50
      `

      return NextResponse.json({ sessions })
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { name, description, components, isPublic = true } = await request.json()

    if (!name || !components) {
      return NextResponse.json({ error: 'Name and components are required' }, { status: 400 })
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newSession = await sql`
      INSERT INTO mecha_sessions (id, name, description, components, is_public, created_by)
      VALUES (${sessionId}, ${name}, ${description}, ${JSON.stringify(components)}, ${isPublic}, 'guest')
      RETURNING *
    `

    return NextResponse.json({ 
      success: true, 
      session: newSession[0] 
    })

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { sessionId, components } = await request.json()

    if (!sessionId || !components) {
      return NextResponse.json({ error: 'Session ID and components are required' }, { status: 400 })
    }

    const updatedSession = await sql`
      UPDATE mecha_sessions 
      SET components = ${JSON.stringify(components)}, updated_at = NOW()
      WHERE id = ${sessionId}
      RETURNING *
    `

    if (updatedSession.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      session: updatedSession[0] 
    })

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    await sql`
      DELETE FROM mecha_sessions 
      WHERE id = ${sessionId}
    `

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
