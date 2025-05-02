"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableIcon as TableRestaurant, Eye, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for orders
const initialOrders = [
  {
    id: 1001,
    tableNumber: "A3",
    items: [
      { id: 2, name: "Mie Goreng", quantity: 1, price: 30000 },
      { id: 4, name: "Es Teh Manis", quantity: 2, price: 8000 },
    ],
    total: 46000,
    status: "Pending",
    time: "10 minutes ago",
  },
  {
    id: 1002,
    tableNumber: "B2",
    items: [
      { id: 1, name: "Nasi Goreng Special", quantity: 1, price: 35000 },
      { id: 3, name: "Ayam Bakar", quantity: 1, price: 45000 },
    ],
    total: 80000,
    status: "Completed",
    time: "25 minutes ago",
  },
  {
    id: 1003,
    tableNumber: "C5",
    items: [
      { id: 1, name: "Nasi Goreng Special", quantity: 2, price: 35000 },
      { id: 3, name: "Ayam Bakar", quantity: 1, price: 45000 },
      { id: 4, name: "Es Teh Manis", quantity: 3, price: 8000 },
    ],
    total: 139000,
    status: "Pending",
    time: "32 minutes ago",
  },
  {
    id: 1004,
    tableNumber: "A1",
    items: [
      { id: 2, name: "Mie Goreng", quantity: 2, price: 30000 },
      { id: 4, name: "Es Teh Manis", quantity: 1, price: 8000 },
    ],
    total: 68000,
    status: "Completed",
    time: "45 minutes ago",
  },
  {
    id: 1005,
    tableNumber: "D2",
    items: [
      { id: 3, name: "Ayam Bakar", quantity: 2, price: 45000 },
      { id: 4, name: "Es Teh Manis", quantity: 2, price: 8000 },
    ],
    total: 106000,
    status: "Cancelled",
    time: "1 hour ago",
  },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleCompleteOrder = (orderId: number) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "Completed" } : order)))
    setIsDetailsOpen(false)
    toast({
      title: "Order Completed",
      description: `Order #${orderId} has been marked as completed.`,
    })
  }

  const handleCancelOrder = (orderId: number) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "Cancelled" } : order)))
    setIsDetailsOpen(false)
    toast({
      title: "Order Cancelled",
      description: `Order #${orderId} has been cancelled.`,
    })
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Order Management</h1>
          <p className="text-gray-600 dark:text-gray-300">View and manage customer orders</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                          <TableRestaurant className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">Order #{order.id}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Table {order.tableNumber} • {order.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">{formatPrice(order.total)}</div>
                          <Badge
                            variant="outline"
                            className={
                              order.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : order.status === "Completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders
                    .filter((order) => order.status === "Pending")
                    .map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                            <TableRestaurant className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium">Order #{order.id}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Table {order.tableNumber} • {order.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(order.total)}</div>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {order.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders
                    .filter((order) => order.status === "Completed")
                    .map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                            <TableRestaurant className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium">Order #{order.id}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Table {order.tableNumber} • {order.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(order.total)}</div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {order.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders
                    .filter((order) => order.status === "Cancelled")
                    .map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                            <TableRestaurant className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium">Order #{order.id}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Table {order.tableNumber} • {order.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(order.total)}</div>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {order.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                {selectedOrder && `Order #${selectedOrder.id} - Table ${selectedOrder.tableNumber}`}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status</span>
                      <Badge
                        variant="outline"
                        className={
                          selectedOrder.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : selectedOrder.status === "Completed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                  {selectedOrder.status === "Pending" && (
                    <>
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel Order
                      </Button>
                      <Button
                        className="bg-green-700 hover:bg-green-800"
                        onClick={() => handleCompleteOrder(selectedOrder.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Complete Order
                      </Button>
                    </>
                  )}
                  {selectedOrder.status !== "Pending" && (
                    <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="ml-auto">
                      Close
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
