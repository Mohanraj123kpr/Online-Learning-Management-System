import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Discussion, Reply, DiscussionFilter, DiscussionSort } from '@/types/discussion'

// Mock data
const mockDiscussions: Discussion[] = [
  {
    id: 'd1',
    courseId: '1',
    userId: 'u1',
    userName: 'Alice Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    title: 'How to implement authentication in React?',
    content:
      "I'm working on a React project and need to implement user authentication. What are the best practices for handling JWT tokens and protecting routes?",
    category: 'question',
    tags: ['react', 'authentication', 'jwt'],
    views: 245,
    replies: [
      {
        id: 'r1',
        discussionId: 'd1',
        userId: 'instructor',
        userName: 'Sarah Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        content:
          'Great question! For JWT authentication, I recommend storing tokens in httpOnly cookies for better security. Use a library like react-router to protect routes with authentication guards.',
        votes: 15,
        isInstructorReply: true,
        isBestAnswer: true,
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      },
      {
        id: 'r2',
        discussionId: 'd1',
        userId: 'u3',
        userName: 'Charlie Brown',
        userAvatar: 'https://i.pravatar.cc/150?img=3',
        content:
          'I also recommend checking out Auth0 or Firebase Authentication if you want a managed solution.',
        votes: 8,
        isInstructorReply: false,
        isBestAnswer: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
    votes: 12,
    isResolved: true,
    isPinned: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: 'd2',
    courseId: '1',
    userId: 'u2',
    userName: 'Bob Smith',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    title: 'Best practices for state management',
    content:
      'What are your thoughts on using Context API vs Redux for state management in a medium-sized application?',
    category: 'discussion',
    tags: ['react', 'state-management', 'redux'],
    views: 189,
    replies: [
      {
        id: 'r3',
        discussionId: 'd2',
        userId: 'u4',
        userName: 'Diana Prince',
        userAvatar: 'https://i.pravatar.cc/150?img=4',
        content:
          'For medium-sized apps, Context API is usually sufficient. Redux adds complexity that you might not need unless you have very complex state logic.',
        votes: 5,
        isInstructorReply: false,
        isBestAnswer: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ],
    votes: 8,
    isResolved: false,
    isPinned: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'd3',
    courseId: '1',
    userId: 'instructor',
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    title: 'Week 3 Assignment Guidelines',
    content:
      'Please submit your Week 3 assignment by Friday. Make sure to include unit tests and follow the coding standards discussed in class.',
    category: 'announcement',
    tags: ['assignment', 'week3'],
    views: 456,
    replies: [],
    votes: 25,
    isResolved: false,
    isPinned: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'd4',
    courseId: '2',
    userId: 'u5',
    userName: 'Eve Martinez',
    userAvatar: 'https://i.pravatar.cc/150?img=6',
    title: 'Understanding async/await vs Promises',
    content:
      'Can someone explain when to use async/await versus traditional Promise chains? What are the performance implications?',
    category: 'question',
    tags: ['javascript', 'async', 'promises'],
    views: 312,
    replies: [],
    votes: 18,
    isResolved: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
]

export const useDiscussionsStore = defineStore('discussions', () => {
  // State
  const discussions = ref<Discussion[]>(mockDiscussions)
  const currentFilter = ref<DiscussionFilter>('all')
  const currentSort = ref<DiscussionSort>('recent')

  // Getters
  const filteredDiscussions = computed(() => {
    let filtered = [...discussions.value]

    // Apply filter
    switch (currentFilter.value) {
      case 'questions':
        filtered = filtered.filter((d) => d.category === 'question')
        break
      case 'discussions':
        filtered = filtered.filter((d) => d.category === 'discussion')
        break
      case 'resolved':
        filtered = filtered.filter((d) => d.isResolved)
        break
      case 'unresolved':
        filtered = filtered.filter((d) => !d.isResolved && d.category === 'question')
        break
      case 'my-posts':
        filtered = filtered.filter((d) => d.userId === 'current-user')
        break
    }

    // Apply sort
    switch (currentSort.value) {
      case 'recent':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.votes - a.votes)
        break
      case 'unanswered':
        filtered.sort((a, b) => a.replies.length - b.replies.length)
        break
    }

    // Pinned posts always on top
    return filtered.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
  })

  const getDiscussionById = computed(() => (id: string) => {
    return discussions.value.find((d) => d.id === id)
  })

  const getDiscussionsByCourse = computed(() => (courseId: string) => {
    return discussions.value.filter((d) => d.courseId === courseId)
  })

  // Actions
  function createDiscussion(
    discussion: Omit<Discussion, 'id' | 'views' | 'votes' | 'replies' | 'createdAt' | 'updatedAt'>,
  ) {
    const newDiscussion: Discussion = {
      ...discussion,
      id: `d${Date.now()}`,
      views: 0,
      votes: 0,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    discussions.value.unshift(newDiscussion)
    return newDiscussion
  }

  function addReply(
    discussionId: string,
    reply: Omit<Reply, 'id' | 'votes' | 'createdAt' | 'updatedAt'>,
  ) {
    const discussion = discussions.value.find((d) => d.id === discussionId)
    if (discussion) {
      const newReply: Reply = {
        ...reply,
        id: `r${Date.now()}`,
        votes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      discussion.replies.push(newReply)
      discussion.updatedAt = new Date()
    }
  }

  function voteDiscussion(discussionId: string, value: 1 | -1) {
    const discussion = discussions.value.find((d) => d.id === discussionId)
    if (discussion) {
      discussion.votes += value
    }
  }

  function voteReply(discussionId: string, replyId: string, value: 1 | -1) {
    const discussion = discussions.value.find((d) => d.id === discussionId)
    if (discussion) {
      const reply = discussion.replies.find((r) => r.id === replyId)
      if (reply) {
        reply.votes += value
      }
    }
  }

  function markAsResolved(discussionId: string) {
    const discussion = discussions.value.find((d) => d.id === discussionId)
    if (discussion) {
      discussion.isResolved = true
      discussion.updatedAt = new Date()
    }
  }

  function markAsBestAnswer(discussionId: string, replyId: string) {
    const discussion = discussions.value.find((d) => d.id === discussionId)
    if (discussion) {
      discussion.replies.forEach((r) => {
        r.isBestAnswer = r.id === replyId
      })
      discussion.isResolved = true
      discussion.updatedAt = new Date()
    }
  }

  function incrementViews(discussionId: string) {
    const discussion = discussions.value.find((d) => d.id === discussionId)
    if (discussion) {
      discussion.views++
    }
  }

  function setFilter(filter: DiscussionFilter) {
    currentFilter.value = filter
  }

  function setSort(sort: DiscussionSort) {
    currentSort.value = sort
  }

  return {
    discussions,
    currentFilter,
    currentSort,
    filteredDiscussions,
    getDiscussionById,
    getDiscussionsByCourse,
    createDiscussion,
    addReply,
    voteDiscussion,
    voteReply,
    markAsResolved,
    markAsBestAnswer,
    incrementViews,
    setFilter,
    setSort,
  }
})
