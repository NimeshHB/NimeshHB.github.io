import { getDatabase } from "../mongodb"
import type { User, CreateUserData } from "../models/User"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export class UserService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<User>("users")
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const collection = await this.getCollection()

    // Check if user already exists
    const existingUser = await collection.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const user: User = {
      ...userData,
      password: hashedPassword,
      status: userData.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const collection = await this.getCollection()
    const user = await collection.findOne({ email, status: "active" })

    if (!user) return null

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return null

    // Update last login
    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return user
  }

  async getUserById(id: string): Promise<User | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async getAllUsers(filter: any = {}): Promise<User[]> {
    const collection = await this.getCollection()
    return await collection.find(filter).toArray()
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    const collection = await this.getCollection()

    const updateDoc = {
      ...updateData,
      updatedAt: new Date(),
    }

    // Hash password if provided
    if (updateData.password) {
      updateDoc.password = await bcrypt.hash(updateData.password, 12)
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: "after" },
    )

    return result.value
  }

  async deleteUser(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async getAdmins(): Promise<User[]> {
    const collection = await this.getCollection()
    return await collection.find({ role: "admin" }).toArray()
  }

  async toggleUserStatus(id: string): Promise<User | null> {
    const collection = await this.getCollection()
    const user = await collection.findOne({ _id: new ObjectId(id) })

    if (!user) return null

    const newStatus = user.status === "active" ? "inactive" : "active"

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }
}
