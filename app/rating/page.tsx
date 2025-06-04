
import { Suspense } from 'react'
import { MenuItem, ApiResponse } from './interface'
import CustomerLayout from "@/components/customer-layout"
import { Loader2 } from "lucide-react"
import RatingModule from '.'

async function getMenuItems(page: number = 1, limit: number = 10, search?: string): Promise<{
  items: MenuItem[]
  total: number
  hasMore: boolean
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    })

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/menus?${params}`,
      {
        cache: 'no-store' // For real-time data, use 'force-cache' for static data
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse & { total?: number } = await response.json()

    if (result.success) {
      return {
        items: result.data,
        total: result.total || result.data.length,
        hasMore: result.data.length === limit
      }
    } else {
      throw new Error(result.message || 'Failed to fetch menu data')
    }
  } catch (error) {
    console.error('Failed to fetch menu items:', error)
    throw error
  }
}

interface RatingPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

export default async function RatingPage({ searchParams }: RatingPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const search = params.search

  try {
    const { items, total, hasMore } = await getMenuItems(page, 10, search)

    return (
      <CustomerLayout>
        <Suspense fallback={<LoadingState />}>
          <RatingModule 
            initialItems={items}
            initialTotal={total}
            initialHasMore={hasMore}
            currentPage={page}
            searchQuery={search || ''}
          />
        </Suspense>
      </CustomerLayout>
    )
  } catch (error) {
    return (
      <CustomerLayout>
        <div className="container mx-auto p-6">
          <div className="p-8 text-center bg-red-50 rounded-lg">
            <p className="text-red-500 mb-4">Failed to load menu items</p>
            <p className="text-sm text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </CustomerLayout>
    )
  }
}

function LoadingState() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading menu data...</span>
        </div>
      </div>
    </div>
  )
}