"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Plus, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMenuQuery, useMenuMutation, useCreateMenu } from "./hooks"

export default function MenuManagement() {
  const { data, isLoading, error } = useMenuQuery()
  const menuItems = Array.isArray(data) ? data : []
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [addItem, setAddItem] = useState<any>({
    name: "",
    description: "",
    price: "",
    available: true,
    image: "",
    quantity: null,
  })
  const [currentItem, setCurrentItem] = useState<any>({
    name: "",
    description: "",
    price: "",
    available: true,
    image: "",
    id: "",
    quantity: null,
  })
  const { toast } = useToast()
  const menuMutation = useMenuMutation()
  const createMenu = useCreateMenu()

  const handleAddItem = () => {
    if (!addItem.name || !addItem.description || !addItem.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    createMenu.mutate(
      {
        name: addItem.name,
        description: addItem.description,
        imageUrl: addItem.image,
        quantity: addItem.quantity ?? null,
        price: parseFloat(addItem.price),
      },
      {
        onSuccess: (data) => {
          setIsAddDialogOpen(false)
          resetAddForm()
          toast({
            title: "Menu Item Added",
            description: `${addItem.name} has been added to the menu.`,
          })
        },
        onError: (error: any) => {
          toast({
            title: "Add Failed",
            description: error?.message || "Failed to add menu item.",
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleEditItem = () => {
    if (!currentItem.name || !currentItem.description || !currentItem.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    menuMutation.mutate(
      {
        id: currentItem.id,
        name: currentItem.name,
        description: currentItem.description,
        imageUrl: currentItem.image,
        quantity: currentItem.quantity ?? null,
        price: parseFloat(currentItem.price),
      },
      {
        onSuccess: (data) => {
          setIsEditDialogOpen(false)
          resetForm()
          toast({
            title: "Menu Item Updated",
            description: `${currentItem.name} has been updated.`,
          })
        },
        onError: (error: any) => {
          toast({
            title: "Update Failed",
            description: error?.message || "Failed to update menu item.",
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleDeleteItem = () => {
    if (deleteId === null) return

    // Logic to delete item
    setDeleteId(null)

    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been deleted successfully.",
      variant: "destructive",
    })
  }

  const openEditDialog = (item: any) => {
    setCurrentItem({
      ...item,
      price: item.price.toString(),
      image: item.imageUrl || item.image || "",
      id: item.id,
      quantity: item.quantity ?? null,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setCurrentItem({
      name: "",
      description: "",
      price: "",
      available: true,
      image: "",
      id: "",
      quantity: null,
    })
  }

  const resetAddForm = () => {
    setAddItem({
      name: "",
      description: "",
      price: "",
      available: true,
      image: "",
      quantity: null,
    })
  }

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
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Menu Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Add, edit, or remove items from your restaurant menu</p>
        </div>

        <div className="flex justify-end mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (open) resetAddForm()
          }}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>Fill in the details for the new menu item.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={addItem.name}
                    onChange={(e) => setAddItem({ ...addItem, name: e.target.value })}
                    placeholder="e.g. Nasi Goreng Special"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={addItem.description}
                    onChange={(e) => setAddItem({ ...addItem, description: e.target.value })}
                    placeholder="Describe the menu item"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (IDR)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={addItem.price}
                    onChange={(e) => setAddItem({ ...addItem, price: e.target.value })}
                    placeholder="e.g. 35000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={addItem.quantity === null ? "" : addItem.quantity}
                    onChange={e => setAddItem({ ...addItem, quantity: e.target.value === "" ? null : Number(e.target.value) })}
                    placeholder="e.g. 10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    value={addItem.image}
                    onChange={(e) => setAddItem({ ...addItem, image: e.target.value })}
                    placeholder="e.g. /images/nasi-goreng.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem} className="bg-green-700 hover:bg-green-800">
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <div>Loading...</div>}
            {error && <div className="text-red-500">Failed to load menu items.</div>}
            {!isLoading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>5.0</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600" disabled>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          {/* Image header if available */}
          {currentItem.image && (
            <img
              src={currentItem.image}
              alt={currentItem.name}
              className="w-full h-48 object-cover rounded-t-lg"
              style={{ display: 'block' }}
            />
          )}
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>Update the details for this menu item.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (IDR)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={currentItem.quantity === null ? "" : currentItem.quantity}
                  onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value === "" ? null : Number(e.target.value) })}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image URL (Optional)</Label>
                <Input
                  id="edit-image"
                  value={currentItem.image}
                  onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditItem} className="bg-green-700 hover:bg-green-800">
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
