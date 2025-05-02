"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TableIcon as TableRestaurant, UtensilsCrossed, Ticket, Menu, LogOut, Home, User, Clock } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      name: "Profile",
      href: "/admin/profile",
      icon: User,
    },
    {
      name: "Table Management",
      href: "/admin/meja",
      icon: TableRestaurant,
    },
    {
      name: "Menu Management",
      href: "/admin/menu",
      icon: UtensilsCrossed,
    },
    {
      name: "Coupon Management",
      href: "/admin/kupon",
      icon: Ticket,
    },
    {
      name: "Opening Hours",
      href: "/admin/hours",
      icon: Clock,
      optional: true,
    },
  ]

  const handleLogout = () => {
    // In a real app, this would clear the session/token
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-2">
                <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">RIZZerve</h1>
            </div>
          </div>
          <div className="flex flex-col flex-1 px-4 mt-5">
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                if (item.optional) return null // Hide optional features unless enabled

                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto pb-6">
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1">
        <div className="md:hidden flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-800 p-1.5 rounded-full mr-2">
              <UtensilsCrossed className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-bold text-green-800 dark:text-green-400">RIZZerve</h1>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-2">
                      <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-xl font-bold text-green-800 dark:text-green-400">RIZZerve</h1>
                  </div>
                </div>
                <nav className="flex-1 px-4 pt-5 pb-4 space-y-2">
                  {navigation.map((item) => {
                    if (item.optional) return null // Hide optional features unless enabled

                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                          isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
                <div className="px-4 pb-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}
