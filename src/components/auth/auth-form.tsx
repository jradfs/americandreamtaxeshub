'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from '@/lib/validations/auth'

interface AuthFormProps {
  onSignIn: (data: SignInValues) => Promise<void>
  onSignUp: (data: SignUpValues) => Promise<void>
}

export function AuthForm({ onSignIn, onSignUp }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: errorsSignIn },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  })

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: errorsSignUp },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  })

  const handleSignIn = async (data: SignInValues) => {
    setIsLoading(true)
    try {
      await onSignIn(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (data: SignUpValues) => {
    setIsLoading(true)
    try {
      await onSignUp(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={handleSubmitSignIn(handleSignIn)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...registerSignIn('email')}
              className={errorsSignIn.email ? 'border-destructive' : ''}
            />
            {errorsSignIn.email && (
              <p className="text-sm text-destructive">
                {errorsSignIn.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...registerSignIn('password')}
              className={errorsSignIn.password ? 'border-destructive' : ''}
            />
            {errorsSignIn.password && (
              <p className="text-sm text-destructive">
                {errorsSignIn.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={handleSubmitSignUp(handleSignUp)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              {...registerSignUp('email')}
              className={errorsSignUp.email ? 'border-destructive' : ''}
            />
            {errorsSignUp.email && (
              <p className="text-sm text-destructive">
                {errorsSignUp.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              type="text"
              placeholder="John Doe"
              {...registerSignUp('full_name')}
              className={errorsSignUp.full_name ? 'border-destructive' : ''}
            />
            {errorsSignUp.full_name && (
              <p className="text-sm text-destructive">
                {errorsSignUp.full_name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              {...registerSignUp('password')}
              className={errorsSignUp.password ? 'border-destructive' : ''}
            />
            {errorsSignUp.password && (
              <p className="text-sm text-destructive">
                {errorsSignUp.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
} 