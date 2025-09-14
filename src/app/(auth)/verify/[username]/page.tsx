"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { verifySchema } from "@/Schemas/verifySchema"
import { useParams, useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Loader2 } from "lucide-react"
import { useState } from "react"


export default function InputOTPForm() {
  const router = useRouter();
  const param = useParams<{username:string}>();
  const [isSubmitting,setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

 async function onSubmit(data: z.infer<typeof verifySchema>) {
  setIsSubmitting(true)
 try {
   const {data:responseData} =   await axios.post("/api/verify-code",JSON.stringify({
       code:data.code,
       username:param.username
      }))

      if(responseData?.success){
        toast.success(responseData?.message)
        router.push("/sign-in")
      }else{
        throw new Error(responseData?.message)
      }
 
 } catch (error) {

  const axiosError = error as AxiosError<ApiResponse>;
  const axiosMessage = axiosError?.response?.data?.message ?? "Error while verifying otp !"

  toast.error(axiosMessage);
  
 } finally{
  setIsSubmitting(false)
 }
    
  }

  return (
   <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center">
    <div className="bg-white shadow-md rounded-xl max-w-md w-full p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-4xl  font-extrabold mb-4">Verify Your Accound:</h1>
<p>Confirm Your username:{param.username} by verifying otp sent to your email.</p>
      </div>

       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the otp sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isSubmitting ?<>
           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait ...
          </> :"Verify"}
        </Button>
      </form>
    </Form>
    </div>

   </div>
  )
}
