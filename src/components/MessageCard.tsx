"use client"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { DeleteAlert } from "./AlertDialogue"
import { Message } from "@/modals/user.model"
import axios from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { toast } from "sonner"

type MessageCardProps = {
  message:Message,
  onMessageDelete: (messageId:string)=>void
}


export default function MessageCard({message,onMessageDelete}:MessageCardProps) {
 
  const handleDeleteMessage = async ()=>{
        
   const {data} = await axios.delete<ApiResponse>(`/api/delete-message?message_id=${message?._id}`)

    if(data.success){
      toast.success("Message deleted successfylly")

      onMessageDelete(message?._id?.toString() ?? "")
    }

  }


  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
       
        <CardContent className="flex justify-between items-start gap-x-0.5 px-1">
        <p>{message?.content}</p>
       <DeleteAlert deleteMessage={handleDeleteMessage} />
        </CardContent>
      </CardHeader>
     
    </Card>
  )
}
