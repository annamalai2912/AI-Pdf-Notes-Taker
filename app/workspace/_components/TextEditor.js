import React, { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import EditorExtensions from './EditorExtensions'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import Highlight from '@tiptap/extension-highlight'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import WorkspaceHeader from './WorkspaceHeader'; 
import { useMutation } from 'convex/react'
 


function TextEditor({fileId,createdBy}) {
    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId
    })

    console.log(notes)
    const addNotes = useMutation(api.notes.AddNotes);

    const editor = useEditor({
        extensions: [Document,Highlight.configure({ multicolor: true }),CodeBlock,Paragraph,Text,StarterKit,
            placeholder.configure({
                placeholder:"start taking your notes here 📝..."

            }),     
        ],
        
      })
      useEffect(()=>{
        editor&&editor.commands.setContent(notes)

      },[notes&&editor])
      
  return (
    <div>
       
        <EditorExtensions editor={editor}/>
        <div className='overflow-scroll h-[88vh]'>
            <EditorContent editor={editor} />
        </div>
        
    </div>
  )
}

export default TextEditor