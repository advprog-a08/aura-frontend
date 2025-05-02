import { UtensilsCrossed } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-3">
              <UtensilsCrossed className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-800 dark:text-green-400">RIZZerve</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The smoothest way to order and enjoy your favorite meals
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} RIZZerve. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
