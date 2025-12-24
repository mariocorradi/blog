'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  useToast,
  Select,
  Text,
} from '@chakra-ui/react'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import NextLink from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import RichTextEditor from '@/components/RichTextEditor'

const DEFAULT_CATEGORIES = ['Life', 'Travel', 'Food', 'Style', 'Thoughts']

export default function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async () => {
    const finalCategory = category === 'custom' ? customCategory : category

    if (!title.trim()) {
      toast({
        title: 'Title is required',
        status: 'warning',
        duration: 2000,
      })
      return
    }

    if (!finalCategory.trim()) {
      toast({
        title: 'Category is required',
        status: 'warning',
        duration: 2000,
      })
      return
    }

    if (!content.trim() || content === '<p></p>') {
      toast({
        title: 'Content is required',
        status: 'warning',
        duration: 2000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content,
          category: finalCategory.trim(),
        }),
      })

      if (response.ok) {
        toast({
          title: 'Post published!',
          status: 'success',
          duration: 2000,
        })
        router.push('/admin/dashboard')
      } else {
        throw new Error('Failed to create post')
      }
    } catch {
      toast({
        title: 'Error creating post',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <Box maxW="container.md" mx="auto">
        <HStack justify="space-between" mb={6}>
          <Button as={NextLink} href="/admin/dashboard" variant="ghost" leftIcon={<FiArrowLeft />}>
            Back
          </Button>
          <Button
            colorScheme="gray"
            leftIcon={<FiSave />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Publish
          </Button>
        </HStack>

        <Heading size="lg" mb={6} fontWeight="600">
          New Post
        </Heading>

        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel fontWeight="500">Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              size="lg"
              bg="white"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="500">Category</FormLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Select category"
              bg="white"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="custom">+ Add new category</option>
            </Select>
            {category === 'custom' && (
              <Input
                mt={2}
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter new category name"
                bg="white"
              />
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="500">Content</FormLabel>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your post here..."
            />
          </FormControl>
        </VStack>
      </Box>
    </AdminLayout>
  )
}
