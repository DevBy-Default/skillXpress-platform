"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MockAuth } from "@/lib/auth"
import { MockDataStore } from "@/lib/mock-data"
import { CertificationGenerator } from "@/lib/certification"
import type { User, Assignment, Milestone } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Clock, AlertCircle, LogOut, Award, Zap, Target, TrendingUp } from "lucide-react"

export default function PMDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [feedback, setFeedback] = useState("")
  const router = useRouter()

  useEffect(() => {
    const currentUser = MockAuth.getCurrentUser()
    if (!currentUser || currentUser.role !== "pm") {
      router.push("/")
      return
    }

    setUser(currentUser)
    const store = MockDataStore.getInstance()
    const pmAssignments = store.getAssignmentsByPM(currentUser.id)
    setAssignments(pmAssignments)
  }, [router])

  const handleLogout = () => {
    MockAuth.logout()
    router.push("/")
  }

  const handleMilestoneReview = (milestoneId: string, action: "approve" | "request_revision") => {
    const store = MockDataStore.getInstance()

    // Find and update milestone
    for (const assignment of store.assignments) {
      const milestone = assignment.milestones.find((m) => m.id === milestoneId)
      if (milestone && milestone.submission) {
        milestone.status = action === "approve" ? "approved" : "needs_revision"
        milestone.submission.feedback = feedback

        // Check if assignment is complete
        const allMilestonesApproved = assignment.milestones.every((m) => m.status === "approved")
        if (allMilestonesApproved && assignment.status === "active") {
          assignment.status = "completed"
          assignment.endDate = new Date()

          // Generate certification
          const project = store.getProjectById(assignment.projectId)
          if (project) {
            const certification = CertificationGenerator.generateCertificate(
              assignment.studentId,
              assignment.projectId,
              assignment.id,
              project.title,
              project.skills,
            )
            store.certifications.push(certification)
          }
        }

        break
      }
    }

    setAssignments([...store.getAssignmentsByPM(user!.id)])
    setSelectedMilestone(null)
    setFeedback("")
  }

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 neon-glow">
          <div className="animate-pulse text-center">
            <div className="w-8 h-8 bg-purple-500/50 rounded-full mx-auto mb-4"></div>
            <p className="font-mono text-gray-300">INITIALIZING PM CONSOLE...</p>
          </div>
        </div>
      </div>
    )

  const activeAssignments = assignments.filter((a) => a.status === "active")
  const completedAssignments = assignments.filter((a) => a.status === "completed")
  const pendingReviews = assignments.flatMap((a) => a.milestones.filter((m) => m.status === "submitted")).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="glass border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold font-mono gradient-text">PROJECT MANAGER CONSOLE</h1>
              <p className="text-gray-400 font-mono">
                Welcome back, <span className="text-purple-400">{user.name}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">ACTIVE PROJECTS</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{activeAssignments.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-mono">IN PROGRESS</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">COMPLETED</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{completedAssignments.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-mono">FINISHED</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">PENDING REVIEWS</CardTitle>
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{pendingReviews}</div>
              <div className="flex items-center gap-1 mt-2">
                <Target className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-mono">AWAITING</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">CERTIFICATIONS ISSUED</CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Award className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{completedAssignments.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <Zap className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-mono">DEPLOYED</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="glass rounded-2xl border-white/10 p-1">
            <TabsTrigger
              value="active"
              className="font-mono data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-xl"
            >
              ACTIVE PROJECTS
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="font-mono data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 rounded-xl"
            >
              PENDING REVIEWS
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 rounded-xl"
            >
              COMPLETED
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid gap-6">
              {activeAssignments.map((assignment) => {
                const project = MockDataStore.getInstance().getProjectById(assignment.projectId)
                const student = MockDataStore.getInstance().getUserById(assignment.studentId)

                if (!project || !student) return null

                const completedMilestones = assignment.milestones.filter((m) => m.status === "approved").length
                const totalMilestones = assignment.milestones.length
                const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

                return (
                  <Card key={assignment.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-mono text-xl text-gray-200">{project.title}</CardTitle>
                          <CardDescription className="text-gray-400 font-mono">STUDENT: {student.name}</CardDescription>
                        </div>
                        <Badge className="glass border-blue-500/30 text-blue-400 font-mono">
                          {completedMilestones}/{totalMilestones} MILESTONES
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2 font-mono">
                            <span className="text-gray-300">OVERALL PROGRESS</span>
                            <span className="text-blue-400">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2 bg-gray-800" />
                        </div>

                        <div className="space-y-2">
                          {assignment.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className="flex justify-between items-center p-4 glass rounded-xl border-white/5"
                            >
                              <div className="flex-1">
                                <p className="font-medium font-mono text-gray-200">{milestone.title}</p>
                                <p className="text-sm text-gray-400 font-mono">
                                  DUE: {milestone.dueDate.toLocaleDateString()}
                                </p>
                                {milestone.submission && (
                                  <p className="text-sm text-gray-500 mt-1 font-mono">
                                    SUBMITTED: {milestone.submission.submittedAt.toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
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
                                {milestone.status === "submitted" && (
                                  <Button
                                    size="sm"
                                    onClick={() => setSelectedMilestone(milestone)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 rounded-xl font-mono font-semibold hover-glow"
                                  >
                                    REVIEW
                                  </Button>
                                )}
                              </div>
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

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid gap-4">
              {assignments
                .flatMap((assignment) =>
                  assignment.milestones
                    .filter((milestone) => milestone.status === "submitted")
                    .map((milestone) => {
                      const project = MockDataStore.getInstance().getProjectById(assignment.projectId)
                      const student = MockDataStore.getInstance().getUserById(assignment.studentId)

                      if (!project || !student) return null

                      return (
                        <Card key={milestone.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-mono text-gray-200">{milestone.title}</CardTitle>
                                <CardDescription className="text-gray-400 font-mono">
                                  {project.title} - {student.name}
                                </CardDescription>
                              </div>
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-mono">
                                NEEDS REVIEW
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2 font-mono text-cyan-400">DESCRIPTION</h4>
                                <p className="text-gray-300">{milestone.description}</p>
                              </div>

                              {milestone.submission && (
                                <div>
                                  <h4 className="font-medium mb-2 font-mono text-blue-400">STUDENT SUBMISSION</h4>
                                  <p className="text-gray-300 glass p-3 rounded-xl border-white/5">
                                    {milestone.submission.content}
                                  </p>
                                  <p className="text-sm text-gray-400 mt-2 font-mono">
                                    SUBMITTED: {milestone.submission.submittedAt.toLocaleDateString()}
                                  </p>
                                </div>
                              )}

                              <Button
                                onClick={() => setSelectedMilestone(milestone)}
                                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 rounded-xl font-mono font-semibold hover-glow"
                              >
                                REVIEW SUBMISSION
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    }),
                )
                .filter(Boolean)}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid gap-6">
              {completedAssignments.map((assignment) => {
                const project = MockDataStore.getInstance().getProjectById(assignment.projectId)
                const student = MockDataStore.getInstance().getUserById(assignment.studentId)

                if (!project || !student) return null

                return (
                  <Card key={assignment.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-mono text-xl text-gray-200">{project.title}</CardTitle>
                          <CardDescription className="text-gray-400 font-mono">STUDENT: {student.name}</CardDescription>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                          COMPLETED
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-400 font-mono">
                            COMPLETED: {assignment.endDate?.toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-400 font-mono">
                            DURATION: {assignment.startDate.toLocaleDateString()} -{" "}
                            {assignment.endDate?.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="glass border-purple-500/30 text-purple-400 font-mono flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          CERTIFICATE ISSUED
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={!!selectedMilestone} onOpenChange={() => setSelectedMilestone(null)}>
          <DialogContent className="glass border-white/20 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono text-xl gradient-text">REVIEW MILESTONE</DialogTitle>
              <DialogDescription className="text-gray-400 font-mono">{selectedMilestone?.title}</DialogDescription>
            </DialogHeader>

            {selectedMilestone?.submission && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 font-mono text-blue-400">STUDENT SUBMISSION</h4>
                  <p className="text-gray-300 glass p-3 rounded-xl border-white/5">
                    {selectedMilestone.submission.content}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 font-mono text-cyan-400">FEEDBACK</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback for the student..."
                    rows={3}
                    className="glass border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/25 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleMilestoneReview(selectedMilestone.id, "request_revision")}
                    className="glass border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 font-mono rounded-xl hover-glow"
                  >
                    REQUEST REVISION
                  </Button>
                  <Button
                    onClick={() => handleMilestoneReview(selectedMilestone.id, "approve")}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 rounded-xl font-mono font-semibold hover-glow"
                  >
                    APPROVE
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
