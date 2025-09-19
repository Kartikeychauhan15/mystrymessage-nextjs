import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const {username, email, password} = await request.json()
    
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json({ message: "Internal Server Error", success: false },{ status: 500 });
  }
}
