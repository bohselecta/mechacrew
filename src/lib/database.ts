import { neon } from '@neondatabase/serverless'

// Only initialize if database URL is available
const sql = process.env.NEON_DATABASE_URL ? neon(process.env.NEON_DATABASE_URL) : null

export interface MechaSession {
  id: string
  name: string
  description: string
  components: any[]
  created_at: Date
  updated_at: Date
  is_public: boolean
  created_by: string
  session_data: any
}

export interface MechaComponent {
  id: string
  session_id: string
  type: 'head' | 'torso' | 'arm' | 'leg' | 'weapon' | 'accessory'
  name: string
  description: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  material: string
  power: number
  durability: number
  weight: number
  created_by: string
  created_at: Date
  metadata: any
}

export interface UserSession {
  id: string
  session_id: string
  user_id: string
  user_name: string
  user_color: string
  position: [number, number, number]
  is_active: boolean
  last_seen: Date
  created_at: Date
}

export interface CollaborationMessage {
  id: string
  session_id: string
  user_id: string
  user_name: string
  message: string
  message_type: 'chat' | 'action'
  created_at: Date
}

export interface AIGeneration {
  id: string
  session_id: string
  user_id: string
  prompt: string
  response: any
  component_id: string
  tokens_used: number
  created_at: Date
}

// Database utility functions
export class DatabaseService {
  // Session operations
  static async createSession(session: Omit<MechaSession, 'created_at' | 'updated_at'>): Promise<MechaSession> {
    if (!sql) {
      throw new Error('Database connection not available')
    }
    
    const result = await sql`
      INSERT INTO mecha_sessions (id, name, description, components, is_public, created_by, session_data)
      VALUES (${session.id}, ${session.name}, ${session.description}, ${JSON.stringify(session.components)}, ${session.is_public}, ${session.created_by}, ${JSON.stringify(session.session_data)})
      RETURNING *
    `
    return result[0] as MechaSession
  }

  static async getSession(sessionId: string): Promise<MechaSession | null> {
    const result = await sql`
      SELECT * FROM mecha_sessions WHERE id = ${sessionId}
    `
    return result[0] as MechaSession || null
  }

  static async updateSession(sessionId: string, updates: Partial<MechaSession>): Promise<MechaSession | null> {
    const result = await sql`
      UPDATE mecha_sessions 
      SET 
        name = COALESCE(${updates.name}, name),
        description = COALESCE(${updates.description}, description),
        components = COALESCE(${updates.components ? JSON.stringify(updates.components) : null}, components),
        is_public = COALESCE(${updates.is_public}, is_public),
        session_data = COALESCE(${updates.session_data ? JSON.stringify(updates.session_data) : null}, session_data),
        updated_at = NOW()
      WHERE id = ${sessionId}
      RETURNING *
    `
    return result[0] as MechaSession || null
  }

  static async deleteSession(sessionId: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM mecha_sessions WHERE id = ${sessionId}
    `
    return result.length > 0
  }

  static async getPublicSessions(limit: number = 50): Promise<MechaSession[]> {
    const result = await sql`
      SELECT * FROM mecha_sessions 
      WHERE is_public = true 
      ORDER BY updated_at DESC 
      LIMIT ${limit}
    `
    return result as MechaSession[]
  }

  // Component operations
  static async createComponent(component: Omit<MechaComponent, 'created_at'>): Promise<MechaComponent> {
    if (!sql) {
      throw new Error('Database connection not available')
    }
    
    const result = await sql`
      INSERT INTO mecha_components (
        id, session_id, type, name, description, position, rotation, scale,
        color, material, power, durability, weight, created_by, metadata
      )
      VALUES (
        ${component.id}, ${component.session_id}, ${component.type}, ${component.name}, ${component.description},
        ${JSON.stringify(component.position)}, ${JSON.stringify(component.rotation)}, ${JSON.stringify(component.scale)},
        ${component.color}, ${component.material}, ${component.power}, ${component.durability}, ${component.weight},
        ${component.created_by}, ${JSON.stringify(component.metadata)}
      )
      RETURNING *
    `
    return result[0] as MechaComponent
  }

  static async getSessionComponents(sessionId: string): Promise<MechaComponent[]> {
    if (!sql) {
      return []
    }
    
    const result = await sql`
      SELECT * FROM mecha_components 
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
    `
    return result as MechaComponent[]
  }

  static async deleteComponent(componentId: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM mecha_components WHERE id = ${componentId}
    `
    return result.length > 0
  }

  // User session operations
  static async joinSession(userSession: Omit<UserSession, 'created_at'>): Promise<UserSession> {
    const result = await sql`
      INSERT INTO user_sessions (id, session_id, user_id, user_name, user_color, position, is_active, last_seen)
      VALUES (
        ${userSession.id}, ${userSession.session_id}, ${userSession.user_id}, ${userSession.user_name},
        ${userSession.user_color}, ${JSON.stringify(userSession.position)}, ${userSession.is_active}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        is_active = true,
        last_seen = NOW()
      RETURNING *
    `
    return result[0] as UserSession
  }

  static async leaveSession(userSessionId: string): Promise<boolean> {
    const result = await sql`
      UPDATE user_sessions 
      SET is_active = false, last_seen = NOW()
      WHERE id = ${userSessionId}
    `
    return result.length > 0
  }

  static async updateUserPosition(userSessionId: string, position: [number, number, number]): Promise<boolean> {
    const result = await sql`
      UPDATE user_sessions 
      SET position = ${JSON.stringify(position)}, last_seen = NOW()
      WHERE id = ${userSessionId}
    `
    return result.length > 0
  }

  static async getActiveUsers(sessionId: string): Promise<UserSession[]> {
    const result = await sql`
      SELECT * FROM user_sessions 
      WHERE session_id = ${sessionId} AND is_active = true
      ORDER BY last_seen DESC
    `
    return result as UserSession[]
  }

  // Collaboration message operations
  static async addMessage(message: Omit<CollaborationMessage, 'created_at'>): Promise<CollaborationMessage> {
    if (!sql) {
      throw new Error('Database connection not available')
    }
    
    const result = await sql`
      INSERT INTO collaboration_messages (id, session_id, user_id, user_name, message, message_type)
      VALUES (${message.id}, ${message.session_id}, ${message.user_id}, ${message.user_name}, ${message.message}, ${message.message_type})
      RETURNING *
    `
    return result[0] as CollaborationMessage
  }

  static async getSessionMessages(sessionId: string, limit: number = 100): Promise<CollaborationMessage[]> {
    if (!sql) {
      return []
    }
    
    const result = await sql`
      SELECT * FROM collaboration_messages 
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return result.reverse() as CollaborationMessage[]
  }

  // AI generation tracking
  static async logAIGeneration(generation: Omit<AIGeneration, 'created_at'>): Promise<AIGeneration> {
    const result = await sql`
      INSERT INTO ai_generations (id, session_id, user_id, prompt, response, component_id, tokens_used)
      VALUES (
        ${generation.id}, ${generation.session_id}, ${generation.user_id}, ${generation.prompt},
        ${JSON.stringify(generation.response)}, ${generation.component_id}, ${generation.tokens_used}
      )
      RETURNING *
    `
    return result[0] as AIGeneration
  }

  static async getSessionAIGenerations(sessionId: string): Promise<AIGeneration[]> {
    const result = await sql`
      SELECT * FROM ai_generations 
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC
    `
    return result as AIGeneration[]
  }

  // Cleanup operations
  static async cleanupInactiveUsers(): Promise<number> {
    const result = await sql`
      UPDATE user_sessions 
      SET is_active = false 
      WHERE last_seen < NOW() - INTERVAL '5 minutes' AND is_active = true
    `
    return result.length
  }

  static async getSessionStats(sessionId: string): Promise<any> {
    const result = await sql`
      SELECT * FROM session_stats WHERE id = ${sessionId}
    `
    return result[0] || null
  }
}

export default DatabaseService
