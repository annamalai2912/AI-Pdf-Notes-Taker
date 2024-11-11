import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'


function WorkspaceHeader({fileName,onSave}) {
  
  return (
    <div className='p-4 flex justify-between shadow-md'>
      <Image src={'/logo.svg'} alt='logo' width={30} height={30} />
      <h2 className='font-bold'>{fileName}</h2>
      <div className='flex gap-2 items-center'>
        <Button>Save</Button>
      
      <UserButton />

      </div>  
    </div>
  )
}

export default WorkspaceHeader