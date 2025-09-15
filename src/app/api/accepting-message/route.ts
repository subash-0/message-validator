
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

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  try {
    if (username) {
      // 🔹 Public route: allow anyone to query by username
      const user = await UserModel.findOne({ username });

      if (!user) {
        return Response.json(
          { success: false, message: "User not found !" },
          { status: 404 }
        );
      }

      return Response.json(
        { success: true, isAcceptingMessage: user.isAcceptingMessage },
        { status: 200 }
      );
    } else {
      // 🔹 Private route: require session if no username
      const session = await getServerSession(authOptions);
      const user = session?.user;

      if (!session || !user) {
        return Response.json(
          { success: false, message: "You are not authorized !" },
          { status: 401 }
        );
      }

      const dbUser = await UserModel.findById(user._id);

      if (!dbUser) {
        return Response.json(
          { success: false, message: "User not found !" },
          { status: 404 }
        );
      }

      return Response.json(
        { success: true, isAcceptingMessage: dbUser.isAcceptingMessage },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error while fetching message status:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
