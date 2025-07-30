import React, { useCallback } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { BoldIcon, ItalicIcon, StrikethroughIcon, QuoteIcon, ListIcon, TypeIcon, SparklesIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { creditsService } from '../../services/credits/creditsService';
import { supabase } from '../../../supabase/client';
import { toast } from 'sonner';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  contentType?: string; // informs AI endpoint about expected style (tweet, blog, etc.)
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = 'Start writing...', contentType = 'generic' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const handleAiAssist = useCallback(async () => {
    if (!editor) return;
    const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' ');

    // Charge 1 credit
    const charged = await creditsService.chargeForAI(1, 'AI writing assistance');
    if (!charged) {
      toast.error('Not enough credits');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'text-rich',
          prompt: selectedText || editor.getText(),
          contentType,
        },
      });
      if (error || data?.error) throw error || new Error(data?.error);
      const aiText = data?.content?.text || data?.content || '';
      editor.commands.insertContent(aiText);
    } catch (e: any) {
      toast.error('AI generation failed', { description: e.message || 'Unknown error' });
    }
  }, [editor, contentType]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-emerald-100 dark:bg-emerald-900' : ''}>
          <BoldIcon size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-emerald-100 dark:bg-emerald-900' : ''}>
          <ItalicIcon size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-emerald-100 dark:bg-emerald-900' : ''}>
          <StrikethroughIcon size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-emerald-100 dark:bg-emerald-900' : ''}>
          <QuoteIcon size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-emerald-100 dark:bg-emerald-900' : ''}>
          <ListIcon size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-emerald-100 dark:bg-emerald-900' : ''}>
          <TypeIcon size={14} />
        </Button>
        <div className="ml-auto" />
        <Button variant="outline" size="sm" leftIcon={<SparklesIcon size={14} />} onClick={handleAiAssist}>
          Write with AI
        </Button>
      </div>

      {/* Editor */}
      <div className="p-4">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none min-h-[200px]" />
      </div>
    </div>
  );
};

export default RichTextEditor;
