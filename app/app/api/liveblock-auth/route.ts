import { liveblocks } from "@/lib/liveblock";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request:Request){
    const clerkuser=await currentUser();
    if(!clerkuser){
        redirect("/sign-in")
    }
    const {id,firstName,lastName,emailAddresses,imageUrl}=await clerkuser;
    const user={
        id,
        info:{
            id,
            name:`${firstName} ${lastName}`,
            email:emailAddresses[0].emailAddress,
            avatar:imageUrl,
            color:getUserColor(id)
        }
    }
    const {status,body}=await liveblocks.identifyUser(
        {
            userId:user.id,
            groupIds:[]
        },
        {userInfo:user.info}
    )

    return new Response(body,{status})
}