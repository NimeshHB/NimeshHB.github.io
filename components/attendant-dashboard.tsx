"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Car, QrCode, CheckCircle, AlertTriangle, Clock, Search } from "lucide-react"
import { useState } from "react"

export function AttendantDashboard({ parkingSlots, onSlotUpdate }) {
  const [qrCode, setQrCode] = useState("")
  const [vehicleSearch, setVehicleSearch] = useState("")

  const occupiedSlots = parkingSlots.filter((slot) => slot.status === "occupied")
  const recentActivity = occupiedSlots.slice(0, 5)

  const handleCheckOut = (slotId) => {
    const updatedSlots = parkingSlots.map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: "available",
          bookedBy: null,
          vehicleNumber: null,
          bookedAt: null,
        }
      }
      return slot
    })
    onSlotUpdate(updatedSlots)
  }

  const handleManualCheckIn = (slotId) => {
    const updatedSlots = parkingSlots.map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: "occupied",
          bookedBy: "Walk-in Customer",
          vehicleNumber: `WLK${Math.floor(Math.random() * 1000)}`,
          bookedAt: new Date(),
        }
      }
      return slot
    })
    onSlotUpdate(updatedSlots)
  }

  const getTimeElapsed = (bookedAt) => {
    if (!bookedAt) return null
    const elapsed = Math.floor((new Date() - new Date(bookedAt)) / (1000 * 60))
    if (elapsed < 60) return `${elapsed}m`
    return `${Math.floor(elapsed / 60)}h ${elapsed % 60}m`
  }

  const getOverstayStatus = (bookedAt, timeLimit = 2) => {
    if (!bookedAt) return false
    const elapsed = (new Date() - new Date(bookedAt)) / (1000 * 60 * 60) // hours
    return elapsed > timeLimit
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Attendant Dashboard</h2>
        <Badge variant="outline" className="text-sm">
          On Duty
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Slots</CardTitle>
            <Car className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupiedSlots.length}</div>
            <p className="text-xs text-muted-foreground">Currently parked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overstays</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {occupiedSlots.filter((slot) => getOverstayStatus(slot.bookedAt)).length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-outs Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1.5h</div>
            <p className="text-xs text-muted-foreground">Today's average</p>
          </CardContent>
        </Card>
      </div>

      

      {/* Active Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Active Bookings</CardTitle>
          <CardDescription>Currently occupied slots requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {occupiedSlots.map((slot) => (
              <div
                key={slot.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  getOverstayStatus(slot.bookedAt) ? "border-orange-300 bg-orange-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Slot {slot.number}</p>
                    <p className="text-sm text-gray-600">{slot.vehicleNumber}</p>
                    <p className="text-xs text-gray-500">{slot.bookedBy}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{getTimeElapsed(slot.bookedAt)}</p>
                    <p className="text-xs text-gray-500">Since {new Date(slot.bookedAt).toLocaleTimeString()}</p>
                  </div>

                  {getOverstayStatus(slot.bookedAt) && (
                    <Badge variant="destructive" className="text-xs">
                      Overstay
                    </Badge>
                  )}

                  <Button size="sm" variant="outline" onClick={() => handleCheckOut(slot.id)}>
                    Check Out
                  </Button>
                </div>
              </div>
            ))}

            {occupiedSlots.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active bookings at the moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Operations</CardTitle>
          <CardDescription>Handle walk-in customers and special cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center bg-transparent"
              onClick={() => {
                const availableSlot = parkingSlots.find((slot) => slot.status === "available")
                if (availableSlot) {
                  handleManualCheckIn(availableSlot.id)
                }
              }}
            >
              <Car className="h-6 w-6 mb-2" />
              Manual Check-in
            </Button>

            <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Report Issue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
