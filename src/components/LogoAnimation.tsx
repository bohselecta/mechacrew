'use client'

import { motion } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'

export default function LogoAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Logo Container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        {/* Chrome Sweep Effect */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-yellow to-transparent opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(249, 214, 72, 0.8) 50%, transparent 100%)',
            transform: 'skewX(-20deg)'
          }}
        />
        
        {/* Main Logo */}
        <div className="relative z-10">
          {/* Mecha Icon */}
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-24 h-24 bg-mecha-red rounded-lg flex items-center justify-center mb-6 mx-auto shadow-2xl"
          >
            <Zap className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-6xl font-orbitron font-black text-white chrome-text text-center mb-2"
            style={{
              textShadow: '0 0 20px #F9D648, 0 0 40px #F9D648, 0 0 60px #F9D648'
            }}
          >
            MECHACREW
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-neon-blue text-xl font-bold uppercase tracking-widest text-center"
          >
            Collaborative AI Mecha Builder
          </motion.p>
        </div>
      </motion.div>

      {/* Loading Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex items-center space-x-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full"
        />
        <span className="text-white font-bold uppercase tracking-wider">
          Initializing Systems...
        </span>
      </motion.div>

      {/* Status Messages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="space-y-2 text-center"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.2 }}
          className="flex items-center justify-center space-x-2 text-neon-blue"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold">AI Orchestrator Online</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.4 }}
          className="flex items-center justify-center space-x-2 text-accent-yellow"
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm font-bold">3D Engine Ready</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.6 }}
          className="flex items-center justify-center space-x-2 text-mecha-red"
        >
          <div className="w-2 h-2 bg-mecha-red rounded-full animate-pulse" />
          <span className="text-sm font-bold">Multiplayer Sync Active</span>
        </motion.div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="w-64 h-2 bg-gunmetal rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 3, delay: 2.8, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-mecha-red via-neon-blue to-accent-yellow"
        />
      </motion.div>
    </div>
  )
}