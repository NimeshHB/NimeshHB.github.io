import { type NextRequest, NextResponse } from "next/server"
import { ParkingSlotService } from "@/lib/services/parkingSlotService"

const slotService = new ParkingSlotService()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const slot = await slotService.getSlotById(params.id)

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, slot })
  } catch (error) {
    console.error("Get slot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const slot = await slotService.updateSlot(params.id, updateData)

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, slot })
  } catch (error) {
    console.error("Update slot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await slotService.deleteSlot(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete slot error:", error)

    if (error.message === "Cannot delete an occupied slot") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
