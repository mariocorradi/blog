'use client'

import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import type { StyleFunctionProps } from '@chakra-ui/styled-system'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  fonts: {
    heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  colors: {
    brand: {
      50: '#f7f7f7',
      100: '#e3e3e3',
      200: '#c8c8c8',
      300: '#a4a4a4',
      400: '#818181',
      500: '#666666',
      600: '#515151',
      700: '#434343',
      800: '#383838',
      900: '#1a1a1a',
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        bg: mode('white', 'gray.900')(props),
        color: mode('gray.800', 'gray.100')(props),
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
      },
      '*': {
        borderColor: mode('gray.200', 'gray.700')(props),
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'gray',
      },
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}
