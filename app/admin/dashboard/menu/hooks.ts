import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface MenuCategories {
  id: string
  name: string
  description: string
  menus: Menu[]
}

export interface Menu {
  id: string
  name: string
  description: string
  imageUrl: string
  quantity: number | null
  price: number
}

export function useMenuQuery() {
  return useQuery<Menu[], Error>({
    queryKey: ["menu-list"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEWING_MENU}/api/menus`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch menu data")
      const data = await res.json()
      // The API returns { success, message, data }, so return data.data
      return data.data
    },
  })
}

export function useMenuMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...menu }: { id: string, name: string, description: string, imageUrl: string, quantity: number | null, price: number }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEWING_MENU}/api/menus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menu),
      })
      if (!res.ok) throw new Error("Failed to update menu item")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-list"] })
    },
  })
}

export function useCreateMenu() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (menu: { name: string, description: string, imageUrl: string, price: number, quantity: number }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEWING_MENU}/api/menus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menu),
      })
      if (!res.ok) throw new Error("Failed to create menu item")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-list"] })
    },
  })
}

export function useDeleteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEWING_MENU}/api/menus/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete menu item")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-list"] })
    },
  })
} 