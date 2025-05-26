import { useQuery } from "@tanstack/react-query"

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