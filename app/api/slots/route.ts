import { type NextRequest, NextResponse } from "next/server"
import { ParkingSlotService } from "@/lib/services/parkingSlotService"

const slotService = new ParkingSlotService()

export async function GET() {
  try {
    const slots = await slotService.getAllSlots()
    return NextResponse.json({ success: true, slots })
  } catch (error) {
    console.error("Get slots error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const slotData = await request.json()

    if (!slotData.number || !slotData.section) {
      return NextResponse.json({ error: "Slot number and section are required" }, { status: 400 })
    }

    const slot = await slotService.createSlot(slotData)
    return NextResponse.json({ success: true, slot }, { status: 201 })
  } catch (error) {
    console.error("Create slot error:", error)

    if (error.message === "Slot with this number already exists") {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
