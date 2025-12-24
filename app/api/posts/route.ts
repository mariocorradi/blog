import { NextRequest, NextResponse } from 'next/server'
import { getPosts, createPost } from '@/lib/data'
import { AUTH_COOKIE_NAME } from '@/lib/auth'

function isAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  return !!authCookie?.value
}

export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.title || !data.content || !data.category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    const post = await createPost(data)
    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
