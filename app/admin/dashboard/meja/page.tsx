"use client"

import type React from "react"
import { useState } from "react"
import { useMejaQuery, useEditMejaMutation, useAddMejaMutation } from "./hooks"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Meja {
  id: string
  nomorMeja: string
  status: string
}

export default function MejaManagement() {
  const { data, isLoading, error } = useMejaQuery()
  const mejas: Meja[] = Array.isArray(data) ? data : []
  const editMejaMutation = useEditMejaMutation()
  const addMejaMutation = useAddMejaMutation()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null)
  const [addNomorMeja, setAddNomorMeja] = useState("")
  const [editNomorMeja, setEditNomorMeja] = useState("")

  const openEditModal = (meja: Meja) => {
    setSelectedMeja(meja)
    setEditNomorMeja(meja.nomorMeja)
    setEditModalOpen(true)
  }

  const handleEditMeja = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMeja) return
    await editMejaMutation.mutateAsync({ id: selectedMeja.id, nomorMeja: editNomorMeja })
    setEditModalOpen(false)
    setSelectedMeja(null)
  }

  const handleAddMeja = async (e: React.FormEvent) => {
    e.preventDefault()
    await addMejaMutation.mutateAsync({ nomorMeja: addNomorMeja })
    setAddModalOpen(false)
    setAddNomorMeja("")
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Table Management</h1>
        <p className="text-gray-600 dark:text-gray-300">All tables in your restaurant</p>
        <div className="flex justify-end">
          <Button onClick={() => setAddModalOpen(true)} className="bg-green-700 hover:bg-green-800">
            Add Table
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-1">
        <div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">All Tables</h2>
            {isLoading && <div>Loading...</div>}
            {error && <div className="text-red-500">Failed to load tables.</div>}
            {!isLoading && !error && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900">
                  {mejas.map((meja) => (
                    <tr key={meja.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{meja.nomorMeja}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          {meja.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(meja)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
            <DialogDescription>Only the table number can be changed.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMeja} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addNomorMeja">Table Number</Label>
              <Input
                id="addNomorMeja"
                value={addNomorMeja}
                onChange={e => setAddNomorMeja(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMejaMutation.isPending}>
                {addMejaMutation.isPending ? "Adding..." : "Add Meja"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
            <DialogDescription>Only the table number can be changed.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditMeja} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editNomorMeja">Table Number</Label>
              <Input
                id="editNomorMeja"
                value={editNomorMeja}
                onChange={e => setEditNomorMeja(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Input value={selectedMeja?.status || ""} disabled readOnly />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editMejaMutation.isPending}>
                {editMejaMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
