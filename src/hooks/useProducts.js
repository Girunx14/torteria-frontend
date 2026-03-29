import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productService } from "../services/api"
import toast from "react-hot-toast"

export function useProducts(params = { only_available: false }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await productService.getAll(params)
      return response.data
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Producto creado")
    },
    onError: () => toast.error("Error al crear producto"),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Producto actualizado")
    },
    onError: () => toast.error("Error al actualizar producto"),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Producto eliminado")
    },
    onError: () => toast.error("Error al eliminar producto"),
  })
}

export function useUploadImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }) => productService.uploadImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Imagen subida correctamente")
    },
    onError: () => toast.error("Error al subir imagen"),
  })
}
