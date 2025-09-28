'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Users, 
  Play, 
  Pause, 
  RotateCcw,
  Wifi,
  WifiOff
} from 'lucide-react'
import MechaSVG from '@/components/MechaSVG'
import AIPreview from '@/components/AIPreview'
import VotingComponent from '@/components/VotingComponent'

interface MechaComponent {
  id: string
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
  createdBy: string
  createdAt: Date
}

interface User {
  id: string
  name: string
  color: string
  position: [number, number, number]
  isActive: boolean
}

export default function MechaCrewApp() {
  const [isLoaded, setIsLoaded] = useState(true)
  const [pendingVote, setPendingVote] = useState<any>(null)
  const [sessionId] = useState('demo-session')
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [featurePosition, setFeaturePosition] = useState<{ x: number, y: number } | null>(null)
  const [addedComponents, setAddedComponents] = useState<string[]>([])
  const [approvedComponents, setApprovedComponents] = useState<{[key: string]: any}>({})
  const [showWelcome, setShowWelcome] = useState(true)
  const [username, setUsername] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [currentWorkflow, setCurrentWorkflow] = useState<'text' | 'voting' | 'approved'>('text')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')

  const loadExistingComponents = useCallback(async () => {
    try {
      const response = await fetch(`/api/canvas?sessionId=${sessionId}`)
      const data = await response.json()
      
      if (data.success && data.components) {
        // Convert database components to our format
        const components: {[key: string]: any} = {}
        const addedFeatures: string[] = []
        
        data.components.forEach((comp: any) => {
          const feature = comp.metadata?.feature || 'unknown'
          components[feature] = {
            ...comp,
            addedBy: comp.created_by,
            addedAt: new Date(comp.created_at).toLocaleTimeString()
          }
          addedFeatures.push(feature)
        })
        
        setApprovedComponents(components)
        setAddedComponents(addedFeatures)
      }
    } catch (error) {
      console.error('Failed to load existing components:', error)
    }
  }, [sessionId])

  const loadChatMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`)
      const data = await response.json()
      
      if (data.success && data.messages) {
        setChatMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error)
    }
  }, [sessionId])

  // Load existing components and chat messages when user joins
  useEffect(() => {
    if (isJoined && sessionId) {
      loadExistingComponents()
      loadChatMessages()
    }
  }, [isJoined, sessionId, loadExistingComponents, loadChatMessages])

  const sendChatMessage = async () => {
    if (!newMessage.trim() || !username) return
    
    // Add message to local state immediately for instant feedback
    const tempMessage = {
      id: `temp-${Date.now()}`,
      user_name: username,
      message: newMessage.trim(),
      message_type: 'chat',
      created_at: new Date().toISOString()
    }
    setChatMessages(prev => [...prev, tempMessage])
    setNewMessage('')
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: username,
          userName: username,
          message: newMessage.trim(),
          messageType: 'chat'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Replace temp message with real one
          setChatMessages(prev => prev.map(msg => 
            msg.id === tempMessage.id ? data.message : msg
          ))
        }
      } else {
        const errorData = await response.json()
        console.error('Chat API error:', errorData)
        // Keep the temp message since database failed
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Keep the temp message since API failed
    }
  }

  const addActionMessage = async (action: string) => {
    if (!username) return
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: username,
          userName: username,
          message: action,
          messageType: 'action'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setChatMessages(prev => [...prev, data.message])
        }
      } else {
        const errorData = await response.json()
        console.error('Chat API error:', errorData)
      }
    } catch (error) {
      console.error('Failed to send action message:', error)
    }
  }

  const handleAICommand = async (command: string) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command, 
          existingComponents: [],
          sessionId,
          userId: username
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (data.needsVoting) {
          // Show voting modal
          setPendingVote({
            componentId: data.component.id,
            sessionId: data.votingData.sessionId,
            userId: data.votingData.creatorId,
            componentData: data.component,
            creatorName: `User_${data.votingData.creatorId.slice(-4)}`,
            previewDescription: data.votingData.previewDescription
          })
        } else {
          // Add immediately (refinement)
          const featureId = selectedFeature || 'unknown'
          setAddedComponents(prev => [...prev, featureId])
          setApprovedComponents(prev => ({
            ...prev,
            [featureId]: {
              ...data.component,
              addedBy: username,
              addedAt: new Date().toLocaleTimeString()
            }
          }))
          setCurrentWorkflow('text')
          setSelectedFeature(null)
        }
      }
    } catch (error) {
      console.error('AI command failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }


  const handleVote = async (componentId: string, vote: 'approve' | 'reject' | 'submit' | 'improve') => {
    if (vote === 'submit') {
      // Submit component to canvas
      try {
        const response = await fetch('/api/canvas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            componentId,
            sessionId,
            userId: username,
            componentData: pendingVote?.componentData,
            action: 'submit'
          })
        })
        
        const data = await response.json()
        if (data.success) {
          console.log('Component submitted to canvas!')
          // Add to local state for immediate wireframe update
          if (pendingVote?.componentData) {
            const featureId = selectedFeature || 'unknown'
            setAddedComponents(prev => [...prev, featureId])
            setApprovedComponents(prev => ({
              ...prev,
              [featureId]: pendingVote.componentData
            }))
            
            // Add action message
            await addActionMessage(`Added ${pendingVote.componentData.name || 'component'} to ${featureId}`)
          }
        }
      } catch (error) {
        console.error('Submission failed:', error)
      }
    } else if (vote === 'improve') {
      // Mark for improvement - could trigger AI refinement
      console.log('Component marked for improvement')
    }
    // Other votes are handled by VotingComponent
  }

  const handleVoteClose = () => {
    setPendingVote(null)
  }

  const handleFeatureSelect = (feature: string, position: { x: number, y: number }) => {
    setSelectedFeature(feature)
    setFeaturePosition(position)
  }

  const handleComponentAccept = (component: any) => {
    // Add component to mecha
    const featureId = selectedFeature || 'unknown'
    setAddedComponents(prev => [...prev, featureId])
    setApprovedComponents(prev => ({
      ...prev,
      [featureId]: {
        ...component,
        addedBy: username,
        addedAt: new Date().toLocaleTimeString()
      }
    }))
    setSelectedFeature(null)
    setFeaturePosition(null)
  }

  const handleComponentReject = () => {
    setSelectedFeature(null)
    setFeaturePosition(null)
    setCurrentWorkflow('text')
  }

  const handleGenerateNew = () => {
    // This will trigger a new AI generation in the AIPreview component
    // The component will re-render and generate a new preview
  }

  const handleJoinCollaboration = () => {
    if (username.trim()) {
      setIsJoined(true)
      setShowWelcome(false)
      // Add user to online list
      setOnlineUsers(prev => [...prev, username.trim()])
      
      // Add welcome message to chat
      const welcomeMessage = {
        id: `welcome-${Date.now()}`,
        user_name: 'System',
        message: `${username} joined the mecha construction crew!`,
        message_type: 'action',
        created_at: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, welcomeMessage])
    }
  }

  const handleTextApproval = async (component: any) => {
    try {
      setError(null)
      // If only one user online, add directly. If multiple users, require voting
      if (onlineUsers.length <= 1) {
        // Direct add - no voting needed
        const featureId = selectedFeature || 'unknown'
        
        // Save to database
        const response = await fetch('/api/canvas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            componentId: `component-${Date.now()}`,
            sessionId,
            userId: username,
            componentData: {
              ...component,
              feature: featureId
            },
            action: 'submit'
          })
        })
        
        if (response.ok) {
          setAddedComponents(prev => [...prev, featureId])
          setApprovedComponents(prev => ({
            ...prev,
            [featureId]: {
              ...component,
              addedBy: username,
              addedAt: new Date().toLocaleTimeString()
            }
          }))
          
          // Add action message
          await addActionMessage(`Added ${component.name || 'component'} to ${featureId}`)
        } else {
          const errorData = await response.json()
          console.error('Canvas API error:', errorData)
          setError(`Failed to save component: ${errorData.error || 'Unknown error'}`)
        }
        
        setCurrentWorkflow('text')
        setSelectedFeature(null)
      } else {
        // Multiple users - require voting
        setCurrentWorkflow('voting')
        setPendingVote({
          componentId: (component.name || 'component') + '-' + Date.now(),
          sessionId,
          userId: username,
          componentData: {
            ...component,
            type: component.type || 'weapon',
            power: component.power || 100,
            durability: component.durability || 85,
            weight: component.weight || 50
          },
          creatorName: username,
          previewDescription: component.name || 'AI Generated Component'
        })
      }
    } catch (err) {
      setError('Failed to process component. Please try again.')
      console.error('Text approval error:', err)
    }
  }

  const handleVotingApproval = (component: any) => {
    setCurrentWorkflow('approved')
    // Component is approved, ready to add to mecha
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center blueprint-bg text-white p-4">
        <div className="mecha-panel p-8 max-w-md w-full text-center">
          <img src="/MC-Logo.png" alt="MechaCrew Logo" className="w-48 h-48 mx-auto mb-6 object-contain" />
          <h1 className="text-4xl font-orbitron font-black text-white chrome-text mb-4">
            JOIN COLLABORATION
          </h1>
          <p className="text-neon-blue text-lg font-bold uppercase tracking-wider mb-8">
            Democratic AI-Orchestrated Creation
          </p>
          
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name..."
              className="mecha-input w-full text-center"
              onKeyPress={(e) => e.key === 'Enter' && handleJoinCollaboration()}
            />
            <button
              onClick={handleJoinCollaboration}
              className="mecha-button w-full"
              disabled={!username.trim()}
            >
              JOIN THE CREATION
            </button>
          </div>
          
          <p className="text-steel-gray text-sm mt-6">
            Close your browser when done collaborating
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen blueprint-bg relative overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-50 bg-steel-gray/90 backdrop-blur-md border-b-2 border-accent-yellow"
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-24 h-24 flex items-center justify-center">
              <img 
                src="/mecha-header-logo.png" 
                alt="MechaCrew Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-neon-blue" />
              <span className="text-white text-sm font-bold">
                {onlineUsers.length} PILOTS ONLINE
              </span>
            </div>
            
            <button
              onClick={() => setShowWelcome(true)}
              className="mecha-button-secondary flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>LEAVE ROOM</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-20 h-screen flex flex-col lg:flex-row">
        {/* Mecha Builder */}
        <div className="flex-1 relative">
          <MechaSVG 
            onFeatureSelect={handleFeatureSelect}
            selectedFeature={selectedFeature || undefined}
            addedComponents={addedComponents}
            approvedComponents={approvedComponents}
            isGuestMode={false}
          />
          
          {/* Online Users Indicator */}
          <div className="absolute top-4 left-4 bg-gunmetal border-2 border-accent-yellow rounded-lg p-3">
            <p className="text-accent-yellow font-bold text-xs uppercase tracking-wider">
              ONLINE: {onlineUsers.length}
            </p>
            <div className="text-white text-xs mt-1">
              {onlineUsers.map((user, index) => (
                <span key={index}>
                  {user}{index < onlineUsers.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Collaboration Panel */}
        <div className="w-full lg:w-96 bg-steel-gray border-l-2 border-neon-blue h-full overflow-y-auto">
          {error && (
            <div className="bg-mecha-red border border-accent-yellow rounded-lg p-4 m-4">
              <p className="text-accent-yellow font-bold text-sm uppercase tracking-wider">
                ⚠️ ERROR
              </p>
              <p className="text-white text-sm mt-2">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 bg-mecha-red hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
              >
                DISMISS
              </button>
            </div>
          )}
          
          {selectedFeature && featurePosition ? (
            currentWorkflow === 'text' ? (
              <AIPreview
                feature={selectedFeature}
                position={featurePosition}
                onAccept={handleTextApproval}
                onReject={handleComponentReject}
                onGenerateNew={handleGenerateNew}
              />
            ) : currentWorkflow === 'voting' && pendingVote ? (
              <VotingComponent
                componentId={pendingVote.componentId}
                sessionId={pendingVote.sessionId}
                userId={pendingVote.userId}
                componentData={pendingVote.componentData}
                creatorName={pendingVote.creatorName}
                previewDescription={pendingVote.previewDescription}
                onVote={handleVote}
                onClose={() => setPendingVote(null)}
              />
            ) : currentWorkflow === 'approved' ? (
              <div className="mecha-panel p-6 text-center">
                <h3 className="text-accent-yellow font-bold text-lg mb-4">✅ COMPONENT APPROVED!</h3>
                <p className="text-white text-sm mb-4">Ready to add to mecha</p>
                <button
                  onClick={async () => {
                    const featureId = selectedFeature || 'unknown'
                    
                    // Save to database
                    try {
                      const response = await fetch('/api/canvas', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          componentId: `component-${Date.now()}`,
                          sessionId,
                          userId: username,
                          componentData: {
                            ...pendingVote?.componentData,
                            feature: featureId
                          },
                          action: 'submit'
                        })
                      })
                      
                      if (response.ok) {
                        // Update local state
                        setAddedComponents([...addedComponents, featureId])
                        if (pendingVote?.componentData) {
                          setApprovedComponents(prev => ({
                            ...prev,
                            [featureId]: {
                              ...pendingVote.componentData,
                              addedBy: username,
                              addedAt: new Date().toLocaleTimeString()
                            }
                          }))
                        }
                        
                        // Add action message
                        await addActionMessage(`Added ${pendingVote?.componentData?.name || 'component'} to ${featureId}`)
                      }
                    } catch (error) {
                      console.error('Failed to save component:', error)
                      setError('Failed to save component to mecha')
                    }
                    
                    setCurrentWorkflow('text')
                    setSelectedFeature(null)
                    setPendingVote(null)
                  }}
                  className="mecha-button w-full"
                >
                  ADD TO MECHA
                </button>
              </div>
            ) : (
              <div className="p-6 text-center">
                <h3 className="text-neon-blue font-bold text-lg mb-4">SELECT A PART</h3>
                <p className="text-white text-sm">Click on the mecha to add components</p>
              </div>
            )
          ) : (
            <div className="p-6 text-center">
              <h3 className="text-neon-blue font-bold text-lg mb-4">COLLABORATION ROOM</h3>
              <p className="text-white text-sm mb-4">Click on the mecha to add components</p>
              <div className="text-xs text-steel-gray">
                {onlineUsers.length <= 1 ? (
                  <p>✨ Solo mode - add parts directly</p>
                ) : (
                  <p>🗳️ Multi-user mode - voting required</p>
                )}
              </div>
              {isGenerating && (
                <div className="mt-4">
                  <div className="animate-spin w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-neon-blue text-xs">AI GENERATING...</p>
                </div>
              )}
            </div>
          )}
          
          {/* Chat System */}
          <div className="border-t-2 border-neon-blue mt-auto">
            <div className="p-4">
              <h4 className="text-accent-yellow font-bold text-sm uppercase tracking-wider mb-3">
                PILOT CHAT ({chatMessages.length} messages)
              </h4>
              
              {/* Chat Messages */}
              <div className="h-48 overflow-y-auto mb-3 space-y-1 bg-gunmetal/50 p-2 rounded border border-neon-blue/30">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-steel-gray text-xs py-4">
                    No messages yet. Be the first to chat!
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={`text-xs ${msg.message_type === 'action' ? 'text-neon-blue' : 'text-white'}`}>
                      <span className="font-bold text-accent-yellow">{msg.user_name}:</span> {msg.message}
                    </div>
                  ))
                )}
              </div>
              
              {/* Chat Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 mecha-input text-xs"
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <button
                  onClick={sendChatMessage}
                  className="mecha-button text-xs px-3"
                  disabled={!newMessage.trim()}
                >
                  SEND
                </button>
              </div>
              
              {/* Debug Info */}
              <div className="text-xs text-steel-gray mt-2">
                Session: {sessionId} | User: {username}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Modal */}
      <AnimatePresence>
        {pendingVote && (
          <VotingComponent
            componentId={pendingVote.componentId}
            sessionId={pendingVote.sessionId}
            userId={pendingVote.userId}
            componentData={pendingVote.componentData}
            creatorName={pendingVote.creatorName}
            previewDescription={pendingVote.previewDescription}
            onVote={handleVote}
            onClose={handleVoteClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}