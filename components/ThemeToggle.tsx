'use client'

import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const SwitchIcon = useColorModeValue(FiMoon, FiSun)
  const iconColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      icon={<SwitchIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      color={iconColor}
      size="sm"
      _hover={{
        bg: useColorModeValue('gray.100', 'gray.700'),
      }}
      transition="all 0.2s"
    />
  )
}
