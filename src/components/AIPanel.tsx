'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Send, Loader, Sparkles, RotateCcw } from 'lucide-react'

interface MechaComponent {
  id: string
  type: string
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

interface AIPanelProps {
  onCommand: (command: string) => void
  isGenerating: boolean
  components: MechaComponent[]
}

export default function AIPanel({ onCommand, isGenerating, components }: AIPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      setHistory(prev => [...prev, prompt])
      onCommand(prompt)
      setPrompt('')
    }
  }

  const quickCommands = [
    "Add rocket boosters to the legs",
    "Create a laser cannon for the right arm",
    "Add armor plating to the torso",
    "Install a targeting system in the head",
    "Add energy shields around the mecha",
    "Create thruster pods for flight",
    "Add a plasma sword to the left arm",
    "Install stealth camouflage system"
  ]

  return (
    <div className="h-full flex flex-col bg-steel-gray">
      {/* Header */}
      <div className="p-6 border-b-2 border-accent-yellow">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-mecha-red rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-black text-white chrome-text">
              AI ORCHESTRATOR
            </h2>
            <p className="text-neon-blue text-sm font-bold uppercase tracking-wider">
              Natural Language Mecha Design
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="p-4 border-b border-gunmetal">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-bold">STATUS:</span>
          <div className="flex items-center space-x-2">
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 text-neon-blue animate-spin" />
                <span className="text-neon-blue text-sm font-bold">GENERATING...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-accent-yellow" />
                <span className="text-accent-yellow text-sm font-bold">READY</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="p-4 border-b border-gunmetal">
        <h3 className="text-accent-yellow font-bold uppercase tracking-wider mb-3 text-sm">
          QUICK COMMANDS
        </h3>
        <div className="space-y-2">
          {quickCommands.map((command, index) => (
            <button
              key={index}
              onClick={() => setPrompt(command)}
              className="w-full text-left p-2 bg-gunmetal hover:bg-neon-blue/20 text-white text-sm rounded border border-gunmetal hover:border-neon-blue transition-all duration-200"
            >
              {command}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-b border-gunmetal">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-accent-yellow font-bold uppercase tracking-wider text-sm mb-2">
              AI COMMAND
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to add to your mecha..."
              className="w-full mecha-input h-20 resize-none"
              disabled={isGenerating}
            />
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full mecha-button flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'GENERATING...' : 'EXECUTE'}</span>
          </button>
        </form>
      </div>

      {/* History */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-accent-yellow font-bold uppercase tracking-wider text-sm">
            COMMAND HISTORY
          </h3>
          <button
            onClick={() => setHistory([])}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No commands yet...</p>
          ) : (
            history.map((command, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gunmetal rounded border border-gunmetal"
              >
                <p className="text-white text-sm">{command}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Component Stats */}
      <div className="p-4 border-t border-gunmetal">
        <h3 className="text-accent-yellow font-bold uppercase tracking-wider mb-3 text-sm">
          CURRENT MECHA
        </h3>
        <div className="space-y-2 text-white text-sm">
          <div className="flex justify-between">
            <span>Components:</span>
            <span className="text-neon-blue font-bold">{components.length}</span>
          </div>
          <div className="flex justify-between">
            <span>AI Generated:</span>
            <span className="text-neon-blue font-bold">
              {components.filter(c => c.createdBy === 'ai').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Power:</span>
            <span className="text-neon-blue font-bold">
              {components.reduce((sum, c) => sum + c.power, 0)} MW
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}