// src/store/authStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService } from "../services/api"

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (username, password) => {
                const params = new URLSearchParams()
                params.append("username", username)
                params.append("password", password)

                const response = await api.post("/auth/login", params, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                })

                const { access_token } = response.data
                localStorage.setItem("token", access_token)

                const meResponse = await api.get("/auth/me", {
                    headers: { Authorization: `Bearer ${access_token}` },
                })

                set({
                    token: access_token,
                    user: meResponse.data,
                    isAuthenticated: true,
                })

                return meResponse.data
            },

            logout: () => {
                localStorage.removeItem("token")
                set({ user: null, token: null, isAuthenticated: false })
            },
        }),
        {
            name: "auth-storage",
            partialState: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

export default useAuthStore