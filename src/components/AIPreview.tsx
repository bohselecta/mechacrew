'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

interface AIPreviewProps {
  feature: string
  position: { x: number, y: number }
  onAccept: (component: any) => void
  onReject: () => void
  onGenerateNew: () => void
}

export default function AIPreview({ feature, position, onAccept, onReject, onGenerateNew }: AIPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewComponent, setPreviewComponent] = useState<any>(null)

  // Generate component preview
  const generatePreview = useCallback(async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command: `Add a ${feature} component to the mecha`,
          existingComponents: [],
          sessionId: 'demo-session',
          userId: 'demo-user',
          isRefinement: false
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setPreviewComponent(data.component)
      }
    } catch (error) {
      console.error('Preview generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [feature])

  // Auto-generate preview when component mounts
  useEffect(() => {
    generatePreview()
  }, [generatePreview])

  const getFeatureIcon = (featureType: string) => {
    switch (featureType) {
      case 'head': return '🧠'
      case 'left-eye': case 'right-eye': return '👁️'
      case 'visor': return '🥽'
      case 'antenna': return '📡'
      case 'torso': return '🛡️'
      case 'chest-core': return '⚡'
      case 'left-shoulder': case 'right-shoulder': return '🔧'
      case 'left-arm': case 'right-arm': return '💪'
      case 'left-hand': case 'right-hand': return '✋'
      case 'left-leg': case 'right-leg': return '🦵'
      case 'left-foot': case 'right-foot': return '👢'
      case 'back-pack': return '🎒'
      case 'left-wing': case 'right-wing': return '🪽'
      default: return '⚙️'
    }
  }

  const getFeatureName = (featureType: string) => {
    const names: { [key: string]: string } = {
      'head': 'Head Unit',
      'left-eye': 'Left Eye Sensor',
      'right-eye': 'Right Eye Sensor',
      'visor': 'Combat Visor',
      'antenna': 'Communication Antenna',
      'torso': 'Main Torso',
      'chest-core': 'Power Core',
      'left-shoulder': 'Left Shoulder',
      'right-shoulder': 'Right Shoulder',
      'left-arm': 'Left Arm',
      'left-hand': 'Left Hand',
      'right-arm': 'Right Arm',
      'right-hand': 'Right Hand',
      'left-leg': 'Left Leg',
      'left-foot': 'Left Foot',
      'right-leg': 'Right Leg',
      'right-foot': 'Right Foot',
      'back-pack': 'Backpack Unit',
      'left-wing': 'Left Wing Thruster',
      'right-wing': 'Right Wing Thruster'
    }
    return names[featureType] || 'Unknown Component'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gunmetal border-2 border-neon-blue rounded-lg p-6 shadow-2xl mt-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neon-blue font-bold text-lg uppercase tracking-wider">
          AI COMPONENT PREVIEW
        </h3>
        <div className="text-2xl">
          {getFeatureIcon(feature)}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-white font-bold text-sm uppercase tracking-wider">
          {getFeatureName(feature)}
        </h4>
        <p className="text-steel-gray text-xs mt-1">
          Position: ({position.x}, {position.y})
        </p>
      </div>

      {isGenerating ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neon-blue font-bold text-sm uppercase tracking-wider">
            GENERATING COMPONENT...
          </p>
        </div>
      ) : previewComponent ? (
        <div className="space-y-4">
          {/* Component Preview */}
          <div className="bg-steel-gray border border-neon-blue rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-white font-bold text-sm">{previewComponent.name}</h5>
              <div 
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ backgroundColor: previewComponent.color }}
              />
            </div>
            
            <p className="text-white text-xs mb-3">{previewComponent.description}</p>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <p className="text-neon-blue font-bold">{previewComponent.power}</p>
                <p className="text-white text-xs">Power</p>
              </div>
              <div className="text-center">
                <p className="text-neon-blue font-bold">{previewComponent.durability}</p>
                <p className="text-white text-xs">Durability</p>
              </div>
              <div className="text-center">
                <p className="text-neon-blue font-bold">{previewComponent.weight}</p>
                <p className="text-white text-xs">Weight</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => onAccept(previewComponent)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>USE THIS</span>
            </button>
            
            <button
              onClick={onGenerateNew}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>MAKE ANOTHER</span>
            </button>
            
            <button
              onClick={onReject}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2"
            >
              <XCircle className="w-4 h-4" />
              <span>CANCEL</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-steel-gray text-sm">Failed to generate preview</p>
          <button
            onClick={generatePreview}
            className="mt-4 bg-neon-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </motion.div>
  )
}
