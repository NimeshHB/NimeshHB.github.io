import { getDatabase } from "../mongodb"
import type { ParkingSlot, CreateSlotData } from "../models/ParkingSlot"
import { ObjectId } from "mongodb"

export class ParkingSlotService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<ParkingSlot>("parking_slots")
  }

  async createSlot(slotData: CreateSlotData): Promise<ParkingSlot> {
    const collection = await this.getCollection()

    // Check if slot number already exists
    const existingSlot = await collection.findOne({ number: slotData.number })
    if (existingSlot) {
      throw new Error("Slot with this number already exists")
    }

    const slot: ParkingSlot = {
      ...slotData,
      status: slotData.status || "available",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(slot)
    return { ...slot, _id: result.insertedId }
  }

  async getAllSlots(): Promise<ParkingSlot[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ number: 1 }).toArray()
  }

  async getSlotById(id: string): Promise<ParkingSlot | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async getSlotByNumber(number: string): Promise<ParkingSlot | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ number })
  }

  async getAvailableSlots(): Promise<ParkingSlot[]> {
    const collection = await this.getCollection()
    return await collection.find({ status: "available" }).toArray()
  }

  async getSlotsByStatus(status: string): Promise<ParkingSlot[]> {
    const collection = await this.getCollection()
    return await collection.find({ status }).toArray()
  }

  async updateSlot(id: string, updateData: Partial<ParkingSlot>): Promise<ParkingSlot | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }

  async bookSlot(
    slotId: string,
    bookingData: {
      bookedBy: string
      bookedByUserId: ObjectId
      vehicleNumber: string
      vehicleType: string
      expectedCheckout?: Date
    },
  ): Promise<ParkingSlot | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(slotId),
        status: "available",
      },
      {
        $set: {
          status: "occupied",
          bookedBy: bookingData.bookedBy,
          bookedByUserId: bookingData.bookedByUserId,
          vehicleNumber: bookingData.vehicleNumber,
          vehicleType: bookingData.vehicleType,
          bookedAt: new Date(),
          expectedCheckout: bookingData.expectedCheckout,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }

  async freeSlot(slotId: string): Promise<ParkingSlot | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(slotId) },
      {
        $set: {
          status: "available",
          updatedAt: new Date(),
        },
        $unset: {
          bookedBy: "",
          bookedByUserId: "",
          vehicleNumber: "",
          vehicleType: "",
          bookedAt: "",
          expectedCheckout: "",
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }

  async blockSlot(slotId: string, reason = "Maintenance"): Promise<ParkingSlot | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(slotId) },
      {
        $set: {
          status: "blocked",
          bookedBy: reason,
          bookedAt: new Date(),
          updatedAt: new Date(),
        },
        $unset: {
          bookedByUserId: "",
          vehicleNumber: "",
          vehicleType: "",
          expectedCheckout: "",
        },
      },
      { returnDocument: "after" },
    )

    return result.value
  }

  async deleteSlot(id: string): Promise<boolean> {
    const collection = await this.getCollection()

    // Check if slot is occupied
    const slot = await collection.findOne({ _id: new ObjectId(id) })
    if (slot && slot.status === "occupied") {
      throw new Error("Cannot delete an occupied slot")
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async getSlotStats() {
    const collection = await this.getCollection()

    const stats = await collection
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    const totalRevenue = await collection
      .aggregate([
        {
          $match: { status: "occupied", bookedAt: { $exists: true } },
        },
        {
          $project: {
            hourlyRate: 1,
            hoursParked: {
              $divide: [{ $subtract: [new Date(), "$bookedAt"] }, 1000 * 60 * 60],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $multiply: ["$hourlyRate", { $ceil: "$hoursParked" }],
              },
            },
          },
        },
      ])
      .toArray()

    return {
      statusCounts: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count
        return acc
      }, {}),
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    }
  }
}
