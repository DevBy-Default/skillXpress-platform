"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MockAuth } from "@/lib/auth"
import { MockDataStore } from "@/lib/mock-data"
import { MatchingEngine } from "@/lib/matching"
import type { User, Project, Application, Assignment, Match, Certification } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Briefcase, Award, LogOut, Star, Zap, Target, TrendingUp } from "lucide-react"

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = MockAuth.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      router.push("/")
      return
    }

    setUser(currentUser)
    const store = MockDataStore.getInstance()

    // Load student data
    const studentMatches = MatchingEngine.generateMatches(currentUser.id)
    const studentApplications = store.getApplicationsByStudent(currentUser.id)
    const studentAssignments = store.getAssignmentsByStudent(currentUser.id)
    const studentCertifications = store.getCertificationsByStudent(currentUser.id)

    // Get project details for matches
    const matchedProjects = studentMatches
      .map((match) => store.getProjectById(match.projectId))
      .filter(Boolean) as Project[]

    setMatches(studentMatches)
    setApplications(studentApplications)
    setAssignments(studentAssignments)
    setCertifications(studentCertifications)
    setProjects(matchedProjects)
  }, [router])

  const handleLogout = () => {
    MockAuth.logout()
    router.push("/")
  }

  const handleApply = (projectId: string) => {
    const store = MockDataStore.getInstance()
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      studentId: user!.id,
      projectId,
      status: "pending",
      coverLetter: "I am interested in this project and believe my skills are a great match.",
      appliedAt: new Date(),
    }

    store.applications.push(newApplication)
    setApplications([...store.applications.filter((app) => app.studentId === user!.id)])
  }

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 neon-glow">
          <div className="animate-pulse text-center">
            <div className="w-8 h-8 bg-blue-500/50 rounded-full mx-auto mb-4"></div>
            <p className="font-mono text-gray-300">INITIALIZING STUDENT PORTAL...</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-cyan-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="glass border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold font-mono gradient-text">STUDENT PORTAL</h1>
              <p className="text-gray-400 font-mono">
                Welcome back, <span className="text-blue-400">{user.name}</span>
              </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">ACTIVE PROJECTS</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Briefcase className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">
                {assignments.filter((a) => a.status === "active").length}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-mono">ACTIVE</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">APPLICATIONS</CardTitle>
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <BookOpen className="h-4 w-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{applications.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <Target className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400 font-mono">SUBMITTED</span>
              </div>
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
              <div className="text-3xl font-bold font-mono gradient-text">{certifications.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <Zap className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-mono">EARNED</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="glass rounded-2xl border-white/10 p-1">
            <TabsTrigger
              value="matches"
              className="font-mono data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-xl"
            >
              AI MATCHES
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="font-mono data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl"
            >
              APPLICATIONS
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="font-mono data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-xl"
            >
              PROJECTS
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 rounded-xl"
            >
              PORTFOLIO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <div className="grid gap-6">
              {matches.map((match) => {
                const project = projects.find((p) => p.id === match.projectId)
                const hasApplied = applications.some((app) => app.projectId === match.projectId)

                if (!project) return null

                return (
                  <Card key={match.projectId} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-3 font-mono text-xl">
                            {project.title}
                            <Badge className="neon-border bg-blue-500/20 text-blue-400 font-mono flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {match.score}% MATCH
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-gray-400 font-mono">{project.companyName}</CardDescription>
                        </div>
                        <Badge
                          className={`font-mono ${
                            project.difficulty === "beginner"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : project.difficulty === "intermediate"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {project.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.map((skill) => (
                          <Badge key={skill} className="glass border-cyan-500/30 text-cyan-400 font-mono">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium font-mono text-blue-400">AI ANALYSIS:</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {match.reasons.map((reason, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-cyan-400 mt-1">▸</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400 font-mono">
                          DURATION: {project.duration} | SLOTS: {project.currentStudents}/{project.maxStudents}
                        </div>
                        <Button
                          onClick={() => handleApply(project.id)}
                          disabled={hasApplied}
                          className={`font-mono rounded-xl ${
                            hasApplied
                              ? "glass border-gray-500/30 text-gray-500"
                              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover-glow"
                          }`}
                        >
                          {hasApplied ? "APPLIED" : "APPLY NOW"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-4">
              {applications.map((application) => {
                const project = MockDataStore.getInstance().getProjectById(application.projectId)
                if (!project) return null

                return (
                  <Card key={application.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-mono text-lg">{project.title}</CardTitle>
                          <CardDescription className="text-gray-400 font-mono">{project.companyName}</CardDescription>
                        </div>
                        <Badge
                          className={`font-mono ${
                            application.status === "accepted"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : application.status === "rejected"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }`}
                        >
                          {application.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 font-mono">
                        SUBMITTED: {application.appliedAt.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="grid gap-6">
              {assignments.map((assignment) => {
                const project = MockDataStore.getInstance().getProjectById(assignment.projectId)
                if (!project) return null

                const completedMilestones = assignment.milestones.filter((m) => m.status === "approved").length
                const totalMilestones = assignment.milestones.length
                const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

                return (
                  <Card key={assignment.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                    <CardHeader>
                      <CardTitle className="font-mono text-lg">{project.title}</CardTitle>
                      <CardDescription className="text-gray-400 font-mono">{project.companyName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2 font-mono">
                            <span className="text-gray-300">PROGRESS</span>
                            <span className="text-blue-400">
                              {completedMilestones}/{totalMilestones} MILESTONES
                            </span>
                          </div>
                          <Progress value={progress} className="h-2 bg-gray-800" />
                        </div>

                        <div className="space-y-2">
                          {assignment.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className="flex justify-between items-center p-4 glass rounded-xl border-white/5"
                            >
                              <div>
                                <p className="font-medium font-mono text-gray-200">{milestone.title}</p>
                                <p className="text-sm text-gray-400 font-mono">
                                  DUE: {milestone.dueDate.toLocaleDateString()}
                                </p>
                              </div>
                              <Badge
                                className={`font-mono ${
                                  milestone.status === "approved"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : milestone.status === "submitted"
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                      : milestone.status === "needs_revision"
                                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                }`}
                              >
                                {milestone.status.toUpperCase().replace("_", " ")}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="glass rounded-2xl border-white/10 neon-glow">
              <CardHeader>
                <CardTitle className="font-mono text-xl gradient-text">PROFILE DATA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium font-mono text-cyan-400 mb-3">SKILL MATRIX</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.map((skill) => (
                        <Badge key={skill} className="glass border-cyan-500/30 text-cyan-400 font-mono">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium font-mono text-blue-400 mb-3">BIO</h3>
                    <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                  </div>

                  {user.portfolio && (
                    <div>
                      <h3 className="font-medium font-mono text-purple-400 mb-3">PORTFOLIO LINK</h3>
                      <a
                        href={user.portfolio}
                        className="text-purple-400 hover:text-purple-300 font-mono hover:underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {certifications.length > 0 && (
              <Card className="glass rounded-2xl border-white/10 neon-glow">
                <CardHeader>
                  <CardTitle className="font-mono text-xl gradient-text">CERTIFICATIONS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center gap-4 p-4 glass rounded-xl border-white/5 hover-glow"
                      >
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <Award className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium font-mono text-gray-200">{cert.title}</h4>
                          <p className="text-sm text-gray-400">{cert.description}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            ISSUED: {cert.issuedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
