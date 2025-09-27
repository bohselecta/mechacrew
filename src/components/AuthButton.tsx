'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { User, LogIn } from 'lucide-react'

export default function AuthButton() {
  return (
    <div className="flex items-center space-x-4">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="mecha-button-secondary flex items-center space-x-2">
            <LogIn className="w-4 h-4" />
            <span>LOGIN</span>
          </button>
        </SignInButton>
      </SignedOut>
      
      <SignedIn>
        <div className="flex items-center space-x-3">
          <div className="text-white text-sm font-bold">
            <User className="w-4 h-4 inline mr-1" />
            Welcome, Pilot!
          </div>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-8 h-8',
                userButtonPopoverCard: 'bg-steel-gray border-2 border-accent-yellow',
                userButtonPopoverActionButton: 'text-white hover:bg-neon-blue/20',
                userButtonPopoverActionButtonText: 'text-white font-bold uppercase tracking-wider',
                userButtonPopoverFooter: 'hidden'
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  )
}

// Guest mode component for demo purposes
export function GuestMode() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-steel-gray/90 backdrop-blur-md border-2 border-accent-yellow p-6 rounded-lg max-w-md mx-auto"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-mecha-red rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h2 className="text-2xl font-orbitron font-black text-white chrome-text mb-2">
            GUEST MODE
          </h2>
          <p className="text-neon-blue font-bold uppercase tracking-wider text-sm">
            Demo Access - No Login Required
          </p>
        </div>
        
        <p className="text-white text-sm">
          Experience MechaCrew&apos;s full capabilities without creating an account. 
          All features are available in guest mode for demonstration purposes.
        </p>
        
        <div className="space-y-2 text-left">
          <div className="flex items-center space-x-2 text-accent-yellow text-sm">
            <div className="w-2 h-2 bg-accent-yellow rounded-full" />
            <span>Full AI Orchestrator Access</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-yellow text-sm">
            <div className="w-2 h-2 bg-accent-yellow rounded-full" />
            <span>Real-time Collaboration</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-yellow text-sm">
            <div className="w-2 h-2 bg-accent-yellow rounded-full" />
            <span>3D Mecha Builder</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-yellow text-sm">
            <div className="w-2 h-2 bg-accent-yellow rounded-full" />
            <span>Physics Simulation</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gunmetal">
          <p className="text-gray-400 text-xs">
            Authentication will be enabled after the beta period
          </p>
        </div>
      </div>
    </motion.div>
  )
}
