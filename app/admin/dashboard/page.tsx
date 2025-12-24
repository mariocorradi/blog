'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Badge,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Spinner,
  Center,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import AdminLayout from '@/components/AdminLayout'
import { Post } from '@/types'
import { useRef } from 'react'

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(data)
      } catch {
        toast({
          title: 'Error fetching posts',
          status: 'error',
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [toast])

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post)
    onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    try {
      const response = await fetch(`/api/posts/${postToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== postToDelete.id))
        toast({
          title: 'Post deleted',
          status: 'success',
          duration: 2000,
        })
      } else {
        throw new Error('Failed to delete')
      }
    } catch {
      toast({
        title: 'Error deleting post',
        status: 'error',
        duration: 3000,
      })
    } finally {
      onClose()
      setPostToDelete(null)
    }
  }

  return (
    <AdminLayout>
      <Box>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg" fontWeight="600">
            Posts
          </Heading>
          <Button as={NextLink} href="/admin/editor" colorScheme="gray" leftIcon={<FiPlus />}>
            New Post
          </Button>
        </HStack>

        {isLoading ? (
          <Center py={12}>
            <Spinner size="lg" color="gray.400" />
          </Center>
        ) : posts.length === 0 ? (
          <Box
            textAlign="center"
            py={12}
            bg="white"
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
          >
            <Text color="gray.500" mb={4}>
              No posts yet
            </Text>
            <Button as={NextLink} href="/admin/editor" colorScheme="gray" leftIcon={<FiPlus />}>
              Create your first post
            </Button>
          </Box>
        ) : (
          <Box
            bg="white"
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
            overflow="hidden"
          >
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th>Date</Th>
                  <Th width="120px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {posts.map((post) => (
                  <Tr key={post.id} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="500">{post.title}</Td>
                    <Td>
                      <Badge colorScheme="gray" borderRadius="full">
                        {post.category}
                      </Badge>
                    </Td>
                    <Td color="gray.600" fontSize="sm">
                      {formatDate(post.createdAt)}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          as={NextLink}
                          href={`/admin/editor/${post.id}`}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                        >
                          <FiEdit2 />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteClick(post)}
                        >
                          <FiTrash2 />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete &quot;{postToDelete?.title}&quot;?
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminLayout>
  )
}
