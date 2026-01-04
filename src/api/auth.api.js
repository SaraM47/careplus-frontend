import { http } from "./http";

// Authentication API to login and register users
export const authApi = {
  async login({ email, password }) {
    const { data } = await http.post("/auth/login", { email, password });
    return data;
  },
  
  async register({ email, password }) {
    const { data } = await http.post("/auth/register", { email, password });
    return data;
  },
};
