
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/user.model";
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
      message: "Message Aceepted status updated!",
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


 try {

const updatedUser =  await UserModel.findById(userId);

if(!updatedUser){
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
      isAcceptingMessage:updatedUser.isAcceptingMessage,
     },
    { status: 200 }
  );

 } catch (error) {

  console.error("Error while toggle Message", error)

   return Response.json({
    success:false,
    message:"Error while  Message status"
   },
  {status:500}
  )

 }


}
