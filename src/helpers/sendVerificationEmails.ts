import {resend} from "@/lib/resend"


import VerificationEmail from './../emails/VerificationEmail';

import { ApiResponse } from "@/types/apiResponse";


export async function sendVerificationEmail(
  email:string,
  usernmae:string,
  verifyCode:string,

):Promise<ApiResponse> {
  try {

    await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Verification Email',
    react:VerificationEmail({username:usernmae,otp:verifyCode}),
  });

    return{
      success:true,
      message:"Verification email sent successfully",
      isAcceptingMessages:true,
    }
    
  } catch (emailError) {
    console.error("Error Sending verification Email:",emailError);

    return {
      success:false,
      message:"Failed to send verification email",
      
    }
    
  }

  
}