'use client'

import { useState, useEffect } from 'react'
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

  // Initialize with demo components
  useEffect(() => {
    const demoComponents: MechaComponent[] = [
      {
        id: 'torso-1',
        type: 'torso',
        name: 'Core Chassis Alpha',
        description: 'Primary structural frame with integrated power core',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [2, 3, 1],
        color: '#2E3E50',
        material: 'steel',
        power: 100,
        durability: 95,
        weight: 50,
        createdBy: 'system',
        createdAt: new Date()
      },
      {
        id: 'head-1',
        type: 'head',
        name: 'Command Module',
        description: 'Advanced sensor array with AI interface',
        position: [0, 2.5, 0],
        rotation: [0, 0, 0],
        scale: [1.2, 1.2, 1.2],
        color: '#E6322B',
        material: 'titanium',
        power: 80,
        durability: 90,
        weight: 15,
        createdBy: 'system',
        createdAt: new Date()
      }
    ]
    
    setMechaComponents(demoComponents)
    
    // Simulate loading
    setTimeout(() => {
      setIsLoaded(true)
    }, 2000)
  }, [])

  const handleAICommand = async (command: string) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command, 
          existingComponents: mechaComponents,
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
            userId: username: data.votingData.creatorId,
            componentData: data.component,
            creatorName: `User_${data.votingData.creatorId.slice(-4)}`,
            previewDescription: data.votingData.previewDescription
          })
        } else {
          // Add immediately (refinement)
          setMechaComponents(prev => [...prev, data.component])
        }
      }
    } catch (error) {
      console.error('AI command failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating)
  }

  const resetMecha = () => {
    setMechaComponents(prev => prev.filter(comp => comp.createdBy === 'system'))
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
          }
          // Refresh canvas if it's open
          if (showCanvas) {
            // Canvas will auto-refresh via polling
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
    setShowCollaboration(true) // Open collaboration panel for AI preview
  }

  const handleComponentAccept = (component: any) => {
    // Add component to mecha
    setMechaComponents(prev => [...prev, component])
    setAddedComponents(prev => [...prev, selectedFeature!])
    setSelectedFeature(null)
    setFeaturePosition(null)
    setShowCollaboration(false)
  }

  const handleComponentReject = () => {
    setSelectedFeature(null)
    setFeaturePosition(null)
    setCurrentWorkflow('text')
    setShowCollaboration(false)
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
    }
  }

  const handleTextApproval = (component: any) => {
    // If only one user online, add directly. If multiple users, require voting
    if (onlineUsers.length <= 1) {
      // Direct add - no voting needed
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
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-36 h-36 flex items-center justify-center">
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
      <div className="pt-20 h-screen flex">
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
        <div className="w-96 bg-steel-gray border-l-2 border-neon-blue h-full overflow-y-auto">
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
                userId: username={pendingVote.userId}
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
                  onClick={() => {
                    const featureId = selectedFeature || 'unknown'
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
            </div>
          )}
        </div>
      </div>

      {/* Voting Modal */}
      <AnimatePresence>
        {pendingVote && (
          <VotingComponent
            componentId={pendingVote.componentId}
            sessionId={pendingVote.sessionId}
            userId: username={pendingVote.userId}
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