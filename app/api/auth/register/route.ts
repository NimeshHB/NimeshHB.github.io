import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate password length
    if (userData.password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address" }, { status: 400 })
    }

    // Additional validation for user role
    if (userData.role === "user") {
      if (!userData.vehicleNumber || !userData.vehicleType || !userData.phone) {
        return NextResponse.json(
          { success: false, error: "Vehicle information and phone number are required for users" },
          { status: 400 },
        )
      }
    }

    // Register user
    const user = await registerUser(userData)

    if (!user) {
      return NextResponse.json({ success: false, error: "Registration failed. Please try again." }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        user,
        message: "Account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration API error:", error)

    // Handle specific MongoDB errors
    if (error.message === "User with this email already exists") {
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 })
    }
git
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 },
    )
  }
}
