'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Button,
  Link as ChakraLink,
  Spinner,
  Center,
} from '@chakra-ui/react'
import Link from 'next/link'
import { FiLogOut, FiPlus, FiList } from 'react-icons/fi'
import { useAuth } from './AuthContext'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" color="gray.400" />
      </Center>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Admin Navbar */}
      <Box
        as="nav"
        borderBottom="1px"
        borderColor="gray.200"
        bg="white"
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={8}>
              <Link href="/admin/dashboard" passHref legacyBehavior>
                <ChakraLink _hover={{ textDecoration: 'none' }}>
                  <Heading
                    size="sm"
                    fontWeight="600"
                    color="gray.900"
                  >
                    Admin
                  </Heading>
                </ChakraLink>
              </Link>

              <HStack spacing={4}>
                <Link href="/admin/dashboard" passHref legacyBehavior>
                  <Button
                    as="a"
                    variant="ghost"
                    size="sm"
                    leftIcon={<FiList />}
                  >
                    Posts
                  </Button>
                </Link>
                <Link href="/admin/editor" passHref legacyBehavior>
                  <Button
                    as="a"
                    variant="ghost"
                    size="sm"
                    leftIcon={<FiPlus />}
                  >
                    New Post
                  </Button>
                </Link>
              </HStack>
            </HStack>

            <HStack spacing={4}>
              <Link href="/" passHref legacyBehavior>
                <Button as="a" variant="ghost" size="sm">
                  View Blog
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FiLogOut />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  )
}
