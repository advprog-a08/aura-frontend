"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, UtensilsCrossed } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Footer from "@/components/footer"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    // Mock login logic - in a real app, this would call an API
    if (username && password) {
      // Simple role detection based on username for demo purposes
      if (username.toLowerCase().includes("admin")) {
        router.push("/admin/dashboard")
      } else {
        router.push("/menu")
      }
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                <UtensilsCrossed className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Welcome to RIZZerve</CardTitle>
            <CardDescription className="text-center">Login to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>

                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-center text-gray-500">
              <Link href="/forgot-password" className="text-green-700 hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm text-center text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-green-700 hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
