import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

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
      const res = await fetch("http://localhost:8080/api/menus", {
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
      const res = await fetch(`http://localhost:8080/api/menus/${id}`, {
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