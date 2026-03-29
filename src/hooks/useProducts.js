// src/hooks/useProducts.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productService } from "../services/api"
import toast from "react-hot-toast"

export function useProducts(params = { only_available: false }) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: async () => {
            console.log("fetching products con params:", params)
            const response = await productService.getAll(params)
            console.log("productos recibidos:", response.data)
            return response.data
        },
    })
}