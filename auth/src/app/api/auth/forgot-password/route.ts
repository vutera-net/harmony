import { NextResponse } from "next/server";
import { forgotPasswordAction } from "@/lib/actions/forgot-password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await forgotPasswordAction(body);

    if (result.success) {
      return NextResponse.json({ 
        message: result.message 
      }, { status: 200 });
    }

    return NextResponse.json({ 
      errors: result.error 
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ 
      error: "Invalid request body" 
    }, { status: 400 });
  }
}
