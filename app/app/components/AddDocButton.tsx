"use client"
import { Button } from '@/components/ui/button'
import { createRoom } from '@/lib/room_actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const AddDocButton = ({userId,email}:AddDocumentBtnProps) => {
   
    const router=useRouter();
    const btnhandler=async()=>{
        try {
            const room=await createRoom({userId,email})
            if(room){
                console.log(room)
                router.push(`/documents/${room.id}`)
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Button type='submit' onClick={btnhandler} className='gradient-blue flex gap-1 shadow-md'>
        <Image src="/assets/icons/add.svg" alt='add' width={24} height={24}/>
        <p className="hidden sm:block">Start a Blank Document</p>
    </Button>
  )
}

export default AddDocButton