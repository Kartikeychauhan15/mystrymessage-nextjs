import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    //  console.log("Sending email to:", email);
    // console.log("Using Resend API key:", process.env.RESEND_API_KEY ? "✅ Loaded" : "❌ Missing");

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Your Verification Code",
      react: VerificationEmail({username, otp: verifyCode}),
    });
    return {
      success: true,
      message: "Verification send successfully",
    };
  } catch (emailError) {
    console.error("error sending verification email:", emailError);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
}

11