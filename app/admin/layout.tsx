'use client'

import { AuthProvider } from '@/components/AuthContext'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
