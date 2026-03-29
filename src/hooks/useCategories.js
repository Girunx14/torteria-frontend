// src/hooks/useCategories.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { categoryService } from "../services/api"
import toast from "react-hot-toast"

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await categoryService.getAll()
            return response.data
        },
    })
}

export function useCreateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data) => categoryService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Categoría creada")
        },
        onError: () => toast.error("Error al crear categoría"),
    })
}