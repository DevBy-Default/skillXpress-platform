import {
  PrismaClient,
  Role,
  ProjectStatus,
  Difficulty,
  ApplicationStatus,
  MilestoneStatus,
  SubmissionStatus,
} from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create users
  const studentA = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "studentA@test.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: Role.STUDENT,
      verified: true,
    },
  })

  const studentB = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "studentB@test.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: Role.STUDENT,
      verified: true,
    },
  })

  const companyUser = await prisma.user.create({
    data: {
      name: "Sarah Wilson",
      email: "company@test.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: Role.COMPANY,
      verified: true,
    },
  })

  const pmUser = await prisma.user.create({
    data: {
      name: "Mike Chen",
      email: "pm@test.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: Role.PM,
      verified: true,
    },
  })

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@test.com",
      passwordHash: await bcrypt.hash("password123", 10),
      role: Role.ADMIN,
      verified: true,
    },
  })

  // Create student profiles
  await prisma.studentProfile.create({
    data: {
      userId: studentA.id,
      education: "Computer Science, University of Tech",
      skills: JSON.stringify(["JavaScript", "React", "Node.js", "Python"]),
      interests: JSON.stringify(["Web Development", "AI/ML", "Startups"]),
      aspirationTags: JSON.stringify(["Full Stack Developer", "Tech Lead"]),
      availability: "Part-time, 20 hours/week",
      resumeUrl: "https://example.com/alice-resume.pdf",
      portfolioUrls: JSON.stringify(["https://github.com/alice", "https://alice-portfolio.com"]),
    },
  })

  await prisma.studentProfile.create({
    data: {
      userId: studentB.id,
      education: "Design, Art Institute",
      skills: JSON.stringify(["UI/UX Design", "Figma", "Adobe Creative Suite", "HTML/CSS"]),
      interests: JSON.stringify(["Product Design", "User Research", "Mobile Apps"]),
      aspirationTags: JSON.stringify(["Product Designer", "UX Researcher"]),
      availability: "Full-time, 40 hours/week",
      resumeUrl: "https://example.com/bob-resume.pdf",
      portfolioUrls: JSON.stringify(["https://dribbble.com/bob", "https://bob-design.com"]),
    },
  })

  // Create company
  const company = await prisma.company.create({
    data: {
      userId: companyUser.id,
      name: "TechCorp Solutions",
      website: "https://techcorp.com",
      industryTags: JSON.stringify(["Software", "SaaS", "Enterprise"]),
      verified: true,
    },
  })

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      companyId: company.id,
      title: "React Dashboard Development",
      summary: "Build a modern analytics dashboard using React and TypeScript",
      requiredSkills: JSON.stringify(["React", "TypeScript", "JavaScript", "CSS"]),
      deliverables: JSON.stringify(["Responsive dashboard UI", "Data visualization components", "User authentication"]),
      difficulty: Difficulty.INTERMEDIATE,
      timeboxDays: 14,
      openings: 2,
      status: ProjectStatus.OPEN,
      budgetCredits: 500,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      companyId: company.id,
      title: "Mobile App UI Design",
      summary: "Design user interface for a new mobile application",
      requiredSkills: JSON.stringify(["UI/UX Design", "Figma", "Mobile Design", "Prototyping"]),
      deliverables: JSON.stringify(["Wireframes", "High-fidelity mockups", "Interactive prototype"]),
      difficulty: Difficulty.BEGINNER,
      timeboxDays: 10,
      openings: 1,
      status: ProjectStatus.OPEN,
      budgetCredits: 300,
    },
  })

  const project3 = await prisma.project.create({
    data: {
      companyId: company.id,
      title: "Python API Development",
      summary: "Develop REST API endpoints using Python and FastAPI",
      requiredSkills: JSON.stringify(["Python", "FastAPI", "REST APIs", "Database Design"]),
      deliverables: JSON.stringify(["API endpoints", "Documentation", "Unit tests"]),
      difficulty: Difficulty.ADVANCED,
      timeboxDays: 21,
      openings: 1,
      status: ProjectStatus.OPEN,
      budgetCredits: 800,
    },
  })

  const project4 = await prisma.project.create({
    data: {
      companyId: company.id,
      title: "Marketing Website Redesign",
      summary: "Redesign company marketing website with modern UI/UX",
      requiredSkills: JSON.stringify(["Web Design", "HTML/CSS", "JavaScript", "Responsive Design"]),
      deliverables: JSON.stringify(["New website design", "Responsive layouts", "Performance optimization"]),
      difficulty: Difficulty.INTERMEDIATE,
      timeboxDays: 18,
      openings: 1,
      status: ProjectStatus.IN_PROGRESS,
      budgetCredits: 600,
    },
  })

  // Create applications
  const app1 = await prisma.application.create({
    data: {
      projectId: project1.id,
      studentId: studentA.id,
      status: ApplicationStatus.ASSIGNED,
      matchScore: 0.85,
      rationale: "Strong match: React, TypeScript, JavaScript skills align perfectly with project requirements.",
    },
  })

  const app2 = await prisma.application.create({
    data: {
      projectId: project2.id,
      studentId: studentB.id,
      status: ApplicationStatus.APPLIED,
      matchScore: 0.92,
      rationale: "Excellent match: UI/UX Design, Figma, Mobile Design skills are exactly what this project needs.",
    },
  })

  // Create assignment
  const assignment = await prisma.assignment.create({
    data: {
      projectId: project1.id,
      studentId: studentA.id,
      pmId: pmUser.id,
      startAt: new Date(),
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  })

  // Create milestones
  const milestone1 = await prisma.milestone.create({
    data: {
      assignmentId: assignment.id,
      title: "Project Setup & Authentication",
      description: "Set up React project structure and implement user authentication",
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: MilestoneStatus.SUBMITTED,
    },
  })

  const milestone2 = await prisma.milestone.create({
    data: {
      assignmentId: assignment.id,
      title: "Dashboard Components",
      description: "Build main dashboard components and data visualization",
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: MilestoneStatus.PENDING,
    },
  })

  // Create submission
  await prisma.submission.create({
    data: {
      milestoneId: milestone1.id,
      note: "Completed project setup with React, TypeScript, and authentication using NextAuth. All tests passing.",
      attachmentUrls: JSON.stringify([
        "https://github.com/alice/dashboard-project",
        "https://dashboard-demo.vercel.app",
      ]),
      status: SubmissionStatus.SUBMITTED,
    },
  })

  // Create taxonomy
  const skills = ["JavaScript", "React", "Node.js", "Python", "UI/UX Design", "Figma", "TypeScript", "CSS", "HTML"]
  for (const skill of skills) {
    await prisma.taxonomy.create({
      data: {
        type: "SKILL",
        name: skill,
        synonyms: JSON.stringify([]),
      },
    })
  }

  // Create message thread
  const thread = await prisma.messageThread.create({
    data: {
      projectId: project1.id,
    },
  })

  // Create messages
  await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: pmUser.id,
      body: "Welcome to the React Dashboard project! Please review the requirements and let me know if you have any questions.",
    },
  })

  await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: studentA.id,
      body: "Thank you! I've reviewed the requirements and I'm excited to get started. I have some questions about the data visualization requirements.",
    },
  })

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
