import { getDatabase } from "../mongodb"
import type { Booking, CreateBookingData } from "../models/Booking"
import { ObjectId } from "mongodb"

export class BookingService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Booking>("bookings")
  }

  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    const collection = await this.getCollection()

    const booking: Booking = {
      ...bookingData,
      startTime: new Date(),
      status: "active",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(booking)
    return { ...booking, _id: result.insertedId }
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const collection = await this.getCollection()
    return await collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()
  }

  async getActiveBookings(): Promise<Booking[]> {
    const collection = await this.getCollection()
    return await collection.find({ status: "active" }).toArray()
  }

  async completeBooking(bookingId: string): Promise<Booking | null> {
    const collection = await this.getCollection()

    const booking = await collection.findOne({ _id: new ObjectId(bookingId) })
    if (!booking) return null

    const endTime = new Date()
    const actualDuration = Math.ceil((endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60))
    const totalAmount = actualDuration * booking.hourlyRate

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          endTime,
          actualDuration,
          totalAmount,
          status: "completed",
          paymentStatus: "paid",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }

  async getBookingHistory(limit = 50): Promise<Booking[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray()
  }

  async getBookingStats() {
    const collection = await this.getCollection()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = await collection
      .aggregate([
        {
          $facet: {
            totalBookings: [{ $count: "count" }],
            activeBookings: [{ $match: { status: "active" } }, { $count: "count" }],
            todayBookings: [{ $match: { createdAt: { $gte: today } } }, { $count: "count" }],
            totalRevenue: [
              { $match: { status: "completed" } },
              { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ],
          },
        },
      ])
      .toArray()

    return {
      totalBookings: stats[0].totalBookings[0]?.count || 0,
      activeBookings: stats[0].activeBookings[0]?.count || 0,
      todayBookings: stats[0].todayBookings[0]?.count || 0,
      totalRevenue: stats[0].totalRevenue[0]?.total || 0,
    }
  }
}
