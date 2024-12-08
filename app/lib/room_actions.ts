"use server"
import {nanoid} from "nanoid";
import { liveblocks } from "./liveblock";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "./utils";
import { currentUser } from "@clerk/nextjs/server";
import { emit } from "process";
import { parse } from "path";
import { redirect } from "next/navigation";

export const createRoom=async({userId,email}:CreateDocumentParams)=>{
    const roomid=nanoid();
    try {
        const metadata={
            creatorId:userId,
            email,
            title:"Untitled"
        }

        const room=await liveblocks.createRoom(roomid,{
           metadata,
           usersAccesses:{
            [email]:['room:write']
           },
           defaultAccesses:[]
        })
        revalidatePath(`/`)
        return parseStringify(room)
    } catch (error) {
        console.log(error)
    }
}

export const getroom=async({roomId,userId}:{roomId:string,userId:string})=>{
    try {
        const room=await liveblocks.getRoom(roomId)
        console.log(room)
        const hasaccess=Object.keys(room.usersAccesses).includes(userId)
        console.log(hasaccess)
        console.log("kkkk")
        console.log('ooooooo'+hasaccess)
        console.log(room.usersAccesses)
        if(!hasaccess){
            throw new Error("you dont have acess to this room")
        }
        return parseStringify(room)
    } catch (error) {
        console.log(`Error occured while fetching room ${error}`)
    }
}

export const updateroom=async({roomId,title}:{roomId:string,title:string})=>{
    try {
        const updatedroom=await liveblocks.updateRoom(roomId,{
            metadata:{
                title
            }
        })
        revalidatePath(`/documents/${roomId}`)
        return updatedroom;
    } catch (error) {
        console.log(error)
    }
}

export const getrooms=async({email}:{email:string})=>{
    try {
        const rooms=await liveblocks.getRooms({userId:email})
        return parseStringify(rooms)
    } catch (error) {
        console.log(error)
    }
}


export const getroomusers=async({roomId,currentuser,text}:{roomId:string,currentuser:string,text:string})=>{
    try {
        const room=await liveblocks.getRoom(roomId);
        const users=Object.keys(room.usersAccesses).filter(email=>email!==currentuser)

        if(text.length){
            const lowcase=text.toLowerCase();
            const filteredusres=users.filter(email=>email.toLowerCase().includes(lowcase))
            return parseStringify(filteredusres)
        }
        return parseStringify(users)
    } catch (error) {
        console.log(error)
    }
}

export const updateroomaccess=async({roomId,email,userType,updatedBy}:ShareDocumentParams)=>{
    try {
        const usersAccesses:RoomAccesses={
            [email]:getAccessType(userType) as AccessType
        }

        const updatedroom=await liveblocks.updateRoom(roomId,{
            usersAccesses
        })

        if(updatedroom){
            const notificationid=nanoid()
            await liveblocks.triggerInboxNotification({
                userId:email,
                kind:'$documentAccess',
                subjectId:notificationid,
                activityData:{
                    userType,
                    title:`You have been granted ${userType} aceess to the room by ${updatedBy.name}`,
                    updatedBy:updatedBy.name,
                    avatar:updatedBy.name,
                    email:updatedBy.email
                },
                roomId
            })
        }


        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedroom)
    } catch (error) {
        console.log(error)
    }
}


export const removeroomuser=async({roomId,email}:{roomId:string,email:string})=>{
    try {
        const updatedroom=await liveblocks.updateRoom(roomId,{
            [email]:null
        })
        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedroom)
    } catch (error) {
        console.log(error)
    }
}


export const deleteroom=async({roomId}:{roomId:string})=>{
    try {
        await liveblocks.deleteRoom(roomId)
        revalidatePath(`/`)
        redirect('/')
    } catch (error) {
        console.log(error)
    }
}