export interface Post {
  id: string
  title: string
  slug: string
  content: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface PostInput {
  title: string
  content: string
  category: string
}
