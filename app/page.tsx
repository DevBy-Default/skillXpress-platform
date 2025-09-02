"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MockAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { UserRole } from "@/types"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Redirect if already logged in
    if (MockAuth.isAuthenticated()) {
      const user = MockAuth.getCurrentUser()
      router.push(`/dashboard/${user?.role}`)
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = MockAuth.login(email, password)

    if (user) {
      router.push(`/dashboard/${user.role}`)
    } else {
      alert("Login failed. Try one of the demo accounts.")
    }

    setIsLoading(false)
  }

  const quickLogin = (role: UserRole) => {
    const demoAccounts = {
      student: "student@demo.com",
      company: "company@demo.com",
      pm: "pm@demo.com",
      admin: "admin@demo.com",
    }

    setEmail(demoAccounts[role])
    setPassword("password")
    setSelectedRole(role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Badge className="glass neon-border px-4 py-2 text-sm font-mono">AI-POWERED PLATFORM</Badge>
              <h1 className="text-5xl lg:text-7xl font-bold font-mono leading-tight">
                <span className="gradient-text">SkillXpress</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 font-light">Next-Generation Micro-Internship Platform</p>
              <p className="text-lg text-gray-400 max-w-2xl">
                Connect with real-world opportunities through AI-assisted matching, complete micro-internships, and earn
                verifiable digital certifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="glass rounded-2xl p-6 neon-glow hover-glow">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-mono font-semibold text-blue-400">AI Matching</h3>
                <p className="text-sm text-gray-400">Smart project recommendations</p>
              </div>
              <div className="glass rounded-2xl p-6 neon-glow hover-glow">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-mono font-semibold text-cyan-400">Micro-Internships</h3>
                <p className="text-sm text-gray-400">Short-term, high-impact projects</p>
              </div>
              <div className="glass rounded-2xl p-6 neon-glow hover-glow">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-mono font-semibold text-purple-400">Certifications</h3>
                <p className="text-sm text-gray-400">Blockchain-verified credentials</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto space-y-6">
            <Card className="glass rounded-2xl border-white/10 shadow-2xl neon-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-mono gradient-text">Access Portal</CardTitle>
                <CardDescription className="text-gray-400">Enter any credentials to explore the demo</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-mono">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter any email"
                      className="glass border-white/20 focus:border-blue-400/50 focus:ring-blue-400/25 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300 font-mono">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter any password"
                      className="glass border-white/20 focus:border-blue-400/50 focus:ring-blue-400/25 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-300 font-mono">
                      Access Level
                    </Label>
                    <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                      <SelectTrigger className="glass border-white/20 focus:border-blue-400/50 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/20 rounded-xl">
                        <SelectItem value="student">Student Portal</SelectItem>
                        <SelectItem value="company">Company Dashboard</SelectItem>
                        <SelectItem value="pm">Project Manager Console</SelectItem>
                        <SelectItem value="admin">Admin Control Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl font-mono font-semibold hover-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? "INITIALIZING..." : "ENTER SYSTEM"}
                  </Button>
                </form>

                <div className="mt-6 space-y-3">
                  <p className="text-sm text-gray-400 text-center font-mono">QUICK ACCESS PROTOCOLS:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin("student")}
                      className="glass border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 rounded-xl font-mono hover-glow"
                    >
                      STUDENT
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin("company")}
                      className="glass border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 rounded-xl font-mono hover-glow"
                    >
                      COMPANY
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin("pm")}
                      className="glass border-purple-500/30 hover:border-purple-400/50 text-purple-400 hover:text-purple-300 rounded-xl font-mono hover-glow"
                    >
                      PROJECT MGR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin("admin")}
                      className="glass border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 rounded-xl font-mono hover-glow"
                    >
                      ADMIN
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-gray-500 font-mono">
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                PROTOTYPE ENVIRONMENT ACTIVE
              </p>
              <p>{""}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
