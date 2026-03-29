// src/hooks/useStats.js
import { useQuery } from "@tanstack/react-query"
import { statsService } from "../services/api"

export function useStats(days = 30) {
    return useQuery({
        queryKey: ["stats", days],
        queryFn: async () => {
            const response = await statsService.get(days)
            return response.data
        },
        staleTime: 1000 * 60 * 2, // refresca cada 2 minutos
    })
}