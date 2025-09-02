export type UserRole = "student" | "company" | "pm" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  // Student specific
  skills?: string[]
  bio?: string
  portfolio?: string
  // Company specific
  companyName?: string
  industry?: string
}

export interface Project {
  id: string
  title: string
  description: string
  companyId: string
  companyName: string
  skills: string[]
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  status: "open" | "in_progress" | "completed" | "cancelled"
  maxStudents: number
  currentStudents: number
  createdAt: Date
  deadline?: Date
}

export interface Application {
  id: string
  studentId: string
  projectId: string
  status: "pending" | "accepted" | "rejected"
  coverLetter: string
  appliedAt: Date
  reviewedAt?: Date
}

export interface Assignment {
  id: string
  studentId: string
  projectId: string
  pmId: string
  status: "active" | "completed" | "cancelled"
  startDate: Date
  endDate?: Date
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  assignmentId: string
  title: string
  description: string
  dueDate: Date
  status: "pending" | "submitted" | "approved" | "needs_revision"
  submission?: {
    content: string
    submittedAt: Date
    feedback?: string
  }
}

export interface Certification {
  id: string
  studentId: string
  projectId: string
  assignmentId: string
  title: string
  description: string
  skills: string[]
  issuedAt: Date
  verificationHash: string
  badgeUrl: string
}

export interface Match {
  studentId: string
  projectId: string
  score: number
  reasons: string[]
}
