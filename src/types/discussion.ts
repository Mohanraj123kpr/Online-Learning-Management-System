export interface Discussion {
  id: string
  courseId: string
  userId: string
  userName: string
  userAvatar?: string
  title: string
  content: string
  category: 'question' | 'discussion' | 'announcement'
  tags: string[]
  views: number
  replies: Reply[]
  votes: number
  isResolved: boolean
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Reply {
  id: string
  discussionId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  votes: number
  isInstructorReply: boolean
  isBestAnswer: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Vote {
  id: string
  userId: string
  targetId: string // discussion or reply id
  targetType: 'discussion' | 'reply'
  value: 1 | -1 // upvote or downvote
}

export type DiscussionFilter =
  | 'all'
  | 'questions'
  | 'discussions'
  | 'resolved'
  | 'unresolved'
  | 'my-posts'
export type DiscussionSort = 'recent' | 'popular' | 'unanswered'
