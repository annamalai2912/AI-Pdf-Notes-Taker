
'use client'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import {api} from '@/convex/_generated/api'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
function Dashboard() {

  const {user}=useUser();
  const path=usePathname()

  const fileList = useQuery(api.fileStorage.GetUserFiles,{ 
    userEmail: user?.primaryEmailAddress.emailAddress }
     
  )

  console.log(fileList);


  return (
    <div>
      <h2 className='font-bold text-3xl'>Workspace</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10'>
  {fileList?.length > 0 ? (
    fileList.map((file) => (
      <Link href={"/workspace/" + file.fileId} key={file.fileId}>
        <div className='flex p-5 shadow-md rounded-md flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all'>
          <Image src='/pdf.png' alt='pdf' width={70} height={70} />
          <h2 className='mt-3 font-medium text-lg'>{file?.fileName}</h2>
          {/*<h2>{file?._creationTime}</h2>*/}
        </div>
      </Link>
    ))
  ) : (
    [1, 2, 3, 4, 5, 6, 7].map((item) => (
      <div key={item} className='bg-slate-200 rounded-md h-[150px] animate-pulse'></div>
    ))
  )}
</div>
      
      
    </div>
  )
}

export default Dashboard