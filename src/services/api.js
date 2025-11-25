const API_BASE_URL = "https://dummyjson.com/products"

export async function fetchProducts({ pageParam = 0, limit = 20, search = "", category = "" }) {
  let url = `${API_BASE_URL}?limit=${limit}&skip=${pageParam * limit}`
  
  if (search) {
    url = `${API_BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${pageParam * limit}`
  } else if (category) {
    url = `${API_BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${pageParam * limit}`
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }
  return response.json()
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`)
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  return response.json()
}
