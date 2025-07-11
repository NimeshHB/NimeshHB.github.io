import { type NextRequest, NextResponse } from "next/server"
import { ParkingSlotService } from "@/lib/services/parkingSlotService"
import { BookingService } from "@/lib/services/bookingService"
import { ObjectId } from "mongodb"

const slotService = new ParkingSlotService()
const bookingService = new BookingService()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId, userName, vehicleNumber, vehicleType, expectedDuration } = await request.json()

    if (!userId || !userName || !vehicleNumber || !vehicleType) {
      return NextResponse.json({ error: "Missing required booking information" }, { status: 400 })
    }

    // Get slot details
    const slot = await slotService.getSlotById(params.id)
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 })
    }

    if (slot.status !== "available") {
      return NextResponse.json({ error: "Slot is not available" }, { status: 400 })
    }

    // Calculate expected checkout time
    const expectedCheckout = new Date()
    expectedCheckout.setHours(expectedCheckout.getHours() + (expectedDuration || slot.maxTimeLimit))

    // Book the slot
    const bookedSlot = await slotService.bookSlot(params.id, {
      bookedBy: userName,
      bookedByUserId: new ObjectId(userId),
      vehicleNumber,
      vehicleType,
      expectedCheckout,
    })

    // Create booking record
    const booking = await bookingService.createBooking({
      userId: new ObjectId(userId),
      slotId: new ObjectId(params.id),
      slotNumber: slot.number,
      vehicleNumber,
      vehicleType,
      expectedDuration: expectedDuration || slot.maxTimeLimit,
      hourlyRate: slot.hourlyRate,
    })

    return NextResponse.json({
      success: true,
      slot: bookedSlot,
      booking,
    })
  } catch (error) {
    console.error("Book slot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
