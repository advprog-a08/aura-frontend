"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import customFetch from "@/lib/fetch"
import { AlertCircle, ArrowLeft, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { MenuItem, SingleMenuResponse } from "../type"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MenuDetailModule({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(true)
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null)

    useEffect(() => {
        async function fetchMenu() {
            try {
                const data: SingleMenuResponse = await customFetch(`/api/menus/${id}`, {}, "mewing_menu")
                console.log(data)
                if (data.success) {
                    setMenuItem(data.data)
                } else {
                    toast.error(data.message || "Error fetching menu item")
                }
            } catch (error) {
                toast.error("Failed to fetch menu item")
            } finally {
                setIsLoading(false)
            }
        }

        fetchMenu()
    }, [id])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2">
                                <Skeleton className="h-64 md:h-96 w-full" />
                            </div>
                            <div className="md:w-1/2 p-8">
                                <Skeleton className="h-8 w-3/4 mb-4" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6 mb-6" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    if (!menuItem) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Item Not Found</h2>
                        <p className="text-gray-600 text-center">Sorry, we couldn't find the menu item you're looking for.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br bg-green-100 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
                <Link href={'/menu'}>
                    <Button>
                        <ArrowLeft />
                        Back
                    </Button>
                </Link>
                <Card className="overflow-hidden border-0">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/2 relative">
                            <div className="aspect-square md:aspect-auto md:h-96 overflow-hidden">
                                <img
                                    src={menuItem.imageUrl || "/placeholder.svg"}
                                    alt={menuItem.name}
                                    // On error
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                        e.currentTarget.src = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg"
                                    }}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="absolute top-4 right-4">
                                <Badge variant="secondary" className="bg-white/90 text-gray-800 font-semibold">
                                    Featured
                                </Badge>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-1/2 p-8 bg-white">
                            <div className="h-full flex flex-col justify-center">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{menuItem.name}</h1>

                                <p className="text-gray-600 text-lg leading-relaxed mb-8">{menuItem.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="h-6 w-6 text-green-600" />
                                        <span className="text-3xl font-bold text-green-600">{menuItem.price.toFixed(2)}</span>
                                    </div>

                                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                                        Available Now
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
