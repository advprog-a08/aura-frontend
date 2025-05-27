import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import customFetch from "@/lib/fetch";

// Types for order data
export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  menuItemDescription: string;
  menuItemCategory?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  mejaId: string;
  nomorMeja: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  locked: boolean;
  total: number;
}

export interface UpdateOrderRequest {
  items: {
    menuItemId: string;
    quantity: number;
  }[];
}

export interface Checkout {
  id: string;
  state: "DRAFT" | "ORDERED" | "PREPARING" | "READY" | "COMPLETED" | "DELETE";
  message: string;
}

// Hook to get current order by table session
export function useCurrentOrderQuery() {
  return useQuery({
    queryKey: ["current-order"],
    queryFn: async (): Promise<Order> => {
      const sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        throw new Error("No session found");
      }

      const data = await customFetch("/api/orders/table", {
        method: "GET",
        headers: {
          "X-Session-Id": sessionId,
        },
      }, "ohio_order");

      return data;
    },
    retry: false,
  });
}

// Hook to update order
export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: UpdateOrderRequest): Promise<Order> => {
      const sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        throw new Error("No session found");
      }

      const result = await customFetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify(data),
      }, "ohio_order");

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-order"] });
    },
  });
}

// Hook to remove item from order
export function useRemoveOrderItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string): Promise<void> => {
      const sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        throw new Error("No session found");
      }

      await customFetch(`/api/orders/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "X-Session-Id": sessionId,
        },
      }, "ohio_order");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-order"] });
    },
  });
}


export function useCurrentCheckoutQuery() {
  return useQuery({
    queryKey: ["current-checkout"],
    queryFn: async (): Promise<Checkout | null> => {
      const sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        throw new Error("No session found");
      }

      try {
        const data = await customFetch("/api/checkout/me", {
          method: "GET",
          headers: {
            "X-Session-Id": sessionId,
          },
        }, "ohio_order");

        if (!data) {
          return null; // No checkout found
        }

        return data;
      } catch (error: any) {
        if (error.status === 400 || error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
}

// Hook to create checkout
export function useCreateCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<Checkout> => {
      const sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        throw new Error("No session found");
      }

      const result = await customFetch("/api/checkout", {
        method: "POST",
        headers: {
          "X-Session-Id": sessionId,
        },
      }, "ohio_order");

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-checkout"] });
      queryClient.invalidateQueries({ queryKey: ["current-order"] });
    },
  });
}

// Hook to cancel checkout
export function useCancelCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        throw new Error("No session found");
      }

      await customFetch("/api/checkout/me", {
        method: "DELETE",
        headers: {
          "X-Session-Id": sessionId,
        },
      }, "ohio_order");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-checkout"] });
      queryClient.invalidateQueries({ queryKey: ["current-order"] });
    },
  });
}