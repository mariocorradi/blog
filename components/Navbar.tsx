'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  showAdminLink?: boolean
}

export default function Navbar({ showAdminLink = true }: NavbarProps) {
  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.100', 'gray.700')
  const headingColor = useColorModeValue('gray.900', 'white')
  const linkColor = useColorModeValue('gray.600', 'gray.400')
  const linkHoverColor = useColorModeValue('gray.900', 'white')

  return (
    <Box
      as="nav"
      borderBottom="1px"
      borderColor={borderColor}
      bg={bgColor}
      position="sticky"
      top={0}
      zIndex={100}
      transition="all 0.2s"
      backdropFilter="blur(10px)"
      bgColor={useColorModeValue('rgba(255,255,255,0.9)', 'rgba(23,25,35,0.9)')}
    >
      <Container maxW="container.lg" py={4}>
        <Flex justify="space-between" align="center">
          <ChakraLink as={NextLink} href='/' _hover={{ textDecoration: 'none' }}>
            <Heading
              size="md"
              fontWeight="600"
              letterSpacing="-0.02em"
              color={headingColor}
              transition="color 0.2s"
            >
              Shereen&apos;s Blog
            </Heading>
          </ChakraLink>

          <HStack spacing={4}>
            <ChakraLink
              fontSize="sm"
              as={NextLink}
              href='/'
              color={linkColor}
              _hover={{ color: linkHoverColor }}
              transition="color 0.2s"
            >
              Home
            </ChakraLink>
            {showAdminLink && (
              <ChakraLink
                fontSize="sm"
                as={NextLink}
                href='/admin'
                color={linkColor}
                _hover={{ color: linkHoverColor }}
                transition="color 0.2s"
              >
                Admin
              </ChakraLink>
            )}
            <ThemeToggle />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
