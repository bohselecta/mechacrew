'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VotingComponentProps {
  componentId: string
  sessionId: string
  userId: string
  componentData: any
  creatorName: string
  previewDescription: string
  onVote: (componentId: string, vote: 'approve' | 'reject' | 'submit' | 'improve') => void
  onClose: () => void
}

export default function VotingComponent({
  componentId,
  sessionId,
  userId,
  componentData,
  creatorName,
  previewDescription,
  onVote,
  onClose
}: VotingComponentProps) {
  const [votes, setVotes] = useState<{approve: number, reject: number, total: number}>({approve: 0, reject: 0, total: 0})
  const [userVote, setUserVote] = useState<'approve' | 'reject' | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    // Poll for vote updates
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/voting?sessionId=${sessionId}&userId=${userId}`)
        const data = await response.json()
        
        if (data.success) {
          const pendingVote = data.pendingVotes.find((v: any) => v.id === componentId)
          if (pendingVote) {
            setVotes({
              approve: pendingVote.votes.filter((v: any) => v.vote === 'approve').length,
              reject: pendingVote.votes.filter((v: any) => v.vote === 'reject').length,
              total: pendingVote.votes.length
            })
            
            const userVoteData = pendingVote.votes.find((v: any) => v.userId === userId)
            if (userVoteData) {
              setUserVote(userVoteData.vote)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching votes:', error)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [componentId, sessionId, userId])

  const handleVote = async (vote: 'approve' | 'reject') => {
    if (userVote || isVoting) return
    
    setIsVoting(true)
    try {
      const response = await fetch('/api/voting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId,
          sessionId,
          userId,
          vote,
          componentData
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setUserVote(vote)
        if (data.status === 'approved' || data.status === 'rejected') {
          setTimeout(() => onClose(), 2000)
        }
      }
    } catch (error) {
      console.error('Voting error:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const isApproved = votes.approve > votes.reject && votes.total >= 2
  const isRejected = votes.reject > votes.approve && votes.total >= 2

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-gunmetal border-2 border-neon-blue rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div className="text-center mb-4">
          <h3 className="text-neon-blue font-bold text-xl mb-2">
            🗳️ Team Vote Required
          </h3>
          <p className="text-white text-sm">
            <span className="text-accent-yellow">{creatorName}</span> wants to add:
          </p>
        </div>

        <div className="bg-steel-gray border border-neon-blue rounded p-4 mb-4">
          <h4 className="text-neon-blue font-bold mb-2">{componentData.name}</h4>
          <p className="text-white text-sm mb-2">{previewDescription}</p>
          <div className="flex justify-between text-xs text-steel-gray">
            <span>Power: {componentData.power}</span>
            <span>Durability: {componentData.durability}</span>
            <span>Weight: {componentData.weight}</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="flex justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-green-400">👍</span>
              <span className="text-white">{votes.approve}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-red-400">👎</span>
              <span className="text-white">{votes.reject}</span>
            </div>
          </div>
          <p className="text-steel-gray text-xs mt-2">
            {votes.total < 2 ? `Need ${2 - votes.total} more vote(s)` : 'Majority reached'}
          </p>
        </div>

        {!userVote && !isApproved && !isRejected && (
          <div className="flex space-x-4">
            <button
              onClick={() => handleVote('approve')}
              disabled={isVoting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {isVoting ? 'Voting...' : '👍 Approve'}
            </button>
            <button
              onClick={() => handleVote('reject')}
              disabled={isVoting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {isVoting ? 'Voting...' : '👎 Reject'}
            </button>
          </div>
        )}

        {userVote && (
          <div className="text-center">
            <p className="text-accent-yellow font-bold">
              You voted: {userVote === 'approve' ? '👍 Approve' : '👎 Reject'}
            </p>
          </div>
        )}

        {isApproved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-green-400 font-bold text-lg">✅ Approved!</p>
            <p className="text-white text-sm mb-4">Component ready for submission</p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Submit to mecha canvas
                  onVote(componentId, 'submit')
                  onClose()
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2"
              >
                <span>🚀</span>
                <span>READY TO SUBMIT</span>
              </button>
              
              <button
                onClick={() => {
                  // Mark for improvement
                  onVote(componentId, 'improve')
                  onClose()
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2"
              >
                <span>🔧</span>
                <span>IMPROVE SOME MORE</span>
              </button>
            </div>
          </motion.div>
        )}

        {isRejected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-red-400 font-bold text-lg">❌ Rejected</p>
            <p className="text-white text-sm">Component not added</p>
          </motion.div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-steel-gray hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}
