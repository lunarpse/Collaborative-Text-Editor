import Image from 'next/image';
import React, { useState } from 'react'
import Usertypeselector from './Usertypeselector';
import { Button } from '@/components/ui/button';
import { removeroomuser, updateroomaccess } from '@/lib/room_actions';

const Collaborator = ({ roomId, creatorId, collaborator, email, user }: CollaboratorProps) => {
  const [usertype,setusertype]=useState(collaborator.userType || 'viewer')
  const [loading,setloading]=useState(false)
  const shareroomhandler=async(type:string)=>{
   setloading(true)
   await updateroomaccess({ 
    roomId, 
    email, 
    userType: type as UserType, 
    updatedBy: user 
  });
   setloading(false)

  };
  const removeroomhandler=async(email:string)=>{
    setloading(true)
    await removeroomuser({roomId,email})
    setloading(false)
  }

    return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        <Image 
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
         <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && 'updating...'}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
        </div>
        {creatorId===collaborator.id?(
            <p className="text-sm text-blue-100">Owner</p>
        ):(
            <div className="flex items-center">
                <Usertypeselector

                userType={collaborator.userType as UserType}
                setUserType={setusertype || 'viewer'}
                onClickHandler={shareroomhandler}
                />
                 <Button type="button" onClick={() => removeroomhandler(collaborator.email)}>
            Remove
          </Button>
            </div>
        )}
        </li>

  )
}

export default Collaborator