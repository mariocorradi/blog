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
  useColorModeValue,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FiLogOut, FiPlus, FiList } from 'react-icons/fi'
import { useAuth } from './AuthContext'
import ThemeToggle from './ThemeToggle'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  // Dark mode colors
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const navBgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const headingColor = useColorModeValue('gray.900', 'white')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <Center minH="100vh" bg={bgColor}>
        <Spinner size="lg" color="purple.500" />
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
    <Box minH="100vh" bg={bgColor} transition="background-color 0.2s">
      {/* Admin Navbar */}
      <Box
        as="nav"
        borderBottom="1px"
        borderColor={borderColor}
        bg={navBgColor}
        position="sticky"
        top={0}
        zIndex={100}
        transition="all 0.2s"
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={8}>
              <ChakraLink as={NextLink} href="/admin/dashboard" _hover={{ textDecoration: 'none' }}>
                <Heading
                  size="sm"
                  fontWeight="600"
                  color={headingColor}
                  transition="color 0.2s"
                >
                  Admin
                </Heading>
              </ChakraLink>

              <HStack spacing={4}>
                <Button
                  as={NextLink}
                  href="/admin/dashboard"
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiList />}
                >
                  Posts
                </Button>
                <Button
                  as={NextLink}
                  href="/admin/editor"
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiPlus />}
                >
                  New Post
                </Button>
              </HStack>
            </HStack>

            <HStack spacing={4}>
              <Button as={NextLink} href="/" variant="ghost" size="sm">
                View Blog
              </Button>
              <ThemeToggle />
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
