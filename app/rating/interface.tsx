// interface.ts
export interface MenuItem {
  id: string
  name: string
  description: string
  imageUrl: string
  quantity: number
  price: number
  averageRating: number | null
}

export interface ApiResponse {
  success: boolean
  message: string
  data: MenuItem[]
  total?: number // Added for pagination
  page?: number
  limit?: number
}

export interface UserRating {
  itemId: string
  rating: number
  ratingId?: string
}

export interface RatingResponse {
  success: boolean
  message: string
  data: {
    id: string
    menuId: string
    rating: number
    createdAt: string
  } | null
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}