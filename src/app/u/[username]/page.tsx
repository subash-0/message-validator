"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send, Lightbulb, Loader2 } from "lucide-react"
import { ApiResponse } from "@/types/apiResponse"
import axios, { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface MessageForm {
  message: string
}



export default function SendMessagePage() {
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(false)
  const [suggestedMessages,setSuggestedMessages] = useState<string[]>([])
  const [suggestingMessages,setSuggestingMessages] = useState(false);
  
  const {username} = useParams<{username:string}>()

  const getSuggestedMessage = async () =>{
    setSuggestingMessages(true)
    setSuggestedMessages([])
    const {data} = await axios.get<ApiResponse>("/api/suggest-message");
    setSuggestedMessages(data?.message?.split("||") || [])

    setSuggestingMessages(false);
   
  }


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    
    formState: { errors,isSubmitting },
  } = useForm<MessageForm>()

  const currentMessage = watch("message")

  const onSubmit = async (data: MessageForm) => {
    try {
      if(isAcceptingMessage){
        const {data: responseData} = await axios.post("/api/send-message",{
          content:data.message,
          username
        })
        if(!responseData?.success){
          toast.error("Something went wrong !")
        }
          toast.success(responseData.message)
          setValue("message","")
        

      }else{
        toast.success("User is not accepting message !")
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message = axiosError.response?.data.message || "Something went wrong !";
      toast.error(message);
      
    }
   
  }

  const handleSuggestionClick = (suggestion: string) => {
    setValue("message", suggestion)
  }

  useEffect(()=>{
    const getIsAcceptingMessage = async ()=>{
      const { data } = await axios.get<ApiResponse>("/api/accepting-message");
      if(data?.isAcceptingMessage){
        setIsAcceptingMessage(data.isAcceptingMessage)
      }
    }

    getIsAcceptingMessage();
  },[])


  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Send Anonymous Message</h1>
          </div>
          <p className="text-muted-foreground">
            Send an anonymous message to this person. Your identity will remain completely private.
          </p>
        </div>

        {/* Message Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Message</CardTitle>
            <CardDescription>Write your anonymous message below. Be respectful and kind.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your anonymous message here..."
                  className="min-h-32 resize-none"
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Message must be at least 10 characters" },
                    maxLength: { value: 500, message: "Message must be less than 500 characters" },
                  })}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                <div className="text-right text-sm text-muted-foreground">{currentMessage?.length || 0}/500</div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {
                    isSubmitting ? <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending ...
                  
                    </>:
                    <><Send className="h-4 w-4 mr-2" />
                  Send Message</>
                  }
                </Button>
                <Button type="button" variant="outline" onClick={getSuggestedMessage} disabled={suggestingMessages}>
                 {suggestingMessages ? <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating ...
                 </>:<>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Suggestions
                 </>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Suggested Messages */}
        {suggestedMessages?.length >0 && (
          <div className="space-y-2 border border-gray-300 p-4 rounded-xl">
            <h2 className="text-xl font-semibold text-center">Suggested Messages</h2>
            <div className="grid gap-4 md:grid-cols-1">
              {suggestedMessages.map((suggestion, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <CardContent className="">
                    <p className="text-sm">{suggestion}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <Card className="border-muted">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              🔒 Your message is completely anonymous. The recipient will not know who sent it.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
