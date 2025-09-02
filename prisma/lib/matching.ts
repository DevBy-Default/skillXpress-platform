import type { Match } from "@/types"
import { MockDataStore } from "./mock-data"

export class MatchingEngine {
  static generateMatches(studentId: string): Match[] {
    const store = MockDataStore.getInstance()
    const student = store.getUserById(studentId)
    const openProjects = store.getOpenProjects()

    if (!student || !student.skills) return []

    const matches: Match[] = []

    for (const project of openProjects) {
      const commonSkills = student.skills.filter((skill) =>
        project.skills.some(
          (projectSkill) =>
            projectSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(projectSkill.toLowerCase()),
        ),
      )

      if (commonSkills.length > 0) {
        // Calculate match score based on skill overlap and add some randomness
        const skillMatchRatio = commonSkills.length / project.skills.length
        const randomFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
        const baseScore = Math.min(skillMatchRatio * randomFactor * 100, 95)
        const score = Math.round(baseScore)

        const reasons = [
          `${commonSkills.length} matching skills: ${commonSkills.join(", ")}`,
          `Difficulty level: ${project.difficulty}`,
          `Project duration: ${project.duration}`,
        ]

        // Add additional reasons based on score
        if (score > 80) {
          reasons.push("Strong skill alignment with project requirements")
        } else if (score > 60) {
          reasons.push("Good foundation with room for skill development")
        }

        matches.push({
          studentId,
          projectId: project.id,
          score,
          reasons,
        })
      }
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score)
  }
}
