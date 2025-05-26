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

  // Filtering logic for new data structure
  const filteredCheckouts = checkouts.filter((item) =>
    showCancelled ? item.checkout.state === "CANCELLED" : item.checkout.state !== "CANCELLED"
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
          {filteredCheckouts.map((item) => (
            <Card key={item.checkout.id} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl transition">
              <CardHeader className="flex flex-row items-center justify-between gap-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-t-xl px-6 py-4">
                <div>
                  <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                    <span className="inline-block bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 rounded px-2 py-0.5 text-xs font-semibold">#{item.checkout.id}</span>
                    Checkout
                  </CardTitle>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    State: <span className="font-semibold">{item.checkout.state}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-base text-green-700 dark:text-green-200">
                    Meja: <span className="font-bold">{item.order?.nomorMeja || "-"}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Order ID:</span>
                      <span className="text-gray-900 dark:text-gray-100">{item.order?.id}</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Created At:</span>
                      <span className="text-gray-900 dark:text-gray-100">{item.order?.createdAt || "-"}</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Updated At:</span>
                      <span className="text-gray-900 dark:text-gray-100">{item.order?.updatedAt || "-"}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Order Items:</span>
                  {item.order?.items?.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {item.order.items.map((orderItem: any) => (
                        <div
                          key={orderItem.id}
                          className="flex flex-col md:flex-row md:items-center md:justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 border border-gray-100 dark:border-gray-700 gap-2"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 dark:text-gray-100">{orderItem.menuItemName}</div>
                            {orderItem.menuItemDescription && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">{orderItem.menuItemDescription}</div>
                            )}
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <span className="text-xs text-gray-600 dark:text-gray-300">Price: {formatPrice(orderItem.price)}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">Qty: {orderItem.quantity}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">Subtotal: {formatPrice(orderItem.subtotal)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1 italic">No items ordered.</div>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <span className="font-bold text-lg text-green-800 dark:text-green-300">
                    Total: {formatPrice(item.order?.total || 0)}
                  </span>
                </div>
                {item.checkout.state !== "COMPLETED" && item.checkout.state !== "CANCELLED" && (
                  <div className="mt-4">
                    <AdvanceStateButton orderId={item.checkout.id} onSuccess={refetch} />
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
              {selectedOrder && `Order #${selectedOrder.checkout.id} - Table ${selectedOrder.order?.nomorMeja}`}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.order?.items?.map((item: any) => (
                      <div key={item.id} className="flex flex-col md:flex-row md:items-center md:justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 border border-gray-100 dark:border-gray-700 gap-2">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 dark:text-gray-100">{item.menuItemName}</div>
                          {item.menuItemDescription && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.menuItemDescription}</div>
                          )}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <span className="text-xs text-gray-600 dark:text-gray-300">Price: {formatPrice(item.price)}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">Qty: {item.quantity}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300">Subtotal: {formatPrice(item.subtotal)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.order?.total || 0)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {selectedOrder.checkout.state}
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
