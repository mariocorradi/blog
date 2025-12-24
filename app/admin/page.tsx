'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { useAuth } from '@/components/AuthContext'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const success = await login(password)

    if (success) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid password')
      setIsSubmitting(false)
    }
  }

  if (isLoading || isAuthenticated) {
    return null
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="sm">
        <Card shadow="sm" borderRadius="xl">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading size="lg" mb={2} fontWeight="600">
                  Admin Login
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Enter your password to continue
                </Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!error}>
                    <FormLabel fontSize="sm" fontWeight="500">
                      Password
                    </FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      size="lg"
                      autoFocus
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="gray"
                    size="lg"
                    width="full"
                    isLoading={isSubmitting}
                  >
                    Login
                  </Button>
                </VStack>
              </form>
            </VStack>
          </CardBody>
        </Card>

        <Text textAlign="center" mt={6} fontSize="sm" color="gray.500">
          Default password: <code>shereen2024</code>
        </Text>
      </Container>
    </Box>
  )
}
