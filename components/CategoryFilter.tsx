'use client'

import { HStack, Button, useColorModeValue } from '@chakra-ui/react'
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
  const ghostHoverBg = useColorModeValue('gray.100', 'gray.700')

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
        colorScheme={!selectedCategory ? 'purple' : 'gray'}
        onClick={() => handleCategoryClick()}
        borderRadius="full"
        _hover={{ bg: !selectedCategory ? undefined : ghostHoverBg }}
        transition="all 0.2s"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          size="sm"
          variant={selectedCategory === category ? 'solid' : 'ghost'}
          colorScheme={selectedCategory === category ? 'purple' : 'gray'}
          onClick={() => handleCategoryClick(category)}
          borderRadius="full"
          _hover={{ bg: selectedCategory === category ? undefined : ghostHoverBg }}
          transition="all 0.2s"
        >
          {category}
        </Button>
      ))}
    </HStack>
  )
}
