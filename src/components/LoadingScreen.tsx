'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('INITIALIZING MECHA SYSTEMS...')

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'CALIBRATING AI ORCHESTRATOR...' },
      { progress: 40, text: 'SYNCHRONIZING COLLABORATION NETWORK...' },
      { progress: 60, text: 'LOADING 3D RENDERING ENGINE...' },
      { progress: 80, text: 'PREPARING MECHA COMPONENTS...' },
      { progress: 100, text: 'SYSTEMS ONLINE - READY FOR DEPLOYMENT!' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep]
        setLoadingProgress(step.progress)
        setLoadingText(step.text)
        currentStep++
      } else {
        clearInterval(interval)
        setTimeout(onComplete, 1000) // Wait 1 second before completing
      }
    }, 800)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-steel-gray via-gunmetal to-steel-gray flex items-center justify-center"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="hud-scanline"></div>
        </div>

        <div className="text-center space-y-8 relative z-10">
          {/* Main Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              delay: 0.2 
            }}
            className="w-80 h-80 mx-auto flex items-center justify-center"
          >
            <img 
              src="/MC-Logo.png" 
              alt="MechaCrew Loading" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-orbitron font-black text-white chrome-text">
              MECHACREW
            </h1>
            <p className="text-neon-blue text-lg font-bold uppercase tracking-wider">
              Collaborative AI Mecha Builder
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="w-80 mx-auto space-y-4"
          >
            <div className="bg-gunmetal border-2 border-neon-blue rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-neon-blue to-accent-yellow"
              />
            </div>
            
            <p className="text-white text-sm font-bold uppercase tracking-wider">
              {loadingText}
            </p>
            
            <p className="text-steel-gray text-xs">
              {loadingProgress}% COMPLETE
            </p>
          </motion.div>

          {/* Animated Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 w-20 h-20 border-2 border-neon-blue border-t-transparent rounded-full opacity-50"
          />
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -left-10 w-16 h-16 border-2 border-accent-yellow border-t-transparent rounded-full opacity-50"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
