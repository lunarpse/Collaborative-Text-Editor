import { useOthers } from '@liveblocks/react/suspense'
import Image from 'next/image';
import React from 'react'

const Activecollaboratorslist = () => {
    const others=useOthers();
    const collaborators=others.map((other)=>other.info)
  return (
   <ul className="collaborators-list">
    {collaborators.map(collaborator=>(
        <li key={collaborator.id}>
            <Image src={collaborator.avatar} alt={collaborator.name} width={100} height={100}
            className="inline0block size-8 rounded-full ring-2 ring-dark-100"
            style={{border:`3px solid ${collaborator.color}`}}
            />
            
        </li>
    ))}
   </ul>
  )
}

export default Activecollaboratorslist