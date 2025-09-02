import type { User } from "@/types"
import { MockDataStore } from "./mock-data"

const CURRENT_USER_KEY = "skillxpress_current_user"

export class MockAuth {
  static login(email: string, password: string): User | null {
    const store = MockDataStore.getInstance()
    const user = store.getUserByEmail(email)

    if (user) {
      // Store user in localStorage for session persistence
      if (typeof window !== "undefined") {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
      }
      return user
    }

    return null
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CURRENT_USER_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return null
        }
      }
    }
    return null
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  static hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }
}
