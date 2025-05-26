"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useCheckoutsQuery, useAdvanceOrderStateMutation } from "../../hooks"

export function AdvanceStateButton({ orderId, onSuccess }: { orderId: number, onSuccess: () => void }) {
  const { toast } = useToast();
  const advanceOrderState = useAdvanceOrderStateMutation();
  return (
    <Button
      className="bg-green-700 hover:bg-green-800 text-white"
      disabled={advanceOrderState.isPending}
      onClick={async () => {
        try {
          await advanceOrderState.mutateAsync(orderId);
          toast({ title: "State Advanced", description: `Order #${orderId} state advanced.` });
          onSuccess();
        } catch (err) {
          toast({ title: "Error", description: `Failed to advance state for order #${orderId}` });
        }
      }}
    >
      Advance State
    </Button>
  );
}

export default function AdminOrders() {
  const { data: checkouts = [], isLoading: loading, refetch } = useCheckoutsQuery();
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [showCancelled, setShowCancelled] = useState(false)
  const { toast } = useToast()

  // Filtering logic
  const filteredCheckouts = checkouts.filter((checkout) =>
    showCancelled ? checkout.state === "CANCELLED" : checkout.state !== "CANCELLED"
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Checkout List</h1>
        <p className="text-gray-600 dark:text-gray-300">All checkouts and their details</p>
        <div className="mt-2 flex gap-2">
          <Button
            variant={showCancelled ? "outline" : "default"}
            className={showCancelled ? "" : "bg-green-700 hover:bg-green-800 text-white"}
            onClick={() => setShowCancelled(false)}
          >
            Non-Cancelled
          </Button>
          <Button
            variant={showCancelled ? "default" : "outline"}
            className={showCancelled ? "bg-red-700 hover:bg-red-800 text-white" : ""}
            onClick={() => setShowCancelled(true)}
          >
            Cancelled
          </Button>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">
          {filteredCheckouts.map((checkout) => (
            <Card key={checkout.id} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl transition">
              <CardHeader className="flex flex-row items-center justify-between gap-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-t-xl px-6 py-4">
                <div>
                  <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                    <span className="inline-block bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 rounded px-2 py-0.5 text-xs font-semibold">#{checkout.id}</span>
                    Checkout
                  </CardTitle>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    State: <span className="font-semibold">{checkout.state}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-base text-green-700 dark:text-green-200">
                    Meja: <span className="font-bold">{checkout.order?.meja?.nomorMeja || "-"}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Status: <span className={
                      checkout.order?.meja?.status === "Available"
                        ? "text-green-600 dark:text-green-300"
                        : checkout.order?.meja?.status === "Occupied"
                          ? "text-amber-600 dark:text-amber-300"
                          : "text-red-600 dark:text-red-300"
                    }>
                      {checkout.order?.meja?.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Order ID:</span>
                      <span className="text-gray-900 dark:text-gray-100">{checkout.order?.id}</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Locked:</span>
                      <span className={
                        checkout.order?.locked
                          ? "text-red-600 dark:text-red-400 font-semibold"
                          : "text-green-600 dark:text-green-400 font-semibold"
                      }>
                        {checkout.order?.locked ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Created At:</span>
                      <span className="text-gray-900 dark:text-gray-100">{checkout.order?.createdAt || "-"}</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Updated At:</span>
                      <span className="text-gray-900 dark:text-gray-100">{checkout.order?.updatedAt || "-"}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Order Items:</span>
                  {checkout.order?.orderItems?.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {checkout.order.orderItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 border border-gray-100 dark:border-gray-700"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 dark:text-gray-100">Menu Item ID: {item.menuItemId}</span>
                          </div>
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded px-2 py-0.5 font-semibold">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1 italic">No items ordered.</div>
                  )}
                </div>
                {checkout.state !== "COMPLETED" && checkout.state !== "CANCELLED" && (
                  <div className="mt-4">
                    <AdvanceStateButton orderId={checkout.id} onSuccess={refetch} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {filteredCheckouts.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">No checkouts found.</div>
          )}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order #${selectedOrder.id} - Table ${selectedOrder.tableNumber}`}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
