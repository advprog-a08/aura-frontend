"use client"

import CustomerLayout from "@/components/customer-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, Star, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ApiResponse, MenuItem, RatingResponse, UserRating } from "./interface"


export default function RatingModule() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userRatings, setUserRatings] = useState<UserRating[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSessionId(localStorage.getItem("session_id"));
        }
    }, []);

    const { toast } = useToast()


    const fetchUserRating = async (menuId: string): Promise<{ rating: number; ratingId?: string }> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/menu/${menuId}/me`, {
                headers: {
                    'X-Session-Id': sessionId ? sessionId : ""
                }
            })

            if (!response.ok) {
                if (response.status === 404) {
                    return { rating: 0 }
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: RatingResponse = await response.json()

            if (result.success && result.data) {
                return { rating: result.data.rating, ratingId: result.data.id }
            }

            return { rating: 0 }
        } catch (err) {
            console.warn(`Failed to fetch rating for menu ${menuId}:`, err)
            return { rating: 0 }
        }
    }

    const fetchAllUserRatings = async (menuItems: MenuItem[]) => {
        const ratings: UserRating[] = []

        for (const item of menuItems) {
            const { rating, ratingId } = await fetchUserRating(item.id)
            if (rating > 0) {
                ratings.push({ itemId: item.id, rating, ratingId })
            }
        }

        setUserRatings(ratings)
    }

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_MEWING_MENU}/api/menus`)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const result: ApiResponse = await response.json()

                if (result.success) {
                    setMenuItems(result.data)
                    await fetchAllUserRatings(result.data)
                } else {
                    throw new Error(result.message || 'Failed to fetch menu data')
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch menu data'
                setError(errorMessage)
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchMenuData()
    }, [toast, sessionId])

    const filteredItems = menuItems.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const getUserRating = (itemId: string) => {
        const rating = userRatings.find((r) => r.itemId === itemId)
        return rating ? rating.rating : 0
    }

    const setRating = async (itemId: string, rating: number) => {
        try {
            const existingRating = userRatings.find((r) => r.itemId === itemId)
            const item = menuItems.find((item) => item.id === itemId)

            if (existingRating) {
                setUserRatings(userRatings.map((r) => (r.itemId === itemId ? { ...r, rating } : r)))
            } else {
                setUserRatings([...userRatings, { itemId, rating }])
            }

            const requestBody = {
                menu: {
                    id: itemId
                },
                rating: rating
            }

            let response: Response
            let apiUrl: string
            let method: string

            if (existingRating && existingRating.ratingId) {
                apiUrl = `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/${existingRating.ratingId}`
                method = 'PUT'
            } else {
                apiUrl = `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings`
                method = 'POST'
            }

            response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Id': sessionId ? sessionId : ""
                },
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: RatingResponse = await response.json()

            if (result.success && result.data) {
                setUserRatings(prevRatings =>
                    prevRatings.map(r =>
                        r.itemId === itemId
                            ? { ...r, rating, ratingId: result.data!.id }
                            : r
                    )
                )

                if (item) {
                    if (existingRating && existingRating.ratingId) {
                        toast({
                            title: "Rating Updated",
                            description: `Your rating for "${item.name}" has been updated to ${rating} stars.`,
                            variant: "default",
                        })
                    } else {
                        toast({
                            title: "Rating Submitted",
                            description: `Thank you for rating "${item.name}" ${rating} stars!`,
                            variant: "default",
                        })
                    }
                }
            } else {
                throw new Error(result.message || 'Failed to submit rating')
            }
        } catch (err) {
            console.error('Failed to submit rating:', err)

            const originalRatingData = await fetchUserRating(itemId)
            if (originalRatingData.rating > 0) {
                setUserRatings(userRatings.map((r) =>
                    r.itemId === itemId
                        ? { ...r, rating: originalRatingData.rating, ratingId: originalRatingData.ratingId }
                        : r
                ))
            } else {
                setUserRatings(userRatings.filter((r) => r.itemId !== itemId))
            }

            const errorMessage = err instanceof Error ? err.message : 'Failed to submit rating'
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    const removeRating = async (itemId: string) => {
        try {
            const existingRating = userRatings.find((r) => r.itemId === itemId)
            const item = menuItems.find((item) => item.id === itemId)

            if (!existingRating || !existingRating.ratingId) {
                setUserRatings(userRatings.filter((r) => r.itemId !== itemId))
                return
            }

            setUserRatings(userRatings.filter((r) => r.itemId !== itemId))

            const response = await fetch(`${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/${existingRating.ratingId}`, {
                method: 'DELETE',
                headers: {
                    'X-Session-Id': sessionId ? sessionId : ""
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            if (item) {
                toast({
                    title: "Rating Removed",
                    description: `Your rating for "${item.name}" has been successfully removed.`,
                    variant: "default",
                })
            }
        } catch (err) {
            console.error('Failed to remove rating:', err)

            const originalRatingData = await fetchUserRating(itemId)
            if (originalRatingData.rating > 0) {
                setUserRatings([...userRatings, {
                    itemId,
                    rating: originalRatingData.rating,
                    ratingId: originalRatingData.ratingId
                }])
            }

            const errorMessage = err instanceof Error ? err.message : 'Failed to remove rating'
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    const renderStars = (itemId: string) => {
        const userRating = getUserRating(itemId)

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(itemId, star)}
                        className={`rounded-full p-1 transition-colors ${star <= userRating ? "text-yellow-500 hover:text-yellow-600" : "text-gray-300 hover:text-yellow-400"
                            }`}
                    >
                        <Star className="h-6 w-6 fill-current" />
                    </button>
                ))}

                {userRating > 0 && (
                    <button
                        onClick={() => removeRating(itemId)}
                        className="ml-2 text-gray-400 hover:text-red-500 rounded-full p-1"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                )}
            </div>
        )
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price)
    }

    if (loading) {
        return (
            <CustomerLayout>
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Loading menu data...</span>
                        </div>
                    </div>
                </div>
            </CustomerLayout>
        )
    }

    if (error) {
        return (
            <CustomerLayout>
                <div className="container mx-auto p-6">
                    <Card className="p-8 text-center">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-green-700 hover:bg-green-800"
                        >
                            Retry
                        </Button>
                    </Card>
                </div>
            </CustomerLayout>
        )
    }

    return (
        <CustomerLayout>
            <div className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Rate Our Menu</h1>
                        <p className="text-gray-600 dark:text-gray-300">Share your feedback on the dishes you've tried</p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="text-sm">
                            <span className="text-gray-500">Session: </span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{sessionId}</code>
                        </div>
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
                    </div>
                </div>

                <div className="grid gap-6">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <div className="flex flex-col sm:flex-row">
                                    <div
                                        className="h-32 sm:w-32 bg-cover bg-center"
                                        style={{
                                            backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : "url(/placeholder.svg?height=200&width=200)",
                                        }}
                                    />
                                    <div className="flex-1 p-4">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{item.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                                                <p className="text-sm font-medium text-green-600 mt-1">{formatPrice(item.price)}</p>

                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                                                    <span>
                                                        Average rating: {item.averageRating ? item.averageRating.toFixed(1) : 'No ratings yet'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                                    <span>Stock: {item.quantity} available</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 sm:mt-0">
                                                <div className="text-sm font-medium mb-1">Your rating:</div>
                                                {renderStars(item.id)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No menu items found matching your search.</p>
                        </Card>
                    )}
                </div>
            </div>
        </CustomerLayout>
    )
}