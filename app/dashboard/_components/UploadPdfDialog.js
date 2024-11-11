'use client'
import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import {api} from '@/convex/_generated/api'
import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'

import { Input } from '@/components/ui/input'
import { useAction, useMutation } from 'convex/react'
import { Loader2Icon } from 'lucide-react'
import axios from 'axios'
import { ingest } from '@/convex/myAction';



function UploadPdfDialog({children,isMaxFile}) {

  const generateUploadUrl=useMutation(api.fileStorage.generateUploadUrl)
  const addFileEntry=useMutation(api.fileStorage.AddFileEntryToDb)
  const[file,setFile]=useState();
  const getFileUrl=useMutation(api.fileStorage.getFileUrl);
  const {user}=useUser();
  const embeddDocument=useAction(api.myAction.ingest);
  const [loading,setLoading]=useState(false)
  const[fileName,setFileName]=useState();
  const[open,setOpen]=useState(false);
  
  const onFileSelect=(event)=>{
    setFile(event.target.files[0])
    


  }
  const OnUpload=async()=>{
    setLoading(true);
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,

    });
    const { storageId } = await result.json();
    console.log('StorageId',storageId);
    const fileId=uuidv4();
    const fileUrl=await getFileUrl({storageId:storageId})
      const resp=await addFileEntry({
        fileId:fileId,
        fileName:fileName??'Untitled',
        fileUrl:fileUrl,
        storageId:storageId,
        createdBy:user?.primaryEmailAddress?.emailAddress
      })
      console.log(resp)

      const ApiResp=await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
      console.log(ApiResp.data.result);
      await embeddDocument({
        splitText:ApiResp.data.result,
        fileId:fileId,
        
      });
      //console.log(embeddedresult);*/
      setLoading(false);
      setOpen(false);

  }
  return (
    <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick={()=>setOpen(true)} disabled={isMaxFile} className="w-full">+ Upload Pdf</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload Pdf File</DialogTitle>
      <DialogDescription asChild>
        <div className=''>
        
            <h2 className='mt-5'>Select File To Upload</h2>
            <div className=' p-3 gap-2 rounded-md border '>
              <input type="file" accept='application/pdf'
              onChange={(event)=>onFileSelect(event)}/>
            </div>
          <div className='mt-2'>
            <label>File Name *</label>
            <Input placeholder='File Name' onChange={(e)=>setFileName(e.target.value)}/>
          </div>
          
        </div>

      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {
              loading?
                 <Loader2Icon className='animate-spin'/>:'Upload'
            }
            </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>

  )
}

export default UploadPdfDialog