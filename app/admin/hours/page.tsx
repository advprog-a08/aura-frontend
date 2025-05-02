"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Clock, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function OpeningHours() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(true)
  const [success, setSuccess] = useState("")
  const [hours, setHours] = useState({
    monday: { open: "10:00", close: "22:00", isOpen: true },
    tuesday: { open: "10:00", close: "22:00", isOpen: true },
    wednesday: { open: "10:00", close: "22:00", isOpen: true },
    thursday: { open: "10:00", close: "22:00", isOpen: true },
    friday: { open: "10:00", close: "22:00", isOpen: true },
    saturday: { open: "11:00", close: "23:00", isOpen: true },
    sunday: { open: "11:00", close: "23:00", isOpen: true },
  })

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setHours({
      ...hours,
      [day]: {
        ...hours[day as keyof typeof hours],
        [field]: value,
      },
    })
  }

  const handleSaveHours = () => {
    // In a real app, this would save to a database
    setSuccess("Opening hours updated successfully")
    toast({
      title: "Hours Updated",
      description: "Restaurant opening hours have been updated successfully.",
    })

    // Clear success message after a few seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  const handleToggleRestaurant = () => {
    setIsOpen(!isOpen)
    toast({
      title: isOpen ? "Restaurant Closed" : "Restaurant Opened",
      description: `Restaurant is now ${isOpen ? "closed" : "open"} for orders.`,
    })
  }

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Opening Hours</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your restaurant's opening hours</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Status</CardTitle>
              <CardDescription>Toggle whether your restaurant is currently open or closed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">Restaurant is currently {isOpen ? "open" : "closed"}</span>
                </div>
                <Switch checked={isOpen} onCheckedChange={handleToggleRestaurant} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Set your regular opening hours for each day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                  <Check className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {days.map((day) => (
                  <div key={day.key} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                    <div className="font-medium">{day.label}</div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${day.key}-open`} className="sr-only">
                        Open
                      </Label>
                      <Input
                        id={`${day.key}-open`}
                        type="time"
                        value={hours[day.key as keyof typeof hours].open}
                        onChange={(e) => handleHoursChange(day.key, "open", e.target.value)}
                        disabled={!hours[day.key as keyof typeof hours].isOpen}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${day.key}-close`} className="sr-only">
                        Close
                      </Label>
                      <Input
                        id={`${day.key}-close`}
                        type="time"
                        value={hours[day.key as keyof typeof hours].close}
                        onChange={(e) => handleHoursChange(day.key, "close", e.target.value)}
                        disabled={!hours[day.key as keyof typeof hours].isOpen}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`${day.key}-toggle`}
                        checked={hours[day.key as keyof typeof hours].isOpen}
                        onCheckedChange={(checked) => handleHoursChange(day.key, "isOpen", checked)}
                      />
                      <Label htmlFor={`${day.key}-toggle`} className="text-sm text-gray-500">
                        {hours[day.key as keyof typeof hours].isOpen ? "Open" : "Closed"}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-700 hover:bg-green-800" onClick={handleSaveHours}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
