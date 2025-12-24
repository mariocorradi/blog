'use client'

import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Box,
  HStack,
  IconButton,
  Divider,
  Skeleton,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  FiBold,
  FiItalic,
  FiList,
  FiLink,
  FiCode,
} from 'react-icons/fi'
import {
  LuHeading1,
  LuHeading2,
  LuListOrdered,
  LuQuote,
  LuUndo,
  LuRedo,
} from 'react-icons/lu'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
}: RichTextEditorProps) {
  const hasInitializedContent = useRef(false)

  // Dark mode colors
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const bgColor = useColorModeValue('white', 'gray.800')
  const toolbarBg = useColorModeValue('gray.50', 'gray.700')
  const blockquoteColor = useColorModeValue('gray.600', 'gray.400')
  const codeBg = useColorModeValue('gray.100', 'gray.700')
  const placeholderColor = useColorModeValue('gray.400', 'gray.500')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  // Sync content when prop changes (for edit mode)
  // Use ref to prevent infinite loops and handle async loading
  useEffect(() => {
    if (editor && content) {
      // Only set content if it's different and we haven't initialized yet,
      // OR if content changed after initialization (e.g., async load)
      const currentContent = editor.getHTML()
      if (content !== currentContent && content !== '<p></p>') {
        editor.commands.setContent(content)
        hasInitializedContent.current = true
      }
    }
  }, [editor, content])

  // Reset ref when editor changes (unmount/remount)
  useEffect(() => {
    return () => {
      hasInitializedContent.current = false
    }
  }, [])

  if (!editor) {
    return (
      <Box border="1px" borderColor={borderColor} borderRadius="lg" bg={bgColor}>
        <Box borderBottom="1px" borderColor={borderColor} p={2} bg={toolbarBg} borderTopRadius="lg">
          <Skeleton height="32px" width="300px" />
        </Box>
        <Box p={4}>
          <Skeleton height="20px" mb={3} />
          <Skeleton height="20px" mb={3} width="80%" />
          <Skeleton height="20px" width="60%" />
        </Box>
      </Box>
    )
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <Box border="1px" borderColor={borderColor} borderRadius="lg" bg={bgColor} transition="all 0.2s">
      {/* Toolbar */}
      <Box
        borderBottom="1px"
        borderColor={borderColor}
        p={2}
        bg={toolbarBg}
        borderTopRadius="lg"
      >
        <HStack spacing={1} flexWrap="wrap">
          <IconButton
            aria-label="Bold"
            icon={<FiBold />}
            size="sm"
            variant={editor.isActive('bold') ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <IconButton
            aria-label="Italic"
            icon={<FiItalic />}
            size="sm"
            variant={editor.isActive('italic') ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />

          <Divider orientation="vertical" h="24px" mx={1} />

          <IconButton
            aria-label="Heading 1"
            icon={<LuHeading1 />}
            size="sm"
            variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'ghost'}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          />
          <IconButton
            aria-label="Heading 2"
            icon={<LuHeading2 />}
            size="sm"
            variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          />

          <Divider orientation="vertical" h="24px" mx={1} />

          <IconButton
            aria-label="Bullet List"
            icon={<FiList />}
            size="sm"
            variant={editor.isActive('bulletList') ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <IconButton
            aria-label="Ordered List"
            icon={<LuListOrdered />}
            size="sm"
            variant={editor.isActive('orderedList') ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />

          <Divider orientation="vertical" h="24px" mx={1} />

          <IconButton
            aria-label="Quote"
            icon={<LuQuote />}
            size="sm"
            variant={editor.isActive('blockquote') ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <IconButton
            aria-label="Code"
            icon={<FiCode />}
            size="sm"
            variant={editor.isActive('code') ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <IconButton
            aria-label="Link"
            icon={<FiLink />}
            size="sm"
            variant={editor.isActive('link') ? 'solid' : 'ghost'}
            onClick={setLink}
          />

          <Divider orientation="vertical" h="24px" mx={1} />

          <IconButton
            aria-label="Undo"
            icon={<LuUndo />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            isDisabled={!editor.can().undo()}
          />
          <IconButton
            aria-label="Redo"
            icon={<LuRedo />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            isDisabled={!editor.can().redo()}
          />
        </HStack>
      </Box>

      {/* Editor */}
      <Box
        sx={{
          '.ProseMirror': {
            minH: '300px',
            padding: 4,
            '&:focus': {
              outline: 'none',
            },
            '& p': {
              mb: 3,
              lineHeight: '1.7',
            },
            '& h1': {
              fontSize: '2xl',
              fontWeight: 'bold',
              mt: 6,
              mb: 3,
            },
            '& h2': {
              fontSize: 'xl',
              fontWeight: 'bold',
              mt: 5,
              mb: 2,
            },
            '& ul, & ol': {
              pl: 6,
              mb: 3,
            },
            '& li': {
              mb: 1,
            },
            '& blockquote': {
              borderLeft: '3px solid',
              borderColor: borderColor,
              pl: 4,
              py: 1,
              my: 4,
              fontStyle: 'italic',
              color: blockquoteColor,
            },
            '& code': {
              bg: codeBg,
              px: 1,
              borderRadius: 'sm',
              fontFamily: 'mono',
              fontSize: 'sm',
            },
            '& a': {
              color: 'blue.500',
              textDecoration: 'underline',
            },
            '& .is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              color: placeholderColor,
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}
