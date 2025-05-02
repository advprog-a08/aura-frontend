"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Check, X } from "lucide-react"
import CustomerLayout from "@/components/customer-layout"
import { useToast } from "@/hooks/use-toast"

// Mock data for menu items
const menuItems = [
  {
    id: 1,
    name: "Nasi Goreng Special",
    price: 35000,
  },
  {
    id: 3,
    name: "Ayam Bakar",
    price: 45000,
  },
  {
    id: 4,
    name: "Es Teh Manis",
    price: 8000,
  },
]

// Mock cart data
const cart = [
  { id: 1, quantity: 2 },
  { id: 3, quantity: 1 },
  { id: 4, quantity: 2 },
]

// Mock coupons
const validCoupons = [
  { code: "WELCOME10", discount: 0.1 },
  { code: "SPECIAL20", discount: 0.2 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [mejaNumber, setMejaNumber] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState("")
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const { toast } = useToast()

  const getItemDetails = (itemId: number) => {
    return menuItems.find((item) => item.id === itemId)
  }

  const calculateSubtotal = (itemId: number, quantity: number) => {
    const item = getItemDetails(itemId)
    return item ? item.price * quantity : 0
  }

  const calculateSubtotalAmount = () => {
    return cart.reduce((total, item) => {
      return total + calculateSubtotal(item.id, item.quantity)
    }, 0)
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    return calculateSubtotalAmount() * appliedCoupon.discount
  }

  const calculateTotal = () => {
    return calculateSubtotalAmount() - calculateDiscount()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleApplyCoupon = () => {
    setCouponError("")

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }

    const coupon = validCoupons.find((c) => c.code === couponCode.trim())

    if (coupon) {
      setAppliedCoupon(coupon)
      toast({
        title: "Coupon Applied",
        description: `${coupon.code} discount has been applied to your order.`,
      })
    } else {
      setCouponError("Invalid coupon code")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
  }

  const handlePlaceOrder = () => {
    if (!mejaNumber.trim()) {
      toast({
        title: "Table Number Required",
        description: "Please enter your table number to place the order.",
        variant: "destructive",
      })
      return
    }

    setIsConfirmationOpen(true)
  }

  const handleConfirmOrder = () => {
    setIsConfirmationOpen(false)

    // In a real app, this would submit the order to the backend

    // Redirect to menu page after a short delay
    setTimeout(() => {
      router.push("/menu")
    }, 1000)
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete your order</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((cartItem) => {
                  const item = getItemDetails(cartItem.id)
                  if (!item) return null

                  return (
                    <div key={cartItem.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x {cartItem.quantity}</span>
                      </div>
                      <span>{formatPrice(calculateSubtotal(cartItem.id, cartItem.quantity))}</span>
                    </div>
                  )
                })}

                <Separator />

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateSubtotalAmount())}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(calculateDiscount())}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Apply Coupon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                  </div>

                  {appliedCoupon ? (
                    <Button variant="outline" className="shrink-0" onClick={handleRemoveCoupon}>
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  ) : (
                    <Button className="bg-green-700 hover:bg-green-800 shrink-0" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mejaNumber">
                    Table Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mejaNumber"
                    placeholder="Enter your table number"
                    value={mejaNumber}
                    onChange={(e) => setMejaNumber(e.target.value)}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                  <p className="text-sm">
                    Please proceed to the cashier to complete your payment after placing your order.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-700 hover:bg-green-800" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Placed Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your order has been received and is being prepared. Please proceed to the cashier to complete your
              payment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-green-700 hover:bg-green-800" onClick={handleConfirmOrder}>
              <Check className="mr-2 h-4 w-4" />
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CustomerLayout>
  )
}
