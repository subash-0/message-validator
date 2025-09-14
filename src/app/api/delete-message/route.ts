import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function DELETE(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "You are not authorized !" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { searchParams } = new URL(req.url);
  const message_id = searchParams.get("message_id");

  if (!message_id) {
    return Response.json(
      { success: false, message: "Message ID is required!" },
      { status: 400 }
    );
  }

  try {
    const userMessage = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { messages: { _id: message_id } }, 
      },
      { new: true }
    );

    if (!userMessage) {
      return Response.json(
        { success: false, message: "User or message not found!" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting message", error);
    return Response.json(
      { success: false, message: "Error while deleting message" },
      { status: 500 }
    );
  }
}
