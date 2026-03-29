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
                const response = await authService.login(username, password)
                const { access_token } = response.data

                localStorage.setItem("token", access_token)

                const meResponse = await authService.me()

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