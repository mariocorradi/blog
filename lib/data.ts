import { Post, PostInput } from '@/types'

// Mock data - replace with database later
// eslint-disable-next-line prefer-const
let posts: Post[] = [
  {
    id: '1',
    title: 'Welcome to My Blog',
    slug: 'welcome-to-my-blog',
    content: '<p>Hello and welcome to my little corner of the internet! I\'m so excited to share my thoughts, experiences, and adventures with you.</p><p>This blog will be a place where I write about the things I love - from everyday moments to special memories. Stay tuned for more posts coming soon!</p>',
    category: 'Life',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'My Favorite Coffee Spots',
    slug: 'my-favorite-coffee-spots',
    content: '<p>There\'s nothing quite like finding the perfect coffee shop. You know the kind - cozy atmosphere, great music, and of course, amazing coffee.</p><h2>What Makes a Great Coffee Shop?</h2><p>For me, it\'s all about the <strong>vibe</strong>. I love places where you can:</p><ul><li>Sit for hours without feeling rushed</li><li>People watch through big windows</li><li>Discover new drinks to try</li></ul><p>What are your favorite spots? I\'d love to hear!</p>',
    category: 'Food',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Weekend Trip to the Mountains',
    slug: 'weekend-trip-to-the-mountains',
    content: '<p>Last weekend, we took a spontaneous trip to the mountains and it was exactly what we needed.</p><p>The fresh air, the stunning views, and just being away from the city noise - it was <em>magical</em>.</p><h2>Highlights</h2><p>We went hiking on a beautiful trail that led to a hidden waterfall. The water was freezing cold but so refreshing!</p><p>Sometimes you just need to disconnect and reconnect with nature.</p>',
    category: 'Travel',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export async function getPosts(): Promise<Post[]> {
  // Sort by date, newest first
  return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const filtered = posts.filter(p => p.category.toLowerCase() === category.toLowerCase())
  return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getPost(slug: string): Promise<Post | null> {
  return posts.find(p => p.slug === slug) || null
}

export async function getPostById(id: string): Promise<Post | null> {
  return posts.find(p => p.id === id) || null
}

export async function createPost(data: PostInput): Promise<Post> {
  const now = new Date()
  const post: Post = {
    id: generateId(),
    title: data.title,
    slug: generateSlug(data.title),
    content: data.content,
    category: data.category,
    createdAt: now,
    updatedAt: now,
  }
  posts.push(post)
  return post
}

export async function updatePost(id: string, data: PostInput): Promise<Post> {
  const index = posts.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('Post not found')
  }

  const updated: Post = {
    ...posts[index],
    title: data.title,
    slug: generateSlug(data.title),
    content: data.content,
    category: data.category,
    updatedAt: new Date(),
  }
  posts[index] = updated
  return updated
}

export async function deletePost(id: string): Promise<void> {
  const index = posts.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('Post not found')
  }
  posts.splice(index, 1)
}

export async function getCategories(): Promise<string[]> {
  const categories = new Set(posts.map(p => p.category))
  return Array.from(categories).sort()
}
