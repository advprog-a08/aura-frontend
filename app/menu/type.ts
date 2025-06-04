interface BulkMenuResponse {
    success: boolean
    message: string
    data: MenuItem[]
    total: number // total number of menu items for pagination
}

interface SingleMenuResponse { 
    success: boolean
    message: string
    data: MenuItem | null
}

interface MenuItem {
    id: string
    name: string
    description: string
    imageUrl: string
    price: number
    quantity: number
    averageRating: number | null
}

export type { BulkMenuResponse, MenuItem, SingleMenuResponse }