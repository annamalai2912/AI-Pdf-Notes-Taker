import { 
  AlignCenter, AlignJustifyIcon, AlignLeft, AlignRight, Bold, Code2, 
  Heading1Icon, Heading2Icon, Highlighter, Italic, List, ListOrdered, Redo2, 
  Sparkles, UnderlineIcon, Undo2,DownloadIcon,
  ListChecksIcon
} from 'lucide-react';
import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { chatSession } from '@/configs/AIModel';
import { toast } from "sonner";
import { useUser } from '@clerk/nextjs';
import html2pdf from 'html2pdf.js';

function EditorExtensions({ editor }) {
  const { fileId } = useParams();
  const SearchAI = useAction(api.myAction.search);
  const { user } = useUser();
  const saveNotes = useMutation(api.notes.AddNotes);

  const onAiClick = async () => {
    toast("AI is generating your answer...");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );

    const result = await SearchAI({
      query: selectedText,
      fileId: fileId,
    });
    const UnformattedAns = JSON.parse(result);
    let AllUnformattedAns = '';
    UnformattedAns && UnformattedAns.forEach(item => {
      AllUnformattedAns = AllUnformattedAns + item.pageContent;
    });
    const PROMPT = "For question :" + selectedText + " and with the given content as answer," +
      "please give appropriate answer in HTML format. The answer content is :" + AllUnformattedAns;

    const AiModelResult = await chatSession.sendMessage(PROMPT);
    const FinalAns = AiModelResult.response.text().replace("```", '').replace('html', '').replace('```', '');

    const AllText = editor.getHTML();
    editor.commands.setContent(AllText + '<p> <strong>Answer: </strong>' + FinalAns + '</p>');

    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress
    });
  };

  const downloadPDF = () => {
    const element = document.createElement("div");
    element.style.textAlign = 'justify';
    element.innerHTML = editor.getHTML();
    html2pdf()
      .from(element)
      .save('document.pdf');
  };

  return editor && (
    <div className='p-5'>
      <div className="control-group">
        <div className="button-group flex gap-3">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'text-blue-500' : ''}>
            <Bold />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'text-blue-500' : ''}>
            <Italic />
          </button>
          
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive({ level: 1 }) ? 'is-active' : ''}>
            <Heading1Icon />
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive({ level: 2 }) ? 'is-active' : ''}>
            <Heading2Icon />
          </button>
          <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'text-yellow-500' : ''}>
            <Highlighter />
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'text-blue-500' : ''}>
            <List />
          </button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'text-blue-500' : ''}>
            <ListOrdered />
          </button>
          <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={editor.isActive('taskList') ? 'text-blue-500' : ''}>
            <ListChecksIcon />
          </button>
          <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo2 />
          </button>
          <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo2 />
          </button>
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>
            <Code2 />
          </button>
          <button onClick={() => onAiClick()} className={'hover:text-blue-500'}>
            <Sparkles />
          </button>
          <button onClick={downloadPDF} className='hover:text-green-500'>
            <DownloadIcon/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorExtensions;
