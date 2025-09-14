
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/user.model";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";


export async function POST(req: Request) {
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

const userId= user._id;



 const {acceptingMessage} =    await req.json();

 try {

const updatedUser =  await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage:acceptingMessage},{new:true});
  
if(!updatedUser){
  return Response.json(
    {
      success: false,
      message: "Message Aceepted status update Error !",
      updatedUser
    },
    { status: 500 }
  );
}

  return Response.json(
    {
      success: true,
      message:`You turned your accepting messsages to ${acceptingMessage}`,
      updatedUser
    },
    { status: 200 }
  );

 } catch (error) {

  console.error("Error while toggle Message",error)

   return Response.json({
    success:false,
    message:"Error while toggle Message"
   },
  {status:500}
  )
  
 }





 


}


export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "You are not authorized !" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username"); 

  console.log("username",username)
  const userId = user._id;

  try {
   let validId: mongoose.Types.ObjectId | null = null;

if (userId && mongoose.Types.ObjectId.isValid(userId)) {
  validId = new mongoose.Types.ObjectId(userId);
}

const updatedUser = await UserModel.findOne({
  $or: [
    validId ? { _id: validId } : {}, 
    username ? { username } : {}
  ],
});
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found !" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, isAcceptingMessage: updatedUser.isAcceptingMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while toggle Message", error);

    return Response.json(
      { success: false, message: "Error while Message status" },
      { status: 500 }
    );
  }
}
