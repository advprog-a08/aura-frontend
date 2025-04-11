import { ChevronRight, Utensils, Clock, CreditCard, ArrowRight } from "lucide-react"
import { Link } from "react-router"

import { Button } from "~/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ0EqHI6h5QgFTXGG_1i2FADG1xulRbVtecA&s"
            alt="Restaurant interior"
            className="object-cover brightness-50 w-full h-full"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Taste & Savor</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Experience culinary excellence with our modern dining experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg bg-blue-600 hover:bg-blue-700">
              <Link to="/menu">View Our Menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg bg-transparent text-white border-white hover:bg-white hover:text-blue-800"
            >
              <Link to="/order">Order Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our digital ordering system makes dining with us a seamless experience from start to finish.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-slate-100 transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Browse Our Menu</h3>
              <p className="text-slate-600">
                Explore our diverse selection of dishes, from appetizers to desserts, all at your fingertips.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-slate-100 transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Place Your Order</h3>
              <p className="text-slate-600">
                Order directly from your table using our digital menu system, no waiting for service.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-slate-100 transform transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Pay at the Cashier</h3>
              <p className="text-slate-600">When you're ready, visit our cashier to complete your payment with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Featured Dishes</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover our chef's special creations that have become customer favorites.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-64">
                <img src="/dish-1.jpg" alt="Featured dish"  className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Grilled Salmon</h3>
                <p className="text-slate-600 mb-4">Fresh salmon with lemon butter sauce and seasonal vegetables.</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/menu">View on Menu</Link>
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-64">
                <img src="/dish-2.jpg" alt="Featured dish" className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Filet Mignon</h3>
                <p className="text-slate-600 mb-4">Tender beef filet with mashed potatoes and asparagus.</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/menu">View on Menu</Link>
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-64">
                <img src="/dish-3.jpg" alt="Featured dish" className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Chocolate Lava Cake</h3>
                <p className="text-slate-600 mb-4">
                  Warm chocolate cake with a molten center, served with vanilla ice cream.
                </p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/menu">View on Menu</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">About Taste & Savor</h2>
              <p className="text-slate-600 mb-6 text-lg">
                Founded in 2020, Taste & Savor brings a modern approach to dining with our innovative ordering system
                and exceptional cuisine. Our chefs prepare each dish with the freshest ingredients, ensuring a memorable
                dining experience.
              </p>
              <p className="text-slate-600 mb-8 text-lg">
                Our digital ordering system allows you to browse our menu, place orders, and pay at your convenience,
                all while enjoying the ambiance of our restaurant.
              </p>
              <Button asChild className="text-lg bg-blue-600 hover:bg-blue-700">
                <Link to="/menu" className="inline-flex items-center">
                  Explore Our Menu <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-xl order-1 md:order-2">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ0EqHI6h5QgFTXGG_1i2FADG1xulRbVtecA&s" alt="Restaurant interior" className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="max-w-2xl mx-auto opacity-90">
              Don't just take our word for it. Here's what our valued customers have to say about their dining
              experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-slate-800">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                "The digital ordering system made our dining experience so smooth. We could browse the menu at our own
                pace and order when we were ready. The food was exceptional!"
              </p>
              <div className="font-semibold text-blue-800">- Sarah Johnson</div>
            </div>
            <div className="bg-white rounded-xl p-8 text-slate-800">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                "I love how easy it is to place an order. The interface is intuitive, and the food arrives quickly. The
                Filet Mignon is a must-try!"
              </p>
              <div className="font-semibold text-blue-800">- Michael Thompson</div>
            </div>
            <div className="bg-white rounded-xl p-8 text-slate-800">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                "The atmosphere is wonderful, and being able to order at our own pace made the evening so relaxing.
                We'll definitely be coming back!"
              </p>
              <div className="font-semibold text-blue-800">- Emily Rodriguez</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">Ready to Experience Taste & Savor?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
            Join us for an unforgettable dining experience with our innovative ordering system and exceptional cuisine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg bg-blue-600 hover:bg-blue-700">
              <Link to="/menu">Browse Our Menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Link to="/order" className="inline-flex items-center">
                Order Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Taste & Savor</h3>
              <p className="text-blue-200">
                A modern dining experience with innovative ordering and exceptional cuisine.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-blue-200 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/menu" className="text-blue-200 hover:text-white transition-colors">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link to="/order" className="text-blue-200 hover:text-white transition-colors">
                    Order Now
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-blue-200 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="not-italic text-blue-200">
                <p>123 Dining Street</p>
                <p>Foodville, CA 90210</p>
                <p className="mt-2">Phone: (555) 123-4567</p>
                <p>Email: info@tasteandsavor.com</p>
              </address>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-6 text-center text-blue-200">
            <p>&copy; {new Date().getFullYear()} Taste & Savor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
