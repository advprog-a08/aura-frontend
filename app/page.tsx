import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Clock, CreditCard, ShoppingCart, Star, Table, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function Home() {
  
  redirect("/menu")

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
        <div className="max-w-3xl w-full mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center p-2 bg-green-600 rounded-full mb-2">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>

          <h1 className="text-5xl font-bold text-green-800 dark:text-green-300">RIZZerve</h1>

          <p className="text-xl text-gray-700 dark:text-gray-200">
            The smoothest way to order and enjoy your favorite meals with just a tap 🍽️🔥
          </p>

          <div className="pt-4">
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Inspired by Japanese Sushi Restaurant Ordering Systems
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full mr-4">
                  <Table className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Table Management</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Easily manage restaurant tables with our intuitive interface. Add, edit, or remove tables as needed.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full mr-4">
                  <UtensilsCrossed className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu Management</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Create and update your restaurant menu with detailed descriptions, prices, and availability status.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full mr-4">
                  <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Management</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Customers can easily place orders by selecting their table number and choosing from available menu
                items.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full mr-4">
                  <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Food Ratings</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Customers can rate menu items and view average ratings to help them make informed choices.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full mr-4">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Easy Checkout</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Streamlined checkout process with coupon support and order summary before finalizing the order.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Efficient Operations</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Reduce errors in order taking and improve overall restaurant efficiency with our digital ordering
                system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="py-12 px-6 bg-green-50 dark:bg-green-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About RIZZerve</h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
            RIZZerve is designed to streamline restaurant operations with an online ordering system. This application
            helps restaurants manage orders more efficiently, reduce errors in order taking, and solve menu availability
            issues during peak hours.
          </p>
          <div className="pt-4">
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
