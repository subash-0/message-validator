import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/user.model";


import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import { generateHash } from "@/helpers/bcrypt";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request:Request) {


  await dbConnect();

  try {
   const {username,name,email,password} = await request.json()

   const exitringUserVerifiedByusername = await UserModel.findOne({username,isVerified:true});
   if(exitringUserVerifiedByusername){
    return Response.json({
      success:false,
      message:"username is already taken !"
    },{status:400});
   }

   const userbyUserEmail = await UserModel.findOne({email});

   const verifyCode = Math.floor(100000 + Math.random() * 900000) // 6 digit code

   if(userbyUserEmail){
      if(userbyUserEmail.isVerified){
        return Response.json({
          success:false,
          message:"Email is already registered !",

        },{status:400})

      }else{
        const hashPassword = await generateHash(password);
        userbyUserEmail.password = hashPassword;
        userbyUserEmail.verifyCode = JSON.stringify(verifyCode);
        userbyUserEmail.verifyCodeExpiry = new Date(new Date().getTime() + 60 * 60 * 1000);

        await userbyUserEmail.save();


      }



   }else{
    const hashPassword = await generateHash(password);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

  const newUser =   new UserModel({
      username,
      email,
      password:hashPassword,
      name,
      verifyCodeExpiry:expiryDate,
      verifyCode,
      isVerified:false,
      isAcceptingMessage:true,
      messages:[]

    });

    await newUser.save();

   }

   // send verification email

const emailResponse =   await sendVerificationEmail(email,username,JSON.stringify(verifyCode));


if(!emailResponse.success){
  return Response.json({
    success:false,
    message:emailResponse.message || "Error sending verification email"
  },{status:500});
}

  return Response.json({
    success:true,
    message:"Verification Email sent to your email !",
  },{status:201});


    
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const message = axiosError?.response?.data?.message || "Error while registering User !";
    return Response.json({

      success:false,
      message,


    },{status:500});
    
  }



  
}



