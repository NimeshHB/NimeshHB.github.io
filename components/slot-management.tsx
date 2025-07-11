"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Plus, Edit, Trash2, MapPin, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"

export function SlotManagement({ parkingSlots, onSlotsUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [newSlot, setNewSlot] = useState({
    number: "",
    section: "A",
    type: "regular",
    hourlyRate: 5,
    status: "available",
    maxTimeLimit: 2,
    description: "",
  })

  const slotTypes = [
    { value: "regular", label: "Regular", rate: 5 },
    { value: "compact", label: "Compact", rate: 4 },
    { value: "large", label: "Large Vehicle", rate: 7 },
    { value: "electric", label: "Electric Vehicle", rate: 6 },
    { value: "handicap", label: "Handicap", rate: 5 },
    { value: "vip", label: "VIP", rate: 10 },
  ]

  const sections = ["A", "B", "C", "D", "E"]

  const handleAddSlot = () => {
    if (!newSlot.number) {
      alert("Please enter a slot number")
      return
    }

    // Check if slot number already exists
    const existingSlot = parkingSlots.find((slot) => slot.number === newSlot.number)
    if (existingSlot && !editingSlot) {
      alert("Slot number already exists")
      return
    }

    const slot = {
      id: editingSlot ? editingSlot.id : Math.max(...parkingSlots.map((s) => s.id), 0) + 1,
      ...newSlot,
      bookedBy: null,
      vehicleNumber: null,
      bookedAt: null,
      createdAt: editingSlot ? editingSlot.createdAt : new Date(),
      updatedAt: new Date(),
    }

    if (editingSlot) {
      const updatedSlots = parkingSlots.map((s) => (s.id === editingSlot.id ? slot : s))
      onSlotsUpdate(updatedSlots)
    } else {
      onSlotsUpdate([...parkingSlots, slot])
    }

    setNewSlot({
      number: "",
      section: "A",
      type: "regular",
      hourlyRate: 5,
      status: "available",
      maxTimeLimit: 2,
      description: "",
    })
    setShowAddForm(false)
    setEditingSlot(null)
  }

  const handleEditSlot = (slot) => {
    setEditingSlot(slot)
    setNewSlot({
      number: slot.number,
      section: slot.section || "A",
      type: slot.type || "regular",
      hourlyRate: slot.hourlyRate || 5,
      status: slot.status,
      maxTimeLimit: slot.maxTimeLimit || 2,
      description: slot.description || "",
    })
    setShowAddForm(true)
  }

  const handleDeleteSlot = (slotId) => {
    const slot = parkingSlots.find((s) => s.id === slotId)
    if (slot && slot.status === "occupied") {
      alert("Cannot delete an occupied slot")
      return
    }

    if (confirm("Are you sure you want to delete this slot?")) {
      const updatedSlots = parkingSlots.filter((s) => s.id !== slotId)
      onSlotsUpdate(updatedSlots)
    }
  }

  const handleSlotStatusChange = (slotId, newStatus) => {
    const updatedSlots = parkingSlots.map((slot) => {
      if (slot.id === slotId) {
        const updatedSlot = { ...slot, status: newStatus }

        // Clear booking data if changing to available or blocked
        if (newStatus === "available" || newStatus === "blocked") {
          updatedSlot.bookedBy = null
          updatedSlot.vehicleNumber = null
          updatedSlot.bookedAt = null
        }

        // Set maintenance info if blocking
        if (newStatus === "blocked") {
          updatedSlot.bookedBy = "Maintenance"
          updatedSlot.bookedAt = new Date()
        }

        return updatedSlot
      }
      return slot
    })
    onSlotsUpdate(updatedSlots)
  }

  const generateSlotNumber = () => {
    const sectionSlots = parkingSlots.filter((slot) => slot.number.startsWith(newSlot.section))
    const nextNumber = sectionSlots.length + 1
    setNewSlot({ ...newSlot, number: `${newSlot.section}${String(nextNumber).padStart(2, "0")}` })
  }

  const getSlotStats = () => {
    const total = parkingSlots.length
    const available = parkingSlots.filter((s) => s.status === "available").length
    const occupied = parkingSlots.filter((s) => s.status === "occupied").length
    const blocked = parkingSlots.filter((s) => s.status === "blocked").length
    const revenue = parkingSlots
      .filter((s) => s.bookedAt)
      .reduce((sum, slot) => {
        const hours = Math.ceil((new Date() - new Date(slot.bookedAt)) / (1000 * 60 * 60))
        return sum + hours * (slot.hourlyRate || 5)
      }, 0)

    return { total, available, occupied, blocked, revenue }
  }

  const stats = getSlotStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Slot Management</h2>
          <p className="text-gray-600">Manage parking slots, pricing, and availability</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Slot
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Parking capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Ready for booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Car className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
            <p className="text-xs text-muted-foreground">Currently parked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.blocked}</div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Estimated earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Slot Form */}
      {showAddForm && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingSlot ? "Edit Slot" : "Add New Slot"}
            </CardTitle>
            <CardDescription>
              {editingSlot
                ? "Update slot information and settings"
                : "Create a new parking slot with specific configuration"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slot-section">Section</Label>
                <Select value={newSlot.section} onValueChange={(value) => setNewSlot({ ...newSlot, section: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slot-number">Slot Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="slot-number"
                    value={newSlot.number}
                    onChange={(e) => setNewSlot({ ...newSlot, number: e.target.value.toUpperCase() })}
                    placeholder="e.g., A01"
                  />
                  <Button type="button" variant="outline" onClick={generateSlotNumber}>
                    Auto
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slot-type">Slot Type</Label>
                <Select
                  value={newSlot.type}
                  onValueChange={(value) => {
                    const selectedType = slotTypes.find((t) => t.value === value)
                    setNewSlot({
                      ...newSlot,
                      type: value,
                      hourlyRate: selectedType ? selectedType.rate : 5,
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select slot type" />
                  </SelectTrigger>
                  <SelectContent>
                    {slotTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} (${type.rate}/hr)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slot-rate">Hourly Rate ($)</Label>
                <Input
                  id="slot-rate"
                  type="number"
                  min="1"
                  step="0.5"
                  value={newSlot.hourlyRate}
                  onChange={(e) => setNewSlot({ ...newSlot, hourlyRate: Number.parseFloat(e.target.value) || 5 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slot-time-limit">Max Time Limit (hours)</Label>
                <Input
                  id="slot-time-limit"
                  type="number"
                  min="1"
                  max="24"
                  value={newSlot.maxTimeLimit}
                  onChange={(e) => setNewSlot({ ...newSlot, maxTimeLimit: Number.parseInt(e.target.value) || 2 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slot-status">Initial Status</Label>
                <Select value={newSlot.status} onValueChange={(value) => setNewSlot({ ...newSlot, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="blocked">Blocked/Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="slot-description">Description (Optional)</Label>
              <Input
                id="slot-description"
                value={newSlot.description}
                onChange={(e) => setNewSlot({ ...newSlot, description: e.target.value })}
                placeholder="e.g., Near entrance, Covered parking, etc."
              />
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddSlot}>{editingSlot ? "Update Slot" : "Add Slot"}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingSlot(null)
                  setNewSlot({
                    number: "",
                    section: "A",
                    type: "regular",
                    hourlyRate: 5,
                    status: "available",
                    maxTimeLimit: 2,
                    description: "",
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slots List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Slots ({parkingSlots.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({stats.available})</TabsTrigger>
          <TabsTrigger value="occupied">Occupied ({stats.occupied})</TabsTrigger>
          <TabsTrigger value="blocked">Blocked ({stats.blocked})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Parking Slots</CardTitle>
              <CardDescription>Complete list of parking slots with management options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parkingSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">{slot.number}</p>
                          <Badge variant="outline" className="capitalize">
                            {slot.type || "regular"}
                          </Badge>
                          <Badge
                            variant={
                              slot.status === "available"
                                ? "default"
                                : slot.status === "occupied"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {slot.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          ${slot.hourlyRate || 5}/hr • Max {slot.maxTimeLimit || 2}h
                        </p>
                        {slot.vehicleNumber && (
                          <p className="text-sm text-gray-500">
                            🚗 {slot.vehicleNumber} • {slot.bookedBy}
                          </p>
                        )}
                        {slot.description && <p className="text-xs text-gray-400">{slot.description}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {slot.status === "occupied" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSlotStatusChange(slot.id, "available")}
                          className="text-green-600"
                        >
                          Free Slot
                        </Button>
                      )}

                      {slot.status === "available" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSlotStatusChange(slot.id, "blocked")}
                          className="text-orange-600"
                        >
                          Block
                        </Button>
                      )}

                      {slot.status === "blocked" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSlotStatusChange(slot.id, "available")}
                          className="text-green-600"
                        >
                          Unblock
                        </Button>
                      )}

                      <Button size="sm" variant="outline" onClick={() => handleEditSlot(slot)}>
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-red-600"
                        disabled={slot.status === "occupied"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Slots</CardTitle>
              <CardDescription>Slots ready for booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parkingSlots
                  .filter((slot) => slot.status === "available")
                  .map((slot) => (
                    <div key={slot.id} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{slot.number}</h3>
                        <Badge className="bg-green-600">Available</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        ${slot.hourlyRate || 5}/hr • {slot.type || "regular"}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditSlot(slot)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSlotStatusChange(slot.id, "blocked")}
                          className="text-orange-600"
                        >
                          Block
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupied">
          <Card>
            <CardHeader>
              <CardTitle>Occupied Slots</CardTitle>
              <CardDescription>Currently parked vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parkingSlots
                  .filter((slot) => slot.status === "occupied")
                  .map((slot) => (
                    <div key={slot.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{slot.number}</h3>
                            <Badge variant="destructive">Occupied</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            🚗 {slot.vehicleNumber} • {slot.bookedBy}
                          </p>
                          <p className="text-xs text-gray-500">
                            Since: {slot.bookedAt ? new Date(slot.bookedAt).toLocaleString() : "Unknown"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSlotStatusChange(slot.id, "available")}
                            className="text-green-600"
                          >
                            Check Out
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditSlot(slot)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Slots</CardTitle>
              <CardDescription>Slots under maintenance or blocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parkingSlots
                  .filter((slot) => slot.status === "blocked")
                  .map((slot) => (
                    <div key={slot.id} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{slot.number}</h3>
                            <Badge variant="secondary">Blocked</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Reason: {slot.bookedBy || "Maintenance"}</p>
                          <p className="text-xs text-gray-500">
                            Since: {slot.bookedAt ? new Date(slot.bookedAt).toLocaleString() : "Unknown"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSlotStatusChange(slot.id, "available")}
                            className="text-green-600"
                          >
                            Unblock
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditSlot(slot)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
