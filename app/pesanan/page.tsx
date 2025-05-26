"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, ArrowRight, Clock } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import CustomerLayout from "@/components/customer-layout"
import { useToast } from "@/hooks/use-toast"
import { useCurrentOrderQuery, useUpdateOrderMutation, useRemoveOrderItemMutation, type Order, type OrderItem } from "./hooks"

export default function PesananPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  
  // Fetch current order data
  const { data: currentOrder, isLoading, error } = useCurrentOrderQuery()
  const updateOrderMutation = useUpdateOrderMutation()
  const removeItemMutation = useRemoveOrderItemMutation()

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

  const updateQuantity = (item: OrderItem, newQuantity: number) => {
    if (!currentOrder) return

    const updatedItems = currentOrder.items.map(orderItem => {
      if (orderItem.id === item.id) {
        return { menuItemId: orderItem.menuItemId, quantity: newQuantity }
      }
      return { menuItemId: orderItem.menuItemId, quantity: orderItem.quantity }
    })

    updateOrderMutation.mutate({ items: updatedItems }, {
      onError: (error: any) => {
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update item quantity",
          variant: "destructive",
        })
      }
    })
  }

  const increaseQuantity = (item: OrderItem) => {
    updateQuantity(item, item.quantity + 1)
  }

  const decreaseQuantity = (item: OrderItem) => {
    if (item.quantity > 1) {
      updateQuantity(item, item.quantity - 1)
    } else {
      handleDeleteClick(item.id)
    }
  }

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId)
    setShowDeleteConfirm(true)
  }
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return
    
    removeItemMutation.mutate(itemToDelete, {
      onSuccess: () => {
        toast({
          title: "Item Removed",
          description: "Item has been removed from your order.",
        })
        setShowDeleteConfirm(false)
        setItemToDelete(null)
      },
      onError: (error: any) => {
        toast({
          title: "Remove Failed",
          description: error.message || "Failed to remove item",
          variant: "destructive",
        })
        setShowDeleteConfirm(false)
        setItemToDelete(null)
      }
    })
  }

  const handleProceedToCheckout = () => {
    setShowCheckoutConfirm(true)
  }

  const handleCheckoutConfirm = () => {
    if (!currentOrder) return

    const updateData = {
      items: currentOrder.items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity
      }))
    }

    updateOrderMutation.mutate(updateData, {
      onSuccess: () => {
        toast({
          title: "Order Updated",
          description: "Your order has been updated successfully.",
        })
        router.push("/checkout")
      },
      onError: (error: any) => {
        toast({
          title: "Checkout Failed",
          description: error.message || "Failed to proceed to checkout",
          variant: "destructive",
        })
      },
      onSettled: () => {
        setShowCheckoutConfirm(false)
      }
    })
  }

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto p-6">
          <div className="text-center">Loading your order...</div>
        </div>
      </CustomerLayout>
    )
  }

  if (error) {
    return (
      <CustomerLayout>
        <div className="container mx-auto p-6">
          <Card className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No active order found</p>
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </Card>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your current order - Table {currentOrder?.nomorMeja}
          </p>
        </div>

        {currentOrder && currentOrder.items.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {currentOrder.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div
                      className="h-32 sm:w-32 bg-cover bg-center"
                      style={{
                        backgroundImage: "url(/placeholder.svg?height=200&width=200)",
                      }}
                    />
                    <div className="flex-1 p-4">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-lg">{item.menuItemName}</h3>
                        <p className="font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {item.menuItemDescription}
                      </p>
                      {item.menuItemCategory && (
                        <Badge variant="outline" className="mt-2">
                          {item.menuItemCategory}
                        </Badge>
                      )}

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => decreaseQuantity(item)}
                            disabled={updateOrderMutation.isPending}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => increaseQuantity(item)}
                            disabled={updateOrderMutation.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="font-bold">{formatPrice(item.subtotal)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(item.id)}
                            disabled={removeItemMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.menuItemName} x {item.quantity}
                        </span>
                        <span>{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(currentOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-700 hover:bg-green-800"
                    disabled={currentOrder.items.length === 0 || updateOrderMutation.isPending}
                    onClick={handleProceedToCheckout}
                  >
                    {updateOrderMutation.isPending ? "Processing..." : "Proceed to Checkout"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Your order is empty</p>
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </Card>
        )}

        {/* Checkout Confirmation Modal */}
        <AlertDialog open={showCheckoutConfirm} onOpenChange={setShowCheckoutConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Checkout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to proceed to checkout? This will finalize your current order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCheckoutConfirm}
                disabled={updateOrderMutation.isPending}
              >
                {updateOrderMutation.isPending ? "Processing..." : "Proceed"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Item Confirmation Modal */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this item from your order? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                disabled={removeItemMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {removeItemMutation.isPending ? "Removing..." : "Remove"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CustomerLayout>
  )
}
