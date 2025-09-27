'use client'

import { Send } from 'lucide-react'

export default function CollaborationPanel({ users }: { users: any[] }) {
  return (
    <div className="h-full flex flex-col bg-steel-gray">
      {/* Header */}
      <div className="p-6 border-b-2 border-neon-blue">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neon-blue rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-black text-white chrome-text">
              COLLABORATION
            </h2>
            <p className="text-neon-blue text-sm font-bold uppercase tracking-wider">
              Real-time Multiplayer
            </p>
          </div>
        </div>
      </div>

      {/* Online Users */}
      <div className="p-4 border-b border-gunmetal">
        <h3 className="text-accent-yellow font-bold uppercase tracking-wider mb-3 text-sm">
          ONLINE PILOTS ({users.length})
        </h3>
        
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-2 bg-gunmetal rounded"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <div className="flex-1">
                <p className="text-white text-sm font-bold">{user.name}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 text-neon-blue">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05c-3.124-3.124-8.19-3.124-11.314 0a1 1 0 01-1.414-1.414c4.01-4.01 10.51-4.01 14.52 0a1 1 0 01-1.414 1.414zM12.12 13.88c-1.171-1.171-3.069-1.171-4.24 0a1 1 0 01-1.415-1.415c2.047-2.047 5.37-2.047 7.417 0a1 1 0 01-1.415 1.415z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-xs">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-accent-yellow font-bold uppercase tracking-wider text-sm">
            LIVE ACTIVITY
          </h3>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <div className="p-2 rounded bg-neon-blue/20 border border-neon-blue/30">
            <div className="flex items-center space-x-2">
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-bold text-xs">Pilot Alpha</span>
              <span className="text-gray-400 text-xs">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <p className="text-white text-xs mt-1">added a laser cannon</p>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gunmetal">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 mecha-input text-sm"
          />
          <button className="mecha-button-secondary px-3 py-2">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="p-4 border-t border-gunmetal">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-bold">CONNECTION:</span>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05c-3.124-3.124-8.19-3.124-11.314 0a1 1 0 01-1.414-1.414c4.01-4.01 10.51-4.01 14.52 0a1 1 0 01-1.414 1.414zM12.12 13.88c-1.171-1.171-3.069-1.171-4.24 0a1 1 0 01-1.415-1.415c2.047-2.047 5.37-2.047 7.417 0a1 1 0 01-1.415 1.415z" clipRule="evenodd" />
            </svg>
            <span className="text-neon-blue text-sm font-bold">CONNECTED</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Real-time sync enabled • Low latency
        </div>
      </div>
    </div>
  )
}