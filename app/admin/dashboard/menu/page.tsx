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
import { Pencil, Trash2, Plus, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock data for menu items
const initialMenuItems = [
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
  {
    id: 5,
    name: "Sate Ayam",
    description: "Chicken satay with peanut sauce",
    price: 35000,
    available: false,
    rating: 4.8,
    image: "/images/sate-ayam.jpg",
  },
]

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState(initialMenuItems)
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

    const newId = Math.max(0, ...menuItems.map((item) => item.id)) + 1
    const newItem = {
      ...currentItem,
      id: newId,
      price: Number(currentItem.price),
      rating: 0,
    }

    setMenuItems([...menuItems, newItem])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Menu Item Added",
      description: `${newItem.name} has been added to the menu.`,
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

    setMenuItems(
      menuItems.map((item) =>
        item.id === currentItem.id ? { ...currentItem, price: Number(currentItem.price) } : item,
      ),
    )

    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: "Menu Item Updated",
      description: `${currentItem.name} has been updated.`,
    })
  }

  const handleDeleteItem = () => {
    if (deleteId === null) return

    setMenuItems(menuItems.filter((item) => item.id !== deleteId))
    setDeleteId(null)

    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been deleted successfully.",
      variant: "destructive",
    })
  }

  const handleToggleAvailability = (id: number) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))

    const item = menuItems.find((item) => item.id === id)
    if (item) {
      toast({
        title: item.available ? "Item Unavailable" : "Item Available",
        description: `${item.name} is now ${item.available ? "unavailable" : "available"} on the menu.`,
      })
    }
  }

  const openEditDialog = (item: any) => {
    setCurrentItem({
      ...item,
      price: item.price.toString(),
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Availability</TableHead>
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
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={item.available} onCheckedChange={() => handleToggleAvailability(item.id)} />
                        {item.available ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                              onClick={() => setDeleteId(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {item.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteItem}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
            <div className="flex items-center gap-2">
              <Switch
                id="edit-available"
                checked={currentItem.available}
                onCheckedChange={(checked) => setCurrentItem({ ...currentItem, available: checked })}
              />
              <Label htmlFor="edit-available">Available</Label>
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
        </DialogContent>
      </Dialog>
    </>
  )
}
