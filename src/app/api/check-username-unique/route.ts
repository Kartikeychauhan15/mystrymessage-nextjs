// we will also use zod in it.

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
   

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username") || "",
    };
    // Validate the query parameters with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    // console.log(result); //TODO: remove
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message:
          usernameErrors.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query parameters",
      }, { status: 400 });
    }

    const { username } = result.data;

   const existingVerifiedUser = await UserModel.findOne({username, isVerified:true})
    if(existingVerifiedUser){
        return Response.json({ success: false, isUnique: false, message: "Username is already taken" });
    }


    return Response.json({ success: true, isUnique: true, message: "Username is available" });
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
