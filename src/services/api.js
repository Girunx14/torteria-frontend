// src/services/api.js
import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Interceptor — agrega el token automáticamente a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor — maneja errores globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("auth-storage")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

// --- Auth ---
export const authService = {
    login: (username, password) => {
        const form = new FormData()
        form.append("username", username)
        form.append("password", password)
        return api.post("/auth/login", form, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
    },
    me: () => api.get("/auth/me"),
}

// --- Categories ---
export const categoryService = {
    getAll: () => api.get("/categories/"),
    create: (data) => api.post("/categories/", data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
}

// --- Products ---
export const productService = {
    getAll: (params) => api.get("/products/", { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post("/products/", data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    uploadImage: (id, file) => {
        const form = new FormData()
        form.append("file", file)
        return api.post(`/products/${id}/image`, form, {
            headers: { "Content-Type": "multipart/form-data" },
        })
    },
}

// --- Orders ---
export const orderService = {
    getAll: (params) => api.get("/orders/", { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post("/orders/", data),
    updateStatus: (id, data) => api.put(`/orders/${id}`, data),
    delete: (id) => api.delete(`/orders/${id}`),
}

// --- Stats ---
export const statsService = {
    get: (days = 30) => api.get("/stats/", { params: { days } }),
}

export default api