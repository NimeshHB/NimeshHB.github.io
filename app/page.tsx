"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car } from "lucide-react"
import { ParkingSlotGrid } from "@/components/parking-slot-grid"
import { AdminDashboard } from "@/components/admin-dashboard"
import { UserDashboard } from "@/components/user-dashboard"
import { AttendantDashboard } from "@/components/attendant-dashboard"
import { LoginForm } from "@/components/login-form"

// Mock user data - in real app, this would come from your auth system
const mockUsers = {
  admin: { id: 1, name: "Admin User", role: "admin", email: "admin@parking.com" },
  // Remove the hardcoded user and attendant - they'll login properly
}

export default function ParkingManagementSystem() {
  const [currentUser, setCurrentUser] = useState(null)
  const [parkingSlots, setParkingSlots] = useState([])

  // Initialize parking slots with all available
  useEffect(() => {
    const initialSlots = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      number: `A${String(i + 1).padStart(2, "0")}`,
      status: "available",
      vehicleNumber: null,
      bookedBy: null,
      bookedAt: null,
      timeLimit: 2, // hours
    }))
    setParkingSlots(initialSlots)
  }, [])

  const handleLogin = (userData) => {
    setCurrentUser(userData)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Parking System</h1>
                <p className="text-sm text-gray-500">10 Slot Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="capitalize">
                {currentUser.role}
              </Badge>
              <span className="text-sm text-gray-700">{currentUser.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Parking Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Live Parking Status</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Block</span>
              </div>
            </div>
          </div>
          <ParkingSlotGrid
            slots={parkingSlots}
            onSlotUpdate={setParkingSlots}
            userRole={currentUser.role}
            currentUser={currentUser}
          />
        </div>

        {/* Role-based Dashboard */}
        {currentUser.role === "admin" && <AdminDashboard parkingSlots={parkingSlots} onSlotsUpdate={setParkingSlots} />}

        {currentUser.role === "user" && (
          <UserDashboard parkingSlots={parkingSlots} currentUser={currentUser} onSlotUpdate={setParkingSlots} />
        )}

        {currentUser.role === "attendant" && (
          <AttendantDashboard parkingSlots={parkingSlots} onSlotUpdate={setParkingSlots} />
        )}
      </main>
    </div>
  )
}