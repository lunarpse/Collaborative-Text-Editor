"use client"
import { ClientSideSuspense, RoomProvider, useRedo } from '@liveblocks/react'
import React, { useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import Header from './Header'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { Editor } from './editor/Editor'
import Activecollaboratorslist from './Activecollaboratorslist'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { updateroom } from '@/lib/room_actions'
import ShareModal from './ShareModal'

const CollaborativeRoom = ({users, roomId,metadata,currentUserType}:{users:any,roomId:string,metadata:RoomMetadata,currentUserType:UserType}) => {
    console.log(roomId)
    console.log(users)
    const currentusertype=currentUserType;
    const [editing,setediting]=useState(false)
    const [loading,setloading]=useState(false)
    const [doctitle,setdoctitle]=useState(metadata.title)
    const containeref=useRef<HTMLDivElement>(null);
    const inputref=useRef<HTMLInputElement>(null);
    const updatetitlehandler=async(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key=='Enter')
        {    setloading(true)
        try {
            
            const updatedroom=await updateroom({roomId,title:doctitle})
            if(!updatedroom){
                setediting(false)
            }
            console.log(updatedroom)
        } catch (error) {
            console.log(error)
        }
        setloading(false)}
    }
    useEffect(()=>{
        const handleclickoutside=(e:MouseEvent)=>{
            if(containeref.current && !containeref.current.contains(e.target as Node)){
                setediting(false)
                updateroom({roomId,title:doctitle})
            }
        }
        document.addEventListener("mousedown",handleclickoutside)
        return ()=>{
            document.removeEventListener("mousedown",handleclickoutside)
        }
    },[])

    useEffect(()=>{
        if (editing && inputref.current){
            inputref.current.focus()
        }
    },[editing])
    
  return (
    <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader/>}>
            <Header>
                <div ref={containeref} className="flex w-fit justify-center gap-2 items-center">
                    
                        {editing && !loading ?(
                            <Input
                            type='text'
                            value={doctitle}
                            ref={inputref}
                            placeholder='Enter Title'
                            onChange={e=>setdoctitle(e.target.value)}
                            onKeyDown={updatetitlehandler}
                            className='document-title-input'
                            disabled={!editing}

                            />
                        ):(
                            <p className="document-title">{doctitle}</p>
                            
                        )}
                    

                    {currentusertype=="editor" && !editing && (
                        <Image src="/assets/icons/edit.svg" alt="edit"
                        width={24}
                        height={24}
                        className="pointer"
                        onClick={()=>setediting(true)}
                        />
                    )}
                    {currentusertype!=='editor' && (
                        <p className="view-only-tag">View Only</p>
                    )}
                    {loading &&  <p className="text-sm text-gray-400">Saving....</p>
                    }
                </div>
                    <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                        <Activecollaboratorslist/>
                    <ShareModal roomId={roomId} currentUserType={currentusertype} collaborators={users} creatorId={metadata.creatorId}/>
                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton/>
                    </SignedOut>
                    </div>
                


            </Header>
            <Editor roomId={roomId} currentUserType={currentusertype} />
        </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom