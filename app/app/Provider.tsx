"use client";
import {ClientSideSuspense, LiveblocksProvider} from "@liveblocks/react/suspense"
import React from "react";
import Loader from "./components/Loader";
import { getclerkusrs } from "@/lib/usre_action";
import { getroomusers } from "@/lib/room_actions";
import { currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
export const Provider=({children}:{children:React.ReactNode})=>{
    const {user:clerkuser}=useUser()
    return (
        <LiveblocksProvider 
        resolveUsers={async ({userIds})=>{
            const users=await getclerkusrs({userIds});
            return users;
        }}
        resolveMentionSuggestions={async({text,roomId})=>{
            const currentuser=clerkuser?.emailAddresses[0].emailAddress!;
            const roomusers=await getroomusers({roomId,currentuser,text})
            return roomusers
        }}
        authEndpoint="/api/liveblock-auth">
            <ClientSideSuspense fallback={<Loader/>} >
            {children}
            </ClientSideSuspense>
            
        </LiveblocksProvider>
    )
}