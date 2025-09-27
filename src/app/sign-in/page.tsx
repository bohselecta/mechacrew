import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-gray via-gunmetal to-steel-gray flex items-center justify-center blueprint-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-black text-white chrome-text mb-4">
            MECHACREW
          </h1>
          <p className="text-neon-blue text-lg font-bold uppercase tracking-wider">
            Pilot Authentication Required
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
