import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

const userService = new UserService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")

    const filter = {}
    if (role) filter.role = role
    if (status) filter.status = status

    const users = await userService.getAllUsers(filter)

    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user)

    return NextResponse.json({
      success: true,
      users: safeUsers,
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}
