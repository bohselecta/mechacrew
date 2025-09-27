'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react'
import { SvgPart } from '@/components/MechaBuilder/SvgPart'
import type { MechaSvgPart } from '@/types/mecha-svg'

interface SVGPreviewProps {
  componentData: any
  onApprove: (component: MechaSvgPart) => void
  onReject: () => void
  onGenerateNew: () => void
}

export default function SVGPreview({ componentData, onApprove, onReject, onGenerateNew }: SVGPreviewProps) {
  const [svgPart, setSvgPart] = useState<MechaSvgPart | null>(null)
  const [isGeneratingSVG, setIsGeneratingSVG] = useState(false)

  useEffect(() => {
    const generateSVG = async () => {
      setIsGeneratingSVG(true)
      
      try {
        const response = await fetch('/api/ai/generate-svg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            componentType: componentData.type,
            description: componentData.description,
            targetAnchorId: `${componentData.type}_socket`
          })
        })
        
        const data = await response.json()
        
        if (data.success) {
          setSvgPart(data.svgPart)
        }
      } catch (error) {
        console.error('SVG generation failed:', error)
      } finally {
        setIsGeneratingSVG(false)
      }
    }

    generateSVG()
  }, [componentData])

  const handleRegenerate = async () => {
    setIsGeneratingSVG(true)
    
    try {
      const response = await fetch('/api/ai/generate-svg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          componentType: componentData.type,
          description: componentData.description,
          targetAnchorId: `${componentData.type}_socket`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSvgPart(data.svgPart)
      }
    } catch (error) {
      console.error('SVG generation failed:', error)
    } finally {
      setIsGeneratingSVG(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gunmetal border-2 border-neon-blue rounded-lg p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neon-blue font-bold text-lg uppercase tracking-wider">
          SVG PREVIEW
        </h3>
        <div className="flex items-center space-x-2 text-accent-yellow">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-bold">LIVE PREVIEW</span>
        </div>
      </div>

      {/* Component Info */}
      <div className="mb-4">
        <h4 className="text-white font-bold text-sm uppercase tracking-wider">
          {componentData.name}
        </h4>
        <p className="text-white text-xs mt-1">
          {componentData.description}
        </p>
      </div>

      {/* SVG Preview Area */}
      <div className="bg-steel-gray border border-neon-blue rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center">
        {isGeneratingSVG ? (
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-neon-blue font-bold text-sm uppercase tracking-wider">
              GENERATING SVG...
            </p>
          </div>
        ) : svgPart ? (
          <div className="svg-preview">
            <SvgPart part={svgPart} className="w-48 h-48" />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-steel-gray text-sm">Failed to generate SVG</p>
            <button
              onClick={handleRegenerate}
              className="mt-2 bg-neon-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors text-xs"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Component Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
        <div className="text-center">
          <p className="text-neon-blue font-bold">{svgPart?.powerWatts ? Math.round(svgPart.powerWatts / 1000) : componentData.power}</p>
          <p className="text-white text-xs">Power (kW)</p>
        </div>
        <div className="text-center">
          <p className="text-neon-blue font-bold">{svgPart?.durability || componentData.durability}</p>
          <p className="text-white text-xs">Durability</p>
        </div>
        <div className="text-center">
          <p className="text-neon-blue font-bold">{svgPart?.massKg ? Math.round(svgPart.massKg) : componentData.weight}</p>
          <p className="text-white text-xs">Mass (kg)</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="bg-mecha-red border border-accent-yellow rounded-lg p-3 mb-3">
          <p className="text-accent-yellow text-xs font-bold uppercase tracking-wider text-center">
            READY FOR TEAM VOTING
          </p>
          <p className="text-white text-xs text-center mt-1">
            This component will be submitted for collaborative approval
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => svgPart && onApprove(svgPart)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2"
            disabled={!svgPart}
          >
            <CheckCircle className="w-4 h-4" />
            <span>APPROVE FOR VOTING</span>
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
    </motion.div>
  )
}
