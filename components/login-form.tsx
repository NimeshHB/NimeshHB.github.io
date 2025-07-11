"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Shield, Users, Eye, EyeOff, Loader2 } from "lucide-react"

export function LoginForm({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    vehicleNumber: "",
    vehicleType: "",
    role: "user",
    adminLevel: "manager",
    permissions: [],
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const vehicleTypes = [
    { value: "car", label: "Car" },
    { value: "suv", label: "SUV" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "truck", label: "Truck" },
    { value: "van", label: "Van" },
    { value: "electric", label: "Electric Vehicle" },
  ]

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (data.success) {
        onLogin(data.user)
      } else {
        setErrors({ login: data.error || "Login failed" })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ login: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Client-side validation
    const newErrors = {}
    if (!registerData.name) newErrors.name = "Name is required"
    if (!registerData.email) newErrors.email = "Email is required"
    if (!registerData.password) newErrors.password = "Password is required"
    if (registerData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    if (registerData.role === "user") {
      if (!registerData.vehicleNumber) newErrors.vehicleNumber = "Vehicle number is required"
      if (!registerData.vehicleType) newErrors.vehicleType = "Vehicle type is required"
      if (!registerData.phone) newErrors.phone = "Phone number is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (data.success) {
        onLogin(data.user)
      } else {
        setErrors({ register: data.error || "Registration failed" })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ register: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (email) => {
    setLoading(true)
    setErrors({})

    // Demo credentials
    const demoCredentials = {
      "admin@parking.com": "admin123",
      "manager@parking.com": "manager123",
      "attendant@parking.com": "attendant123",
      "john@example.com": "password123",
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: demoCredentials[email],
        }),
      })

      const data = await response.json()

      if (data.success) {
        onLogin(data.user)
      } else {
        setErrors({ login: data.error || "Quick login failed" })
      }
    } catch (error) {
      console.error("Quick login error:", error)
      setErrors({ login: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Car className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Parking</h1>
          </div>
          <p className="text-gray-600">A Proud Group 09 Collaborative Project! 🚗📋</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={errors.login ? "border-red-500" : ""}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className={errors.login ? "border-red-500" : ""}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {errors.login && <p className="text-sm text-red-600">{errors.login}</p>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Account Type</Label>
                    <Select
                      value={registerData.role}
                      onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Vehicle User</SelectItem>
                        <SelectItem value="attendant">Parking Attendant</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {registerData.role === "admin" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="register-admin-level">Admin Level</Label>
                        <Select
                          value={registerData.adminLevel}
                          onValueChange={(value) => setRegisterData({ ...registerData, adminLevel: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select admin level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="super">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Admin Permissions</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["slots", "users", "reports", "settings"].map((permission) => (
                            <label key={permission} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={registerData.permissions.includes(permission)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setRegisterData({
                                      ...registerData,
                                      permissions: [...registerData.permissions, permission],
                                    })
                                  } else {
                                    setRegisterData({
                                      ...registerData,
                                      permissions: registerData.permissions.filter((p) => p !== permission),
                                    })
                                  }
                                }}
                                className="rounded"
                                disabled={loading}
                              />
                              <span className="text-sm capitalize">{permission}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name *</Label>
                      <Input
                        id="register-name"
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className={errors.name ? "border-red-500" : ""}
                        disabled={loading}
                      />
                      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email Address *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className={errors.email ? "border-red-500" : ""}
                        disabled={loading}
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {registerData.role === "user" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="register-phone">Phone Number *</Label>
                          <Input
                            id="register-phone"
                            placeholder="Enter your phone number"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            className={errors.phone ? "border-red-500" : ""}
                            disabled={loading}
                          />
                          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-vehicle-number">Vehicle Number *</Label>
                          <Input
                            id="register-vehicle-number"
                            placeholder="e.g., ABC123 or AB12CD3456"
                            value={registerData.vehicleNumber}
                            onChange={(e) =>
                              setRegisterData({ ...registerData, vehicleNumber: e.target.value.toUpperCase() })
                            }
                            className={errors.vehicleNumber ? "border-red-500" : ""}
                            disabled={loading}
                          />
                          {errors.vehicleNumber && <p className="text-sm text-red-600">{errors.vehicleNumber}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="register-vehicle-type">Vehicle Type *</Label>
                          <Select
                            value={registerData.vehicleType}
                            onValueChange={(value) => setRegisterData({ ...registerData, vehicleType: value })}
                            disabled={loading}
                          >
                            <SelectTrigger className={errors.vehicleType ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select your vehicle type" />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicleTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.vehicleType && <p className="text-sm text-red-600">{errors.vehicleType}</p>}
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password (min 6 characters)"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className={errors.password ? "border-red-500" : ""}
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password *</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                        disabled={loading}
                      />
                      {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  {errors.register && <p className="text-sm text-red-600">{errors.register}</p>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Introducing the Parking Management System </p>
          <p className="mt-1">UoR</p>
        </div>
      </div>
    </div>
  )
}
