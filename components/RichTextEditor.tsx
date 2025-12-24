'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Box, HStack, IconButton, Divider } from '@chakra-ui/react'
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
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  if (!editor) {
    return null
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
    <Box border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
      {/* Toolbar */}
      <Box
        borderBottom="1px"
        borderColor="gray.200"
        p={2}
        bg="gray.50"
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
              borderColor: 'gray.300',
              pl: 4,
              py: 1,
              my: 4,
              fontStyle: 'italic',
              color: 'gray.600',
            },
            '& code': {
              bg: 'gray.100',
              px: 1,
              borderRadius: 'sm',
              fontFamily: 'mono',
              fontSize: 'sm',
            },
            '& a': {
              color: 'blue.600',
              textDecoration: 'underline',
            },
            '& .is-editor-empty:first-child::before': {
              content: 'attr(data-placeholder)',
              color: 'gray.400',
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
