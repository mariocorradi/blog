'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Center,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState, useEffect, use } from 'react'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import PostCardSkeleton from '@/components/PostCardSkeleton'
import { getPosts, getCategories } from '@/lib/data'
import CategoryFilter from '@/components/CategoryFilter'
import { Post } from '@/types'

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = use(searchParams)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{ posts: Post[], categories: string[] }>({ posts: [], categories: [] })

  // Dark mode colors
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const headingColor = useColorModeValue('gray.900', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  useEffect(() => {
    setMounted(true)

    const loadData = async () => {
      const allPosts = await getPosts()
      const categories = await getCategories()
      setData({ posts: allPosts, categories })
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (!mounted) {
    return (
      <Center h="100vh" bg={bgColor}>
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  const selectedCategory = params?.category
  const filteredPosts = selectedCategory
    ? data.posts.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    : data.posts

  return (
    <Box minH="100vh" bg={bgColor} transition="background-color 0.2s">
      <Navbar />

      <Container maxW="container.lg" py={12}>
        <Box textAlign="center" mb={12}>
          <Heading
            size="2xl"
            fontWeight="700"
            mb={4}
            letterSpacing="-0.03em"
            color={headingColor}
            transition="color 0.2s"
          >
            Welcome
          </Heading>
          <Text color={textColor} fontSize="lg" maxW="md" mx="auto" transition="color 0.2s">
            Thoughts, stories, and ideas from my life.
          </Text>
        </Box>

        <CategoryFilter
          categories={data.categories}
          selectedCategory={selectedCategory}
        />

        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {[1, 2, 3, 4].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </SimpleGrid>
        ) : filteredPosts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12}>
            <Text color={textColor}>No posts found.</Text>
          </Box>
        )}
      </Container>
    </Box>
  )
}
