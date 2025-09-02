"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MockAuth } from "@/lib/auth"
import { MockDataStore } from "@/lib/mock-data"
import type { User, Project, Application } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Briefcase, Users, LogOut, Building2, Clock, Target } from "lucide-react"

export default function CompanyDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = MockAuth.getCurrentUser()
    if (!currentUser || currentUser.role !== "company") {
      router.push("/")
      return
    }

    setUser(currentUser)
    const store = MockDataStore.getInstance()

    const companyProjects = store.getProjectsByCompany(currentUser.id)
    const allApplications = companyProjects.flatMap((project) => store.getApplicationsByProject(project.id))

    setProjects(companyProjects)
    setApplications(allApplications)
  }, [router])

  const handleLogout = () => {
    MockAuth.logout()
    router.push("/")
  }

  const handleCreateProject = (formData: FormData) => {
    const store = MockDataStore.getInstance()
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      companyId: user!.id,
      companyName: user!.companyName || user!.name,
      skills: (formData.get("skills") as string).split(",").map((s) => s.trim()),
      duration: formData.get("duration") as string,
      difficulty: formData.get("difficulty") as "beginner" | "intermediate" | "advanced",
      status: "open",
      maxStudents: Number.parseInt(formData.get("maxStudents") as string),
      currentStudents: 0,
      createdAt: new Date(),
      deadline: new Date(formData.get("deadline") as string),
    }

    store.projects.push(newProject)
    setProjects([...store.getProjectsByCompany(user!.id)])
    setIsCreateDialogOpen(false)
  }

  const handleApplicationAction = (applicationId: string, action: "accept" | "reject") => {
    const store = MockDataStore.getInstance()
    const application = store.applications.find((app) => app.id === applicationId)

    if (application) {
      application.status = action === "accept" ? "accepted" : "rejected"
      application.reviewedAt = new Date()

      // Update current students count if accepted
      if (action === "accept") {
        const project = store.getProjectById(application.projectId)
        if (project && project.currentStudents < project.maxStudents) {
          project.currentStudents++
        }
      }

      setApplications([...store.applications.filter((app) => projects.some((project) => project.id === app.projectId))])
    }
  }

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 neon-glow">
          <div className="animate-pulse text-center">
            <div className="w-8 h-8 bg-cyan-500/50 rounded-full mx-auto mb-4"></div>
            <p className="font-mono text-gray-300">INITIALIZING COMPANY PORTAL...</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="glass border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold font-mono gradient-text">COMPANY CONTROL</h1>
              <p className="text-gray-400 font-mono">
                Welcome back, <span className="text-cyan-400">{user.companyName || user.name}</span>
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
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Briefcase className="h-4 w-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">
                {projects.filter((p) => p.status === "open" || p.status === "in_progress").length}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Target className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400 font-mono">LIVE</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">TOTAL APPLICATIONS</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">{applications.length}</div>
              <div className="flex items-center gap-1 mt-2">
                <Building2 className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-mono">RECEIVED</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl border-white/10 neon-glow hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono text-gray-300">PENDING REVIEWS</CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono gradient-text">
                {applications.filter((app) => app.status === "pending").length}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-mono">AWAITING</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold font-mono gradient-text">PROJECT MANAGEMENT</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 rounded-xl font-mono font-semibold hover-glow">
                <Plus className="w-4 h-4 mr-2" />
                CREATE PROJECT
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/20 rounded-2xl max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-mono text-xl gradient-text">CREATE NEW PROJECT</DialogTitle>
                <DialogDescription className="text-gray-400 font-mono">
                  Deploy a new micro-internship opportunity for students
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300 font-mono">
                      Project Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      className="glass border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/25 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-gray-300 font-mono">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      placeholder="e.g., 4 weeks"
                      className="glass border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/25 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300 font-mono">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="glass border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/25 rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-gray-300 font-mono">
                      Required Skills (comma-separated)
                    </Label>
                    <Input
                      id="skills"
                      name="skills"
                      placeholder="React, TypeScript, Node.js"
                      className="glass border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/25 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-gray-300 font-mono">
                      Difficulty Level
                    </Label>
                    <Select name="difficulty" required>
                      <SelectTrigger className="glass border-white/20 focus:border-cyan-400/50 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/20 rounded-xl">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxStudents" className="text-gray-300 font-mono">
                      Max Students
                    </Label>
                    <Input
                      id="maxStudents"
                      name="maxStudents"
                      type="number"
                      min="1"
                      max="10"
                      className="glass border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/25 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-gray-300 font-mono">
                      Application Deadline
                    </Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      className="glass border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/25 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="glass border-gray-500/30 hover:border-gray-400/50 text-gray-400 hover:text-gray-300 font-mono rounded-xl"
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 rounded-xl font-mono font-semibold hover-glow"
                  >
                    DEPLOY PROJECT
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="glass rounded-2xl border-white/10 p-1">
            <TabsTrigger
              value="projects"
              className="font-mono data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl"
            >
              MY PROJECTS
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="font-mono data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-xl"
            >
              APPLICATIONS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-mono text-xl text-gray-200">{project.title}</CardTitle>
                        <CardDescription className="text-gray-400 font-mono">
                          CREATED: {project.createdAt.toLocaleDateString()}
                        </CardDescription>
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
                          {project.currentStudents}/{project.maxStudents} SLOTS
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill) => (
                        <Badge key={skill} className="glass border-purple-500/30 text-purple-400 font-mono">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span>DURATION: {project.duration}</span>
                      <span>LEVEL: {project.difficulty.toUpperCase()}</span>
                      <span>DEADLINE: {project.deadline?.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-4">
              {applications.map((application) => {
                const project = projects.find((p) => p.id === application.projectId)
                const student = MockDataStore.getInstance().getUserById(application.studentId)

                if (!project || !student) return null

                return (
                  <Card key={application.id} className="glass rounded-2xl border-white/10 neon-glow hover-glow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-mono text-gray-200">{student.name}</CardTitle>
                          <CardDescription className="text-gray-400 font-mono">
                            APPLIED TO: {project.title}
                          </CardDescription>
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
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 font-mono text-blue-400">COVER LETTER</h4>
                          <p className="text-gray-300">{application.coverLetter}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 font-mono text-cyan-400">STUDENT SKILLS</h4>
                          <div className="flex flex-wrap gap-2">
                            {student.skills?.map((skill) => (
                              <Badge key={skill} className="glass border-cyan-500/30 text-cyan-400 font-mono">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400 font-mono">
                            SUBMITTED: {application.appliedAt.toLocaleDateString()}
                          </span>

                          {application.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApplicationAction(application.id, "reject")}
                                className="glass border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 font-mono rounded-xl hover-glow"
                              >
                                REJECT
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApplicationAction(application.id, "accept")}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 rounded-xl font-mono font-semibold hover-glow"
                              >
                                ACCEPT
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
