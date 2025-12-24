'use client'

import { HStack, Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory?: string
}

export default function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter()

  const handleCategoryClick = (category?: string) => {
    if (category) {
      router.push(`/?category=${encodeURIComponent(category)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <HStack spacing={2} mb={8} flexWrap="wrap" justify="center">
      <Button
        size="sm"
        variant={!selectedCategory ? 'solid' : 'ghost'}
        colorScheme={!selectedCategory ? 'gray' : undefined}
        onClick={() => handleCategoryClick()}
        borderRadius="full"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          size="sm"
          variant={selectedCategory === category ? 'solid' : 'ghost'}
          colorScheme={selectedCategory === category ? 'gray' : undefined}
          onClick={() => handleCategoryClick(category)}
          borderRadius="full"
        >
          {category}
        </Button>
      ))}
    </HStack>
  )
}
