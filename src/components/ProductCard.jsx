import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { ShoppingCart } from "lucide-react"

export function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg bg-muted">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold">${product.price}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm">{product.rating}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full"
          variant="default"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
