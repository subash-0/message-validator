"use client"
import Link from "next/link"
import { useSession, signOut} from "next-auth/react"

import { Button } from "./ui/button"
import { LogOut, MessageSquare } from "lucide-react"




const Navbar = () => {
  const {data:session} = useSession();

 

  return (
    <nav className="p-4 md:p-6 shadow-md min-w-screen top-0 shadow-blue-100 border-b z-50 bg-white">
      <div className="container mx-auto flex  md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8  text-primary" />
            <span className="text-xl font-bold text-foreground">

Session Message

            </span>
          </div>
        {session ?(
          <div className="flex justify-center items-center font-bold gap-5">
          <Button onClick={()=>signOut()} className="w-fit md:mx-auto"><LogOut className="h-4" /> </Button>
          
          </div>
          ):(
            <Link href="/sign-in">
              <Button className="w-full md:mx-auto">Sign In</Button>
            </Link>
          )}
      </div>
      
    </nav>
  )
}

export default Navbar
