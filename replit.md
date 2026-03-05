# Sistema de Catalogação - Desmanche e Gerenciamento de Peças

## Overview
A React + TypeScript + Vite frontend application for cataloging and managing auto parts (peças) in a salvage yard (desmanche) context. It includes QR code generation, spreadsheet import, parts search, and a dashboard.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite 7
- **Styling**: Tailwind CSS v3 with shadcn/ui components
- **State**: React Context API (AuthContext, DataContext)
- **Forms**: react-hook-form + zod
- **QR Codes**: qrcode.react
- **Spreadsheet**: xlsx
- **Charts**: recharts

## Project Structure
- `src/App.tsx` - Root component with routing
- `src/pages/` - Page components (Login, Dashboard, ListagemPecas, CadastroPeca, BuscaPecas, QRCodes, ImportarPlanilha, Layout)
- `src/contexts/` - AuthContext, DataContext
- `src/hooks/` - Custom hooks
- `src/types/` - TypeScript type definitions
- `src/lib/utils.ts` - Utility functions

## Development
- Run: `npm run dev` on port 5000
- Build: `npm run build` (outputs to `dist/`)

## Deployment
- Type: Static site
- Build command: `npm run build`
- Public directory: `dist`

## Demo Credentials
- Admin: admin@desmanche.com / admin123
- Operator: operador@desmanche.com / operador123
