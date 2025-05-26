"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function AdminProfile() {
  const { toast, dismiss } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function fetchAdmin() {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8082/admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          throw new Error("Failed to fetch admin data")
        }
        const data = await res.json()
        setFormData({ name: data.name, email: data.email })
      } catch (e: any) {
        setError(e.message || "Failed to fetch admin data")
      } finally {
        setLoading(false)
      }
    }
    fetchAdmin()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    const toastId = toast({
      title: "Updating...",
      description: "Saving your changes.",
    }).id
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8082/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_name: formData.name }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to update profile")
      }
      setSuccess("Profile updated successfully")
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (e: any) {
      setError(e.message || "Failed to update profile")
      toast({
        title: "Update Failed",
        description: e.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      if (toastId) {
        dismiss(toastId)
      }
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="flex justify-center mb-6">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(formData.name)}`}
                alt="Profile Avatar"
                className="h-24 w-24 rounded-full bg-green-100"
              />
            </div>
            {error && (
              <div className="text-red-600 text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-700 text-center">{success}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={loading}>
              {loading ? "Saving..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
