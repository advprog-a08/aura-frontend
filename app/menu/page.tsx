"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, Search, ShoppingCart, Plus, Minus } from "lucide-react"
import CustomerLayout from "@/components/customer-layout"
import { useToast } from "@/hooks/use-toast"

// Mock data for menu items (same as admin page)
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
  {
    id: 6,
    name: "Gado-gado",
    description: "Indonesian salad with peanut sauce",
    price: 25000,
    available: true,
    rating: 4.3,
    image: "/images/gado-gado.jpg",
  },
  {
    id: 7,
    name: "Soto Ayam",
    description: "Chicken soup with rice and vegetables",
    price: 28000,
    available: true,
    rating: 4.6,
    image: "/images/soto-ayam.jpg",
  },
  {
    id: 8,
    name: "Es Jeruk",
    description: "Fresh orange juice",
    price: 10000,
    available: true,
    rating: 4.4,
    image: "/images/es-jeruk.jpg",
  },
]

export default function MenuPage() {
  const [menuItems] = useState(initialMenuItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([])
  const { toast } = useToast()

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addToCart = (itemId: number) => {
    const existingItem = cart.find((item) => item.id === itemId)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { id: itemId, quantity: 1 }])
    }

    const item = menuItems.find((item) => item.id === itemId)
    if (item) {
      toast({
        title: "Added to Order",
        description: `${item.name} has been added to your order.`,
      })
    }
  }

  const decreaseQuantity = (itemId: number) => {
    const existingItem = cart.find((item) => item.id === itemId)

    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)))
    } else {
      setCart(cart.filter((item) => item.id !== itemId))
    }
  }

  const getItemQuantity = (itemId: number) => {
    const item = cart.find((item) => item.id === itemId)
    return item ? item.quantity : 0
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Our Menu</h1>
            <p className="text-gray-600 dark:text-gray-300">Browse and order from our delicious selection</p>
          </div>

          <div className="flex w-full md:w-auto gap-4">
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

            <Button asChild className="bg-green-700 hover:bg-green-800 flex gap-2 items-center">
              <Link href="/pesanan">
                <ShoppingCart className="h-4 w-4" />
                <span>My Orders</span>
                {totalItems > 0 && (
                  <Badge variant="outline" className="ml-1 bg-white text-green-800">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className={`overflow-hidden flex flex-col ${!item.available ? "opacity-60" : ""}`}>
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: item.image ? `url(${item.image})` : "url(/placeholder.svg?height=200&width=400)",
                }}
              />
              <div className="flex flex-col flex-1">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  {!item.available && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Currently Unavailable
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pb-2 flex-1">
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.description}</p>
                  <p className="mt-2 font-bold text-lg">{formatPrice(item.price)}</p>
                </CardContent>
                <CardFooter className="pt-2 mt-auto">
                  {item.available ? (
                    getItemQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-2 w-full">
                        <Button variant="outline" size="icon" onClick={() => decreaseQuantity(item.id)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center font-medium">{getItemQuantity(item.id)}</div>
                        <Button variant="outline" size="icon" onClick={() => addToCart(item.id)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full bg-green-700 hover:bg-green-800" onClick={() => addToCart(item.id)}>
                        Add to Order
                      </Button>
                    )
                  ) : (
                    <Button disabled className="w-full">
                      Unavailable
                    </Button>
                  )}
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </CustomerLayout>
  )
}
