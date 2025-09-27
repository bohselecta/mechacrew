import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-mecha-red hover:bg-mecha-red/90 text-white font-bold uppercase tracking-wider',
          card: 'bg-steel-gray border-2 border-accent-yellow',
          headerTitle: 'text-white font-orbitron font-black chrome-text',
          headerSubtitle: 'text-neon-blue font-bold uppercase tracking-wider',
          socialButtonsBlockButton: 'bg-gunmetal border border-neon-blue text-white hover:bg-neon-blue/20',
          formFieldInput: 'mecha-input',
          identityPreviewText: 'text-white',
          formFieldLabel: 'text-accent-yellow font-bold uppercase tracking-wider',
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}
