export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  bio?: string | null
  role: string
  mobile?: string | null
  address?: string | null
  state?: string | null
  district?: string | null
  class?: string | null
  aiDomain?: string | null
  bootcampType?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Course {
  id: string
  title: string
  description: string
  price: number
  image?: string
  instructor: string
  duration: string
  level: string
  category: string
  students: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: string
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface Progress {
  id: string
  userId: string
  courseId: string
  lessonsCompleted: number
  totalLessons: number
  percentage: number
  lastAccessed: Date
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ContactForm {
  name: string
  email: string
  message: string
}
