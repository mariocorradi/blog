# Developer Guide

A comprehensive guide for developers working on this Next.js blog application. This document assumes you're an experienced developer but new to this particular tech stack.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Project Structure](#project-structure)
3. [Next.js App Router Concepts](#nextjs-app-router-concepts)
4. [Component Architecture](#component-architecture)
5. [Styling with Chakra UI](#styling-with-chakra-ui)
6. [Dark Mode System](#dark-mode-system)
7. [Data Flow](#data-flow)
8. [Authentication](#authentication)
9. [Rich Text Editor](#rich-text-editor)
10. [API Routes](#api-routes)
11. [Common Patterns](#common-patterns)
12. [Adding New Features](#adding-new-features)
13. [Troubleshooting](#troubleshooting)

---

## Tech Stack Overview

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.x | React framework with App Router |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Chakra UI** | 2.x | Component library & styling |
| **TipTap** | 2.x | Rich text editor |
| **isomorphic-dompurify** | - | XSS protection for HTML content |

### Why These Choices?

- **Next.js App Router**: Modern React patterns with Server Components, file-based routing, and built-in API routes
- **Chakra UI**: Accessible components with excellent dark mode support and CSS-in-JS
- **TipTap**: Headless, extensible rich text editor built on ProseMirror

---

## Project Structure

```
blog/
├── app/                      # Next.js App Router (pages & layouts)
│   ├── layout.tsx            # Root layout (wraps entire app)
│   ├── providers.tsx         # Client-side providers (Chakra, theme)
│   ├── page.tsx              # Home page (/)
│   ├── post/
│   │   └── [slug]/
│   │       └── page.tsx      # Dynamic post page (/post/my-post-slug)
│   ├── admin/
│   │   ├── layout.tsx        # Admin section layout (AuthProvider)
│   │   ├── page.tsx          # Login page (/admin)
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Post management (/admin/dashboard)
│   │   └── editor/
│   │       ├── page.tsx      # New post (/admin/editor)
│   │       └── [id]/
│   │           └── page.tsx  # Edit post (/admin/editor/123)
│   └── api/                  # API routes (backend)
│       ├── auth/
│       │   └── login/
│       │       └── route.ts  # POST /api/auth/login
│       └── posts/
│           ├── route.ts      # GET/POST /api/posts
│           └── [id]/
│               └── route.ts  # GET/PUT/DELETE /api/posts/[id]
│
├── components/               # Reusable React components
│   ├── AdminLayout.tsx       # Admin page wrapper with nav
│   ├── AuthContext.tsx       # Authentication state management
│   ├── CategoryBadge.tsx     # Gradient category labels
│   ├── CategoryFilter.tsx    # Category filter buttons
│   ├── Navbar.tsx            # Public site navigation
│   ├── PostCard.tsx          # Post preview card
│   ├── PostCardSkeleton.tsx  # Loading state for PostCard
│   ├── RichTextEditor.tsx    # TipTap editor wrapper
│   └── ThemeToggle.tsx       # Dark/light mode toggle
│
├── lib/                      # Utility functions & business logic
│   ├── auth.ts               # Password validation, cookie config
│   ├── data.ts               # Data layer (mock database)
│   └── toast.ts              # Toast notification helpers
│
├── types/
│   └── index.ts              # TypeScript interfaces (Post, PostInput)
│
└── public/                   # Static assets
```

### Key Directories Explained

| Directory | Role |
|-----------|------|
| `app/` | Next.js App Router - each folder is a route segment |
| `components/` | Shared React components (all client components here) |
| `lib/` | Business logic, utilities, data access |
| `types/` | TypeScript type definitions |

---

## Next.js App Router Concepts

### Server vs Client Components

Next.js 15+ uses React Server Components by default. Understanding the distinction is crucial:

```tsx
// SERVER COMPONENT (default) - runs on server only
// Can: directly access database, use async/await at component level
// Cannot: use hooks, browser APIs, event handlers

export default async function Page() {
  const data = await fetchFromDatabase() // Direct data access
  return <div>{data}</div>
}
```

```tsx
// CLIENT COMPONENT - runs in browser (and server for initial render)
// Add 'use client' directive at top
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0) // Hooks work here
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### When to Use Which?

| Use Server Component | Use Client Component |
|---------------------|---------------------|
| Static content | Interactive UI (buttons, forms) |
| Data fetching | useState, useEffect hooks |
| Accessing backend resources | Browser APIs (localStorage, etc.) |
| Keeping secrets server-side | Event handlers (onClick, etc.) |

### This Project's Pattern

Most components in this project are **client components** because:
- Chakra UI requires client-side rendering for its styling system
- Interactive features (dark mode, forms, etc.) need hooks
- The `'use client'` directive propagates to child components

### File-Based Routing

```
app/
├── page.tsx           → /
├── post/
│   └── [slug]/
│       └── page.tsx   → /post/:slug (dynamic route)
├── admin/
│   ├── page.tsx       → /admin
│   └── editor/
│       └── [id]/
│           └── page.tsx → /admin/editor/:id
```

**Special files:**
- `page.tsx` - The UI for a route
- `layout.tsx` - Shared UI that wraps child pages
- `route.ts` - API endpoint (no UI)
- `loading.tsx` - Loading UI (we use custom skeletons instead)
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI

### Dynamic Route Parameters

```tsx
// app/post/[slug]/page.tsx
// URL: /post/my-great-post

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string // "my-great-post"
  // ...
}
```

### Search Parameters (Query Strings)

Next.js 15+ passes `searchParams` as a Promise:

```tsx
// app/page.tsx
// URL: /?category=Travel

import { use } from 'react'

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = use(searchParams)  // Unwrap the Promise
  const category = params?.category // "Travel"
  // ...
}
```

---

## Component Architecture

### Component Hierarchy

```
RootLayout (app/layout.tsx)
└── Providers (app/providers.tsx) - Chakra theme
    ├── Public Routes
    │   ├── Navbar
    │   └── Page Content (Home, Post)
    │
    └── Admin Routes (app/admin/layout.tsx)
        └── AuthProvider - Authentication context
            ├── Login Page (unauthenticated)
            └── AdminLayout - Admin nav wrapper
                └── Admin Pages (Dashboard, Editor)
```

### Component Breakdown

#### `Navbar.tsx`
Public navigation bar with:
- Logo/site title
- Theme toggle button
- Responsive design with Chakra's responsive props

#### `AdminLayout.tsx`
Wrapper for authenticated admin pages:
- Checks authentication, redirects if not logged in
- Admin navigation (Posts, New Post, View Blog, Logout)
- Loading spinner while checking auth

#### `PostCard.tsx`
Blog post preview card:
- Gradient category badge
- Title, excerpt (truncated content)
- Date, hover animations
- Links to full post

#### `RichTextEditor.tsx`
TipTap-based WYSIWYG editor:
- Toolbar with formatting options
- Handles async content loading (important for edit mode)
- Dark mode support
- Loading skeleton while initializing

#### `CategoryBadge.tsx`
Gradient badge for categories:
- Each category has unique light/dark gradients
- Consistent styling across the app

---

## Styling with Chakra UI

### Core Concepts

Chakra UI uses a **props-based styling** approach:

```tsx
// Instead of CSS classes:
<div className="flex justify-between items-center p-4 bg-white">

// Use style props:
<Box display="flex" justifyContent="space-between" alignItems="center" p={4} bg="white">

// Or the Flex shorthand component:
<Flex justify="space-between" align="center" p={4} bg="white">
```

### Common Style Props

| Prop | CSS Property | Example |
|------|--------------|---------|
| `p`, `px`, `py` | padding | `p={4}` = 16px |
| `m`, `mx`, `my` | margin | `my={8}` = 32px vertical |
| `bg` | background | `bg="gray.100"` |
| `color` | color | `color="gray.700"` |
| `w`, `h` | width, height | `w="100%"` |
| `display` | display | `display="flex"` |

### Spacing Scale

Chakra uses a 4px base:
- `1` = 4px
- `2` = 8px
- `4` = 16px
- `8` = 32px
- `12` = 48px

### Responsive Props

Use object or array syntax for responsive values:

```tsx
// Object syntax (preferred)
<Box fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}>
  Responsive text
</Box>

// Breakpoints: base (0+), sm (480+), md (768+), lg (992+), xl (1280+)
```

### The `sx` Prop

For complex/custom styles, use the `sx` prop:

```tsx
<Box
  sx={{
    '&:hover': {
      transform: 'scale(1.02)',
    },
    'p': {
      marginBottom: 4,
    },
  }}
>
```

---

## Dark Mode System

### How It Works

1. **Theme Config** (`app/providers.tsx`):
```tsx
const config: ThemeConfig = {
  initialColorMode: 'system',    // Start with OS preference
  useSystemColorMode: true,      // React to OS changes
}
```

2. **Color Mode Values** - Components use `useColorModeValue`:
```tsx
const bgColor = useColorModeValue('white', 'gray.800')
// Returns 'white' in light mode, 'gray.800' in dark mode
```

3. **Theme Toggle** (`components/ThemeToggle.tsx`):
```tsx
const { toggleColorMode } = useColorMode()
// Cycles: system → light → dark → system
```

### Adding Dark Mode to New Components

```tsx
'use client'
import { Box, useColorModeValue } from '@chakra-ui/react'

export default function MyComponent() {
  // Define all color mode values at the top
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Box bg={bgColor} color={textColor} borderColor={borderColor}>
      Content
    </Box>
  )
}
```

### Color Palette Convention

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Page background | `gray.50` | `gray.900` |
| Card background | `white` | `gray.800` |
| Primary text | `gray.900` | `white` |
| Secondary text | `gray.600` | `gray.400` |
| Muted text | `gray.500` | `gray.500` |
| Borders | `gray.200` | `gray.700` |

---

## Data Flow

### Current Architecture (Mock Data)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  API Route  │────▶│  lib/data   │
│  Component  │◀────│  (route.ts) │◀────│  (mock DB)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Data Layer (`lib/data.ts`)

The data layer provides async functions that mimic database operations:

```tsx
// Available functions:
getPosts()                    // Get all posts (sorted by date)
getPostsByCategory(category)  // Filter by category
getPost(slug)                 // Get single post by slug
getPostById(id)               // Get single post by ID
createPost(data)              // Create new post
updatePost(id, data)          // Update existing post
deletePost(id)                // Delete post
getCategories()               // Get unique categories
```

### Replacing with Real Database

To connect a real database (e.g., Prisma + PostgreSQL):

1. Keep the same function signatures in `lib/data.ts`
2. Replace mock array operations with database queries:

```tsx
// Before (mock):
export async function getPosts(): Promise<Post[]> {
  return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// After (Prisma example):
export async function getPosts(): Promise<Post[]> {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  })
}
```

### Types (`types/index.ts`)

```tsx
export interface Post {
  id: string
  title: string
  slug: string
  content: string      // HTML string from TipTap
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface PostInput {
  title: string
  content: string
  category: string
}
```

---

## Authentication

### Overview

Simple password-based authentication using HTTP-only cookies:

```
Login Flow:
1. User enters password
2. POST /api/auth/login with password
3. Server validates against ADMIN_PASSWORD env var
4. Success: Set HTTP-only cookie, return 200
5. Client updates AuthContext state
```

### Components

**`lib/auth.ts`** - Server-side validation:
```tsx
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shereen2024'

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export const AUTH_COOKIE_NAME = 'blog_admin_auth'
```

**`components/AuthContext.tsx`** - Client-side state:
```tsx
const { isAuthenticated, login, logout, isLoading } = useAuth()

// login() - POST to /api/auth/login, update state
// logout() - Clear cookie, update state
// isLoading - True while checking initial auth state
```

**`components/AdminLayout.tsx`** - Route protection:
```tsx
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/admin')  // Redirect to login
  }
}, [isAuthenticated, isLoading, router])
```

### Upgrading Authentication

For production, consider:
- **NextAuth.js** - Full auth solution with providers (Google, GitHub, etc.)
- **Clerk** - Drop-in auth with UI components
- **Auth0** - Enterprise-grade auth

---

## Rich Text Editor

### TipTap Overview

TipTap is a headless editor built on ProseMirror. "Headless" means it provides the editing logic without UI - you build the toolbar yourself.

### Structure (`components/RichTextEditor.tsx`)

```tsx
// 1. Initialize editor with extensions
const editor = useEditor({
  extensions: [
    StarterKit,           // Basic formatting (bold, italic, lists, etc.)
    Underline,            // Underline support
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: false }),
    Image,
  ],
  content: '',            // Initial content (HTML string)
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML())  // Sync to parent
  },
  immediatelyRender: false,     // Important for SSR
})

// 2. Sync external content (for edit mode)
useEffect(() => {
  if (editor && content && !hasInitializedContent.current) {
    editor.commands.setContent(content)
    hasInitializedContent.current = true
  }
}, [editor, content])

// 3. Render toolbar + editor area
return (
  <Box>
    <EditorToolbar editor={editor} />
    <EditorContent editor={editor} />
  </Box>
)
```

### Toolbar Commands

```tsx
// Toggle formatting:
editor.chain().focus().toggleBold().run()
editor.chain().focus().toggleItalic().run()
editor.chain().focus().toggleBulletList().run()

// Check if format is active:
editor.isActive('bold')
editor.isActive('heading', { level: 2 })

// Set heading level:
editor.chain().focus().toggleHeading({ level: 2 }).run()
```

### XSS Protection

User-generated HTML is sanitized before rendering:

```tsx
import DOMPurify from 'isomorphic-dompurify'

// In post display:
<Box dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(post.content)
}} />
```

---

## API Routes

### Route Handler Pattern

```tsx
// app/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server'

// GET /api/posts
export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
}

// POST /api/posts
export async function POST(request: NextRequest) {
  // Auth check
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse body
  const data = await request.json()

  // Validate
  if (!data.title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 })
  }

  // Create & return
  const post = await createPost(data)
  return NextResponse.json(post, { status: 201 })
}
```

### Dynamic Route Parameters

```tsx
// app/api/posts/[id]/route.ts

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}
```

### API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Authenticate with password |
| GET | `/api/posts` | No | List all posts |
| POST | `/api/posts` | Yes | Create new post |
| GET | `/api/posts/[id]` | No | Get single post |
| PUT | `/api/posts/[id]` | Yes | Update post |
| DELETE | `/api/posts/[id]` | Yes | Delete post |

---

## Common Patterns

### Toast Notifications

Use the utilities in `lib/toast.ts`:

```tsx
import { useToast } from '@chakra-ui/react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

function MyComponent() {
  const toast = useToast()

  const handleSave = async () => {
    try {
      await saveData()
      showSuccessToast(toast, 'Saved!', 'Your changes have been saved.')
    } catch {
      showErrorToast(toast, 'Error', 'Failed to save changes.')
    }
  }
}
```

### Loading States

Use skeletons for better UX:

```tsx
const [isLoading, setIsLoading] = useState(true)

if (isLoading) {
  return <PostCardSkeleton />
}
```

### Form Handling

```tsx
const [formData, setFormData] = useState({ title: '', content: '' })
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async () => {
  setIsSubmitting(true)
  try {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    showSuccessToast(toast, 'Post created!')
    router.push('/admin/dashboard')
  } catch {
    showErrorToast(toast, 'Failed to create post')
  } finally {
    setIsSubmitting(false)
  }
}
```

### Linking Between Pages

```tsx
import NextLink from 'next/link'
import { Button, Link as ChakraLink } from '@chakra-ui/react'

// As a text link:
<ChakraLink as={NextLink} href="/about">
  About
</ChakraLink>

// As a button:
<Button as={NextLink} href="/admin/editor">
  New Post
</Button>
```

---

## Adding New Features

### Adding a New Page

1. Create the file in `app/`:
```tsx
// app/about/page.tsx
'use client'

import { Box, Container, Heading } from '@chakra-ui/react'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <Box>
      <Navbar />
      <Container maxW="container.lg" py={12}>
        <Heading>About</Heading>
      </Container>
    </Box>
  )
}
```

2. The route `/about` is automatically available.

### Adding a New Component

1. Create in `components/`:
```tsx
// components/MyComponent.tsx
'use client'

import { Box, useColorModeValue } from '@chakra-ui/react'

interface MyComponentProps {
  title: string
}

export default function MyComponent({ title }: MyComponentProps) {
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Box bg={bgColor} p={4} borderRadius="lg">
      {title}
    </Box>
  )
}
```

2. Import and use:
```tsx
import MyComponent from '@/components/MyComponent'

<MyComponent title="Hello" />
```

### Adding a New API Endpoint

1. Create the route file:
```tsx
// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // Your logic
  return NextResponse.json({ comments: [] })
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  // Your logic
  return NextResponse.json({ success: true }, { status: 201 })
}
```

2. The endpoint `/api/comments` is automatically available.

### Adding a New Category

Categories are dynamic based on posts, but to add a gradient:

```tsx
// components/CategoryBadge.tsx - add to categoryGradients object:
const categoryGradients = {
  // existing...
  tech: {
    light: 'linear(to-r, cyan.400, blue.400)',
    dark: 'linear(to-r, cyan.300, blue.300)'
  },
}
```

---

## Troubleshooting

### Common Issues

**"useColorModeValue" returns wrong value on first render**
- This is normal SSR behavior. The server doesn't know the color mode.
- Use `suppressHydrationWarning` on elements that differ (like dates).

**Editor content not loading in edit mode**
- The `RichTextEditor` has been fixed to handle async content.
- Ensure you pass `initialContent` prop correctly.

**"Cannot use hooks in Server Component"**
- Add `'use client'` at the top of the file.
- Or refactor to not need hooks (use Server Component patterns).

**Hydration mismatch errors**
- Often caused by Date formatting (server vs client timezone).
- Use `suppressHydrationWarning` on date elements.
- Avoid `legacyBehavior` on Next.js Link components.

**API returns 401 Unauthorized**
- Check that the auth cookie is being sent.
- Verify you're logged in at `/admin`.

### Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Useful Debug Techniques

```tsx
// Log color mode:
const { colorMode } = useColorMode()
console.log('Current mode:', colorMode)

// Log auth state:
const { isAuthenticated, isLoading } = useAuth()
console.log('Auth:', { isAuthenticated, isLoading })

// Check API response:
const response = await fetch('/api/posts')
console.log('Status:', response.status)
console.log('Data:', await response.json())
```

---

## Next Steps

Potential improvements for this project:

1. **Database Integration** - Replace mock data with Prisma + PostgreSQL
2. **Image Uploads** - Add image upload to editor (Cloudinary, S3, etc.)
3. **Comments System** - Add commenting on posts
4. **Search** - Full-text search across posts
5. **Tags** - Multiple tags per post instead of single category
6. **Draft Mode** - Save drafts before publishing
7. **SEO** - Add meta tags, Open Graph, sitemap
8. **Analytics** - Track page views and engagement

---

*Last updated: December 2024*
