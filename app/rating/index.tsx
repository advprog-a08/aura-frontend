"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Loader2, Search, Star, Trash2 } from "lucide-react"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { MenuItem, RatingResponse, UserRating } from "./interface"

interface RatingModuleProps {
  allItems: MenuItem[]
  initialTotal: number
  currentPage: number
  searchQuery: string
  itemsPerPage?: number
}

export default function RatingModule({
  allItems,
  initialTotal,
  currentPage = 1,
  searchQuery = "",
  itemsPerPage = 10
}: RatingModuleProps) {
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(allItems)
  const [total, setTotal] = useState(initialTotal)
  const [userRatings, setUserRatings] = useState<UserRating[]>([])
  const [loadingRatings, setLoadingRatings] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState(searchQuery)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
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

  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(allItems)
      setTotal(allItems.length)
    } else {
      const filtered = allItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredItems(filtered)
      setTotal(filtered.length)
    }
  }, [allItems, searchQuery])

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredItems, currentPage, itemsPerPage])

  // Fetch individual rating for a specific item
  const fetchItemRating = useCallback(async (item: MenuItem) => {
    if (!sessionId) return

    // Set loading state for this specific item
    setLoadingRatings(prev => new Set([...prev, item.id]))

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/menu/${item.id}/me`,
        { headers: { 'X-Session-Id': sessionId } }
      )
      
      if (response.ok) {
        const result: RatingResponse = await response.json()
        if (result.success && result.data && result.data.rating !== undefined && result.data.id) {
          setUserRatings(prev => {
            // Remove existing rating for this item and add new one
            const filtered = prev.filter(r => r.itemId !== item.id)
            return [...filtered, { 
              itemId: item.id, 
              rating: result.data!.rating, 
              ratingId: result.data!.id 
            }]
          })
        }
      }
    } catch (error) {
      console.error(`Failed to fetch rating for ${item.name}:`, error)
    } finally {
      // Remove loading state for this item
      setLoadingRatings(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }
  }, [sessionId])

  // Fetch ratings for all paginated items asynchronously
  useEffect(() => {
    if (!sessionId || paginatedItems.length === 0) return

    // Clear existing ratings for items that are no longer on the page
    const currentItemIds = new Set(paginatedItems.map(item => item.id))
    setUserRatings(prev => prev.filter(rating => currentItemIds.has(rating.itemId)))

    // Fetch ratings for each item independently
    paginatedItems.forEach(item => {
      // Only fetch if we don't already have the rating
      const existingRating = userRatings.find(r => r.itemId === item.id)
      if (!existingRating) {
        fetchItemRating(item)
      }
    })
  }, [paginatedItems, sessionId, fetchItemRating])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== searchQuery) {
        const params = new URLSearchParams(searchParams.toString())
        search ? params.set('search', search) : params.delete('search')
        params.set('page', '1')
        router.push(`?${params.toString()}`)
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [search])

  const getUserRating = (itemId: string) => 
    userRatings.find(r => r.itemId === itemId)?.rating || 0

  const isItemRatingLoading = (itemId: string) => 
    loadingRatings.has(itemId)

  const handleRating = async (itemId: string, rating: number) => {
    if (!sessionId) return

    try {
      const existing = userRatings.find(r => r.itemId === itemId)
      const item = paginatedItems.find(item => item.id === itemId)
      
      // Optimistically update the UI
      setUserRatings(prev => existing
        ? prev.map(r => r.itemId === itemId ? { ...r, rating } : r)
        : [...prev, { itemId, rating }]
      )

      const url = existing?.ratingId
        ? `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/${existing.ratingId}`
        : `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings`

      const response = await fetch(url, {
        method: existing?.ratingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId
        },
        body: JSON.stringify({ menu: { id: itemId }, rating })
      })

      if (!response.ok) throw new Error('Failed to submit rating')
      
      const result: RatingResponse = await response.json()
      if (result.success && result.data && result.data.id) {
        // Update with the actual response data
        setUserRatings(prev => 
          prev.map(r => r.itemId === itemId 
            ? { ...r, ratingId: result.data!.id } 
            : r
          )
        )
        toast.success(existing ? "Rating updated!" : `Thank you for rating "${item?.name}"!`)
      }
    } catch (error) {
      toast.error('Failed to submit rating')
      // Revert optimistic update by refetching
      const item = paginatedItems.find(item => item.id === itemId)
      if (item) {
        fetchItemRating(item)
      }
    }
  }

  const handleRemoveRating = async (itemId: string) => {
    if (!sessionId) return

    try {
      const existing = userRatings.find(r => r.itemId === itemId)
      if (!existing?.ratingId) return

      // Optimistically remove from UI
      setUserRatings(prev => prev.filter(r => r.itemId !== itemId))
      
      await fetch(
        `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/ratings/${existing.ratingId}`,
        { method: 'DELETE', headers: { 'X-Session-Id': sessionId } }
      )
      
      toast.success("Rating removed!")
    } catch (error) {
      toast.error('Failed to remove rating')
      // Revert by refetching
      const item = paginatedItems.find(item => item.id === itemId)
      if (item) {
        fetchItemRating(item)
      }
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, total)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const renderStars = (itemId: string) => {
    const rating = getUserRating(itemId)
    const isLoading = isItemRatingLoading(itemId)
    
    return (
      <div className="flex gap-1 items-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRating(itemId, star)}
                disabled={!sessionId}
                className={`rounded-full p-1 transition-colors disabled:opacity-50 ${
                  star <= rating ? "text-yellow-500 hover:text-yellow-600" 
                  : "text-gray-300 hover:text-yellow-400"
                }`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
            {rating > 0 && (
              <button
                onClick={() => handleRemoveRating(itemId)}
                disabled={!sessionId}
                className="ml-2 text-gray-400 hover:text-red-500 rounded-full p-1 disabled:opacity-50"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
            Rate Our Menu
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Showing {startItem}-{endItem} of {total} items
          </p>
        </div>

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

      {/* Menu Items List */}
      <div className="grid gap-6 mb-8">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    e.currentTarget.src =
                      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";
                  }}
                  className="h-32 sm:w-32 bg-cover bg-center object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {item.description}
                      </p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(item.price)}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                        <span>
                          Average: {item.averageRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <div className="text-sm font-medium mb-1">
                        Your rating:
                      </div>
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
              No menu items found
            </p>
          </Card>
        )}
      </div>

      {/* Pagination Controls */}
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
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum =
                  currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;
                return (
                  <Button
                    key={i}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}