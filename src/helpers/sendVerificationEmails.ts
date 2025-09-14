
import { createTransport } from "nodemailer";

import {getOtpHtml} from './../emails/VerificationEmail';

import { ApiResponse } from "@/types/apiResponse";


export async function sendVerificationEmail(
  email:string,
  username:string,
  verifyCode:string,

):Promise<ApiResponse> {
  try {

     const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.SMTP_USER || "subashwp2@gmail.com",
        pass: process.env.SMTP_PASSWORD || "your-app-password",
      },
    });

    const html = getOtpHtml(
    {
        email,
       otp:verifyCode,
       username:username
   

    }
    
   )
   
    await transporter.sendMail({
      from: process.env.SMTP_USER || "subashwp2@gmail.com",
      to: email, // must not be undefined
      subject:"Verification Mail from Session Chart",
      html,
    });

    console.log("Email sent successfully");

    return{
      success:true,
      message:"Verification email sent successfully",
     
    }
    
  } catch (emailError) {
    console.error("Error Sending verification Email:",emailError);

    return {
      success:false,
      message:"Failed to send verification email",
      
    }
    
  }

  
}