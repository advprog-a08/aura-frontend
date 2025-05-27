import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Meja {
  id: string
  nomorMeja: string
  status: string
}

export function useMejaQuery() {
  return useQuery<Meja[], Error>({
    queryKey: ["meja-list"],
    queryFn: async () => {
      const token = localStorage?.getItem('token')
      const res = await fetch(process.env.NEXT_PUBLIC_OHIO_ORDER + "/api/v1/meja", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!res.ok) throw new Error("Failed to fetch meja data")
      return res.json()
    },
  })
}

export function useEditMejaMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, nomorMeja }: { id: string; nomorMeja: string }) => {
      const token = localStorage?.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_OHIO_ORDER}/api/v1/meja/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nomorMeja }),
      })
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update meja");
      }
      
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meja-list"] })
    },
  })
} 

export function useAddMejaMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ nomorMeja }: { nomorMeja: string }) => {
      const token = localStorage?.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_OHIO_ORDER}/api/v1/meja`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ nomorMeja }),
      })
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add meja");
      }
      
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meja-list"] })
    },
  })
}