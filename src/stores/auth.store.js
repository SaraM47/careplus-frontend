import { defineStore } from "pinia";
import { authApi } from "@/api/auth.api";
import { useToastStore } from "@/stores/toast.store"

// Keys for sessionStorage
const TOKEN_KEY = "inv_token";
const USER_KEY = "inv_user";

// Auth store definition 
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem(TOKEN_KEY) || "",
    user: JSON.parse(sessionStorage.getItem(USER_KEY) || "null"),
    loading: false,
    error: "",
    // Indicate to Render cold-start
    startingBackend: false,
  }),

  // Getters to check authentication and admin status
  getters: {
    isAuthenticated: (s) => Boolean(s.token),
    isAdmin: (s) => s.user?.role === "admin",
  },

  // Actions for login, registration, and logout
  actions: {
    // Login action
    async login(email, password) {
      this.loading = true
      this.error = ""
      this.startingBackend = false   // reset vid nytt försök
  
      // Try to login via API
      try {
        const res = await authApi.login({ email, password })
  
        // Store token and user in state
        this.token = res.token
        this.user = res.user

        // Save token and user in sessionStorage
        sessionStorage.setItem(TOKEN_KEY, res.token)
        sessionStorage.setItem(USER_KEY, JSON.stringify(res.user))

      } catch (err) {

        // Timeout for Render cold , backend vaknar
        if (err.code === "ECONNABORTED") {
          this.error = ""                
          this.startingBackend = true     
        }

        // Wrong credentials
        else if (err.response?.status === 401) {
          this.error = "Felaktiga inloggningsuppgifter"
        }

        // Other unnexpected errors
        else {
          this.error = "Ett oväntat fel inträffade"
        }

        throw err

      } finally {
        this.loading = false
      }
    },
  
    // Register new user and show feedback via toast
    async register(email, password) {
      const toast = useToastStore()
    
      // Set loading state
      this.loading = true
      this.error = ""
    
      // Try to register via API
      try {
        const res = await authApi.register({ email, password })
    
        this.token = res.token
        this.user = res.user
    
        // Save token and user in sessionStorage
        sessionStorage.setItem(TOKEN_KEY, res.token)
        sessionStorage.setItem(USER_KEY, JSON.stringify(res.user))
    
        toast.success("Account created successfully")
    
      // Handle errors  
      } catch (err) {
        this.error = "Kunde inte skapa konto"
        toast.error("Failed to create account")
        throw err
      } finally {
        this.loading = false
      }
    },
  
    // Clear auth state and sessionStorage on logout
    logout() {
      this.token = ""
      this.user = null
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
    },
  }  
});
