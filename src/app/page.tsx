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
import AIPanel from '@/components/AIPanel'
import CollaborationPanel from '@/components/CollaborationPanel'
import LogoAnimation from '@/components/LogoAnimation'
import VotingComponent from '@/components/VotingComponent'
import ActivityFeed from '@/components/ActivityFeed'
import PublicCanvas from '@/components/PublicCanvas'
import LoadingScreen from '@/components/LoadingScreen'
import MechaSVG from '@/components/MechaSVG'
import AIPreview from '@/components/AIPreview'

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
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [mechaComponents, setMechaComponents] = useState<MechaComponent[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [pendingVote, setPendingVote] = useState<any>(null)
  const [sessionId] = useState('demo-session')
  const [userId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`)
  const [showCanvas, setShowCanvas] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [featurePosition, setFeaturePosition] = useState<{ x: number, y: number } | null>(null)
  const [addedComponents, setAddedComponents] = useState<string[]>([])

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
          userId
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
            userId,
            componentData: pendingVote?.componentData,
            action: 'submit'
          })
        })
        
        const data = await response.json()
        if (data.success) {
          console.log('Component submitted to canvas!')
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
    setShowCollaboration(false)
  }

  const handleGenerateNew = () => {
    // This will trigger a new AI generation in the AIPreview component
    // The component will re-render and generate a new preview
  }

  if (!isLoaded) {
    return <LoadingScreen onComplete={() => setIsLoaded(true)} />
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
            <div className="w-24 h-24 flex items-center justify-center">
              <img 
                src="/mecha-header-logo.png" 
                alt="MechaCrew Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ActivityFeed sessionId={sessionId} userId={userId} />
            
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-neon-blue" />
              ) : (
                <WifiOff className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-white text-sm font-bold">
                {users.length} PILOTS ONLINE
              </span>
            </div>
            
            <button
              onClick={() => setShowCanvas(!showCanvas)}
              className="mecha-button-secondary flex items-center space-x-2"
            >
              <span>🚀</span>
              <span>{showCanvas ? 'HIDE CANVAS' : 'VIEW CANVAS'}</span>
            </button>
            
            <button
              onClick={() => setShowCollaboration(!showCollaboration)}
              className="mecha-button-secondary flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>COLLABORATE</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-20 h-screen flex">
        {/* Public Canvas */}
        {showCanvas && (
          <div className="w-1/3 bg-gunmetal border-r-2 border-neon-blue p-4 overflow-y-auto">
            <PublicCanvas sessionId={sessionId} />
          </div>
        )}
        
        {/* Mecha Builder */}
        <div className={`${showCanvas ? 'flex-2' : 'flex-1'} relative`}>
          <MechaSVG 
            onFeatureSelect={handleFeatureSelect}
            selectedFeature={selectedFeature || undefined}
            addedComponents={addedComponents}
          />
          
          {/* Overlay Controls */}
          <div className="absolute top-4 left-4 space-y-2">
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="mecha-button flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>AI ORCHESTRATOR</span>
            </button>
            
            <button
              onClick={toggleSimulation}
              className={`mecha-button-secondary flex items-center space-x-2 ${
                isSimulating ? 'animate-pulse-neon' : ''
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? 'STOP' : 'SIMULATE'}</span>
            </button>
            
            <button
              onClick={resetMecha}
              className="mecha-button-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET</span>
            </button>
          </div>
          
          {/* Status Panel */}
          <div className="absolute bottom-4 left-4 mecha-panel p-4 min-w-[300px]">
            <h3 className="text-accent-yellow font-bold uppercase tracking-wider mb-2">
              MECHA STATUS
            </h3>
            <div className="space-y-2 text-white text-sm">
              <div className="flex justify-between">
                <span>Components:</span>
                <span className="text-neon-blue font-bold">{mechaComponents.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Power:</span>
                <span className="text-neon-blue font-bold">
                  {mechaComponents.reduce((sum, comp) => sum + comp.power, 0)} MW
                </span>
              </div>
              <div className="flex justify-between">
                <span>Weight:</span>
                <span className="text-neon-blue font-bold">
                  {mechaComponents.reduce((sum, comp) => sum + comp.weight, 0)} tons
                </span>
              </div>
              <div className="flex justify-between">
                <span>Durability:</span>
                <span className="text-neon-blue font-bold">
                  {Math.round(mechaComponents.reduce((sum, comp) => sum + comp.durability, 0) / mechaComponents.length)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-96 bg-steel-gray border-l-2 border-accent-yellow h-full overflow-y-auto"
            >
              <AIPanel 
                onCommand={handleAICommand}
                isGenerating={isGenerating}
                components={mechaComponents}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collaboration Panel */}
        <AnimatePresence>
          {showCollaboration && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-80 bg-steel-gray border-l-2 border-neon-blue h-full overflow-y-auto"
            >
              {selectedFeature && featurePosition ? (
                <AIPreview
                  feature={selectedFeature}
                  position={featurePosition}
                  onAccept={handleComponentAccept}
                  onReject={handleComponentReject}
                  onGenerateNew={handleGenerateNew}
                />
              ) : (
                <CollaborationPanel users={users} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
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