// src/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { orderService } from "../services/api"
import toast from "react-hot-toast"

export function useOrders(params) {
    return useQuery({
        queryKey: ["orders", params],
        queryFn: async () => {
            const response = await orderService.getAll(params)
            return response.data
        },
        refetchInterval: 1000 * 30, // refresca cada 30 segundos automáticamente
    })
}

export function useCreateOrder() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data) => orderService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["stats"] })
            toast.success("Orden creada correctamente")
        },
        onError: () => toast.error("Error al crear la orden"),
    })
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }) => orderService.updateStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["stats"] })
            toast.success("Estado actualizado")
        },
        onError: () => toast.error("Error al actualizar estado"),
    })
}

export function useDeleteOrder() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id) => orderService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["stats"] })
            toast.success("Orden eliminada")
        },
        onError: () => toast.error("Error al eliminar orden"),
    })
}
