import type { ObjectId } from "mongodb"

export interface ParkingSlot {
  _id?: ObjectId
  number: string
  section: string
  type: "regular" | "compact" | "large" | "electric" | "handicap" | "vip"
  status: "available" | "occupied" | "blocked" | "reserved"
  hourlyRate: number
  maxTimeLimit: number
  description?: string
  bookedBy?: string
  bookedByUserId?: ObjectId
  vehicleNumber?: string
  vehicleType?: string
  bookedAt?: Date
  expectedCheckout?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateSlotData {
  number: string
  section: string
  type: "regular" | "compact" | "large" | "electric" | "handicap" | "vip"
  hourlyRate: number
  maxTimeLimit: number
  description?: string
  status?: "available" | "blocked"
}
