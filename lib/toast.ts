import { UseToastOptions } from '@chakra-ui/react'

type ToastFunction = (options: UseToastOptions) => void

const defaultOptions: Partial<UseToastOptions> = {
  duration: 3000,
  isClosable: true,
  position: 'bottom-right',
}

export const showSuccessToast = (
  toast: ToastFunction,
  title: string,
  description?: string
) => {
  toast({
    ...defaultOptions,
    title,
    description,
    status: 'success',
  })
}

export const showErrorToast = (
  toast: ToastFunction,
  title: string,
  description?: string
) => {
  toast({
    ...defaultOptions,
    title,
    description,
    status: 'error',
    duration: 5000, // Errors stay longer
  })
}

export const showWarningToast = (
  toast: ToastFunction,
  title: string,
  description?: string
) => {
  toast({
    ...defaultOptions,
    title,
    description,
    status: 'warning',
  })
}

export const showInfoToast = (
  toast: ToastFunction,
  title: string,
  description?: string
) => {
  toast({
    ...defaultOptions,
    title,
    description,
    status: 'info',
  })
}
