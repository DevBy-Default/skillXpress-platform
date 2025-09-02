import type { User, Project, Application, Assignment, Certification } from "@/types"

// Mock users
export const mockUsers: User[] = [
  {
    id: "student-1",
    email: "student@demo.com",
    name: "Alex Chen",
    role: "student",
    skills: ["React", "TypeScript", "Node.js", "Python"],
    bio: "Computer Science student passionate about full-stack development",
    portfolio: "https://alexchen.dev",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "student-2",
    email: "sarah@demo.com",
    name: "Sarah Johnson",
    role: "student",
    skills: ["UI/UX Design", "Figma", "React", "CSS"],
    bio: "Design student with a focus on user experience and frontend development",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "company-1",
    email: "company@demo.com",
    name: "Tech Innovations Inc",
    role: "company",
    companyName: "Tech Innovations Inc",
    industry: "Software Development",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "pm-1",
    email: "pm@demo.com",
    name: "Michael Rodriguez",
    role: "pm",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "admin-1",
    email: "admin@demo.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]

// Mock projects
export const mockProjects: Project[] = [
  {
    id: "project-1",
    title: "E-commerce Dashboard Development",
    description:
      "Build a responsive admin dashboard for an e-commerce platform using React and TypeScript. Features include order management, inventory tracking, and analytics visualization.",
    companyId: "company-1",
    companyName: "Tech Innovations Inc",
    skills: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    duration: "4 weeks",
    difficulty: "intermediate",
    status: "open",
    maxStudents: 2,
    currentStudents: 0,
    createdAt: new Date("2024-03-01"),
    deadline: new Date("2024-04-01"),
  },
  {
    id: "project-2",
    title: "Mobile App UI/UX Design",
    description:
      "Design a complete user interface for a fitness tracking mobile application. Create wireframes, prototypes, and design system components.",
    companyId: "company-1",
    companyName: "Tech Innovations Inc",
    skills: ["UI/UX Design", "Figma", "Prototyping", "Design Systems"],
    duration: "3 weeks",
    difficulty: "beginner",
    status: "in_progress",
    maxStudents: 1,
    currentStudents: 1,
    createdAt: new Date("2024-02-15"),
    deadline: new Date("2024-03-15"),
  },
  {
    id: "project-3",
    title: "API Development & Documentation",
    description:
      "Develop RESTful APIs for a social media platform and create comprehensive documentation. Includes user authentication, post management, and real-time features.",
    companyId: "company-1",
    companyName: "Tech Innovations Inc",
    skills: ["Node.js", "Express", "MongoDB", "API Documentation"],
    duration: "5 weeks",
    difficulty: "advanced",
    status: "open",
    maxStudents: 1,
    currentStudents: 0,
    createdAt: new Date("2024-03-05"),
    deadline: new Date("2024-04-10"),
  },
]

// Mock applications
export const mockApplications: Application[] = [
  {
    id: "app-1",
    studentId: "student-1",
    projectId: "project-1",
    status: "pending",
    coverLetter:
      "I am excited to work on this e-commerce dashboard project. My experience with React and TypeScript makes me a great fit for this role.",
    appliedAt: new Date("2024-03-02"),
  },
  {
    id: "app-2",
    studentId: "student-2",
    projectId: "project-2",
    status: "accepted",
    coverLetter:
      "As a design student with strong Figma skills, I would love to contribute to this mobile app UI/UX project.",
    appliedAt: new Date("2024-02-16"),
    reviewedAt: new Date("2024-02-17"),
  },
]

// Mock assignments
export const mockAssignments: Assignment[] = [
  {
    id: "assignment-1",
    studentId: "student-2",
    projectId: "project-2",
    pmId: "pm-1",
    status: "active",
    startDate: new Date("2024-02-18"),
    milestones: [
      {
        id: "milestone-1",
        assignmentId: "assignment-1",
        title: "User Research & Wireframes",
        description: "Conduct user research and create initial wireframes for the fitness app",
        dueDate: new Date("2024-02-25"),
        status: "approved",
        submission: {
          content: "Completed user research with 15 participants and created wireframes for 8 key screens.",
          submittedAt: new Date("2024-02-24"),
          feedback: "Excellent work on the user research. Wireframes are clean and well-thought-out.",
        },
      },
      {
        id: "milestone-2",
        assignmentId: "assignment-1",
        title: "High-Fidelity Prototypes",
        description: "Create high-fidelity prototypes and interactive mockups",
        dueDate: new Date("2024-03-04"),
        status: "submitted",
        submission: {
          content: "Created interactive prototypes for all main user flows using Figma.",
          submittedAt: new Date("2024-03-03"),
        },
      },
      {
        id: "milestone-3",
        assignmentId: "assignment-1",
        title: "Design System Documentation",
        description: "Document the complete design system including components and guidelines",
        dueDate: new Date("2024-03-11"),
        status: "pending",
      },
    ],
  },
]

// Mock certifications
export const mockCertifications: Certification[] = []

// In-memory data store
export class MockDataStore {
  private static instance: MockDataStore

  users: User[] = [...mockUsers]
  projects: Project[] = [...mockProjects]
  applications: Application[] = [...mockApplications]
  assignments: Assignment[] = [...mockAssignments]
  certifications: Certification[] = [...mockCertifications]

  static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore()
    }
    return MockDataStore.instance
  }

  // User methods
  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id)
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email)
  }

  // Project methods
  getProjectById(id: string): Project | undefined {
    return this.projects.find((project) => project.id === id)
  }

  getProjectsByCompany(companyId: string): Project[] {
    return this.projects.filter((project) => project.companyId === companyId)
  }

  getOpenProjects(): Project[] {
    return this.projects.filter((project) => project.status === "open")
  }

  // Application methods
  getApplicationsByStudent(studentId: string): Application[] {
    return this.applications.filter((app) => app.studentId === studentId)
  }

  getApplicationsByProject(projectId: string): Application[] {
    return this.applications.filter((app) => app.projectId === projectId)
  }

  // Assignment methods
  getAssignmentsByStudent(studentId: string): Assignment[] {
    return this.assignments.filter((assignment) => assignment.studentId === studentId)
  }

  getAssignmentsByPM(pmId: string): Assignment[] {
    return this.assignments.filter((assignment) => assignment.pmId === pmId)
  }

  // Certification methods
  getCertificationsByStudent(studentId: string): Certification[] {
    return this.certifications.filter((cert) => cert.studentId === studentId)
  }

  // Analytics methods
  getAnalytics() {
    return {
      totalUsers: this.users.length,
      totalStudents: this.users.filter((u) => u.role === "student").length,
      totalCompanies: this.users.filter((u) => u.role === "company").length,
      totalProjects: this.projects.length,
      activeProjects: this.projects.filter((p) => p.status === "in_progress").length,
      totalApplications: this.applications.length,
      totalCertifications: this.certifications.length,
      completionRate:
        this.assignments.length > 0
          ? (this.assignments.filter((a) => a.status === "completed").length / this.assignments.length) * 100
          : 0,
    }
  }
}
