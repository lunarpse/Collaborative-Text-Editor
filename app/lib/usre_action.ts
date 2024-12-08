"use server"
import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "./utils"

export const getclerkusrs=async({userIds}:{userIds:string[]})=>{
    try {
        const {data}=await (await clerkClient()).users.getUserList({
            emailAddress:userIds
        })
        console.log("lllllll")
        console.log(data)

        const users=data.map(user=>({
            id:user.id,
            name:`${user.firstName} ${user.lastName}`,
            email:user.emailAddresses[0].emailAddress,
            avatar:user.imageUrl
        }))

        const sortedusers=userIds.map(email=>users.find(user=>user.email===email))
        return parseStringify(sortedusers)
    } catch (error) {
        console.log(error)
    }
}