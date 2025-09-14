
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/modals/user.model";
import mongoose, { FilterQuery } from "mongoose";
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

  const userId = user._id;

  const toObjectId = (id?: string) =>
  id && mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;

  const validId = toObjectId(userId);

  // Each condition is a filter for User
  const conditions: FilterQuery<User>[] = [];

  if (validId) {
    conditions.push({ _id: validId });
  }
  if (username) {
    conditions.push({ username });
  }

  if (conditions.length === 0) {
    throw new Error("No identifier provided");
  }
  try {


const updatedUser = await UserModel.findOne({
  $or: conditions,
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
