import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme")
    return stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark")
      root.classList.add("dark")
    } else {
      root.removeAttribute("data-theme")
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return { theme, toggleTheme }
}
