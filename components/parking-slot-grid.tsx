import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function ParkingSlotGrid({ slots, onSlotUpdate, userRole, currentUser }) {
  const handleSlotAction = (slotId, action) => {
    const updatedSlots = slots.map((slot) => {
      if (slot.id === slotId) {
        switch (action) {
          case "book":
            return {
              ...slot,
              status: "occupied",
              bookedBy: currentUser.name,
              vehicleNumber: currentUser.vehicleNumber || `ABC${Math.floor(Math.random() * 1000)}`, // Fallback if no vehicleNumber
              vehicleType: null, // Removed vehicleType
              bookedAt: new Date(),
            }
          case "free":
            return {
              ...slot,
              status: "available",
              bookedBy: null,
              vehicleNumber: null,
              vehicleType: null, // Ensure vehicleType is null on free
              bookedAt: null,
            }
          case "block":
            return {
              ...slot,
              status: "blocked",
              bookedBy: "Maintenance",
              vehicleNumber: null,
              vehicleType: null, // Ensure vehicleType is null on block
              bookedAt: new Date(),
            }
          default:
            return slot
        }
      }
      return slot
    })
    onSlotUpdate(updatedSlots)
  }

  const getSlotColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-300 hover:bg-green-200"
      case "occupied":
        return "bg-red-100 border-red-300"
      case "reserved":
        return "bg-yellow-100 border-yellow-300"
      case "blocked":
        return "bg-gray-100 border-gray-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getTimeElapsed = (bookedAt) => {
    if (!bookedAt) return null
    const elapsed = Math.floor((new Date() - new Date(bookedAt)) / (1000 * 60))
    if (elapsed < 60) return `${elapsed}m`
    return `${Math.floor(elapsed / 60)}h ${elapsed % 60}m`
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {slots.map((slot) => (
        <Card
          key={slot.id}
          className={cn("relative transition-all duration-200 cursor-pointer", getSlotColor(slot.status))}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Car
                  className={cn(
                    "h-8 w-8",
                    slot.status === "available"
                      ? "text-green-600"
                      : slot.status === "occupied"
                        ? "text-red-600"
                        : slot.status === "blocked"
                          ? "text-gray-600"
                          : "text-yellow-600",
                  )}
                />
              </div>

              <h3 className="font-bold text-lg mb-1">{slot.number}</h3>

              <Badge variant={slot.status === "available" ? "default" : "secondary"} className="mb-2 capitalize">
                {slot.status}
              </Badge>

              {slot.vehicleNumber && <p className="text-xs text-gray-600 mb-1">🚗 {slot.vehicleNumber}</p>}

              {/* Removed vehicleType display */}
              {/* {slot.vehicleType && <p className="text-xs text-gray-600 mb-1 capitalize">🚗 {slot.vehicleType}</p> } */}

              {slot.bookedBy && (
                <p className="text-xs text-gray-600 mb-1">
                  <User className="inline h-3 w-3 mr-1" />
                  {slot.bookedBy}
                </p>
              )}

              {slot.bookedAt && (
                <p className="text-xs text-gray-500 mb-2">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {getTimeElapsed(slot.bookedAt)}
                </p>
              )}

              {/* Action Buttons based on role */}
              <div className="space-y-1">
                {userRole === "user" && slot.status === "available" && (
                  <Button size="sm" className="w-full text-xs" onClick={() => handleSlotAction(slot.id, "book")}>
                    Book Now
                  </Button>
                )}

                {userRole === "admin" && (
                  <div className="space-y-1">
                    {slot.status === "occupied" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs bg-transparent"
                        onClick={() => handleSlotAction(slot.id, "free")}
                      >
                        Free Slot
                      </Button>
                    )}
                    {slot.status === "available" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full text-xs"
                        onClick={() => handleSlotAction(slot.id, "block")}
                      >
                        Block
                      </Button>
                    )}
                  </div>
                )}

                {userRole === "attendant" && slot.status === "occupied" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs bg-transparent"
                    onClick={() => handleSlotAction(slot.id, "free")}
                  >
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}