"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Users, Plus, Edit, Trash2, Search, UserCheck, UserX, Settings, Eye, EyeOff } from "lucide-react"

// Mock admin data - in real app, this would come from your database
const mockAdmins = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@parking.com",
    role: "admin",
    adminLevel: "super",
    permissions: ["all"],
    status: "active",
    lastLogin: new Date("2024-01-15T10:30:00"),
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "manager@parking.com",
    role: "admin",
    adminLevel: "manager",
    permissions: ["slots", "users", "reports"],
    status: "active",
    lastLogin: new Date("2024-01-14T15:45:00"),
    createdAt: new Date("2024-01-05T00:00:00"),
  },
  {
    id: 3,
    name: "Sarah Wilson",
    email: "sarah@parking.com",
    role: "admin",
    adminLevel: "manager",
    permissions: ["slots", "reports"],
    status: "inactive",
    lastLogin: new Date("2024-01-10T09:15:00"),
    createdAt: new Date("2024-01-03T00:00:00"),
  },
]

export function AdminManagement({ currentUser }) {
  const [admins, setAdmins] = useState(mockAdmins)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    adminLevel: "manager",
    permissions: [],
    status: "active",
  })

  const allPermissions = ["slots", "users", "reports", "settings", "billing", "analytics"]

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert("Please fill in all required fields")
      return
    }

    const admin = {
      id: admins.length + 1,
      ...newAdmin,
      role: "admin",
      lastLogin: null,
      createdAt: new Date(),
    }

    setAdmins([...admins, admin])
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      adminLevel: "manager",
      permissions: [],
      status: "active",
    })
    setShowAddForm(false)
  }

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin)
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      password: "",
      adminLevel: admin.adminLevel,
      permissions: admin.permissions,
      status: admin.status,
    })
    setShowAddForm(true)
  }

  const handleUpdateAdmin = () => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === editingAdmin.id ? { ...admin, ...newAdmin, password: newAdmin.password || admin.password } : admin,
    )
    setAdmins(updatedAdmins)
    setEditingAdmin(null)
    setShowAddForm(false)
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      adminLevel: "manager",
      permissions: [],
      status: "active",
    })
  }

  const handleDeleteAdmin = (adminId) => {
    if (adminId === currentUser.id) {
      alert("You cannot delete your own account")
      return
    }
    if (confirm("Are you sure you want to delete this admin?")) {
      setAdmins(admins.filter((admin) => admin.id !== adminId))
    }
  }

  const toggleAdminStatus = (adminId) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === adminId ? { ...admin, status: admin.status === "active" ? "inactive" : "active" } : admin,
    )
    setAdmins(updatedAdmins)
  }

  const handlePermissionChange = (permission) => {
    if (newAdmin.permissions.includes(permission)) {
      setNewAdmin({
        ...newAdmin,
        permissions: newAdmin.permissions.filter((p) => p !== permission),
      })
    } else {
      setNewAdmin({
        ...newAdmin,
        permissions: [...newAdmin.permissions, permission],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600">Manage admin users and their permissions</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
            <p className="text-xs text-muted-foreground">Registered admins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {admins.filter((admin) => admin.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Settings className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {admins.filter((admin) => admin.adminLevel === "super").length}
            </div>
            <p className="text-xs text-muted-foreground">Full access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Admins</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {admins.filter((admin) => admin.status === "inactive").length}
            </div>
            <p className="text-xs text-muted-foreground">Deactivated</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Admin Form */}
      {showAddForm && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingAdmin ? "Edit Admin" : "Add New Admin"}
            </CardTitle>
            <CardDescription>
              {editingAdmin
                ? "Update admin information and permissions"
                : "Create a new admin account with specific permissions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Full Name *</Label>
                <Input
                  id="admin-name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Address *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password {editingAdmin ? "(leave blank to keep current)" : "*"}</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder={editingAdmin ? "Enter new password" : "Enter password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-level">Admin Level</Label>
                <Select
                  value={newAdmin.adminLevel}
                  onValueChange={(value) => setNewAdmin({ ...newAdmin, adminLevel: value })}
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
                <Label htmlFor="admin-status">Status</Label>
                <Select value={newAdmin.status} onValueChange={(value) => setNewAdmin({ ...newAdmin, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allPermissions.map((permission) => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={editingAdmin ? handleUpdateAdmin : handleAddAdmin}>
                {editingAdmin ? "Update Admin" : "Add Admin"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingAdmin(null)
                  setNewAdmin({
                    name: "",
                    email: "",
                    password: "",
                    adminLevel: "manager",
                    permissions: [],
                    status: "active",
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Admin List</CardTitle>
          <CardDescription>Manage existing admin accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search admins by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{admin.name}</p>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={admin.status === "active" ? "default" : "secondary"}>{admin.status}</Badge>
                      <Badge variant="outline" className="capitalize">
                        {admin.adminLevel}
                      </Badge>
                      <span className="text-xs text-gray-500">{admin.permissions.length} permissions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right text-sm text-gray-500 mr-4">
                    <p>Last login:</p>
                    <p>{admin.lastLogin ? admin.lastLogin.toLocaleDateString() : "Never"}</p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAdminStatus(admin.id)}
                    className={admin.status === "active" ? "text-red-600" : "text-green-600"}
                  >
                    {admin.status === "active" ? "Deactivate" : "Activate"}
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => handleEditAdmin(admin)}>
                    <Edit className="h-4 w-4" />
                  </Button>

                  {admin.id !== currentUser.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredAdmins.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No admins found matching your search</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
