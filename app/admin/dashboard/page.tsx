"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, TableIcon as TableRestaurant, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCheckoutsQuery } from "../hooks"
import { Meja } from "./meja"
import { useMejaQuery } from "./meja/hooks"
import { Menu, useMenuQuery } from "./menu/hooks"

interface Order {
  checkout: {
    id: string,
    state: string,
    message: string
  },
  order: {
    id: string,
    mejaId: string,
    nomorMeja: string,
    items: {
      id: string,
      menuItemId: string,
      menuItemName: string,
      menuItemDescription: string,
      menuItemCategory: string,
      price: number,
      quantity: number,
      subtotal: number
    }[],
    locked: true,
    total: number,
    createdAt: string,
  }
}

export default function AdminDashboard() {
  const router = useRouter()

  const { data: mejaData, isLoading, error } = useMejaQuery();
  const mejas: Meja[] = Array.isArray(mejaData) ? mejaData : []

  const { data: menuData } = useMenuQuery();
  const menus: Menu[] = Array.isArray(menuData) ? menuData : []
  
  const { data: orderData } = useCheckoutsQuery();
  const orders: Order[] = Array.isArray(orderData) ? orderData : []

  // Mock data for dashboard
  const summaryData = {
    totalMeja: mejas.length,
    totalMenuItems: menus.length,
    pendingOrders: orders.length,
  }

  const recentOrders = orders.map((order) => ({
    id: order.order.id,
    tableNumber: order.order.nomorMeja,
    items: order.order.items.length,
    total: order.order.total,
    status: order.checkout.state,
    time: new Date(order.order.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  })).slice(0, 5)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, Admin. Here's an overview of your restaurant.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Tables</CardTitle>
              <TableRestaurant className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summaryData.totalMeja}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active tables in your restaurant</p>
              <Link href="/admin/dashboard/meja" className="px-0 text-green-600 dark:text-green-400 mt-2">
                Manage Tables →
              </Link>
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
              <Link href="/admin/dashboard/menu" className="px-0 text-green-600 dark:text-green-400 mt-2">
                Manage Menu →
              </Link>
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
              <Link href="/admin/dashboard/orders" className="px-0 text-green-600 dark:text-green-400 mt-2">
                View Orders →
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <Card className="md:col-span-3 bg-white dark:bg-gray-800 shadow-md hover">
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
                    </div>
                  </div>
                ))}
              </div>
              <Link href={'/admin/dashboard/checkouts'}>
                <Button variant="outline" className="w-full mt-4">
                  View All Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
