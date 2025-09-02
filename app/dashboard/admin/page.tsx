"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MockAuth } from "@/lib/auth"
import { MockDataStore } from "@/lib/mock-data"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Briefcase, Award, TrendingUp, LogOut, Shield, Database, Activity } from "lucide-react"

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = MockAuth.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/")
      return
    }

    setUser(currentUser)
    const store = MockDataStore.getInstance()
    const analyticsData = store.getAnalytics()
    setAnalytics(analyticsData)
  }, [router])

  const handleLogout = () => {
    MockAuth.logout()
    router.push("/")
  }

  if (!user || !analytics)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 neon-glow">
          <div className="animate-pulse text-center">
            <div className="w-8 h-8 bg-red-500/50 rounded-full mx-auto mb-4"></div>
            <p className="font-mono text-gray-300">INITIALIZING ADMIN CONTROL CENTER...</p>
          </div>
        </div>
      </div>
    )

  const userDistributionData = [
    { name: "Students", value: analytics.totalStudents, color: "#3B82F6" },
    { name: "Companies", value: analytics.totalCompanies, color: "#10B981" },
    {
      name: "PMs",
      value: analytics.totalUsers - analytics.totalStudents - analytics.totalCompanies - 1,
      color: "#F59E0B",
    },
  ]

  const projectStatusData = [
    { name: "Active", count: analytics.activeProjects },
    { name: "Total", count: analytics.totalProjects },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-yellow-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="glass border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold font-mono gradient-text">ADMIN CONTROL CENTER</h1>
              <p className="text-gray-400 font-mono">Platform Analytics & Management</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="glass border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 font-mono hover-glow bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">TOTAL USERS</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{analytics.totalUsers}</div>
              <p className="text-xs text-gray-400 font-mono">
                {analytics.totalStudents} STUDENTS, {analytics.totalCompanies} COMPANIES
              </p>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">TOTAL PROJECTS</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/20">
                <Briefcase className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{analytics.totalProjects}</div>
              <p className="text-xs text-gray-400 font-mono">{analytics.activeProjects} CURRENTLY ACTIVE</p>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">APPLICATIONS</CardTitle>
              <div className="p-2 rounded-lg bg-orange-500/20">
                <TrendingUp className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{analytics.totalApplications}</div>
              <p className="text-xs text-gray-400 font-mono">STUDENT APPLICATIONS SUBMITTED</p>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">CERTIFICATIONS</CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Award className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{analytics.totalCertifications}</div>
              <p className="text-xs text-gray-400 font-mono">{Math.round(analytics.completionRate)}% COMPLETION RATE</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass rounded-2xl border-white/10 p-1">
            <TabsTrigger
              value="overview"
              className="font-mono data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 rounded-xl"
            >
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="font-mono data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-xl"
            >
              USERS
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 rounded-xl"
            >
              PROJECTS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                <CardHeader>
                  <CardTitle className="font-mono text-xl gradient-text">USER DISTRIBUTION</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Breakdown of platform users by role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {userDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.8)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          color: "#f3f4f6",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                <CardHeader>
                  <CardTitle className="font-mono text-xl gradient-text">PROJECT ACTIVITY</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">Active vs total projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.8)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          color: "#f3f4f6",
                        }}
                      />
                      <Bar dataKey="count" fill="url(#barGradient)" />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
              <CardHeader>
                <CardTitle className="font-mono text-xl gradient-text">PLATFORM HEALTH</CardTitle>
                <CardDescription className="text-gray-400 font-mono">Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 glass rounded-2xl border-blue-500/20 neon-glow">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="w-6 h-6 text-blue-400 mr-2" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-blue-400">
                      {Math.round((analytics.activeProjects / analytics.totalProjects) * 100)}%
                    </div>
                    <div className="text-sm text-gray-400 font-mono">PROJECT ACTIVITY RATE</div>
                  </div>

                  <div className="text-center p-6 glass rounded-2xl border-green-500/20 neon-glow">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="w-6 h-6 text-green-400 mr-2" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-green-400">
                      {Math.round(analytics.completionRate)}%
                    </div>
                    <div className="text-sm text-gray-400 font-mono">COMPLETION RATE</div>
                  </div>

                  <div className="text-center p-6 glass rounded-2xl border-purple-500/20 neon-glow">
                    <div className="flex items-center justify-center mb-2">
                      <Database className="w-6 h-6 text-purple-400 mr-2" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-purple-400">
                      {analytics.totalApplications > 0
                        ? Math.round((analytics.totalApplications / analytics.totalProjects) * 100) / 100
                        : 0}
                    </div>
                    <div className="text-sm text-gray-400 font-mono">AVG APPLICATIONS PER PROJECT</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-4">
              {MockDataStore.getInstance().users.map((user) => (
                <Card key={user.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-mono text-gray-200">{user.name}</CardTitle>
                        <CardDescription className="text-gray-400 font-mono">{user.email}</CardDescription>
                      </div>
                      <Badge
                        className={`font-mono ${
                          user.role === "admin"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : user.role === "company"
                              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                              : user.role === "pm"
                                ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {user.companyName && (
                        <p className="text-sm text-gray-300 font-mono">
                          <strong className="text-cyan-400">COMPANY:</strong> {user.companyName}
                        </p>
                      )}
                      {user.skills && (
                        <div>
                          <p className="text-sm font-medium mb-1 font-mono text-blue-400">SKILLS:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.skills.map((skill) => (
                              <Badge key={skill} className="glass border-blue-500/30 text-blue-400 font-mono text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 font-mono">JOINED: {user.createdAt.toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-4">
              {MockDataStore.getInstance().projects.map((project) => (
                <Card key={project.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-mono text-gray-200">{project.title}</CardTitle>
                        <CardDescription className="text-gray-400 font-mono">{project.companyName}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          className={`font-mono ${
                            project.status === "open"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : project.status === "in_progress"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}
                        >
                          {project.status.toUpperCase().replace("_", " ")}
                        </Badge>
                        <Badge className="glass border-cyan-500/30 text-cyan-400 font-mono">
                          {project.currentStudents}/{project.maxStudents}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map((skill) => (
                          <Badge key={skill} className="glass border-purple-500/30 text-purple-400 font-mono text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 font-mono">
                        <span>CREATED: {project.createdAt.toLocaleDateString()}</span>
                        <span>DURATION: {project.duration}</span>
                        <span>LEVEL: {project.difficulty.toUpperCase()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
