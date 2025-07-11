import { type NextRequest, NextResponse } from "next/server"
import { ParkingSlotService } from "@/lib/services/parkingSlotService"
import { BookingService } from "@/lib/services/bookingService"

const slotService = new ParkingSlotService()
const bookingService = new BookingService()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get current slot to find active booking
    const slot = await slotService.getSlotById(params.id)
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 })
    }

    // Find and complete active booking
    const activeBookings = await bookingService.getActiveBookings()
    const currentBooking = activeBookings.find((booking) => booking.slotId.toString() === params.id)

    if (currentBooking) {
      await bookingService.completeBooking(currentBooking._id!.toString())
    }

    // Free the slot
    const freedSlot = await slotService.freeSlot(params.id)

    return NextResponse.json({
      success: true,
      slot: freedSlot,
    })
  } catch (error) {
    console.error("Free slot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
