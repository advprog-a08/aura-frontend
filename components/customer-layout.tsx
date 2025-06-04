"use client"

import type React from "react"

import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMutation } from "@tanstack/react-query"
import { ChefHat, LogOut, Menu, ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface CustomerLayoutProps {
  children: React.ReactNode
}

export function useLogoutMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const sessionId = localStorage.getItem("session_id");

      const headers: Record<string, string> = {};
      if (sessionId) headers["X-Session-Id"] = sessionId;

      const res = await fetch(process.env.NEXT_PUBLIC_OHIO_ORDER + "/api/v1/meja/session/deactivate", {
        method: "POST",
        headers,
      });

      return res.json();
    },
    onSuccess: (data) => {
      localStorage.removeItem("session_id");
      router.push("/");
    },
  });
}


export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mutation = useLogoutMutation();
  const router = useRouter();

  // Update the navigation array to remove checkout from the navbar
  const navigation = [
    {
      name: "Menu",
      href: "/menu",
      icon: Menu,
      isAuth: false,
    },
    {
      name: "My Orders",
      href: "/pesanan",
      icon: ShoppingCart,
      isAuth: true,
    },
    {
      name: "Rate Items",
      href: "/rating",
      icon: Star,
      isAuth: true,
    },
  ]

  const handleLogout = () => {
    mutation.mutate();
  }

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("session_id") && (process.env.NEXT_PUBLIC_IS_DEV !== "true")) {
      router.push("/");
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/menu" className="text-xl font-bold text-green-800 dark:text-green-400">
              RIZZerve
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation
              .filter((item) => {
                // Show only items that don't require auth, or require auth and user is logged in
                if (!item.isAuth) return true;
                if (typeof window === "undefined") return false;
                return !!localStorage.getItem("session_id") && (process.env.NEXT_PUBLIC_IS_DEV !== "true");
              })
              .map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}

            {
              typeof window !== "undefined" && localStorage.getItem("session_id") && (process.env.NEXT_PUBLIC_IS_DEV !== "true") &&
              <Button
                variant="outline"
                className="ml-4 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            }
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <ChefHat className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-green-800 dark:text-green-400">RIZZerve</h1>
                  </div>
                  <nav className="flex-1 px-4 pt-5 pb-4 space-y-2">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  )
}
