'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Clerk components to avoid SSR issues
const DynamicSignIn = dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.SignIn })), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-white">Loading authentication...</p>
    </div>
  )
})

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            MECHACREW
          </h1>
          <p className="text-blue-400 text-lg font-bold uppercase tracking-wider">
            Pilot Authentication Required
          </p>
        </div>
        <Suspense fallback={
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Loading authentication...</p>
          </div>
        }>
          <DynamicSignIn />
        </Suspense>
      </div>
    </div>
  )
}
