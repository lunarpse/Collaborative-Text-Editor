import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import { SignedIn, UserButton } from "@clerk/nextjs";
import AddDocButton from "../components/AddDocButton";
import { getrooms } from "@/lib/room_actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import Deletemodal from "../components/Deletemodal";
import Notifications from "../components/Notifications";

export default async function Home() {
  const clerkuser=await currentUser();

  if(!clerkuser){
    redirect("/sign-in")
  }
  const documents=await getrooms({email:clerkuser.emailAddresses[0].emailAddress as string})
 
  return (
    <>
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications/>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </div>
      </Header>
      {documents.data.length>0?(
        <div className="document-list-container">
        <div className="document-list-title">
          <h3 className="text-28-semibold">All Documents</h3>
          <AddDocButton 
           userId={clerkuser.id}
           email={clerkuser.emailAddresses[0].emailAddress}
           />
        </div>
        <ul className="document-ul">
          {documents.data.map((doc:any)=>(
            <li className="document-list-item">
              <Link className="flex flex-1 items-center gap-4" href={`/documents/${doc.id}`}>
              <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                <Image src="/assets/icons/doc.svg" alt="file" width={40} height={40}/>
              </div>
              <div className="space-y-1">
                <p className="line-clamp-1 text-lg">{doc.metadata.title}</p>
                <p className="text-sm font-light text-blue-100">Created At {dateConverter(doc.createdAt)}</p>
              </div>
              </Link>
              <Deletemodal roomId={doc.id}/>
            </li>
          ))}
        </ul>
        </div>
      ):(
        <div className="document-list-empty">
          <Image src="/assets/icons/doc.svg" alt="docs" width={40} height={40} className="mx-auto"/>
           <AddDocButton 
           userId={clerkuser.id}
           email={clerkuser.emailAddresses[0].emailAddress}
           />
        </div>
      )}
    </main>
    </>
   
  );
}
