'use client'

import { useAuth } from "src/components/providers/auth-provider"
import { Button } from "src/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Accounting Practice Management{" "}
            <span className="text-primary">Made Simple and Efficient</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Streamline your accounting practice with our comprehensive management tool. Track clients, manage deadlines, and optimize your workflow.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="gap-2" onClick={handleGetStarted}>
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to manage your accounting practice efficiently
          </p>
        </div>

        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {/* Client Management */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Client Management</h3>
                <p className="text-sm text-muted-foreground">
                  Organize and manage your client information efficiently
                </p>
              </div>
            </div>
          </div>

          {/* Project Management */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Project Management</h3>
                <p className="text-sm text-muted-foreground">
                  Track projects, deadlines, and assignments
                </p>
              </div>
            </div>
          </div>

          {/* Task Management */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">Task Management</h3>
                <p className="text-sm text-muted-foreground">
                  Organize and track daily tasks and to-dos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
