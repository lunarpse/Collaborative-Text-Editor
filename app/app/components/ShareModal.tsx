'use client'
import { useSelf } from '@liveblocks/react/suspense'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Usertypeselector from './Usertypeselector'
import Collaborator from './Collaborator'
import { updateroomaccess } from '@/lib/room_actions'

  
const ShareModal = ({roomId,collaborators,creatorId,currentUserType}:ShareDocumentDialogProps) => {
  const [loading,setloading]=useState(false)
  const [open,setopen]=useState(false)
  const [email,setemail]=useState('')
  const user=useSelf();
  const [usertype,setusertpe]=useState<UserType>('viewer')
  const sharedochandler=async()=>{
  console.log("hereeeeeeeee")
    setloading(true)
    await updateroomaccess({ 
     roomId, 
     email, 
     userType: usertype as UserType, 
     updatedBy:user.info
   });
    setloading(false)
  }
    return (
    <Dialog open={open} onOpenChange={setopen}>
        <DialogTrigger>
            <Button className="gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType!=='editor'}>
                <Image src="/assets/icons/share.svg" alt='share' className='min-w-4 md:size-5' width={20} height={20} />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>Select which users can view and edit this document</DialogDescription>
          </DialogHeader>
          <Label  htmlFor='email' className="mt-6 text-blue-100">Email Address</Label>
          <div className="flex items-center gap-3">
            <div className="flex flex-1 rounded-md bg-dark-400">
                <Input className="share-input" id='email' value={email} placeholder='Enter email' onChange={e=>setemail(e.target.value)} />
                <Usertypeselector userType={usertype} setUserType={setusertpe}  />
            </div>
            <Button type='submit' onClick={sharedochandler} className='gradient-blue flex h-full gap-1 px-5' disabled={loading}>
                {loading ?'Sending...':'Invite'}
            </Button>
          </div>
          <div className="my-2 space-y-2">
            <ul className="flex flex-col">
                {collaborators.map(collaborator=>(
                    <Collaborator
                    key={collaborator.id}
                    roomId={roomId}
                    creatorId={creatorId}
                    email={collaborator.email}
                    user={user.info}
                    collaborator={collaborator}
                    />
                ))}
            </ul>
          </div>
           
           
        </DialogContent>
    </Dialog>
  )
}

export default ShareModal