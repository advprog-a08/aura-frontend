"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, ArrowRight, Clock } from "lucide-react"
import CustomerLayout from "@/components/customer-layout"
import { useToast } from "@/hooks/use-toast"

// Mock data for menu items (same as other pages)
const menuItems = [
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
]

// Mock cart data
const initialCart = [
  { id: 1, quantity: 2 },
  { id: 3, quantity: 1 },
  { id: 4, quantity: 2 },
]

// Mock ongoing orders data
const initialOngoingOrders = [
  {
    id: 1001,
    tableNumber: "A3",
    status: "Preparing",
    timestamp: "2023-05-15T14:30:00",
    items: [
      { id: 2, quantity: 1 },
      { id: 4, quantity: 2 },
    ],
  },
  {
    id: 1002,
    tableNumber: "B2",
    status: "Ready",
    timestamp: "2023-05-15T14:15:00",
    items: [
      { id: 1, quantity: 1 },
      { id: 3, quantity: 1 },
    ],
  },
]

export default function PesananPage() {
  const [cart, setCart] = useState(initialCart)
  const [ongoingOrder, setOngoingOrder] = useState(null as null | typeof initialOngoingOrders[0])
  const { toast } = useToast()
  const [checkoutDisabled, setCheckoutDisabled] = useState(false)

  const increaseQuantity = (itemId: number) => {
    setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decreaseQuantity = (itemId: number) => {
    const existingItem = cart.find((item) => item.id === itemId)

    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)))
    } else {
      removeItem(itemId)
    }
  }

  const removeItem = (itemId: number) => {
    setCart(cart.filter((item) => item.id !== itemId))

    const item = menuItems.find((item) => item.id === itemId)
    if (item) {
      toast({
        title: "Item Removed",
        description: `${item.name} has been removed from your order.`,
        variant: "destructive",
      })
    }
  }

  const getItemDetails = (itemId: number) => {
    return menuItems.find((item) => item.id === itemId)
  }

  const calculateSubtotal = (itemId: number, quantity: number) => {
    const item = getItemDetails(itemId)
    return item ? item.price * quantity : 0
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + calculateSubtotal(item.id, item.quantity)
    }, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleProceedToCheckout = () => {
    // Simulate creating an ongoing order from the cart
    if (cart.length === 0) return
    setOngoingOrder({
      id: Math.floor(Math.random() * 10000),
      tableNumber: "A1",
      status: "Preparing",
      timestamp: new Date().toISOString(),
      items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
    })
    setCheckoutDisabled(true)
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-300">{ongoingOrder ? "Your current order in progress" : "Manage your current cart and place an order"}</p>
        </div>

        {ongoingOrder ? (
          <div className="space-y-6">
            <Card key={ongoingOrder.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Order #{ongoingOrder.id}</CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      ongoingOrder.status === "Ready"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  >
                    {ongoingOrder.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4" />
                  <span>Ordered at {formatDate(ongoingOrder.timestamp)}</span>
                  <span className="mx-2">•</span>
                  <span>Table {ongoingOrder.tableNumber}</span>
                </div>

                <div className="space-y-2">
                  {ongoingOrder.items.map((item) => {
                    const itemDetails = getItemDetails(item.id)
                    if (!itemDetails) return null

                    return (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-10 w-10 bg-cover bg-center rounded"
                            style={{
                              backgroundImage: itemDetails.image
                                ? `url(${itemDetails.image})`
                                : "url(/placeholder.svg?height=40&width=40)",
                            }}
                          />
                          <span>
                            {itemDetails.name} x {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium">{formatPrice(itemDetails.price * item.quantity)}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-gray-500">
                  {ongoingOrder.status === "Ready"
                    ? "Your order is ready for pickup!"
                    : "Your order is being prepared..."}
                </div>
                <Button variant="outline" size="sm" disabled>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cart.length > 0 ? (
                cart.map((cartItem) => {
                  const item = getItemDetails(cartItem.id)
                  if (!item) return null

                  return (
                    <Card key={cartItem.id} className="overflow-hidden opacity-100">
                      <div className="flex flex-col sm:flex-row">
                        <div
                          className="h-32 sm:w-32 bg-cover bg-center"
                          style={{
                            backgroundImage: item.image
                              ? `url(${item.image})`
                              : "url(/placeholder.svg?height=200&width=200)",
                          }}
                        />
                        <div className="flex-1 p-4">
                          <div className="flex justify-between">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="font-bold">{formatPrice(item.price)}</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-3">
                              <Button variant="outline" size="icon" onClick={() => decreaseQuantity(cartItem.id)} disabled={checkoutDisabled}>
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium">{cartItem.quantity}</span>
                              <Button variant="outline" size="icon" onClick={() => increaseQuantity(cartItem.id)} disabled={checkoutDisabled}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-4">
                              <p className="font-bold">
                                {formatPrice(calculateSubtotal(cartItem.id, cartItem.quantity))}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeItem(cartItem.id)}
                                disabled={checkoutDisabled}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
                  <Button asChild className="bg-green-700 hover:bg-green-800">
                    <Link href="/menu">Browse Menu</Link>
                  </Button>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((cartItem) => {
                      const item = getItemDetails(cartItem.id)
                      if (!item) return null

                      return (
                        <div key={cartItem.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {cartItem.quantity}
                          </span>
                          <span>{formatPrice(calculateSubtotal(cartItem.id, cartItem.quantity))}</span>
                        </div>
                      )
                    })}

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-700 hover:bg-green-800"
                    disabled={cart.length === 0 || checkoutDisabled}
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
