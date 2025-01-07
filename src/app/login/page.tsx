'use client'

import { useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth/auth-form'
import { signIn, signUp } from '@/lib/auth'
import { type SignInValues, type SignUpValues } from '@/lib/validations/auth'

export default function LoginPage() {
  const router = useRouter()

  const handleSignIn = async (data: SignInValues) => {
    await signIn(data)
    router.push('/dashboard')
  }

  const handleSignUp = async (data: SignUpValues) => {
    await signUp(data)
    router.push('/dashboard')
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to American Dream Taxes
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>
        <AuthForm onSignIn={handleSignIn} onSignUp={handleSignUp} />
      </div>
    </div>
  )
}
