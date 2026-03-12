export type Role = 'STUDENT' | 'ALUMNI' | 'ADMIN'
export type MediaType = 'IMAGE' | 'VIDEO' | 'NONE'
export type RsvpStatus = 'YES' | 'NO' | 'MAYBE'

export interface AuthResponse {
  token: string
  userId: number
  fullName: string
  email: string
  role: Role
}

export interface ProfileResponse {
  userId: number
  fullName: string
  email: string
  role: Role
  profileImageUrl?: string
  bio?: string
  department?: string
  batch?: string
  graduationYear?: number
  currentCompany?: string
  jobTitle?: string
  skills?: string
  linkedinUrl?: string
  githubUrl?: string
}

export interface CommentResponse {
  id: number
  userId: number
  userName: string
  content: string
  createdAt: string
}

export interface PostResponse {
  id: number
  userId: number
  userName: string
  content?: string
  mediaUrl?: string
  mediaType: MediaType
  sharedPostId?: number
  likeCount: number
  commentCount: number
  likedByCurrentUser: boolean
  createdAt: string
  comments: CommentResponse[]
}

export interface JobResponse {
  id: number
  postedById: number
  postedByName: string
  title: string
  company: string
  description: string
  location?: string
  type?: string
  deadline: string
  createdAt: string
  applicationCount: number
}

export interface EventResponse {
  id: number
  createdById: number
  createdByName: string
  title: string
  description: string
  venue?: string
  eventDate: string
  eventType?: string
  bannerUrl?: string
  yesCount: number
  noCount: number
  maybeCount: number
  currentUserRsvp?: string
}

export interface ResearchProjectResponse {
  id: number
  createdById: number
  createdByName: string
  title: string
  description: string
  documentUrl?: string
  requiredSkills?: string
  memberCount: number
  joinedByCurrentUser: boolean
  createdAt: string
}

export interface ConversationResponse {
  id: number
  type?: string
  title?: string
  participantNames: string[]
  lastMessagePreview?: string
  updatedAt?: string
}

export interface MessageResponse {
  id: number
  senderId: number
  senderName: string
  content: string
  readStatus: boolean
  createdAt: string
}

export interface NotificationResponse {
  id: number
  type: string
  title: string
  message: string
  referenceId?: number
  readStatus: boolean
  createdAt: string
}

export interface AnalyticsOverviewResponse {
  totalUsers: number
  activeUsers: number
  totalPosts: number
  totalJobs: number
  totalApplications: number
  totalEvents: number
  totalRsvps: number
  totalResearchProjects: number
  totalConversations: number
  totalNotifications: number
}
