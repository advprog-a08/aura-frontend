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