# Kapit Lang: PUV Terminal Simulation

## Project Overview

**Kapit Lang** aims to address the daily travel unpredictability experienced by local commuters in Bulacan. It is a web-based stochastic simulation application that provides realistic, probability-based commute estimates by modeling terminal dynamics and en-route delays along MacArthur Highway.

## Key Features

- **Stochastic Simulation:** Probability-based commute estimates.
- **Terminal Dynamics:** Simulates "fill-and-go" behavior of local PUVs.
- **Bulacan Specific:** Designed for MacArthur Highway routes.
- **Congestion Modeling:** Accounts for rush hour and frequent stops.

## Tech Stack

- **Frontend:** Next.js (React)
- **Database & Logic:** Convex
- **Simulation Engine:** Python (FastAPI, Uvicorn)
- **3D Rendering:** React Three Fiber (Three.js)
- **Styling:** Tailwind CSS & Shadcn UI
- **Icons:** Lucide React
- **Quality Assurance:** Husky, lint-staged, oxlint, and TypeScript

## Getting Started

### Prerequisites

- Node.js
- Python
- Convex account

### Installation

1. Install dependencies:
   ```bash
   npm install
   pip install -r lib/sim/requirements.txt
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

- **Linting & Types:** `npm run lint:fix`
- **Pre-commit Hooks:** Husky ensures type safety and linting before every commit.
