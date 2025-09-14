"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/modals/user.model";
import { acceptMessageSchema } from "@/Schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadin, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchingLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((msg) => msg.filter((m) => m.id !== messageId));
  };

  const { data: session } = useSession();

  const { register,watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessage = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchingLoading(true);

    try {
      const { data } = await axios.get<ApiResponse>("/api/accepting-message");
      setValue("acceptMessage", data?.isAcceptingMessage ?? false);
      toast.success("Message Accepting");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data.message || "Something went wrong !";
      toast.error(message);
    } finally {
      setIsSwitchingLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);

      try {
        const { data } = await axios.get<ApiResponse>("/api/get-messages");
        if (data?.messages) {
          setMessages(data.messages || []);
        }
        if (refresh) {
          toast.success("Showing Latest Messages !");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const message =
          axiosError.response?.data.message || "Something went wrong !";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (session?.user) {
      fetchAcceptMessage();
      fetchMessages();
    }
    return;
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  /// handle switch change ?

  const handleSwitchChange = async () => {
    try {
      const { data } = await axios.post<ApiResponse>("/api/accepting-message", {
        acceptingMessage: !acceptMessage,
      });

      if (data?.success) {
        toast.success(data.message);
        setValue("acceptMessage", !acceptMessage);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data.message || "Something went wrong !";
      toast.message(message);
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Please Login to continue</h1>
      </div>
    );
  }

  const { username } = session?.user;

  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const profileURL = `${baseURL}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(profileURL)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="my-8 md:mx-8 lg:mx-auto p-6 bg-white rounded-full max-w-6xl min-h-screen">
      <h1 className="text-4xl font-bold mb-4">User Dashbaord</h1>
       <h2 className="text-lg font-bold mb-2">
        Welcome : <span className="text-xl font-extrabold"> {username}</span>
       </h2>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your unique link</h2>

        <div className="flex items-center">
          <Input type="text"  value={profileURL} disabled className=" w-fit line-clamp-1 p-2 mr-2" />
        <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

<div className="mb-4 flex items-center font-semibold">
  <Switch
  {...register("acceptMessage")}
  checked={acceptMessage}
  onCheckedChange={handleSwitchChange}
  disabled={isSwitchLoading}
  />
  <span className="ml-4">Accept Messages :{acceptMessage ?"ON" :"OFF" }</span>

</div>
<Separator />
<Button className="mt-4" variant="outline"

onClick={(e)=>{
  e.preventDefault();
  fetchMessages(true)
}}
>
  {isLoadin ? <Loader2 className="h-4 w-4 animate-spin" />:<RefreshCcw className="h-4 w-4" />  }

</Button>

<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
{
  messages?.length >0 ?(
    messages.map((message: Message, index:number) => (
      <MessageCard
        key={index}
        message={message}
        onMessageDelete={handleDeleteMessage}
      />
    ))
  ):(
    <p>No message to display</p>
  )
}
</div>

    </div>
  );
};

export default Dashboard;
