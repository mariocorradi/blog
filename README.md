# Shereen's Blog

A clean, minimalist blog built with Next.js 14 and Chakra UI.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

Go to [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

**Default password:** `shereen2024`

To change the password, create a `.env.local` file:
```
ADMIN_PASSWORD=your-new-password
```

## Features

- Clean, minimalist design
- Rich text editor (no markdown needed!)
- Category filtering
- Mobile responsive
- Easy to customize

## Tech Stack

- Next.js 16 (App Router)
- Chakra UI
- Tiptap (rich text editor)
- TypeScript
- React 19

## Project Structure

```
/app
  /page.tsx              # Home page
  /post/[slug]/page.tsx  # Post detail page
  /admin                 # Admin pages
  /api                   # API routes
/components              # React components
/lib                     # Data and auth utilities
/types                   # TypeScript types
```

## Customization

- **Blog name:** Edit `app/layout.tsx` and `components/Navbar.tsx`
- **Colors:** Edit the theme in `app/providers.tsx`
- **Categories:** Edit `DEFAULT_CATEGORIES` in the editor pages

## Deployment

This blog is ready to deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add `ADMIN_PASSWORD` environment variable
4. Deploy!

## Adding a Database (Optional)

The current version uses in-memory storage (mock data). To persist posts:

1. Set up Turso or Vercel Postgres
2. Replace functions in `lib/data.ts` with database queries
3. That's it!
# blog
