"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { useAdminQuery, useUpdateAdminMutation, useDeleteAdminMutation } from "../../hooks"

export default function AdminProfile() {
  const { toast, dismiss } = useToast()
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [success, setSuccess] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  // Fetch admin data
  const {
    data: admin,
    isLoading,
    error,
  } = useAdminQuery()

  useEffect(() => {
    if (admin && admin.name) {
      setName(admin.name)
      setImageUrl(`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(admin.name)}`)
    }
  }, [admin])

  const updateMutation = useUpdateAdminMutation()
  const deleteMutation = useDeleteAdminMutation()

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("")
    const toastId = toast({
      title: "Updating...",
      description: "Saving your changes.",
    }).id
    updateMutation.mutate(name, {
      onSuccess: () => {
        setSuccess("Profile updated successfully")
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        })
        queryClient.invalidateQueries({ queryKey: ["admin-profile"] })
      },
      onError: (err: any) => {
        toast({
          title: "Update Failed",
          description: err.message || "Failed to update profile",
          variant: "destructive",
        })
      },
      onSettled: () => {
        dismiss(toastId)
      },
    })
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      deleteMutation.mutate()
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
                src={imageUrl}
                alt="Profile Avatar"
                className="h-24 w-24 rounded-full bg-green-100"
              />
            </div>
            {error && (
              <div className="text-red-600 text-center">{(error as Error).message}</div>
            )}
            {success && (
              <div className="text-green-700 text-center">{success}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={isLoading || updateMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={admin?.email || ""}
                disabled
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading || updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Delete Admin</CardTitle>
          <CardDescription>Remove your admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Admin"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
