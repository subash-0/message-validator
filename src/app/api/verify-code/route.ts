import dbConnect from "@/lib/dbConnect";

import UserModel from "@/modals/user.model";
import { ApiResponse } from "@/types/apiResponse";
import { AxiosError } from "axios";

export async function POST(request:Request) {
  await dbConnect();


  try {
   const {username,code} = await request.json();
  const decodedUsername = decodeURIComponent(username);

  const existingUser = await UserModel.findOne({username:decodedUsername});

  if(!existingUser){
    return Response.json(
      {
        success: false,
        message: "Username not found!",
      },
      { status: 404 } // Conflict
    );
  }

  const isCodeValid = existingUser?.verifyCode === code;
  const isCodenotExpired = new Date(existingUser.verifyCodeExpiry) > new Date();

  if(isCodeValid && isCodenotExpired){
    existingUser.isVerified = true;
    await existingUser.save();
    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 }
    );
  }else if(!isCodenotExpired){

     return Response.json(
      {
        success: false,
        message: "Verification code expired !, please signup again !",
      },
      { status: 400 }
    );

  }else{
    return Response.json(
      {
        success: false,
        message: "Invalid verification code !",
      },
      { status: 400 }
    );

  }

  


    
  } catch (error) {
     const axiosError = error as AxiosError<ApiResponse>;
        const message = axiosError?.response?.data?.message || "Error while registering User !";
        return Response.json({
    
          success:false,
          message,
    
    
        },{status:500});
        
    
  }


  
}




