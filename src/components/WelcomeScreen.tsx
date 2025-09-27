'use client'

import { motion } from 'framer-motion'
import { User, Eye, Zap } from 'lucide-react'

interface WelcomeScreenProps {
  onAccountCreate: () => void
  onGuestView: () => void
}

export default function WelcomeScreen({ onAccountCreate, onGuestView }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-gray via-gunmetal to-steel-gray flex items-center justify-center blueprint-bg">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
        {/* Hero Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-64 h-64 mx-auto flex items-center justify-center"
        >
          <img 
            src="/MC-Logo.png" 
            alt="MechaCrew Welcome" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-orbitron font-black text-white chrome-text">
            WELCOME TO MECHACREW
          </h1>
          <p className="text-neon-blue text-xl font-bold uppercase tracking-wider">
            Collaborative AI Mecha Builder
          </p>
          <p className="text-white text-lg max-w-xl mx-auto">
            Build epic mechas with AI assistance and collaborate with other pilots in real-time. 
            The future of multiplayer creation awaits.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccountCreate}
            className="mecha-button flex items-center space-x-3 px-8 py-4 text-lg"
          >
            <User className="w-6 h-6" />
            <span>CREATE ACCOUNT</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGuestView}
            className="mecha-button-secondary flex items-center space-x-3 px-8 py-4 text-lg"
          >
            <Eye className="w-6 h-6" />
            <span>NO, JUST VIEW MECHACREW</span>
          </motion.button>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <div className="mecha-panel p-6 text-center">
            <Zap className="w-8 h-8 text-neon-blue mx-auto mb-3" />
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              AI ORCHESTRATOR
            </h3>
            <p className="text-steel-gray text-xs">
              Natural language commands generate mecha components with SVG precision
            </p>
          </div>
          
          <div className="mecha-panel p-6 text-center">
            <User className="w-8 h-8 text-neon-blue mx-auto mb-3" />
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              REAL-TIME COLLABORATION
            </h3>
            <p className="text-steel-gray text-xs">
              Multiple pilots can work together on the same mecha simultaneously
            </p>
          </div>
          
          <div className="mecha-panel p-6 text-center">
            <Eye className="w-8 h-8 text-neon-blue mx-auto mb-3" />
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              LIVE MECHA CANVAS
            </h3>
            <p className="text-steel-gray text-xs">
              Your mecha exists as a persistent database object that evolves over time
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="text-steel-gray text-sm"
        >
          <p>Ready to build the ultimate mecha? Choose your path above.</p>
        </motion.div>
      </div>
    </div>
  )
}
