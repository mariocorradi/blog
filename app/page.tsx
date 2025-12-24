'use client' // 1. Must be a client component for 'mounted' logic

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Center,
  Spinner
} from '@chakra-ui/react'
import { useState, useEffect, use } from 'react'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import { getPosts, getCategories } from '@/lib/data'
import CategoryFilter from '@/components/CategoryFilter'
import { Post } from '@/types'

export default function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = use(searchParams)
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<{ posts: Post[], categories: string[] }>({ posts: [], categories: [] })

  // Handle the "Mounted" state
  useEffect(() => {
    setMounted(true)

    // Load data once mounted
    const loadData = async () => {
      const allPosts = await getPosts()
      const categories = await getCategories()
      setData({ posts: allPosts, categories })
    }
    loadData()
  }, [])

  if (!mounted) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  // Logic for filtering
  const selectedCategory = params?.category
  const filteredPosts = selectedCategory
    ? data.posts.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    : data.posts

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />

      <Container maxW="container.lg" py={12}>
        <Box textAlign="center" mb={12}>
          <Heading
            size="2xl"
            fontWeight="700"
            mb={4}
            letterSpacing="-0.03em"
            color="gray.900"
          >
            Welcome
          </Heading>
          <Text color="gray.600" fontSize="lg" maxW="md" mx="auto">
            Thoughts, stories, and ideas from my life.
          </Text>
        </Box>

        <CategoryFilter
          categories={data.categories}
          selectedCategory={selectedCategory}
        />

        {filteredPosts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12}>
            <Text color="gray.500">No posts found.</Text>
          </Box>
        )}
      </Container>
    </Box>
  )
}
