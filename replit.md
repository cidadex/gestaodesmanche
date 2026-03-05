# Desmanche Pro - Brazilian Car Parts Inventory Management System

## Project Overview
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, Radix UI (Lucide-React icons).
- **Environment**: Replit (Node.js/NixOS).
- **Architecture**: Single Page Application (SPA) with client-side state management (localStorage).

## Key Features
- Dashboard with real-time statistics and advanced filtering.
- Parts management (registration, listing, searching).
- Location and deposit configuration.
- QR Code generation for parts.
- Spreadsheet import functionality.
- Fully responsive design (Mobile & Desktop).

## Recent Improvements
- **Responsiveness**:
  - Implemented a sticky mobile header with a hamburger menu in `Layout.tsx`.
  - Optimized grid layouts (stat cards, forms) for all screen sizes across all pages.
  - Added horizontal scrolling to all data tables for mobile compatibility.
  - Improved button groups to stack on mobile and align horizontally on desktop.
- **Bug Fixes**:
  - Fixed a critical crash caused by empty `value=""` props in Radix UI `SelectItem` components (replaced with `value="none"`).
  - Resolved layout overlaps on mobile by adjusting main content padding and header positioning.
- **UI/UX**:
  - Standardized font sizes and spacing for better mobile readability.
  - Optimized the login page for smaller screens by hiding decorative elements on mobile.

## Technical Notes
- All `SelectItem` components must have a non-empty `value` prop (use `"none"` for "no selection").
- Data is persisted in `localStorage` using keys like `desmanche_pecas`, `desmanche_marcas`, etc.
- Default credentials: `admin@desmanche.com` / `admin123` and `operador@desmanche.com` / `operador123`.

## Deployment
- Dev server runs on `0.0.0.0:5000` via `npm run dev`.
- Build command: `npm run build` (output to `dist/`).
- Static deployment via Replit pointing to `dist`.
