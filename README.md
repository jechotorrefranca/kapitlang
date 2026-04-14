# Kapit Lang: A Web-Based Application for Simulating PUV Terminal Dynamics in Bulacan

## Project Overview

**Kapit Lang** aims to address the daily travel unpredictability experienced by local commuters in Bulacan. Standard navigation applications calculate travel times based solely on road distance and vehicle traffic, rendering them inadequate for commuters relying on Public Utility Vehicles (PUVs). 

To bridge this gap, our team developed a web-based stochastic simulation application that provides realistic, probability-based commute estimates. The system actively models the localized "fill-and-go" terminal dynamics, rush hour queue delays, and frequent en-route stops characteristic of jeepneys and UV Express vans operating along the MacArthur Highway.

## Key Features

- **Stochastic Simulation:** Provides realistic, probability-based commute estimates rather than just fixed distance/time calculations.
- **Terminal Dynamics Modeling:** Actively simulates the "fill-and-go" behavior of PUVs at terminals.
- **Tailored for Bulacan:** Specifically designed for MacArthur Highway routes (Jeepneys and UV Express).
- **Congestion Awareness:** Models rush hour queue delays and frequent stops.

## Tech Stack

This project is built using:

- **Frontend:** [Next.js](https://nextjs.org/) (React)
- **Backend:** [Convex](https://convex.dev/) (Database & Serverless Logic)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js installed
- Convex account (for backend)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kapitlang
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
