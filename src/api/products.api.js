import { http } from "./http";

// Remove empty, null or undefined params from an object
function cleanParams(obj) {
  const params = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === "" || v === null || v === undefined) return;
    params[k] = v;
  });
  return params;
}

export const productsApi = {
  /**
   * Get /products list with filters, search and pagination
   */
  async list(query) {
    const { data } = await http.get("/products", {
      params: cleanParams(query),
    });
    return data;
  },

  /**
   * Create new product (admin only) with POST /products (admin only)
   */
  async create(payload) {
    const { data } = await http.post("/products", payload);
    return data;
  },

  /**
   * Update existing product (admin only) with PUT /products/:id (admin only)
   */
  async update(productId, payload) {
    const { data } = await http.put(`/products/${productId}`, payload);
    return data;
  },

  /**
   * Adjust stock by delta (+1 / -1) with PATCH /products/:id/stock
   */
  async adjustStock(productId, delta) {
    const { data } = await http.patch(
      `/products/${productId}/stock`,
      { delta }
    );
    return data;
  },

  /**
   * Upload product image with POST /products/:id/image (admin only)
   */
  async uploadImage(productId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await http.post(
      `/products/${productId}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data; // { message, imagePath, product }
  },

  /**
   * Delete product (admin only) with DELETE /products/:id
   */
  async remove(productId) {
    const { data } = await http.delete(`/products/${productId}`)
    return data
  },
};
