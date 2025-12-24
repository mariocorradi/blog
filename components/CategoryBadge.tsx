'use client'

import { Box, useColorModeValue } from '@chakra-ui/react'

interface CategoryBadgeProps {
  category: string
  size?: 'sm' | 'md'
}

// Gradient styles for each category
const categoryGradients: Record<string, { light: string; dark: string }> = {
  life: {
    light: 'linear(to-r, purple.400, pink.400)',
    dark: 'linear(to-r, purple.300, pink.300)',
  },
  travel: {
    light: 'linear(to-r, blue.400, cyan.400)',
    dark: 'linear(to-r, blue.300, cyan.300)',
  },
  food: {
    light: 'linear(to-r, orange.400, yellow.400)',
    dark: 'linear(to-r, orange.300, yellow.300)',
  },
  style: {
    light: 'linear(to-r, pink.400, red.300)',
    dark: 'linear(to-r, pink.300, red.200)',
  },
  thoughts: {
    light: 'linear(to-r, teal.400, green.400)',
    dark: 'linear(to-r, teal.300, green.300)',
  },
  technology: {
    light: 'linear(to-r, blue.500, purple.500)',
    dark: 'linear(to-r, blue.400, purple.400)',
  },
  default: {
    light: 'linear(to-r, gray.400, gray.500)',
    dark: 'linear(to-r, gray.500, gray.600)',
  },
}

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const colorMode = useColorModeValue('light', 'dark')
  const normalizedCategory = category.toLowerCase()
  const gradients = categoryGradients[normalizedCategory] || categoryGradients.default

  const sizeStyles = {
    sm: {
      fontSize: 'xs',
      px: 2.5,
      py: 0.5,
    },
    md: {
      fontSize: 'sm',
      px: 3,
      py: 1,
    },
  }

  return (
    <Box
      as="span"
      display="inline-block"
      bgGradient={gradients[colorMode]}
      color="white"
      fontWeight="600"
      borderRadius="full"
      textTransform="capitalize"
      letterSpacing="0.02em"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-1px)',
        boxShadow: 'md',
      }}
      {...sizeStyles[size]}
    >
      {category}
    </Box>
  )
}
