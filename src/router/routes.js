// Define application routes with lazy-loaded components and route metadata
export const routes = [
    // redirect root to main app entry
    { path: "/", redirect: "/app/products" },
  
    // Public route for authentication
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/AuthPage.vue"),
      meta: { public: true },
    },
  
    // Protected routes under the main app shell
    {
      path: "/app",
      component: () => import("@/components/layout/AppShell.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "products",
          name: "products",
          component: () => import("@/pages/ProductsPage.vue"),
        },
        {
          path: "categories",
          name: "categories",
          component: () => import("@/pages/CategoriesPage.vue"),
          meta: { roles: ["admin"] },
        },
      ],
    },
  
    // Catch-all route for 404 Not Found
    { path: "/:pathMatch(.*)*", name: "notFound", component: () => import("@/pages/NotFound.vue") },
  ];
  