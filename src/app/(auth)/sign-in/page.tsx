"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { signInSchema } from "@/Schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignIn = () => {
 const [isSubmitting, setIsSubmitting] = useState(false);

  const naviation = useRouter();

  ///zod implementation

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      password: "",
      identifier:""
   
    },
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
  const result =  await signIn('credentials',{
      identifier:data.identifier,
      password:data.password,
      redirect:false

      
    })

    if(result?.error){
      toast.error(result?.error)
    }
    if(result?.url){
      toast.success("Login Successfull")
      form.reset();
      naviation.push("/dashboard")
    }
   
    setIsSubmitting(false)
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-3">
            Join Session Message
          </h1>
          <p className="text-lg">Join to Explore Advanture</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Email:</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. Subash Kumar Yadav" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Password:</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="eg. Abc32@!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ?<>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait ...
              </> :"Sign In"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-5">
          <p>
            Not a member ? {" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignIn;
