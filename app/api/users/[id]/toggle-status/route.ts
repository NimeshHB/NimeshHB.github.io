import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

const userService = new UserService()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await userService.toggleUserStatus(params.id)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...safeUser } = user

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: `User ${user.status === "active" ? "activated" : "deactivated"} successfully`,
    })
  } catch (error) {
    console.error("Toggle user status error:", error)
    return NextResponse.json({ success: false, error: "Failed to toggle user status" }, { status: 500 })
  }
}
