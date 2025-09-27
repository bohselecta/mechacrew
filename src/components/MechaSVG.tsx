'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface MechaSVGProps {
  onFeatureSelect: (feature: string, position: { x: number, y: number }) => void
  selectedFeature?: string
  addedComponents: string[]
}

export default function MechaSVG({ onFeatureSelect, selectedFeature, addedComponents }: MechaSVGProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  const features = [
    { id: 'head', name: 'Head Unit', x: 200, y: 50, width: 80, height: 60 },
    { id: 'left-eye', name: 'Left Eye Sensor', x: 210, y: 65, width: 15, height: 12 },
    { id: 'right-eye', name: 'Right Eye Sensor', x: 255, y: 65, width: 15, height: 12 },
    { id: 'visor', name: 'Combat Visor', x: 220, y: 75, width: 40, height: 8 },
    { id: 'antenna', name: 'Communication Antenna', x: 235, y: 35, width: 4, height: 20 },
    
    { id: 'torso', name: 'Main Torso', x: 180, y: 110, width: 100, height: 120 },
    { id: 'chest-core', name: 'Power Core', x: 200, y: 130, width: 60, height: 40 },
    { id: 'left-shoulder', name: 'Left Shoulder', x: 160, y: 120, width: 30, height: 40 },
    { id: 'right-shoulder', name: 'Right Shoulder', x: 270, y: 120, width: 30, height: 40 },
    
    { id: 'left-arm', name: 'Left Arm', x: 140, y: 160, width: 40, height: 80 },
    { id: 'left-hand', name: 'Left Hand', x: 120, y: 230, width: 25, height: 30 },
    { id: 'right-arm', name: 'Right Arm', x: 280, y: 160, width: 40, height: 80 },
    { id: 'right-hand', name: 'Right Hand', x: 315, y: 230, width: 25, height: 30 },
    
    { id: 'left-leg', name: 'Left Leg', x: 200, y: 230, width: 35, height: 100 },
    { id: 'left-foot', name: 'Left Foot', x: 195, y: 320, width: 30, height: 20 },
    { id: 'right-leg', name: 'Right Leg', x: 225, y: 230, width: 35, height: 100 },
    { id: 'right-foot', name: 'Right Foot', x: 235, y: 320, width: 30, height: 20 },
    
    { id: 'back-pack', name: 'Backpack Unit', x: 190, y: 110, width: 80, height: 60 },
    { id: 'left-wing', name: 'Left Wing Thruster', x: 150, y: 140, width: 20, height: 40 },
    { id: 'right-wing', name: 'Right Wing Thruster', x: 290, y: 140, width: 20, height: 40 },
  ]

  const handleFeatureClick = (feature: any) => {
    onFeatureSelect(feature.id, { x: feature.x, y: feature.y })
  }

  const getFeatureColor = (featureId: string) => {
    if (selectedFeature === featureId) return '#F9D648' // Accent Yellow
    if (addedComponents.includes(featureId)) return '#08B0D5' // Neon Blue
    if (hoveredFeature === featureId) return '#E6322B' // Mecha Red
    return '#2E2E2E' // Steel Gray
  }

  const getFeatureOpacity = (featureId: string) => {
    if (selectedFeature === featureId) return 0.8
    if (addedComponents.includes(featureId)) return 0.6
    if (hoveredFeature === featureId) return 0.7
    return 0.3
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-steel-gray to-gunmetal p-8">
      <div className="relative">
        <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#08B0D5" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="400" fill="url(#grid)" />
          
          {/* Mecha Outline */}
          <g className="mecha-outline">
            {/* Main Body Structure */}
            <rect x="180" y="110" width="100" height="120" fill="none" stroke="#08B0D5" strokeWidth="2" opacity="0.4"/>
            <rect x="200" y="50" width="80" height="60" fill="none" stroke="#08B0D5" strokeWidth="2" opacity="0.4"/>
            <rect x="200" y="230" width="70" height="100" fill="none" stroke="#08B0D5" strokeWidth="2" opacity="0.4"/>
            
            {/* Feature Areas */}
            {features.map((feature) => (
              <motion.rect
                key={feature.id}
                x={feature.x}
                y={feature.y}
                width={feature.width}
                height={feature.height}
                fill={getFeatureColor(feature.id)}
                stroke="#08B0D5"
                strokeWidth="1"
                opacity={getFeatureOpacity(feature.id)}
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleFeatureClick(feature)}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                filter={selectedFeature === feature.id ? "url(#glow)" : "none"}
              />
            ))}
            
            {/* Connection Lines */}
            <line x1="240" y1="110" x2="240" y2="50" stroke="#08B0D5" strokeWidth="2" opacity="0.3"/>
            <line x1="200" y1="230" x2="200" y2="110" stroke="#08B0D5" strokeWidth="2" opacity="0.3"/>
            <line x1="280" y1="230" x2="280" y2="110" stroke="#08B0D5" strokeWidth="2" opacity="0.3"/>
            <line x1="160" y1="160" x2="180" y2="160" stroke="#08B0D5" strokeWidth="2" opacity="0.3"/>
            <line x1="320" y1="160" x2="280" y2="160" stroke="#08B0D5" strokeWidth="2" opacity="0.3"/>
          </g>
        </svg>
        
        {/* Feature Labels */}
        {hoveredFeature && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 bg-gunmetal border-2 border-neon-blue rounded-lg p-3 shadow-lg"
          >
            <h3 className="text-neon-blue font-bold text-sm uppercase tracking-wider">
              {features.find(f => f.id === hoveredFeature)?.name}
            </h3>
            <p className="text-white text-xs mt-1">
              Click to add component
            </p>
          </motion.div>
        )}
        
        {/* Selected Feature Info */}
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 bg-mecha-red border-2 border-accent-yellow rounded-lg p-4 shadow-lg"
          >
            <h3 className="text-accent-yellow font-bold text-sm uppercase tracking-wider">
              {features.find(f => f.id === selectedFeature)?.name} SELECTED
            </h3>
            <p className="text-white text-xs mt-1">
              Ready for AI component generation
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
