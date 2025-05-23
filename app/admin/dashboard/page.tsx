"use client"

import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableIcon as TableRestaurant, UtensilsCrossed, Ticket, ShoppingCart, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AdminDashboard() {
  const router = useRouter()

  // Mock data for dashboard
  const summaryData = {
    totalMeja: 15,
    totalMenuItems: 42,
    activeCoupons: 8,
    pendingOrders: 3,
  }

  // Mock data for recent orders
  const recentOrders = [
    {
      id: 1001,
      tableNumber: "A3",
      items: 4,
      total: 120000,
      status: "Pending",
      time: "10 minutes ago",
    },
    {
      id: 1002,
      tableNumber: "B2",
      items: 2,
      total: 75000,
      status: "Completed",
      time: "25 minutes ago",
    },
    {
      id: 1003,
      tableNumber: "C5",
      items: 6,
      total: 185000,
      status: "Pending",
      time: "32 minutes ago",
    },
    {
      id: 1004,
      tableNumber: "A1",
      items: 3,
      total: 95000,
      status: "Completed",
      time: "45 minutes ago",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, Admin. Here's an overview of your restaurant.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Tables</CardTitle>
              <TableRestaurant className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summaryData.totalMeja}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active tables in your restaurant</p>
              <Button
                variant="link"
                className="px-0 text-green-600 dark:text-green-400 mt-2"
                onClick={() => router.push("/admin/meja")}
              >
                Manage Tables →
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Menu Items</CardTitle>
              <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summaryData.totalMenuItems}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dishes available on your menu</p>
              <Button
                variant="link"
                className="px-0 text-green-600 dark:text-green-400 mt-2"
                onClick={() => router.push("/admin/menu")}
              >
                Manage Menu →
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Pending Orders</CardTitle>
              <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summaryData.pendingOrders}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Orders waiting to be processed</p>
              <Button
                variant="link"
                className="px-0 text-green-600 dark:text-green-400 mt-2"
                onClick={() => router.push("/admin/orders")}
              >
                View Orders →
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <Card className="md:col-span-2 bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                        <TableRestaurant className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Table {order.tableNumber}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items} items • {order.time}
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
                              : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
