"use client"

import CustomerLayout from "@/components/customer-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import customFetch from "@/lib/fetch"
import { Minus, Plus, Search, ShoppingCart, Star, Save } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useDebouncedCallback } from 'use-debounce'
import { BulkMenuResponse, MenuItem } from "./type"
import { useCurrentOrderQuery, useUpdateOrderMutation } from "../pesanan/hooks"
import { useToast } from "@/hooks/use-toast"

export default function MenuModule() {
    const { toast: hookToast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const { data: currentOrder, isLoading: orderLoading, error: orderError } = useCurrentOrderQuery()
    const updateOrderMutation = useUpdateOrderMutation()

    const filteredItems = menuItems.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const params = useSearchParams()

    const [page] = useState(params.get("page") ? parseInt(params.get("page") as string) : 1)
    const [size] = useState(params.get("size") ? parseInt(params.get("size") as string) : 10)

    useEffect(() => {
        async function fetchMenu() {
            const data: BulkMenuResponse = await customFetch(`/api/menus?page=${page}&size=${size}`)
            if (data.success) {
                setMenuItems(data.data);
            } else {
                toast.error("Failed to load menu items. Please try again later.")
            }
            setIsLoading(false);
        }

        fetchMenu();
    }, [])
    useEffect(() => {
        if (currentOrder && currentOrder.items) {
            const orderCart = currentOrder.items.map(item => ({
                id: item.menuItemId,
                quantity: item.quantity
            }))
            setCart(orderCart)
            setHasUnsavedChanges(false)
        } else if (orderError) {
            setCart([])
            setHasUnsavedChanges(false)
        }
    }, [currentOrder, orderError])

    const addToCart = useDebouncedCallback((itemId: string) => {
        const existingItem = cart.find((item) => item.id === itemId)

        if (existingItem) {
            setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)))
        } else {
            setCart([...cart, { id: itemId, quantity: 1 }])
        }

        setHasUnsavedChanges(true)

        const item = menuItems.find((item) => item.id === itemId)
        if (item) {
            toast.success(`Added ${item.name} to your order!`)
        }
    })

    const decreaseQuantity = useDebouncedCallback((itemId: string) => {
        const existingItem = cart.find((item) => item.id === itemId)

        if (existingItem && existingItem.quantity > 1) {
            setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)))
        } else {
            setCart(cart.filter((item) => item.id !== itemId))
        }

        setHasUnsavedChanges(true)
    })

    const saveOrder = async () => {
        const orderData = {
            items: cart.map(item => ({
                menuItemId: item.id,
                quantity: item.quantity
            }))
        }

        updateOrderMutation.mutate(orderData, {
            onSuccess: () => {
                hookToast({
                    title: "Order Saved",
                    description: "Your order has been saved successfully.",
                })
                setHasUnsavedChanges(false)
            },
            onError: (error: any) => {
                hookToast({
                    title: "Save Failed",
                    description: error.message || "Failed to save order",
                    variant: "destructive",
                })
            }
        })
    }

    const getItemQuantity = (itemId: string) => {
        const item = cart.find((item) => item.id === itemId)
        return item ? item.quantity : 0
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CustomerLayout>
            <div className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Our Menu</h1>
                        <p className="text-gray-600 dark:text-gray-300">Browse and order from our delicious selection</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search menu..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />                        
                        </div>

                        {hasUnsavedChanges && (
                            <Button 
                                onClick={saveOrder}
                                disabled={updateOrderMutation.isPending || cart.length === 0}
                                className="bg-blue-600 hover:bg-blue-700 flex gap-2 items-center"
                            >
                                <Save className="h-4 w-4" />
                                <span>{updateOrderMutation.isPending ? "Saving..." : "Save Order"}</span>
                            </Button>
                        )}

                        <Button asChild className="bg-green-700 hover:bg-green-800 flex gap-2 items-center">
                            <Link href="/pesanan">
                                <ShoppingCart className="h-4 w-4" />
                                <span>My Orders</span>
                                {totalItems > 0 && (
                                    <Badge variant="outline" className="ml-1 bg-white text-green-800">
                                        {totalItems}
                                    </Badge>
                                )}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {
                        isLoading && (
                            <div className="col-span-full text-center animate-bounce">
                                <p className="text-gray-500">Loading menu items...</p>
                            </div>
                        )
                    }
                    {
                        filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <Link href={'/menu/' + item.id} key={item.id} className="flex hover:scale-105 duration-300">
                                    <Card key={item.id} className={`overflow-hidden flex flex-col w-full ${!true ? "opacity-60" : ""}`}>
                                        <img
                                            src={item.imageUrl ? item.imageUrl : "/placeholder.svg?height=200&width=400"}
                                            alt={item.name}
                                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                e.currentTarget.src = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg"
                                            }}
                                            className="h-48 w-full object-cover"
                                        />
                                        <div className="flex flex-col flex-1"></div>
                                        <div className="flex flex-col flex-1">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-xl">{item.name}</CardTitle>
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                        {/* <span className="text-sm">{item.rating.toFixed(1)}</span> */}
                                                    </div>
                                                </div>
                                                {!true && (
                                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                        Currently Unavailable
                                                    </Badge>
                                                )}
                                            </CardHeader>
                                            <CardContent className="pb-2 flex-1">
                                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.description}</p>
                                                <p className="mt-2 font-bold text-lg">{formatPrice(item.price)}</p>
                                            </CardContent>
                                            <CardFooter className="pt-2 mt-auto">
                                                {true ? (
                                                    getItemQuantity(item.id) > 0 ? (
                                                        <div className="flex items-center gap-2 w-full">
                                                            <Button variant="outline" size="icon" onClick={(e) => {
                                                                e.preventDefault()
                                                                decreaseQuantity(item.id)
                                                            }}>
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <div className="flex-1 text-center font-medium">{getItemQuantity(item.id)}</div>
                                                            <Button variant="outline" size="icon" onClick={(e) => {
                                                                e.preventDefault()
                                                                addToCart(item.id)
                                                            }}>
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button className="w-full bg-green-700 hover:bg-green-800" onClick={(e) => {
                                                            e.preventDefault()
                                                            addToCart(item.id)
                                                        }}>
                                                            Add to Order
                                                        </Button>
                                                    )
                                                ) : (
                                                    <Button disabled className="w-full">
                                                        Unavailable
                                                    </Button>
                                                )}
                                            </CardFooter>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        ) :
                            (
                                <div className="col-span-full text-center">
                                    <p className="text-gray-500">No menu items found matching your search.</p>
                                </div>
                            )
                    }
                </div>
            </div>
        </CustomerLayout>
    )
}
