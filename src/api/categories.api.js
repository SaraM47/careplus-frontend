import { http } from "./http";

// Categories API methods
export const categoriesApi = {
  // List all categories
  async list() {
    const { data } = await http.get("/categories");
    return data;
  },

  // Create a category
  async create(payload) {
    const { data } = await http.post("/categories", payload);
    return data;
  },

  // Update category
  async update(id, payload) {
    const { data } = await http.put(`/categories/${id}`, payload);
    return data;
  },

  // Delete category
  async remove(id) {
    await http.delete(`/categories/${id}`);
  },
};
