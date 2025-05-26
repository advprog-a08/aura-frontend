"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2, Plus, Eye, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock data for tables with order status
const initialMejas = [
  {
    id: 1,
    number: "A1",
    status: "occupied",
    order: {
      id: 1001,
      items: 3,
      total: 95000,
      status: "Completed",
      time: "45 minutes ago",
    },
  },
  {
    id: 2,
    number: "A2",
    status: "available",
    order: null,
  },
  {
    id: 3,
    number: "A3",
    status: "occupied",
    order: {
      id: 1005,
      items: 4,
      total: 120000,
      status: "Pending",
      time: "10 minutes ago",
    },
  },
  {
    id: 4,
    number: "B1",
    status: "available",
    order: null,
  },
  {
    id: 5,
    number: "B2",
    status: "occupied",
    order: {
      id: 1002,
      items: 2,
      total: 75000,
      status: "Pending",
      time: "25 minutes ago",
    },
  },
  {
    id: 6,
    number: "C1",
    status: "occupied",
    order: {
      id: 1003,
      items: 6,
      total: 185000,
      status: "Pending",
      time: "32 minutes ago",
    },
  },
]

export default function MejaManagement() {
  const [mejas, setMejas] = useState(initialMejas)
  const [newMejaNumber, setNewMejaNumber] = useState("")
  const [editMeja, setEditMeja] = useState<{ id: number; number: string } | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const { toast } = useToast()

  const handleAddMeja = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMejaNumber.trim()) return

    const newId = Math.max(0, ...mejas.map((m) => m.id)) + 1
    setMejas([...mejas, { id: newId, number: newMejaNumber, status: "available", order: null }])
    setNewMejaNumber("")

    toast({
      title: "Table Added",
      description: `Table ${newMejaNumber} has been added successfully.`,
    })
  }

  const handleEditMeja = () => {
    if (!editMeja) return

    setMejas(mejas.map((meja) => (meja.id === editMeja.id ? { ...meja, number: editMeja.number } : meja)))

    setIsEditDialogOpen(false)
    setEditMeja(null)

    toast({
      title: "Table Updated",
      description: "Table number has been updated successfully.",
    })
  }

  const handleDeleteMeja = () => {
    if (deleteId === null) return

    setMejas(mejas.filter((meja) => meja.id !== deleteId))
    setDeleteId(null)

    toast({
      title: "Table Deleted",
      description: "Table has been deleted successfully.",
      variant: "destructive",
    })
  }

  const openEditDialog = (meja: { id: number; number: string }) => {
    setEditMeja(meja)
    setIsEditDialogOpen(true)
  }

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "available":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Table Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Add, edit, or remove tables from your restaurant</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mejas.map((meja) => (
                      <TableRow key={meja.id}>
                        <TableCell className="font-medium">{meja.number}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(meja.status)}>
                            {meja.status === "occupied" ? "Occupied" : "Available"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {meja.order ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <ShoppingCart className="h-3.5 w-3.5 text-gray-500" />
                                <span className="text-sm">Order #{meja.order.id}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getOrderStatusColor(meja.order.status)}>
                                  {meja.order.status}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => viewOrderDetails(meja.order)}
                                >
                                  <Eye className="h-3 w-3 mr-1" /> View
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No active order</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => openEditDialog(meja)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => setDeleteId(meja.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Table</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete table {meja.number}? This action cannot be undone.
                                    {meja.order && (
                                      <div className="mt-2 text-red-600 font-medium">
                                        Warning: This table has an active order!
                                      </div>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteMeja}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add New Table</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMeja} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mejaNumber">Table Number</Label>
                    <Input
                      id="mejaNumber"
                      value={newMejaNumber}
                      onChange={(e) => setNewMejaNumber(e.target.value)}
                      placeholder="e.g. A1, B2, etc."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                    <Plus className="mr-2 h-4 w-4" /> Add Table
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Table Status Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Available
                      </Badge>
                      <span>Available Tables</span>
                    </div>
                    <span className="font-bold">{mejas.filter((meja) => meja.status === "available").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Occupied
                      </Badge>
                      <span>Occupied Tables</span>
                    </div>
                    <span className="font-bold">{mejas.filter((meja) => meja.status === "occupied").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Pending
                      </Badge>
                      <span>Pending Orders</span>
                    </div>
                    <span className="font-bold">{mejas.filter((meja) => meja.order?.status === "Pending").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Completed
                      </Badge>
                      <span>Completed Orders</span>
                    </div>
                    <span className="font-bold">
                      {mejas.filter((meja) => meja.order?.status === "Completed").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
            <DialogDescription>Update the table number below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="editMejaNumber">Table Number</Label>
              <Input
                id="editMejaNumber"
                value={editMeja?.number || ""}
                onChange={(e) => setEditMeja((prev) => (prev ? { ...prev, number: e.target.value } : null))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMeja} className="bg-green-700 hover:bg-green-800">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>{selectedOrder && `Order #${selectedOrder.id}`}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  <Badge variant="outline" className={getOrderStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Items</span>
                  <span>{selectedOrder.items} items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{formatPrice(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Time</span>
                  <span>{selectedOrder.time}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOrderDetailsOpen(false)}>
                  Close
                </Button>
                <Button
                  className="bg-green-700 hover:bg-green-800"
                  onClick={() => {
                    setIsOrderDetailsOpen(false)
                    // In a real app, this would navigate to the order management page
                    toast({
                      title: "Redirecting",
                      description: "Navigating to order management page...",
                    })
                  }}
                >
                  Manage Order
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
