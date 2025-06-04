"use client"

import { Button } from "@/components/ui/button"
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
import { FileInput } from "@/components/ui/file-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { uploadFile } from "@/lib/s3"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useCreateMenu, useDeleteMutation, useMenuMutation, useMenuQuery } from "./hooks"

export default function MenuManagement() {
  const { data, isLoading, error } = useMenuQuery()
  const router = useRouter();

  const menuItems = Array.isArray(data) ? data : []

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [addItem, setAddItem] = useState<any>({
    name: "",
    description: "",
    price: "",
    available: true,
    image: "",
    quantity: null,
    imageFile: null,
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

  const [currentFile, setCurrentFile] = useState<File | null>();
  const menuMutation = useMenuMutation()
  const createMenu = useCreateMenu()
  const deleteMutation = useDeleteMutation()
  

  const handleAddItem = async () => {
    if (!addItem.name || !addItem.description || !addItem.price) {
      toast.error("Please fill in all required fields.")
      return
    }

    // Upload IMage to S3
    let url = ''
    if (currentFile) {
      url = await uploadFile(currentFile, `menu/${addItem.name.replace(/\s+/g, '-').toLowerCase()}/${Date.now()}`, 'rizzserve-menu')
    }

    createMenu.mutate(
      {
        name: addItem.name,
        description: addItem.description,
        imageUrl: url || 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505',
        price: parseFloat(addItem.price),
        quantity: addItem.quantity ?? null,
      },
      {
        onSuccess: (data) => {
          setIsAddDialogOpen(false)
          resetAddForm()
          toast.success("Menu Item Added")

          router.refresh()
        },
        onError: (error: any) => {
          toast.error("Add Failed")
        },
      }
    )
  }

  const handleEditItem = async () => {
    if (!currentItem.name || !currentItem.description || !currentItem.price) {
      toast.error("Missing Information")
      return
    }

    // Upload Image to S3 if it exists
    const url = currentFile
      ? await uploadFile(currentFile, `menu/${currentItem.name.replace(/\s+/g, '-').toLowerCase()}/${Date.now()}`, 'rizzserve-menu')
      : undefined;

    menuMutation.mutate(
      {
        id: currentItem.id,
        name: currentItem.name,
        description: currentItem.description,
        imageUrl: url || 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505',
        quantity: currentItem.quantity ?? null,
        price: parseFloat(currentItem.price),
      },
      {
        onSuccess: (data) => {
          setIsEditDialogOpen(false)
          resetForm()
          toast.success("Menu Item Updated")
          router.refresh()
        },
        onError: (error: any) => {
          toast.error("Update Failed")
        },
      }
    )
  }

  const handleDeleteItem = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Menu Item Deleted")

        router.refresh()
      },
      onError: (error: any) => {
        toast.error("Delete Failed");
      },
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
            <DialogContent className="sm:max-w-[500px] max-h-[90%] overflow-auto">
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
                  <Label htmlFor="image-file">Image File (Optional)</Label>
                  <FileInput
                    onFileChange={(file) => {
                      setCurrentFile(file)
                    }}
                    file={currentFile as File}
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
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.length > 0 ? menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell className={`${item.quantity! > 0 ? "text-green-500" : "text-red-400"}`}>{item.quantity ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => {
                            if (window.confirm('Are you sure you want to delete this menu item?')) handleDeleteItem(item.id)
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                      <p className="text-center flex justify-center w-full text-neutral-500 mt-4">
                        No Menu Available
                      </p>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 max-h-[90vh] overflow-auto">
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
                <Label htmlFor="edit-image">Image File (Optional)</Label>
                <FileInput
                  onFileChange={(file) => {
                    setCurrentFile(file)
                  }
                  }
                  file={currentFile as File}
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
