import { Suspense } from 'react'
import { MenuItem, ApiResponse } from './interface'
import CustomerLayout from "@/components/customer-layout"
import { Loader2 } from "lucide-react"
import RatingModule from '.'

async function getMenuItems(page: number = 1, limit: number = 5, search?: string): Promise<{
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
        cache: 'no-store' 
      }
    )

    if (response.status === 404) {
      return {
        items: [],
        total: 0,
        hasMore: false
      }
    }

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
    return {
      items: [],
      total: 0,
      hasMore: false
    }
  }
}

interface RatingPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

async function getAllMenuItems(search?: string): Promise<{
  items: MenuItem[]
  total: number
}> {
  try {
    const params = new URLSearchParams()
    if (search) params.set('search', search)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEWING_MENU}/api/menus?${params}`,
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const result = await response.json()
    return {
      items: result.success ? result.data : [],
      total: result.success ? result.data.length : 0
    }
  } catch (error) {
    console.error('Failed to fetch menu items:', error)
    return { items: [], total: 0 }
  }
}

export default async function RatingPage({ searchParams }: RatingPageProps) {
  const params = await searchParams
  const search = params.search
  const { items, total } = await getAllMenuItems(search)

  return (
    <CustomerLayout>
      <Suspense fallback={<LoadingState />}>
        <RatingModule 
          allItems={items} 
          initialTotal={total}
          currentPage={parseInt(params.page || '1')}
          searchQuery={search || ''}
          itemsPerPage={5}
        />
      </Suspense>
    </CustomerLayout>
  )
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