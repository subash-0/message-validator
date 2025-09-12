import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/user.model";

import { z } from "zod";
import { username as usernameValidation } from "@/Schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {


  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const queryParams = {
      username: searchParams.get("username"),
    };

    // validate with zod
    const result = usernameQuerySchema.safeParse(queryParams);

   
    if (!result.success) {
      const usernameError = result.error?.format()?.username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError?.join(", ")
              : "Invalid query parameters!",
        },
        { status: 400 }
      );
    }

   
    // ✅ If validation passes → check DB for username
    const existingVerifiedUser = await UserModel.findOne({
      username: result.data.username, isVerified:true
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 409 } // Conflict
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error check username:", error);

    return Response.json(
      {
        success: false,
        message: "Checking username failed",
      },
      { status: 500 }
    );
  }
}
