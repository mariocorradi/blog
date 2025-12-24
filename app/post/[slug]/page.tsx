import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  Button,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import DOMPurify from 'isomorphic-dompurify'
import Navbar from '@/components/Navbar'
import { getPost, getPosts } from '@/lib/data'
import { FiArrowLeft } from 'react-icons/fi'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

// Pre-render paths for better performance (Static Site Generation)
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  // Format date safely for the server-render phase
  const dateString = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Box minH="100vh" bg="white">
      <Navbar />

      <Container maxW="container.md" py={12}>
        {/* Fixed: Wrapped Button in Link instead of passing function via 'as' prop */}
        <NextLink href="/" style={{ textDecoration: 'none' }}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<FiArrowLeft />}
            mb={8}
            color="gray.600"
            _hover={{ color: 'gray.900', bg: 'gray.100' }}
          >
            Back to posts
          </Button>
        </NextLink>

        {/* Post Header */}
        <Box mb={8}>
          <Badge
            colorScheme="gray"
            fontSize="xs"
            fontWeight="500"
            mb={4}
            px={2}
            py={0.5}
            borderRadius="full"
          >
            {post.category}
          </Badge>

          <Heading
            size="2xl"
            fontWeight="700"
            mb={4}
            letterSpacing="-0.03em"
            lineHeight="1.2"
            color="gray.900"
          >
            {post.title}
          </Heading>

          {/* suppressHydrationWarning prevents errors if user/server locales differ */}
          <Text fontSize="sm" color="gray.500" suppressHydrationWarning>
            {dateString}
          </Text>
        </Box>

        {/* Post Content with Styled Prose */}
        <Box
          className="prose"
          sx={{
            'p': {
              color: 'gray.700',
              lineHeight: '1.8',
              mb: 4,
              fontSize: 'md',
            },
            'h2': {
              fontWeight: '600',
              fontSize: 'xl',
              mt: 8,
              mb: 4,
              color: 'gray.900',
            },
            'h3': {
              fontWeight: '600',
              fontSize: 'lg',
              mt: 6,
              mb: 3,
              color: 'gray.900',
            },
            'ul, ol': {
              pl: 6,
              mb: 4,
              color: 'gray.700',
            },
            'li': {
              mb: 2,
            },
            'strong': {
              fontWeight: '600',
              color: 'gray.900',
            },
            'blockquote': {
              borderLeft: '4px solid',
              borderColor: 'gray.200',
              pl: 4,
              py: 1,
              my: 4,
              fontStyle: 'italic',
              color: 'gray.600',
            },
            'a': {
              color: 'blue.600',
              textDecoration: 'underline',
            }
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
      </Container>
    </Box>
  )
}
