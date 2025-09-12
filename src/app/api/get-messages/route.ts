
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/user.model";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";



export async function GET(req:Request) {
  await dbConnect();
    
const session = await  getServerSession(authOptions);

const user = session?.user;

if(!session || !user){
  return Response.json(
    {
      success: false,
      message: "You are not authorized !",
    },
    { status: 401 }
  );
}

const userId= new mongoose.Types.ObjectId(user._id);


try {

  const userMessage = await UserModel.aggregate([
    {$match:{_id:userId}},
    {$unwind:"$messages"},
    {$sort:{"messages.createdAt":-1}},
    {$group:{
      _id:"$_id",
      messages:{$push:"$messages"}
    }},

  ]);

  if(!userMessage || userMessage?.length ===0){
    return Response.json(
      {
        success: false,
        message: "User not found !",
        },
      { status: 404 }
    );
  }
  
  return Response.json(
      {
        success: true,
        messages:userMessage[0]?.messages,
        },
      { status: 404 }
    );


} catch (error) {
  console.error("error while message fetching :",error)
  return Response.json(
      {
        success: false,
        message: "Error while fetching messages !",
        },
      { status: 404 }
    );
  
}


}