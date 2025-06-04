"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Loader2, Search, Star, Trash2 } from "lucide-react"
import { useEffect, useState, useTransition, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { MenuItem, RatingResponse, UserRating } from "./interface"

interface RatingModuleProps {
  initialItems: MenuItem[]
  initialTotal: number
  initialHasMore: boolean
  currentPage: number
  searchQuery: string
}

export default function RatingModule({
  initialItems,
  initialTotal,
  initialHasMore,
  currentPage,
  searchQuery
}: RatingModuleProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems)
  const [total, setTotal] = useState(initialTotal)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [userRatings, setUserRatings] = useState<UserRating[]>([])
  const [search, setSearch] = useState(searchQuery)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loadingRatings, setLoadingRatings] = useState(false)
  
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionId = localStorage.getItem("session_id")
      if (!storedSessionId) {
        window.location.href = "/"
        return
      }
      setSessionId(storedSessionId)
    }
  }, [])

  const fetchUserRatings = useCallback(async (items: MenuItem[]) => {
    if (!sessionId || items.length === 0) return

    setLoadingRatings(true)
    try {
      const ratings: UserRating[] = []
      
      const ratingPromises = items.map(async (item) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/menu/${item.id}/me`,
            {
              headers: {
                'X-Session-Id': sessionId
              }
            }
          )

          if (response.ok) {
            const result: RatingResponse = await response.json()
            if (result.success && result.data) {
              return {
                itemId: item.id,
                rating: result.data.rating,
                ratingId: result.data.id
              }
            }
          }
          return null
        } catch (error) {
          console.warn(`Failed to fetch rating for ${item.id}:`, error)
          return null
        }
      })

      const results = await Promise.allSettled(ratingPromises)
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          ratings.push(result.value)
        }
      })

      setUserRatings(ratings)
    } catch (error) {
      console.error('Failed to fetch user ratings:', error)
    } finally {
      setLoadingRatings(false)
    }
  }, [sessionId])

  useEffect(() => {
    fetchUserRatings(menuItems)
  }, [menuItems, fetchUserRatings])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== searchQuery) {
        handleSearch(search)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, searchQuery])

  const handleSearch = (searchValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }
    params.set('page', '1') 
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const getUserRating = (itemId: string) => {
    const rating = userRatings.find((r) => r.itemId === itemId)
    return rating ? rating.rating : 0
  }

  const setRating = async (itemId: string, rating: number) => {
    if (!sessionId) return

    try {
      const existingRating = userRatings.find((r) => r.itemId === itemId)
      const item = menuItems.find((item) => item.id === itemId)

      // Optimistic update
      if (existingRating) {
        setUserRatings(userRatings.map((r) => (r.itemId === itemId ? { ...r, rating } : r)))
      } else {
        setUserRatings([...userRatings, { itemId, rating }])
      }

      const requestBody = {
        menu: { id: itemId },
        rating: rating
      }

      let apiUrl: string
      let method: string

      if (existingRating?.ratingId) {
        apiUrl = `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/${existingRating.ratingId}`
        method = 'PUT'
      } else {
        apiUrl = `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings`
        method = 'POST'
      }

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId
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
          toast.success(
            existingRating?.ratingId 
              ? "Rating updated!" 
              : `Thank you for rating "${item.name}"!`
          )
        }
      } else {
        throw new Error(result.message || 'Failed to submit rating')
      }
    } catch (error) {
      console.error('Failed to submit rating:', error)
      await fetchUserRatings([menuItems.find(item => item.id === itemId)!].filter(Boolean))
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit rating'
      toast.error(errorMessage)
    }
  }

  const removeRating = async (itemId: string) => {
    if (!sessionId) return

    try {
      const existingRating = userRatings.find((r) => r.itemId === itemId)
      const item = menuItems.find((item) => item.id === itemId)

      if (!existingRating?.ratingId) {
        setUserRatings(userRatings.filter((r) => r.itemId !== itemId))
        return
      }

      setUserRatings(userRatings.filter((r) => r.itemId !== itemId))

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/${existingRating.ratingId}`,
        {
          method: 'DELETE',
          headers: { 'X-Session-Id': sessionId }
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (item) {
        toast.success(`Rating for "${item.name}" removed successfully`)
      }
    } catch (error) {
      console.error('Failed to remove rating:', error)
      
      await fetchUserRatings([menuItems.find(item => item.id === itemId)!].filter(Boolean))
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove rating'
      toast.error(errorMessage)
    }
  }

  const renderStars = (itemId: string) => {
    const userRating = getUserRating(itemId)

    return (
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(itemId, star)}
            disabled={!sessionId}
            className={`rounded-full p-1 transition-colors disabled:opacity-50 ${
              star <= userRating 
                ? "text-yellow-500 hover:text-yellow-600" 
                : "text-gray-300 hover:text-yellow-400"
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}

        {userRating > 0 && (
          <button
            onClick={() => removeRating(itemId)}
            disabled={!sessionId}
            className="ml-2 text-gray-400 hover:text-red-500 rounded-full p-1 disabled:opacity-50"
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

  const totalPages = Math.ceil(total / 10)
  const startItem = (currentPage - 1) * 10 + 1
  const endItem = Math.min(currentPage * 10, total)

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
            Rate Our Menu
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Share your feedback on the dishes you've tried
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Showing {startItem}-{endItem} of {total} items
          </p>
        </div>

        <div className="flex gap-4 items-center">
          {sessionId && (
            <div className="text-sm">
              <span className="text-gray-500">Session: </span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {sessionId}
              </code>
            </div>
          )}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search menu..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {(isPending || loadingRatings) && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{loadingRatings ? 'Loading ratings...' : 'Loading...'}</span>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="grid gap-6 mb-8">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div
                  className="h-32 sm:w-32 bg-cover bg-center"
                  style={{
                    backgroundImage: item.imageUrl 
                      ? `url(${item.imageUrl})` 
                      : "url(/placeholder.svg?height=200&width=200)",
                  }}
                />
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {item.description}
                      </p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                        <span>
                          Average rating: {
                            item.averageRating 
                              ? item.averageRating.toFixed(1) 
                              : 'No ratings yet'
                          }
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
            <p className="text-gray-500 dark:text-gray-400">
              No menu items found matching your search.
            </p>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={i}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isPending}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}