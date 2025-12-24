'use client'

import {
  Heading,
  Text,
  LinkBox,
  LinkOverlay,
  useColorModeValue,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Post } from '@/types'
import CategoryBadge from './CategoryBadge'

interface PostCardProps {
  post: Post
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

function getExcerpt(content: string, maxLength: number = 150): string {
  const text = stripHtml(content)
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export default function PostCard({ post }: PostCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.100', 'gray.700')
  const hoverBorderColor = useColorModeValue('gray.200', 'gray.600')
  const headingColor = useColorModeValue('gray.900', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const dateColor = useColorModeValue('gray.400', 'gray.500')

  return (
    <LinkBox
      as="article"
      p={6}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      transition="all 0.2s ease-in-out"
      _hover={{
        borderColor: hoverBorderColor,
        shadow: 'lg',
        transform: 'translateY(-2px)',
      }}
    >
      <CategoryBadge category={post.category} />

      <Heading
        size="md"
        mb={2}
        mt={3}
        fontWeight="600"
        lineHeight="1.3"
        color={headingColor}
        transition="color 0.2s"
      >
        <LinkOverlay as={NextLink} href={`/post/${post.slug}`}>
          {post.title}
        </LinkOverlay>
      </Heading>

      <Text color={textColor} fontSize="sm" mb={4} lineHeight="1.6">
        {getExcerpt(post.content)}
      </Text>

      <Text fontSize="xs" color={dateColor}>
        {formatDate(post.createdAt)}
      </Text>
    </LinkBox>
  )
}
