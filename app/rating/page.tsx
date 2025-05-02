"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Search, Trash2 } from "lucide-react"
import CustomerLayout from "@/components/customer-layout"
import { useToast } from "@/hooks/use-toast"

// Mock data for menu items
const initialMenuItems = [
  {
    id: 1,
    name: "Nasi Goreng Special",
    description: "Fried rice with chicken, vegetables, and egg",
    price: 35000,
    available: true,
    rating: 4.5,
    image: "/images/nasi-goreng.jpg",
  },
  {
    id: 2,
    name: "Mie Goreng",
    description: "Fried noodles with vegetables and chicken",
    price: 30000,
    available: true,
    rating: 4.2,
    image: "/images/mie-goreng.jpg",
  },
  {
    id: 3,
    name: "Ayam Bakar",
    description: "Grilled chicken with special sauce",
    price: 45000,
    available: true,
    rating: 4.7,
    image: "/images/ayam-bakar.jpg",
  },
  {
    id: 4,
    name: "Es Teh Manis",
    description: "Sweet iced tea",
    price: 8000,
    available: true,
    rating: 4.0,
    image: "/images/es-teh.jpg",
  },
  {
    id: 5,
    name: "Sate Ayam",
    description: "Chicken satay with peanut sauce",
    price: 35000,
    available: false,
    rating: 4.8,
    image: "/images/sate-ayam.jpg",
  },
]

// Mock user ratings
const initialUserRatings = [
  { itemId: 1, rating: 5 },
  { itemId: 3, rating: 4 },
]

export default function RatingPage() {
  const [menuItems] = useState(initialMenuItems)
  const [userRatings, setUserRatings] = useState(initialUserRatings)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getUserRating = (itemId: number) => {
    const rating = userRatings.find((r) => r.itemId === itemId)
    return rating ? rating.rating : 0
  }

  const setRating = (itemId: number, rating: number) => {
    const existingRating = userRatings.find((r) => r.itemId === itemId)

    if (existingRating) {
      setUserRatings(userRatings.map((r) => (r.itemId === itemId ? { ...r, rating } : r)))
    } else {
      setUserRatings([...userRatings, { itemId, rating }])
    }

    const item = menuItems.find((item) => item.id === itemId)
    if (item) {
      toast({
        title: "Rating Submitted",
        description: `You rated ${item.name} ${rating} stars.`,
      })
    }
  }

  const removeRating = (itemId: number) => {
    setUserRatings(userRatings.filter((r) => r.itemId !== itemId))

    const item = menuItems.find((item) => item.id === itemId)
    if (item) {
      toast({
        title: "Rating Removed",
        description: `Your rating for ${item.name} has been removed.`,
        variant: "destructive",
      })
    }
  }

  const renderStars = (itemId: number) => {
    const userRating = getUserRating(itemId)

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(itemId, star)}
            className={`rounded-full p-1 transition-colors ${
              star <= userRating ? "text-yellow-500 hover:text-yellow-600" : "text-gray-300 hover:text-yellow-400"
            }`}
          >
            <Star className="h-6 w-6" />
          </button>
        ))}

        {userRating > 0 && (
          <button
            onClick={() => removeRating(itemId)}
            className="ml-2 text-gray-400 hover:text-red-500 rounded-full p-1"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
    )
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Rate Our Menu</h1>
            <p className="text-gray-600 dark:text-gray-300">Share your feedback on the dishes you've tried</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search menu..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div
                  className="h-32 sm:w-32 bg-cover bg-center"
                  style={{
                    backgroundImage: item.image ? `url(${item.image})` : "url(/placeholder.svg?height=200&width=200)",
                  }}
                />
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>

                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>Average rating: {item.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0">
                      <div className="text-sm font-medium mb-1">Your rating:</div>
                      {renderStars(item.id)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </CustomerLayout>
  )
}
