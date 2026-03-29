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

export function useUpdateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => categoryService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Categoría actualizada")
        },
        onError: () => toast.error("Error al actualizar categoría"),
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id) => categoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Categoría eliminada")
        },
        onError: () => toast.error("Error al eliminar categoría"),
    })
}