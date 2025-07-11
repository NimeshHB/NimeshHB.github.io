"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, Car, Phone, Mail, Edit, Save, X } from "lucide-react"

export function UserProfile({ currentUser, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: currentUser.name || "",
    phone: currentUser.phone || "",
    vehicleNumber: currentUser.vehicleNumber || "",
    vehicleType: currentUser.vehicleType || "",
  })
  const [errors, setErrors] = useState({})

  const vehicleTypes = [
    { value: "car", label: "Car" },
    { value: "suv", label: "SUV" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "truck", label: "Truck" },
    { value: "van", label: "Van" },
    { value: "electric", label: "Electric Vehicle" },
  ]

  const handleSave = () => {
    const newErrors = {}

    if (currentUser.role === "user") {
      if (!editData.vehicleNumber) newErrors.vehicleNumber = "Vehicle number is required"
      if (!editData.vehicleType) newErrors.vehicleType = "Vehicle type is required"
      if (!editData.phone) newErrors.phone = "Phone number is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Update user data
    const updatedUser = { ...currentUser, ...editData }
    onUserUpdate(updatedUser)
    setIsEditing(false)
    setErrors({})
  }

  const handleCancel = () => {
    setEditData({
      name: currentUser.name || "",
      phone: currentUser.phone || "",
      vehicleNumber: currentUser.vehicleNumber || "",
      vehicleType: currentUser.vehicleType || "",
    })
    setIsEditing(false)
    setErrors({})
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Manage your account and vehicle details</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-sm bg-gray-50 p-2 rounded">{currentUser.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <p className="text-sm bg-gray-50 p-2 rounded flex-1">{currentUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Badge variant="outline" className="w-fit capitalize">
                  {currentUser.role}
                </Badge>
              </div>

              {currentUser.role === "user" && (
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm bg-gray-50 p-2 rounded flex-1">{currentUser.phone || "Not provided"}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Information - Only for users */}
          {currentUser.role === "user" && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Vehicle Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle Number</Label>
                  {isEditing ? (
                    <div>
                      <Input
                        value={editData.vehicleNumber}
                        onChange={(e) => setEditData({ ...editData, vehicleNumber: e.target.value.toUpperCase() })}
                        placeholder="e.g., ABC123 or AB12CD3456"
                        className={errors.vehicleNumber ? "border-red-500" : ""}
                      />
                      {errors.vehicleNumber && <p className="text-sm text-red-600 mt-1">{errors.vehicleNumber}</p>}
                    </div>
                  ) : (
                    <p className="text-sm bg-gray-50 p-2 rounded font-mono">
                      {currentUser.vehicleNumber || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  {isEditing ? (
                    <div>
                      <Select
                        value={editData.vehicleType}
                        onValueChange={(value) => setEditData({ ...editData, vehicleType: value })}
                      >
                        <SelectTrigger className={errors.vehicleType ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.vehicleType && <p className="text-sm text-red-600 mt-1">{errors.vehicleType}</p>}
                    </div>
                  ) : (
                    <p className="text-sm bg-gray-50 p-2 rounded capitalize">
                      {currentUser.vehicleType || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              {!isEditing && currentUser.vehicleNumber && currentUser.vehicleType && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Car className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">{currentUser.vehicleNumber}</p>
                      <p className="text-sm text-blue-700 capitalize">{currentUser.vehicleType}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
