import { UserService } from "../lib/services/userService"
import { ParkingSlotService } from "../lib/services/parkingSlotService"

async function seedDatabase() {
  console.log("🌱 Seeding MongoDB Atlas database...")

  const userService = new UserService()
  const slotService = new ParkingSlotService()

  try {
    // Check if users already exist
    const existingUsers = await userService.getAllUsers()
    if (existingUsers.length > 0) {
      console.log("⚠️  Database already seeded. Skipping...")
      return
    }

    console.log("👤 Creating users...")

    // Create Super Admin
    await userService.createUser({
      name: "Super Admin",
      email: "admin@parking.com",
      password: "admin123",
      role: "admin",
      adminLevel: "super",
      permissions: ["all"],
      status: "active",
    })

    // Create Manager Admin
    await userService.createUser({
      name: "Manager Admin",
      email: "manager@parking.com",
      password: "manager123",
      role: "admin",
      adminLevel: "manager",
      permissions: ["slots", "users", "reports"],
      status: "active",
    })

    // // Create Attendant
    // await userService.createUser({
    //   name: "Jane Smith",
    //   email: "attendant@parking.com",
    //   password: "attendant123",
    //   role: "attendant",
    //   status: "active",
    // })

    // // Create Test Users
    // await userService.createUser({
    //   name: "John Doe",
    //   email: "john@example.com",
    //   password: "password123",
    //   role: "user",
    //   phone: "+1234567890",
    //   vehicleNumber: "ABC123",
    //   vehicleType: "car",
    //   status: "active",
    // })

    // await userService.createUser({
    //   name: "Sarah Wilson",
    //   email: "sarah@example.com",
    //   password: "password123",
    //   role: "user",
    //   phone: "+1234567891",
    //   vehicleNumber: "XYZ789",
    //   vehicleType: "suv",
    //   status: "active",
    // })

    console.log("✅ Users created successfully")

    console.log("🅿️  Creating parking slots...")

    // Create parking slots
    // const slotTypes = [
    //   { type: "regular", rate: 5 },
    //   { type: "compact", rate: 4 },
    //   { type: "large", rate: 7 },
    //   { type: "electric", rate: 6 },
    //   { type: "handicap", rate: 5 },
    //   { type: "vip", rate: 10 },
    // ]

    const sections = ["A", "B", "C"]

    for (const section of sections) {
      for (let i = 1; i <= 10; i++) {
        const slotNumber = `${section}${i.toString().padStart(2, "0")}`
        const randomSlotType = slotTypes[Math.floor(Math.random() * slotTypes.length)]

        await slotService.createSlot({
          number: slotNumber,
          section,
          type: randomSlotType.type as any,
          hourlyRate: randomSlotType.rate,
          maxTimeLimit: Math.random() > 0.5 ? 2 : 4, // Random 2 or 4 hours
          description: `${randomSlotType.type.charAt(0).toUpperCase() + randomSlotType.type.slice(1)} parking slot in section ${section}`,
          status: Math.random() > 0.8 ? "blocked" : "available", // 20% chance of being blocked
        })
      }
    }

    console.log("✅ Parking slots created successfully")

    // Get some stats
    const userStats = await userService.getAllUsers()
    const slotStats = await slotService.getAllSlots()

    console.log("\n📊 Database Statistics:")
    console.log(`👥 Total Users: ${userStats.length}`)
    console.log(`   - Admins: ${userStats.filter((u) => u.role === "admin").length}`)
    console.log(`   - Users: ${userStats.filter((u) => u.role === "user").length}`)
    console.log(`   - Attendants: ${userStats.filter((u) => u.role === "attendant").length}`)
    console.log(`🅿️  Total Slots: ${slotStats.length}`)
    console.log(`   - Available: ${slotStats.filter((s) => s.status === "available").length}`)
    console.log(`   - Blocked: ${slotStats.filter((s) => s.status === "blocked").length}`)

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n🔐 Demo Login Credentials:")
    console.log("   Super Admin: admin@parking.com / admin123")
    console.log("   Manager: manager@parking.com / manager123")
    console.log("   Attendant: attendant@parking.com / attendant123")
    console.log("   User: john@example.com / password123")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
