# CarePlus Inventory Management System – Frontend with Vue 

This repository contains the frontend (client application) for a warehouse and inventory management system developed for a fictional company. The application is designed as an internal web application (intranet-style) and is intended to be used by both warehouse staff and office administrators. The frontend is built as a Single Page Application (SPA) using Vue 3, and it consumes data from a separate REST API that handles authentication, data storage, and business logic. All backend functionality (database, authentication, and CRUD operations) is implemented in a separate repository, according to the project requirements.

## Overview

The application provides a clean, responsive, and user-friendly interface for managing inventory data.
It supports both desktop and mobile devices and includes role-based access control.

Users can:
* Log in or register an account
* View and manage products in the inventory
* Adjust stock levels directly from the product list
* Filter, search, and sort products
* Manage product categories (admin only)

Authentication is handled using JSON Web Tokens (JWT). When a user logs in or registers, the backend returns a token that is stored in sessionStorage. This token is used to access protected routes and API endpoints.

## Authentication and User Roles

### Login and registration

- Users can create an account or log in via the authentication views.
- Credentials are sent to the backend REST API.
- Upon successful authentication, a JWT token and user object are returned.

### Token Handling

- The JWT token is stored in sessionStorage.
- Protected API requests include the token in the Authorization: Bearer header.
- The token is used to verify both authentication status and user role.

### User Roles

The system supports role-based access:

1. Admin
- Full CRUD access to products
- Full CRUD access to categories
- Can adjust stock levels
- Can access protected admin routes

2. Staff
- Can view products
- Can adjust stock levels
- Cannot access category management

Route guards ensure that Unauthenticated users are redirected to the login page and non-admin users are blocked from admin-only routes such as /categories


## User guide for the application pages

### Login & Register

When visiting the application without being authenticated, the user is redirected to the authentication view.

* The interface contains two tabs: Log in and Sign up
* Forms include proper labels, validation, and accessibility attributes
* Errors are displayed inline
* Successful registration and login trigger toast notifications
* After login, the user is redirected to the product page


### Products Page (/app/products)

This is the main working area of the application.

Users can:

* View a list of all products in the inventory

* See product name, description, category, price, image, and stock level

* Increase or decrease stock using + / − buttons

* Search products by name

* Filter products by category, price range, and stock status

* Sort products by name, date, price, or stock

* Navigate through pages using pagination

Admins can additionally:

* Create new products

* Edit existing products

* Delete products

* Upload product images

### Categories Page (/app/categories) – Admin Only

The categories page is restricted to admin users and protected by route guards.

Admins can:

* View all categories

* See how many products belong to each category

* Create new categories

* Edit existing categories

* Delete categories (with confirmation modal)

The page includes desktop table view mobile card view, modal-based create/edit form, confirmation modal for delete actions, toast notifications for create, update, and delete actions.

Non-admin users are automatically redirected away from this route.

## Technical Stack

- Vue 3 (Composition API)

- Vue Router (routing and route guards)

- Pinia (state management)

- Tailwind CSS (CSS framework)

- Axios (HTTP client)

- Font Awesome (icons)

- Vite (build tool) 

## Route protection (Route Guards)
Protected routes use meta fields:
```js
{
  path: "categories",
  name: "categories",
  component: () => import("@/pages/CategoriesPage.vue"),
  meta: {
    requiresAuth: true,
    roles: ["admin"]
  }
}
```

A global router guard checks if the route requires authentication, the user is logged in and the user has the correct role. Unauthorized users are redirected to the products page or login page.

## Project Setup

### 1. Install dependencies
```sh
npm install
```
### 2. Create a .env file:
Create a .env file:
```sh
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start development server

```sh
npm run dev
```