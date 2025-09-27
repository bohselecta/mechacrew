'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ActivityItem {
  id: string
  componentData: any
  creatorId: string
  creatorName: string
  createdAt: string
  approvedAt?: string
  approvedBy?: string[]
  status: 'approved' | 'rejected'
}

interface ActivityFeedProps {
  sessionId: string
  userId: string
}

export default function ActivityFeed({ sessionId, userId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [lastSeen, setLastSeen] = useState<Date | null>(null)

  useEffect(() => {
    // Load last seen timestamp
    const saved = localStorage.getItem(`lastSeen_${sessionId}`)
    if (saved) {
      setLastSeen(new Date(saved))
    }

    // Fetch activity history
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/voting?sessionId=${sessionId}&userId=${userId}`)
        const data = await response.json()
        
        if (data.success) {
          setActivities(data.history || [])
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    fetchActivities()

    // Poll for updates
    const interval = setInterval(fetchActivities, 5000)
    return () => clearInterval(interval)
  }, [sessionId, userId])

  const markAsSeen = () => {
    setLastSeen(new Date())
    localStorage.setItem(`lastSeen_${sessionId}`, new Date().toISOString())
  }

  const getNewActivities = () => {
    if (!lastSeen) return activities
    return activities.filter(activity => 
      new Date(activity.approvedAt || activity.createdAt) > lastSeen
    )
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const newActivities = getNewActivities()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gunmetal border-2 border-neon-blue p-3 rounded-lg hover:bg-steel-gray transition-colors relative"
      >
        <div className="flex items-center space-x-2">
          <span className="text-neon-blue font-bold">📋 Activity Feed</span>
          {newActivities.length > 0 && (
            <span className="bg-accent-yellow text-black text-xs font-bold px-2 py-1 rounded-full">
              {newActivities.length}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-80 bg-gunmetal border-2 border-neon-blue rounded-lg p-4 z-10 max-h-96 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-neon-blue font-bold">Recent Changes</h3>
            <button
              onClick={markAsSeen}
              className="text-accent-yellow text-xs hover:underline"
            >
              Mark as seen
            </button>
          </div>

          {activities.length === 0 ? (
            <p className="text-steel-gray text-sm">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const isNew = lastSeen && new Date(activity.approvedAt || activity.createdAt) > lastSeen
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded border ${
                      isNew ? 'border-accent-yellow bg-accent-yellow bg-opacity-10' : 'border-steel-gray'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-bold ${
                          activity.status === 'approved' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {activity.status === 'approved' ? '✅' : '❌'}
                        </span>
                        <span className="text-white font-bold text-sm">
                          {activity.componentData.name}
                        </span>
                      </div>
                      <span className="text-steel-gray text-xs">
                        {formatTime(activity.approvedAt || activity.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-steel-gray text-xs mb-2">
                      by <span className="text-accent-yellow">{activity.creatorName}</span>
                    </p>
                    
                    <p className="text-white text-xs">
                      {activity.componentData.description}
                    </p>
                    
                    {activity.status === 'approved' && activity.approvedBy && (
                      <p className="text-green-400 text-xs mt-1">
                        Approved by {activity.approvedBy.length} team member(s)
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
