import { defineStore } from "pinia";
import { authApi } from "@/api/auth.api";
import { useToastStore } from "@/stores/toast.store"

// Keys for sessionStorage
const TOKEN_KEY = "inv_token";
const USER_KEY = "inv_user";

// Retry configuration
const MAX_RETRIES = 3;        // max 3 attempts
const RETRY_DELAY_MS = 6000;  // waits 6 seconds between retries

// Auth store definition 
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem(TOKEN_KEY) || "",
    user: JSON.parse(sessionStorage.getItem(USER_KEY) || "null"),
    loading: false,
    error: "",
    // Indicate Render cold-start
    startingBackend: false,
  }),

  // Getters to check authentication and admin status
  getters: {
    isAuthenticated: (s) => Boolean(s.token),
    isAdmin: (s) => s.user?.role === "admin",
  },

  // Actions for login, registration, and logout
  actions: {

    // Login action with automatic retry for Render cold-start
    async login(email, password) {
      this.loading = true;
      this.error = "";
      this.startingBackend = false;

      let attempt = 0;

      // Show "starting server" text if login takes long
      const slowTimer = setTimeout(() => {
        if (this.loading) {
          this.startingBackend = true;
        }
      }, 5000);

      try {
        while (attempt < MAX_RETRIES) {
          try {
            const res = await authApi.login({ email, password });

            // SUCCESS
            this.token = res.token;
            this.user = res.user;

            sessionStorage.setItem(TOKEN_KEY, res.token);
            sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));

            return; // stop retry loop

          } catch (err) {
            attempt++;

            // Retry only on timeout / backend not responding
            if (err.code === "ECONNABORTED" && attempt < MAX_RETRIES) {
              this.startingBackend = true;

              // Wait before retrying
              await new Promise((resolve) =>
                setTimeout(resolve, RETRY_DELAY_MS)
              );

              continue;
            }

            // Wrong credentials – no retry
            if (err.response?.status === 401) {
              this.error = "Felaktiga inloggningsuppgifter";
              throw err;
            }

            // Other unexpected errors
            this.error = "Ett oväntat fel inträffade";
            throw err;
          }
        }

        // If all retries failed
        this.error = "Servern svarar inte. Försök igen om en stund.";
        throw new Error("Login failed after retries");

      } finally {
        clearTimeout(slowTimer);
        this.loading = false;
        this.startingBackend = false;
      }
    },

// Register new user and show feedback via toast
async register(email, password) {
  const toast = useToastStore();

  // Set loading state
  this.loading = true;
  this.error = "";

  // Try to register via API
  try {
    const res = await authApi.register({ email, password });

    this.token = res.token;
    this.user = res.user;

    // Save token and user in sessionStorage
    sessionStorage.setItem(TOKEN_KEY, res.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));

    toast.success("Account created successfully");

  // Handle errors  
  } catch (err) {

    // Email already exists (HTTP 409 Conflict)
    if (err.response?.status === 409) {
      this.error = "An account with this email already exists";
      toast.error("This email address is already registered");
    } else {
      // Fallback for unexpected errors
      this.error = "Failed to create account";
      toast.error("Something went wrong while creating the account");
    }

    throw err;

  } finally {
    this.loading = false;
  }
},


    // Clear auth state and sessionStorage on logout
    logout() {
      this.token = "";
      this.user = null;
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    },
  }
});
