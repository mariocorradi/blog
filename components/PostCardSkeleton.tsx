'use client'

import { Box, Skeleton, SkeletonText, useColorModeValue } from '@chakra-ui/react'

export default function PostCardSkeleton() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
    >
      {/* Category badge skeleton */}
      <Skeleton height="20px" width="60px" borderRadius="full" mb={3} />

      {/* Title skeleton */}
      <Skeleton height="24px" width="85%" mb={2} />

      {/* Excerpt skeleton */}
      <SkeletonText mt={4} noOfLines={2} spacing={3} skeletonHeight="14px" />

      {/* Date skeleton */}
      <Skeleton height="12px" width="100px" mt={4} />
    </Box>
  )
}
