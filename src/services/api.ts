/**
 * API Service Layer
 * Centralized API calls to backend
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

interface ApiError {
  detail: string
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: 'An error occurred',
      }))
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return this.handleResponse(response)
  }

  async logout() {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async validateToken() {
    const response = await fetch(`${API_BASE}/auth/validate`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Organization endpoints
  async registerOrganization(data: {
    name: string
    slug: string
    domain: string
    plan: string
    admin_name: string
    admin_email: string
    admin_password: string
    logo?: string
  }) {
    const response = await fetch(`${API_BASE}/organizations/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async getMyOrganization() {
    const response = await fetch(`${API_BASE}/organizations/my-organization`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async updateMyOrganization(data: { name?: string; logo?: string; settings?: any }) {
    const response = await fetch(`${API_BASE}/organizations/my-organization`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async upgradeOrganizationPlan(newPlan: string) {
    const response = await fetch(`${API_BASE}/organizations/my-organization/upgrade`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ new_plan: newPlan }),
    })
    return this.handleResponse(response)
  }

  // Course endpoints
  async getCourses() {
    const response = await fetch(`${API_BASE}/courses`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getCourse(courseId: string) {
    const response = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async enrollInCourse(courseId: string) {
    const response = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async updateCourseProgress(courseId: string, lessonId: string, progress: number) {
    const response = await fetch(`${API_BASE}/courses/${courseId}/progress?lesson_id=${lessonId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Admin endpoints
  async inviteUser(data: { email: string; name: string; role: string; department?: string }) {
    const response = await fetch(`${API_BASE}/admin/employees/invite`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async assignCourse(data: {
    courseId: string
    assignedTo: string
    assignedUserIds?: string[]
    assignedDepartments?: string[]
    mandatory?: boolean
    dueDate?: string
  }) {
    const response = await fetch(`${API_BASE}/admin/courses/assign`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async removeUser(userId: string) {
    const response = await fetch(`${API_BASE}/admin/employees/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getOrganizationMembers() {
    const response = await fetch(`${API_BASE}/admin/employees`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getOrganizationAnalytics() {
    const response = await fetch(`${API_BASE}/admin/analytics`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // User endpoints
  async getCurrentUser() {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async updateUserProfile(data: {
    name?: string
    avatar?: string
    bio?: string
    title?: string
    location?: string
    website?: string
    social_links?: any
  }) {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async updateUserPreferences(data: any) {
    const response = await fetch(`${API_BASE}/users/me/preferences`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }
}

export const api = new ApiService()
