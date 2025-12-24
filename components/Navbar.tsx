'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
} from '@chakra-ui/react'
import NextLink from 'next/link'

interface NavbarProps {
  showAdminLink?: boolean
}

export default function Navbar({ showAdminLink = true }: NavbarProps) {
  return (
    <Box
      as="nav"
      borderBottom="1px"
      borderColor="gray.100"
      bg="white"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Container maxW="container.lg" py={4}>
        <Flex justify="space-between" align="center">
          <ChakraLink as={NextLink} href='/' _hover={{ textDecoration: 'none' }}>
            <Heading
              size="md"
              fontWeight="600"
              letterSpacing="-0.02em"
              color="gray.900"
            >
              Shereen&apos;s Blog
            </Heading>
          </ChakraLink>

          <HStack spacing={6}>
            <ChakraLink
              fontSize="sm"
              as={NextLink} href='/'
              color="gray.600"
              _hover={{ color: 'gray.900' }}
            >
              Home
            </ChakraLink>
            {showAdminLink && (
              <ChakraLink
                fontSize="sm"
                as={NextLink} href='/admin'
                color="gray.600"
                _hover={{ color: 'gray.900' }}
              >
                Admin
              </ChakraLink>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
