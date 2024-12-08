import CollaborativeRoom from '@/app/components/CollaborativeRoom'
import { Editor } from '@/app/components/editor/Editor'
import { getroom } from '@/lib/room_actions'
import { getclerkusrs } from '@/lib/usre_action'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const DocumentPage = async({params}:{params:{id:string}}) => {

  const clerkuser=await currentUser();
  if(!clerkuser){redirect("/sign-in")}
  const room=await getroom({roomId:params.id,userId:clerkuser.emailAddresses[0].emailAddress})
  console.log(room)
  if(!room){
    redirect('/')
  }
  const userids=Object.keys(room.usersAccesses)

  const users=await getclerkusrs({userIds:userids})
 
  const userdata=users.map((user:User)=>({
    ...user,
    userType:room.usersAccesses[user.email].includes('room:write')?'editor':'viewer'                                                       
  }))
 
  const currentusertype=room.usersAccesses[clerkuser.emailAddresses[0].emailAddress].includes('room:write')?'editor':'viewer';
 
  return (
    <div>
        <CollaborativeRoom users={userdata}  roomId={room.id} metadata={room.metadata} currentUserType={currentusertype}/>
    </div>
  )
}

export default DocumentPage