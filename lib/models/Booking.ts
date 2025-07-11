import type { ObjectId } from "mongodb"

export interface Booking {
  _id?: ObjectId
  userId: ObjectId
  slotId: ObjectId
  slotNumber: string
  vehicleNumber: string
  vehicleType: string
  startTime: Date
  endTime?: Date
  expectedDuration: number
  actualDuration?: number
  hourlyRate: number
  totalAmount?: number
  status: "active" | "completed" | "cancelled" | "overstay"
  paymentStatus: "pending" | "paid" | "refunded"
  createdAt: Date
  updatedAt: Date
}

export interface CreateBookingData {
  userId: ObjectId
  slotId: ObjectId
  slotNumber: string
  vehicleNumber: string
  vehicleType: string
  expectedDuration: number
  hourlyRate: number
}
