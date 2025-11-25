import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useState, useMemo, useEffect, useRef } from "react"
import { fetchProducts, fetchCategories } from "../services/api"
import { ProductCard } from "./ProductCard"
import { Input } from "./ui/input"
import { Select } from "./ui/select"
import { Button } from "./ui/button"
import { Moon, Sun, ShoppingCart, CloudCog } from "lucide-react"
import { useTheme } from "../hooks/useTheme"
import { useCart } from "../hooks/useCart"

export function ProductList() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("")
  const { theme, toggleTheme } = useTheme()
  const { addToCart, getCartCount } = useCart()
  const observerTarget = useRef(null)

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  })
  //console.log(categoriesData)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["products", search, category],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam, search, category }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      //console.log("lastpage", lastPage, "allpages", allPages)
      const totalLoaded = allPages.reduce((sum, page) => sum + page.products.length, 0)
      return totalLoaded < lastPage.total ? allPages.length : undefined
    },
  })
  console.log(data)
  
  const products = useMemo(() => {
    if (!data) return []
    const allProducts = data.pages.flatMap((page) => page.products)
    
    let sorted = [...allProducts]
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating-asc") {
      sorted.sort((a, b) => a.rating - b.rating)
    } else if (sortBy === "rating-desc") {
      sorted.sort((a, b) => b.rating - a.rating)
    }
    
    return sorted
  }, [data, sortBy])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-destructive">Error loading products. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Product Store</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categoriesData?.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat?.name.charAt(0).toUpperCase() + cat?.name.slice(1)}
                </option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="rating-desc">Rating: High to Low</option>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
            <div ref={observerTarget} className="h-10 flex items-center justify-center py-8">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-muted-foreground">Loading more...</span>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
