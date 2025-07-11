import { UserService } from "./services/userService"

const userService = new UserService()

export interface AuthUser {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "attendant"
  phone?: string
  vehicleNumber?: string
  vehicleType?: string
  adminLevel?: "manager" | "super"
  permissions?: string[]
  status: "active" | "inactive"
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await userService.authenticateUser(email, password)

    if (!user) {
      return null
    }

    // Convert MongoDB user to AuthUser
    return {
      id: user._id!.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      vehicleNumber: user.vehicleNumber,
      vehicleType: user.vehicleType,
      adminLevel: user.adminLevel,
      permissions: user.permissions,
      status: user.status,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function registerUser(userData: {
  name: string
  email: string
  password: string
  role: "user" | "admin" | "attendant"
  phone?: string
  vehicleNumber?: string
  vehicleType?: string
  adminLevel?: "manager" | "super"
  permissions?: string[]
}): Promise<AuthUser | null> {
  try {
    const user = await userService.createUser(userData)

    return {
      id: user._id!.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      vehicleNumber: user.vehicleNumber,
      vehicleType: user.vehicleType,
      adminLevel: user.adminLevel,
      permissions: user.permissions,
      status: user.status,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return null
  }
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const user = await userService.getUserById(id)

    if (!user) {
      return null
    }

    return {
      id: user._id!.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      vehicleNumber: user.vehicleNumber,
      vehicleType: user.vehicleType,
      adminLevel: user.adminLevel,
      permissions: user.permissions,
      status: user.status,
    }
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}
