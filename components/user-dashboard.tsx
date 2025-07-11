"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, MapPin, CreditCard, History } from "lucide-react"
// Import the UserProfile component at the top
import { UserProfile } from "./user-profile"

export function UserDashboard({ parkingSlots, currentUser, onSlotUpdate }) {
  const userBookings = parkingSlots.filter((slot) => slot.bookedBy === currentUser.name)
  const availableSlots = parkingSlots.filter((slot) => slot.status === "available").length
  const currentBooking = userBookings.find((slot) => slot.status === "occupied")

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

  const getTimeElapsed = (bookedAt) => {
    if (!bookedAt) return null
    const elapsed = Math.floor((new Date() - new Date(bookedAt)) / (1000 * 60))
    if (elapsed < 60) return `${elapsed} minutes`
    return `${Math.floor(elapsed / 60)} hours ${elapsed % 60} minutes`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>
        <Badge variant="outline" className="text-sm">
          Welcome, {currentUser.name}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableSlots}</div>
            <p className="text-xs text-muted-foreground">Ready for booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Booking</CardTitle>
            <Car className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBooking ? currentBooking.number : "None"}</div>
            <p className="text-xs text-muted-foreground">{currentBooking ? "Currently parked" : "No active booking"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Vehicle</CardTitle>
            <Car className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.vehicleNumber || "N/A"}</div>
            <p className="text-xs text-muted-foreground capitalize">{currentUser.vehicleType || "Not specified"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <History className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Booking Status */}
      {currentBooking && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Active Parking Session
            </CardTitle>
            <CardDescription>You are currently parked in slot {currentBooking.number}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Slot Number</p>
                  <p className="text-lg font-bold text-blue-600">{currentBooking.number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Vehicle</p>
                  <p className="text-lg font-bold">{currentUser.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-lg font-bold text-orange-600">{getTimeElapsed(currentBooking.bookedAt)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Started at {new Date(currentBooking.bookedAt).toLocaleTimeString()}
                </div>
                <Button onClick={() => handleCheckOut(currentBooking.id)} className="bg-red-600 hover:bg-red-700">
                  Check Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Book</CardTitle>
            <CardDescription>Find and book an available parking slot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{availableSlots} slots available for immediate booking</p>
              <Button className="w-full" disabled={currentBooking || availableSlots === 0}>
                {currentBooking
                  ? "Already Parked"
                  : availableSlots === 0
                    ? "No Slots Available"
                    : "Find Available Slot"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription>View your recent parking sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">Slot A05</p>
                  <p className="text-xs text-gray-500">Yesterday, 2:30 PM</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  2h 15m
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">Slot A03</p>
                  <p className="text-xs text-gray-500">Dec 28, 10:15 AM</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  1h 45m
                </Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View All History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment & Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment & Billing
          </CardTitle>
          <CardDescription>Manage your payment methods and view billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Current Balance</h4>
              <p className="text-2xl font-bold text-green-600">$25.50</p>
              <p className="text-sm text-gray-500">Available credit</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">This Month</h4>
              <p className="text-2xl font-bold">$48.75</p>
              <p className="text-sm text-gray-500">Total spent</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              Add Funds
            </Button>
            <Button variant="outline" size="sm">
              Payment Methods
            </Button>
            <Button variant="outline" size="sm">
              Billing History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Management */}
      <UserProfile
        currentUser={currentUser}
        onUserUpdate={(updatedUser) => {
          // In a real app, this would update the user in the database
          console.log("User updated:", updatedUser)
        }}
      />
    </div>
  )
}
