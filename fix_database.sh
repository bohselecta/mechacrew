#!/bin/bash

# Add null checks to remaining database methods
sed -i '' 's/static async joinSession(userSession: Omit<UserSession, '\''created_at'\''>): Promise<UserSession> {/static async joinSession(userSession: Omit<UserSession, '\''created_at'\''>): Promise<UserSession> {\
    if (!sql) {\
      throw new Error('\''Database connection not available'\'')\
    }\
    /' src/lib/database.ts

sed -i '' 's/static async leaveSession(userSessionId: string): Promise<boolean> {/static async leaveSession(userSessionId: string): Promise<boolean> {\
    if (!sql) {\
      return false\
    }\
    /' src/lib/database.ts

sed -i '' 's/static async updateUserPosition(userSessionId: string, position: \[number, number, number\]): Promise<boolean> {/static async updateUserPosition(userSessionId: string, position: \[number, number, number\]): Promise<boolean> {\
    if (!sql) {\
      return false\
    }\
    /' src/lib/database.ts

sed -i '' 's/static async getActiveUsers(sessionId: string): Promise<UserSession\[\]> {/static async getActiveUsers(sessionId: string): Promise<UserSession\[\]> {\
    if (!sql) {\
      return []\
    }\
    /' src/lib/database.ts

sed -i '' 's/static async getSessionMessages(sessionId: string, limit: number = 100): Promise<CollaborationMessage\[\]> {/static async getSessionMessages(sessionId: string, limit: number = 100): Promise<CollaborationMessage\[\]> {\
    if (!sql) {\
      return []\
    }\
    /' src/lib/database.ts

sed -i '' 's/static async logAIGeneration(generation: Omit<AIGeneration, '\''created_at'\''>): Promise<AIGeneration> {/static async logAIGeneration(generation: Omit<AIGeneration, '\''created_at'\''>): Promise<AIGeneration> {\
    if (!sql) {\
      throw new Error('\''Database connection not available'\'')\
    }\
    /' src/lib/database.ts

sed -i '' 's/static async getSessionAIGenerations(sessionId: string): Promise<AIGeneration\[\]> {/static async getSessionAIGenerations(sessionId: string): Promise<AIGeneration\[\]> {\
    if (!sql) {\
      return []\
    }\
    /' src/lib/database.ts

sed -i '' 's/static async cleanupInactiveUsers(): Promise<number> {/static async cleanupInactiveUsers(): Promise<number> {\
    if (!sql) {\
      return 0\
    }\
    /' src/lib/database.ts

sed -i '' 's/static async getSessionStats(sessionId: string): Promise<any> {/static async getSessionStats(sessionId: string): Promise<any> {\
    if (!sql) {\
      return { components: 0, users: 0, messages: 0 }\
    }\
    /' src/lib/database.ts
