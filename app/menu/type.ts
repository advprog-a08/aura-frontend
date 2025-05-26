interface BulkMenuResponse {
    success: boolean
    message: string
    data: MenuItem[]
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
}

export type { BulkMenuResponse, MenuItem, SingleMenuResponse }