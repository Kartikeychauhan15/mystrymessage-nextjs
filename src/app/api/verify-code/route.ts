import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username); // prefer method to decode URI components
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isCodeNotExpired){
        user.isVerified = true;
        await user.save();
        return Response.json({ success: true, message: "Account verified successfully" }, { status: 200 });
    }else if(!isCodeNotExpired){
        return Response.json({ success: false, message: "Verification code has expired" }, { status: 400 });
    }else{
        return Response.json({ success: false, message: "Invalid verification code" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
