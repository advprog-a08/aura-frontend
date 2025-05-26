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
import { useMenuQuery } from "./hooks"

export default function MenuManagement() {
  const { data, isLoading, error } = useMenuQuery()
  const menuItems = Array.isArray(data) ? data : []
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [currentItem, setCurrentItem] = useState<any>({
    name: "",
    description: "",
    price: "",
    available: true,
    image: "",
  })
  const { toast } = useToast()

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.description || !currentItem.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Logic to add new item
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Menu Item Added",
      description: `${currentItem.name} has been added to the menu.`,
    })
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

    // Logic to update item
    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: "Menu Item Updated",
      description: `${currentItem.name} has been updated.`,
    })
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    placeholder="e.g. Nasi Goreng Special"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={currentItem.description}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    placeholder="Describe the menu item"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (IDR)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={currentItem.price}
                    onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                    placeholder="e.g. 35000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    value={currentItem.image}
                    onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                    placeholder="e.g. /images/nasi-goreng.jpg"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="available"
                    checked={currentItem.available}
                    onCheckedChange={(checked) => setCurrentItem({ ...currentItem, available: checked })}
                  />
                  <Label htmlFor="available">Available</Label>
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
