import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/mantine/style.css';
import { useState, useEffect } from 'react';
import { MediaManager } from './MediaManager';

interface EditorProps {
  initialContent?: any;
  onChange?: (content: any) => void;
}

export function Editor({ initialContent, onChange }: EditorProps) {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  const activeEditor = useCreateBlockNote({
    initialContent: initialContent ? (Array.isArray(initialContent) ? initialContent : []) : undefined,
    uploadFile: async (file) => {
      // Return a dummy URL or handle upload
      // Ideally we use our upload mutation here but we are outside React context for hooks if not careful
      // For now let's just use a placeholder to trigger the media manager for image blocks?
      // BlockNote has its own file handler. 
      // We will override the slash command for image to open our manager.
      return URL.createObjectURL(file);
    },
  });

  useEffect(() => {
    if (activeEditor) {
      setEditor(activeEditor);
      
      // Subscribe to changes
      activeEditor.onChange((editor) => {
        onChange?.(editor.document);
      });
    }
  }, [activeEditor, onChange]);

  const insertImage = (url: string, alt: string) => {
    if (editor) {
      editor.insertBlocks(
        [
          {
            type: 'image',
            props: {
              url,
              name: alt,
              previewWidth: 512,
            },
          },
        ],
        editor.getTextCursorPosition().block,
        'after'
      );
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg min-h-[400px] bg-white relative group">
      <div className="p-4">
        <BlockNoteView editor={activeEditor} theme="light" />
      </div>

      {/* Custom Floating Toolbar trigger or similar could go here */}
      
      {/* Media Manager for inserting images */}
      <MediaManager
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={(item) => insertImage(item.url, item.altText || '')}
      />
      
      {/* 
        To fully integrate "Insert Image" button from the custom toolbar, 
        we need a way to pass the "open media manager" signal to this component 
        or lift the state up. For now, let's keep it simple: 
        The toolbar will be part of BlockNote default or we customize it later. 
        Actually, let's add a custom button in the UI above the editor to "Insert Image" 
        since customizing BlockNote toolbar requires deep dive.
      */}
      <button
        onClick={() => setIsMediaOpen(true)}
        className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 p-2 rounded text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Insert Image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
      </button>
    </div>
  );
}
