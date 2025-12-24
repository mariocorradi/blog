'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useParams, notFound } from 'next/navigation'
import DOMPurify from 'isomorphic-dompurify'
import Navbar from '@/components/Navbar'
import CategoryBadge from '@/components/CategoryBadge'
import { Post } from '@/types'
import { FiArrowLeft } from 'react-icons/fi'

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Dark mode colors
  const bgColor = useColorModeValue('white', 'gray.900')
  const headingColor = useColorModeValue('gray.900', 'white')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const dateColor = useColorModeValue('gray.500', 'gray.400')
  const buttonColor = useColorModeValue('gray.600', 'gray.400')
  const buttonHoverColor = useColorModeValue('gray.900', 'white')
  const buttonHoverBg = useColorModeValue('gray.100', 'gray.700')
  const blockquoteBorder = useColorModeValue('gray.200', 'gray.600')
  const blockquoteColor = useColorModeValue('gray.600', 'gray.400')
  const linkColor = useColorModeValue('blue.600', 'blue.400')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts`)
        const posts = await response.json()
        const foundPost = posts.find((p: Post) => p.slug === slug)
        setPost(foundPost || null)
      } catch {
        setPost(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Navbar />
        <Center py={20}>
          <Spinner size="xl" color="purple.500" />
        </Center>
      </Box>
    )
  }

  if (!post) {
    notFound()
  }

  const dateString = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Box minH="100vh" bg={bgColor} transition="background-color 0.2s">
      <Navbar />

      <Container maxW="container.md" py={12}>
        <NextLink href="/" style={{ textDecoration: 'none' }}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<FiArrowLeft />}
            mb={8}
            color={buttonColor}
            _hover={{ color: buttonHoverColor, bg: buttonHoverBg }}
            transition="all 0.2s"
          >
            Back to posts
          </Button>
        </NextLink>

        {/* Post Header */}
        <Box mb={8}>
          <CategoryBadge category={post.category} size="md" />

          <Heading
            size="2xl"
            fontWeight="700"
            mb={4}
            mt={4}
            letterSpacing="-0.03em"
            lineHeight="1.2"
            color={headingColor}
            transition="color 0.2s"
          >
            {post.title}
          </Heading>

          <Text fontSize="sm" color={dateColor} suppressHydrationWarning>
            {dateString}
          </Text>
        </Box>

        {/* Post Content with Styled Prose */}
        <Box
          className="prose"
          sx={{
            'p': {
              color: textColor,
              lineHeight: '1.8',
              mb: 4,
              fontSize: 'md',
            },
            'h2': {
              fontWeight: '600',
              fontSize: 'xl',
              mt: 8,
              mb: 4,
              color: headingColor,
            },
            'h3': {
              fontWeight: '600',
              fontSize: 'lg',
              mt: 6,
              mb: 3,
              color: headingColor,
            },
            'ul, ol': {
              pl: 6,
              mb: 4,
              color: textColor,
            },
            'li': {
              mb: 2,
            },
            'strong': {
              fontWeight: '600',
              color: headingColor,
            },
            'blockquote': {
              borderLeft: '4px solid',
              borderColor: blockquoteBorder,
              pl: 4,
              py: 1,
              my: 4,
              fontStyle: 'italic',
              color: blockquoteColor,
            },
            'a': {
              color: linkColor,
              textDecoration: 'underline',
            }
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
      </Container>
    </Box>
  )
}
