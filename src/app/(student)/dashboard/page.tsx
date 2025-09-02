import { withRole } from "@/lib/rbac"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Target, Award, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function StudentDashboard() {
  const session = await withRole(["STUDENT"])

  // Get student data
  const [profile, applications, assignments, certifications] = await Promise.all([
    db.studentProfile.findUnique({
      where: { userId: session.user.id },
    }),
    db.application.findMany({
      where: { studentId: session.user.id },
      include: { project: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.assignment.findMany({
      where: { studentId: session.user.id },
      include: {
        project: { include: { company: true } },
        milestones: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.certification.findMany({
      where: { studentId: session.user.id },
      include: { project: { include: { company: true } } },
      orderBy: { issuedAt: "desc" },
      take: 3,
    }),
  ])

  const stats = {
    applications: applications.length,
    activeAssignments: assignments.length,
    certifications: certifications.length,
    profileComplete: profile ? 85 : 20,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
          <p className="text-gray-600 mt-2">Track your progress and discover new opportunities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applications}</div>
              <p className="text-xs text-muted-foreground">Total submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAssignments}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.certifications}</div>
              <p className="text-xs text-muted-foreground">Earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profileComplete}%</div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest project applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{app.project.title}</h4>
                        <p className="text-sm text-gray-600">{app.project.company.name}</p>
                        <p className="text-xs text-gray-500">Applied {formatDate(app.createdAt)}</p>
                      </div>
                      <Badge variant={app.status === "ASSIGNED" ? "default" : "secondary"}>{app.status}</Badge>
                    </div>
                  ))}
                  <Link href="/student/applications">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Applications
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No applications yet</p>
                  <Link href="/student/matches">
                    <Button>Find Projects</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Active Assignments</CardTitle>
              <CardDescription>Projects you're currently working on</CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{assignment.project.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.project.company.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{assignment.milestones.length} milestones</span>
                        <span className="text-xs text-gray-500">Due {formatDate(assignment.dueAt)}</span>
                      </div>
                      <Link href={`/student/assignments/${assignment.id}`}>
                        <Button size="sm" className="mt-2">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No active assignments</p>
                  <Link href="/student/matches">
                    <Button>Find Projects</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/student/matches">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">Find Matches</h3>
                <p className="text-sm text-gray-600">Discover projects that match your skills</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/student/portfolio">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium">Portfolio</h3>
                <p className="text-sm text-gray-600">View your certifications and achievements</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/student/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">Profile</h3>
                <p className="text-sm text-gray-600">Update your skills and preferences</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
