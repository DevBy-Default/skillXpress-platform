import type { Certification } from "@/types"

export class CertificationGenerator {
  static generateCertificate(
    studentId: string,
    projectId: string,
    assignmentId: string,
    projectTitle: string,
    skills: string[],
  ): Certification {
    const verificationHash = this.generateHash()
    const badgeUrl = this.generateBadgeSVG(projectTitle, skills, verificationHash)

    return {
      id: `cert-${Date.now()}`,
      studentId,
      projectId,
      assignmentId,
      title: `${projectTitle} Completion Certificate`,
      description: `Successfully completed the ${projectTitle} micro-internship project, demonstrating proficiency in ${skills.join(", ")}.`,
      skills,
      issuedAt: new Date(),
      verificationHash,
      badgeUrl,
    }
  }

  private static generateHash(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private static generateBadgeSVG(title: string, skills: string[], hash: string): string {
    const svg = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="150" r="140" fill="url(#grad1)" stroke="#1F2937" stroke-width="4"/>
        <circle cx="150" cy="150" r="120" fill="none" stroke="#F9FAFB" stroke-width="2"/>
        <text x="150" y="120" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
          SkillXpress
        </text>
        <text x="150" y="140" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">
          Certificate
        </text>
        <text x="150" y="170" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10">
          ${title.length > 25 ? title.substring(0, 25) + "..." : title}
        </text>
        <text x="150" y="190" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="8">
          Skills: ${skills.slice(0, 3).join(", ")}
        </text>
        <text x="150" y="220" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="6">
          Verification: ${hash.substring(0, 12)}...
        </text>
      </svg>
    `

    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
}
