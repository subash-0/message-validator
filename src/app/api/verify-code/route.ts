import dbConnect from "@/lib/dbConnect";

import UserModel from "@/modals/user.model";

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
    console.log("error check username:", error);

    return Response.json(
      {
        success: false,
        message: "Checking username failed",
      },
      { status: 500 }
    );
    
  }


  
}




