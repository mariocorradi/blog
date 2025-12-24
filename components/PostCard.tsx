'use client'

import {
  Box,
  Heading,
  Text,
  Badge,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Post } from '@/types'

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
  return (
    <LinkBox
      as="article"
      p={6}
      bg="white"
      borderRadius="lg"
      border="1px"
      borderColor="gray.100"
      transition="all 0.2s"
      _hover={{
        borderColor: 'gray.200',
        shadow: 'sm',
      }}
    >
      <Badge
        colorScheme="gray"
        fontSize="xs"
        fontWeight="500"
        mb={3}
        px={2}
        py={0.5}
        borderRadius="full"
      >
        {post.category}
      </Badge>

      <Heading size="md" mb={2} fontWeight="600" lineHeight="1.3">
        <LinkOverlay as={NextLink} href={`/post/${post.slug}`}>
          {post.title}
        </LinkOverlay>
      </Heading>

      <Text color="gray.600" fontSize="sm" mb={4} lineHeight="1.6">
        {getExcerpt(post.content)}
      </Text>

      <Text fontSize="xs" color="gray.400">
        {formatDate(post.createdAt)}
      </Text>
    </LinkBox>
  )
}
