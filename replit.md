# Desmanche Pro

A professional car parts inventory management system (Gestão completa de peças e estoque) built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS + Radix UI components (shadcn/ui)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **QR Codes**: qrcode.react
- **Spreadsheet**: xlsx

## Project Structure

- `src/pages/` - Main application pages (Dashboard, Login, Parts listing/registration, QR Codes, Config pages)
- `src/components/ui/` - Reusable UI components (shadcn/ui)
- `src/contexts/` - React contexts (AuthContext, DataContext)
- `src/hooks/` - Custom hooks
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utilities

## Development

- Dev server runs on `0.0.0.0:5000`
- `npm run dev` - Start development server
- `npm run build` - Build for production (output to `dist/`)

## Deployment

- Static deployment via Replit
- Build command: `npm run build`
- Public directory: `dist`
