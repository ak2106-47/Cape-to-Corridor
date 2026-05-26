# Cape to Corridor

An interactive dashboard that models a solar-powered electric rail corridor as a net-zero alternative to high-emission shipping reroutes around the Cape of Good Hope.

When a maritime chokepoint like the Strait of Hormuz closes, container traffic is forced to detour ~6,000 nautical miles around southern Africa — adding weeks at sea and an estimated 41 million tonnes of extra CO₂ per year. **Cape to Corridor** visualizes that problem side by side with a proposed solution: a 2,200 km solar-powered electric rail line from Bahrain to Haifa that moves cargo in ~22 hours instead of ~35 days, at net-zero operational emissions.

## About

This project was built for **SpaceHack for Sustainability 2026**, a hackathon hosted at Arizona State University (ASU) focused on using technology to tackle real-world sustainability and climate challenges. Cape to Corridor was our response to the prompt: how do we cut the massive carbon cost of forced maritime reroutes when a global shipping chokepoint goes offline?

## Features

- **Split "problem vs. solution" dashboard** comparing the shipping reroute against the rail corridor.
- **Interactive route maps** (Leaflet) showing the Cape of Good Hope shipping detour and the Bahrain → Haifa rail corridor with solar farm stations.
- **Live animated tickers and stat cards** for emissions, distance, transit time, and cost.
- **Emissions trajectory chart** projecting monthly CO₂ under the reroute vs. the rail alternative.
- **Historical chokepoint comparisons** — Suez 1956, Suez 1967, Red Sea 2024, and the modeled Hormuz 2026 crisis.

## Key figures

| Metric | Shipping reroute | Solar rail corridor |
| --- | --- | --- |
| Distance added per voyage | ~6,000 nm | 2,200 km route |
| Transit time | ~35 days | ~22 hours |
| Operational CO₂ | ~41 Mt/year extra | Net-zero (solar) |
| Solar capacity | — | 5.5 GW |
| Projected annual CO₂ savings | — | ~15.6 Mt |

All figures are defined in `src/lib/constants.ts`, with inline source notes from 2024–2026 maritime industry reports.

## Tech stack

- **Next.js 16** (App Router) and **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for animations
- **Leaflet** / **react-leaflet** for the maps
- **react-countup** for animated counters

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Build

```bash
npm run build
npm run start
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, and metadata
│   ├── page.tsx            # Main dashboard page + footer
│   └── globals.css         # Global styles
├── components/dashboard/
│   ├── header.tsx          # Top header bar
│   ├── problem-panel.tsx   # Shipping-reroute (crisis) panel
│   ├── solution-panel.tsx  # Rail corridor (solution) panel
│   ├── route-map.tsx       # Cape of Good Hope shipping route map
│   ├── panel-map.tsx       # Rail corridor map
│   ├── emissions-chart.tsx # Monthly emissions projection chart
│   ├── ticker.tsx          # Animated live ticker
│   └── stat-card.tsx       # Reusable stat card
└── lib/
    ├── constants.ts        # All emission data, route geometry, and figures
    └── utils.ts            # Helpers
```

## Deployment

This app deploys to [Vercel](https://vercel.com) with zero configuration. Import the repository, accept the auto-detected Next.js settings, and deploy — every push to `main` triggers a new deployment.

---

Made with ❤️ by Apoorva Kumar
