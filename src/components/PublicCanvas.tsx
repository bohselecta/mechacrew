'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CanvasComponent {
  id: string
  name: string
  description: string
  type: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  material: string
  power: number
  durability: number
  weight: number
  submittedAt: string
  submittedBy: string
  status: string
}

interface PublicCanvasProps {
  sessionId: string
}

export default function PublicCanvas({ sessionId }: PublicCanvasProps) {
  const [components, setComponents] = useState<CanvasComponent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPower, setTotalPower] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)

  const fetchComponents = async () => {
    try {
      const response = await fetch(`/api/canvas?sessionId=${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        setComponents(data.components)
        setTotalPower(data.components.reduce((sum: number, comp: CanvasComponent) => sum + comp.power, 0))
        setTotalWeight(data.components.reduce((sum: number, comp: CanvasComponent) => sum + comp.weight, 0))
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error fetching components:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComponents()
    
    // Poll for updates every 3 seconds
    const interval = setInterval(fetchComponents, 3000)
    return () => clearInterval(interval)
  }, [sessionId])

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'head': return '🧠'
      case 'torso': return '🛡️'
      case 'arm': return '💪'
      case 'leg': return '🦵'
      case 'weapon': return '⚔️'
      case 'accessory': return '🔧'
      default: return '⚙️'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-steel-gray border-2 border-neon-blue rounded-lg p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white">Loading mecha canvas...</p>
      </div>
    )
  }

  return (
    <div className="bg-steel-gray border-2 border-neon-blue rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-neon-blue font-bold text-xl">🚀 PUBLIC MECHA CANVAS</h3>
        <div className="text-right text-sm">
          <p className="text-white">Components: <span className="text-accent-yellow font-bold">{components.length}</span></p>
          <p className="text-white">Power: <span className="text-neon-blue font-bold">{totalPower}MW</span></p>
          <p className="text-white">Weight: <span className="text-neon-blue font-bold">{totalWeight}t</span></p>
        </div>
      </div>

      {components.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-steel-gray to-gunmetal rounded-lg flex items-center justify-center border-2 border-neon-blue">
            <div className="text-4xl">⚙️</div>
          </div>
          <p className="text-steel-gray text-lg">No components submitted yet</p>
          <p className="text-steel-gray text-sm">Be the first to add a component!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gunmetal border border-neon-blue rounded-lg p-4 hover:border-accent-yellow transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getComponentIcon(component.type)}</span>
                  <h4 className="text-white font-bold text-sm">{component.name}</h4>
                </div>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: component.color }}
                />
              </div>
              
              <p className="text-steel-gray text-xs mb-3">{component.description}</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-neon-blue font-bold">{component.power}</p>
                  <p className="text-steel-gray">Power</p>
                </div>
                <div className="text-center">
                  <p className="text-neon-blue font-bold">{component.durability}</p>
                  <p className="text-steel-gray">Durability</p>
                </div>
                <div className="text-center">
                  <p className="text-neon-blue font-bold">{component.weight}</p>
                  <p className="text-steel-gray">Weight</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-steel-gray">
                <p className="text-accent-yellow text-xs">
                  Added by User_{component.submittedBy.slice(-4)}
                </p>
                <p className="text-steel-gray text-xs">
                  {new Date(component.submittedAt).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-steel-gray text-xs">
          Canvas updates in real-time • Share this session to collaborate
        </p>
      </div>
    </div>
  )
}
