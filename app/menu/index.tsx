"use client"

import CustomerLayout from "@/components/customer-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast as useSonnerToast } from "@/hooks/use-toast"; // Renamed to avoid conflict if "toast" from sonner is also used directly
import customFetch from "@/lib/fetch"
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, Save, Search, ShoppingCart, Star } from "lucide-react"; // Added Loader2, ChevronLeft, ChevronRight
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"; // useRouter added
import { useEffect, useState } from "react"; // useCallback added
import { toast } from "sonner"
import { useDebouncedCallback } from 'use-debounce'
import { useCurrentOrderQuery, useUpdateOrderMutation } from "../pesanan/hooks"
import { BulkMenuResponse, MenuItem } from "./type"

const ITEMS_PER_PAGE = 12; // Or make this configurable

export default function MenuModule() {
    const { toast: hookToast } = useSonnerToast() // Using the renamed import
    const router = useRouter()
    const searchParams = useSearchParams()

    // State for data and loading
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalItems, setTotalItems] = useState(0)

    // State for pagination and search query (derived from URL)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("") // Actual query for API

    // State for the search input field
    const [searchInput, setSearchInput] = useState("")

    // Cart and Order related state/hooks (existing)
    const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const { data: currentOrder, isLoading: orderLoading, error: orderError } = useCurrentOrderQuery()
    const updateOrderMutation = useUpdateOrderMutation()

    // Effect to sync state from URL parameters
    useEffect(() => {
        const pageFromUrl = parseInt(searchParams.get("page") || "1")
        const queryFromUrl = searchParams.get("search") || ""

        setCurrentPage(pageFromUrl)
        setSearchQuery(queryFromUrl)
        setSearchInput(queryFromUrl) // Sync input field with URL search query
    }, [searchParams])

    // Effect to debounce search input changes and update URL
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchInput !== searchQuery) { // Only push if different from current URL query
                const params = new URLSearchParams(searchParams.toString())
                if (searchInput) {
                    params.set('search', searchInput)
                } else {
                    params.delete('search')
                }
                params.set('page', '1') // Reset to page 1 on new search
                router.push(`?${params.toString()}`, { scroll: false })
            }
        }, 500) // 500ms debounce

        return () => {
            clearTimeout(handler)
        }
    }, [searchInput, searchQuery, router, searchParams])

    // Effect to fetch menu items (server-side pagination and search)
    useEffect(() => {
        async function fetchMenuData() {
            setIsLoading(true)
            // API endpoint needs to support `page`, `size`, and `search`
            const apiUrl = `/api/menus`
            try {
                const response: BulkMenuResponse = await customFetch(apiUrl)
                if (response.success) {
                    const paginatedItems = response.data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

                    const filteredItems = paginatedItems.filter(item => { 
                        return !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    })


                    setMenuItems(filteredItems)
                    // IMPORTANT: API must return total count of matching items
                    // Adjust based on your API response structure (e.g., response.meta.total or response.total)
                    setTotalItems(response.data.length || response.total || response.data.length)
                    if (!response.data.length && !response.total) {
                        console.warn("API response for menu items does not include total count. Pagination might be inaccurate if data.length is less than ITEMS_PER_PAGE but more pages exist.");
                    }
                } else {
                    toast.error("Failed to load menu items. Please try again later.")
                    setMenuItems([])
                    setTotalItems(0)
                }
            } catch (error) {
                console.error("Error fetching menu:", error)
                toast.error("An error occurred while fetching menu items.")
                setMenuItems([])
                setTotalItems(0)
            } finally {
                setIsLoading(false)
            }
        }
        // Fetch data if currentPage is valid (e.g., > 0)
        // This ensures that we don't fetch with a potentially uninitialized currentPage
        if (currentPage > 0) {
            fetchMenuData();
        }
    }, [currentPage, searchQuery]) // ITEMS_PER_PAGE can be added if it's dynamic

    // Effect for syncing cart from currentOrder (existing)
    useEffect(() => {
        if (currentOrder && currentOrder.items) {
            const orderCart = currentOrder.items.map(item => ({
                id: item.menuItemId,
                quantity: item.quantity
            }))
            setCart(orderCart)
            setHasUnsavedChanges(false)
        } else if (orderError) { // If there's an error fetching order, or no order, reset cart
            setCart([])
            setHasUnsavedChanges(false)
        }
    }, [currentOrder, orderError])


    const addToCart = useDebouncedCallback((itemId: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find((item) => item.id === itemId)
            if (existingItem) {
                return prevCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
            }
            return [...prevCart, { id: itemId, quantity: 1 }]
        })
        setHasUnsavedChanges(true)
        const item = menuItems.find((menuItem) => menuItem.id === itemId)
        if (item) {
            toast.success(`Added ${item.name} to your order!`)
        }
    }, 300)

    const decreaseQuantity = useDebouncedCallback((itemId: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find((item) => item.id === itemId)
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
            }
            return prevCart.filter((item) => item.id !== itemId)
        })
        setHasUnsavedChanges(true)
    }, 300)

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
        const item = cart.find((cartItem) => cartItem.id === itemId)
        return item ? item.quantity : 0
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    // Pagination calculations
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;
    const startItem = totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
    const endItem = totalItems > 0 ? Math.min(currentPage * ITEMS_PER_PAGE, totalItems) : 0;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            const params = new URLSearchParams(searchParams.toString())
            params.set('page', newPage.toString())
            router.push(`?${params.toString()}`, { scroll: false }) // scroll:false prevents jumping to top
        }
    }

    // Determine if an item is available (assuming MenuItem has `isAvailable` property)
    const isItemAvailable = (item: MenuItem) => item.quantity > 0


    return (
        <CustomerLayout>
            <div className="container mx-auto p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Our Menu</h1>
                        {totalItems > 0 && !isLoading ? (
                            <p className="text-gray-600 dark:text-gray-300">
                                Showing {startItem}-{endItem} of {totalItems} items
                            </p>
                        ) : isLoading ? (
                            <p className="text-gray-600 dark:text-gray-300">Loading items...</p>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300">Browse and order from our delicious selection</p>
                        )}
                    </div>

                    <div className="flex w-full md:w-auto gap-4 flex-wrap"> {/* Added flex-wrap */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search menu..."
                                className="pl-8"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>

                        {hasUnsavedChanges && (
                            <Button
                                onClick={saveOrder}
                                disabled={updateOrderMutation.isPending || cart.length === 0}
                                className="bg-blue-600 hover:bg-blue-700 flex gap-2 items-center"
                            >
                                <Save className="h-4 w-4" />
                                <span>{updateOrderMutation.isPending || orderLoading ? "Saving..." : "Save Order"}</span>
                            </Button>
                        )}

                        <Button asChild className="bg-green-700 hover:bg-green-800 flex gap-2 items-center">
                            <Link href="/pesanan">
                                <ShoppingCart className="h-4 w-4" />
                                <span>My Orders</span>
                                {totalCartItems > 0 && (
                                    <Badge variant="outline" className="ml-1 bg-white text-green-800">
                                        {totalCartItems}
                                    </Badge>
                                )}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Menu Items Grid */}
                {isLoading && (
                    <div className="col-span-full text-center py-10">
                        <Loader2 className="h-12 w-12 animate-spin text-green-700 mx-auto" />
                        <p className="text-gray-500 mt-2">Loading menu items...</p>
                    </div>
                )}

                {!isLoading && menuItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {menuItems.map((item) => (
                            <Link href={`/menu/${item.id}`} key={item.id} className="flex hover:scale-105 duration-300">
                                <Card className={`overflow-hidden flex flex-col w-full ${!isItemAvailable(item) ? "opacity-60" : ""}`}>
                                    <img
                                        src={item.imageUrl || "/placeholder.svg?height=200&width=400"}
                                        alt={item.name}
                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                            e.currentTarget.src = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg"
                                        }}
                                        className="h-48 w-full object-cover"
                                    />
                                    <div className="flex flex-col flex-1">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-xl">{item.name}</CardTitle>
                                                {item.averageRating !== undefined && item.averageRating! > 0 && (
                                                    <div className="flex items-center text-sm">
                                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                                        <span>{item.averageRating!.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {!isItemAvailable(item) && (
                                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 w-fit">
                                                    Currently Unavailable
                                                </Badge>
                                            )}
                                        </CardHeader>
                                        <CardContent className="pb-2 flex-1">
                                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.description}</p>
                                            <p className="mt-2 font-bold text-lg">{formatPrice(item.price)}</p>
                                        </CardContent>
                                        <CardFooter className="pt-2 mt-auto">
                                            {isItemAvailable(item) ? (
                                                getItemQuantity(item.id) > 0 ? (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <Button variant="outline" size="icon" onClick={(e) => {
                                                            e.preventDefault();
                                                            decreaseQuantity(item.id);
                                                        }}>
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <div className="flex-1 text-center font-medium">{getItemQuantity(item.id)}</div>
                                                        <Button variant="outline" size="icon" onClick={(e) => {
                                                            e.preventDefault();
                                                            addToCart(item.id);
                                                        }}>
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button className="w-full bg-green-700 hover:bg-green-800" onClick={(e) => {
                                                        e.preventDefault();
                                                        addToCart(item.id);
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
                        ))}
                    </div>
                )}

                {!isLoading && menuItems.length === 0 && (
                    <div className="col-span-full text-center py-10">
                        <Card className="p-8 text-center inline-block">
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchQuery ? `No menu items found matching "${searchQuery}".` : "No menu items available at the moment."}
                            </p>
                        </Card>
                    </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-between mt-8">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> {/* Added mr-1 for spacing */}
                                Previous
                            </Button>
                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum = currentPage <= 3
                                        ? i + 1
                                        : currentPage >= totalPages - 2
                                            ? totalPages - Math.min(5, totalPages) + 1 + i // Corrected logic for few total pages
                                            : currentPage - 2 + i;

                                    // Ensure pageNum is within valid range, especially when totalPages < 5
                                    if (totalPages < 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i; // Should be totalPages - (Math.min(5, totalPages) - 1) + i
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    // Simpler logic for page numbers:
                                    // Calculate start and end page for the 5 buttons
                                    let startPage = Math.max(1, currentPage - 2);
                                    let endPage = Math.min(totalPages, currentPage + 2);
                                    if (endPage - startPage + 1 < Math.min(5, totalPages)) {
                                        if (currentPage < 3) { // near the start
                                            endPage = Math.min(totalPages, startPage + Math.min(5, totalPages) - 1);
                                        } else { // near the end
                                            startPage = Math.max(1, endPage - Math.min(5, totalPages) + 1);
                                        }
                                    }
                                    // This complex logic is to always show 5 buttons if possible.
                                    // A simpler approach from RatingModule might be best if it works well there.
                                    // Using the RatingModule logic directly:
                                    pageNum = (currentPage <= 3)
                                        ? i + 1
                                        : (currentPage >= totalPages - 2)
                                            ? totalPages - (Math.min(5, totalPages) - 1) + i // Adjusted for Math.min(5,totalPages)
                                            : currentPage - 2 + i;

                                    if (pageNum > totalPages || pageNum < 1) return null; // Don't render invalid page buttons

                                    return (
                                        <Button
                                            key={`page-${pageNum}`}
                                            variant={pageNum === currentPage ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            className="w-10"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                }).filter(Boolean)} {/* Filter out nulls from invalid page numbers */}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" /> {/* Added ml-1 for spacing */}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    )
}