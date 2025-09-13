"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
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

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
 const [usernameAvailable,setUsernameAvailable] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300);
  
  const naviation = useRouter();

  ///zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      email: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsLoadingUser(true);
        setUsernameMessage("");

        try {
          const { data } = await axios.get(
            `/api/check-username-unique?username=${username}`
          );

         
          setUsernameAvailable(data?.success)
          setUsernameMessage(data?.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError?.response?.data?.message ??
              "Error while checking username !"
          );
        } finally {
          setIsLoadingUser(false);
         
        }
      }else{
        setUsernameMessage('')
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const { data: responseData } = await axios.post("/api/sign-up", data);
      if (responseData?.success) {
        toast.success(responseData?.message);
        naviation.push(`/verify/${username}`);
      } else {
        throw new Error(responseData?.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message ?? "Error while signing up !"
      );
    } finally {
      setIsSubmitting(false);
    }
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                 
                    <Input
                      placeholder="Enter Your Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />

                   
                  </FormControl>
                   {isLoadingUser && <Loader2 className="h-2 animate-spin" />}
                    {usernameMessage && (
                      <FormMessage className={clsx(usernameAvailable ? "text-green-600" : "text-red-600")}>
                        {usernameMessage}
                      </FormMessage>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Full Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. Subash Kumar Yadav" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Email:</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. subash12@gmail.com" {...field} />
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
              </> :"Sign Up"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-5">
          <p>
            Already a member ? {" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Page;
