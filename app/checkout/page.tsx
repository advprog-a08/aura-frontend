"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"
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
import { 
  useCurrentOrderQuery, 
  useCurrentCheckoutQuery,
  useCancelCheckoutMutation,
  type Order, 
  type Checkout 
} from "../pesanan/hooks"

export default function CheckoutPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  // Fetch current order and checkout data
  const { data: currentOrder, isLoading: orderLoading, error: orderError } = useCurrentOrderQuery()
  const { data: currentCheckout, isLoading: checkoutLoading, error: checkoutError } = useCurrentCheckoutQuery()
  const cancelCheckoutMutation = useCancelCheckoutMutation()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleCancelCheckout = () => {
    setShowCancelConfirm(true)
  }
  const handleCancelConfirm = () => {
    cancelCheckoutMutation.mutate(undefined, {      
        onSuccess: () => {
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled. You will be logged out.",
        })
        
        // Clear session and redirect to home
        localStorage.removeItem("session_id")
        router.push("/")
      },
      onError: (error: any) => {
        toast({
          title: "Cancel Failed",
          description: error.message || "Failed to cancel order",
          variant: "destructive",
        })
      },
      onSettled: () => {
        setShowCancelConfirm(false)
      }
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Draft</Badge>
      case "ORDERED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ordered</Badge>
      case "PREPARING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Preparing</Badge>
      case "READY":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Ready</Badge>
      case "COMPLETED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
      case "DELETE":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Deleted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (orderLoading || checkoutLoading) {
    return (
      <CustomerLayout>        <div className="container mx-auto p-6">
          <div className="text-center">Loading order status...</div>
        </div>
      </CustomerLayout>
    )
  }
  if (orderError || checkoutError || !currentOrder || !currentCheckout) {
    return (
      <CustomerLayout>
        <div className="container mx-auto p-6">          <Card className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              {!currentCheckout ? "No active order found" : "No active order found"}
            </div>
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href="/pesanan">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
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
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/pesanan">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Order Status</h1>
              <div className="text-gray-600 dark:text-gray-300">
                View your order status - Table {currentOrder.nomorMeja}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge(currentCheckout.state)}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <Card>              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Order Details
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Order from Table {currentOrder.nomorMeja}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                      <div
                        className="h-16 w-16 bg-cover bg-center rounded-md"
                        style={{
                          backgroundImage: "url(/placeholder.svg?height=200&width=200)",
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.menuItemName}</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {item.menuItemDescription}
                        </div>
                        {item.menuItemCategory && (
                          <Badge variant="outline" className="mt-1">
                            {item.menuItemCategory}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.quantity} x {formatPrice(item.price)}
                        </div>
                        <div className="font-bold">{formatPrice(item.subtotal)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Summary */}
          <div>            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Order Summary
                </CardTitle>
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

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(currentOrder.total)}</span>
                  </div>

                  <Separator />                  
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                  </div>
                </div>
              </CardContent>              <CardFooter className="flex flex-col gap-3">
                <div className="w-full text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-3">
                    {currentCheckout.state === "COMPLETED" ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : currentCheckout.state === "READY" ? (
                      <CheckCircle className="h-8 w-8 text-orange-600" />
                    ) : currentCheckout.state === "DELETE" ? (
                      <Clock className="h-8 w-8 text-red-600" />
                    ) : (
                      <Clock className="h-8 w-8 text-yellow-600" />
                    )}
                  </div>
                  <div className="font-medium text-lg mb-2">
                    {getStatusBadge(currentCheckout.state)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {currentCheckout.state === "COMPLETED"
                      ? "Your order has been completed."
                      : currentCheckout.state === "READY"
                      ? "Your order is ready for pickup."
                      : currentCheckout.state === "PREPARING"
                      ? "Your order is being prepared."
                      : currentCheckout.state === "ORDERED"
                      ? "Your order has been placed and will be prepared soon."
                      : currentCheckout.state === "DELETE"
                      ? "This order has been cancelled."
                      : "Processing your order..."}
                  </div>
                  {currentCheckout.message && (
                    <div className="text-sm text-gray-500 italic border-t pt-3">
                      {currentCheckout.message}
                    </div>
                  )}
                </div>
                
                {currentCheckout.state === "DRAFT" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancelCheckout}
                    disabled={cancelCheckoutMutation.isPending}
                  >
                    {cancelCheckoutMutation.isPending ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Cancel Checkout Confirmation Modal */}        
        <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <AlertDialogContent>            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Order</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this order? This action cannot be undone and you will be logged out. 
                You'll need to scan a new QR code to place another order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Order</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCancelConfirm}
                disabled={cancelCheckoutMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {cancelCheckoutMutation.isPending ? "Cancelling..." : "Cancel Order"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CustomerLayout>
  )
}
