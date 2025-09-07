# AI Coding Agent Instructions for Nuxt POS x Supabase

## Project Overview

This project is a Point-of-Sale (POS) system built with Nuxt 4 and Supabase. It includes distinct roles (`admin` and `kasir`) with separate UI layouts. The backend leverages Supabase Postgres with Row Level Security (RLS) enabled. The runtime environment uses Bun for development and scripting.

### Key Components

- **Frontend**: Built with Nuxt 4, using Tailwind CSS for styling.
- **Backend**: Supabase Postgres with RLS for secure data access.
- **State Management**: Pinia for managing application state.
- **Authentication**: Supabase Auth integrated with middleware for role-based access control.

### Folder Structure Highlights

- `app/components`: Reusable Vue components (e.g., `AdminToast.vue`, `ConfirmDeleteModal.vue`).
- `app/pages`: Page-level components for routing (e.g., `admin/pengguna/index.vue`).
- `app/stores`: Pinia stores for managing state (e.g., `auth.ts`).
- `lib`: Utility libraries (e.g., `supabaseClient.ts` for Supabase integration).
- `sql`: SQL scripts for database setup and fixes.
- `testing`: Scripts for automated testing and debugging.

## Developer Workflows

### Setup

Install dependencies using Bun:

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

### Production

Build the application for production:

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```

### Testing

Run test scripts located in the `testing` folder. Example:

```bash
node testing/testLogin.js
```

## Project-Specific Conventions

### Coding Patterns

- **Toast Notifications**: Use `useToast.ts` composable for consistent toast notifications.
- **Delete Confirmation**: Use `ConfirmDeleteModal.vue` for delete actions.
- **Role-Based Middleware**: Implement role checks in `middleware/role.ts`.

### Database

- **Schema**: All tables are under the `sbs` schema.
- **RLS**: Ensure Row Level Security policies are respected in all queries.
- **ID Formats**: Follow the predefined ID formats:
  - `pengguna`: `001-ABC` (3 digits + 3 uppercase letters, total 7 characters)
  - `pelanggan`: `P001` format
- **User Status Logic**: Status is automatically determined based on last login:
  - `aktif`: Last login within 7 days
  - `nonaktif`: No login or login more than 7 days ago
- **Phone Validation**: Phone numbers must contain only digits (no letters allowed)
- **Default Values**: 
  - Role defaults to `kasir` for new users
  - Status defaults to `nonaktif` until first login

### Common Errors

- Incorrect import paths for `supabaseClient.ts`. Use `~/lib/supabaseClient`.
- Ensure `bun` is installed and used for all scripts.

## Integration Points

- **Supabase**: Integrated via `lib/supabaseClient.ts`.
- **Pinia**: State management for authentication and user roles.
- **Tailwind CSS**: Styling for all components.

## Examples

### Toast Notification

```javascript
const toast = useToast();
toast.success("Operation successful!");
```

### Role Middleware

```javascript
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useAuthStore();
  if (user.role !== "admin") {
    return navigateTo("/login");
  }
});
```

### Supabase Query

```javascript
const { data, error } = await supabase
  .from("pengguna")
  .select("*")
  .eq("status", "aktif");
```

---

This document is a living guide. Update it as the project evolves to ensure AI agents remain productive.
