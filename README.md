# Walmart Canada Social Insights Dashboard

Internal analytics platform for **Cossette × Walmart Canada** to monitor organic social media performance across TikTok and Instagram.

**Team**: Cossette Data & Analytics
**Contact**: [parth.shahanand@cossette.com](mailto:parth.shahanand@cossette.com)

---

## Overview

The **Walmart Canada Social Insights Dashboard** transforms raw social media exports into actionable metrics. It provides the marketing team with a centralized view of organic performance, enabling data-driven optimization for campaigns and content strategy.

### Key Capabilities

- **Executive Metrics**: Real-time tracking of Impressions, Engagements, and Engagement Rates.
- **Performance Trends**: Time-series visualization with daily, weekly, and monthly granularity.
- **Network Distribution**: Comparative analysis between TikTok and Instagram performance.
- **Content Inventory**: Searchable, sortable breakdown of all organic posts, including boosted content highlighting.

---

## Local Development Setup

### Prerequisites

- **Node.js**: 18.17 or later
- **npm**: 9+

### Initial Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add Data**:
   Place the source CSV in `public/wm2025.csv`. 

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Access Dashboard**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architecture

This dashboard is built as a highly responsive Next.js application using a centralized data context for efficient filtering and state management.

### Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Visualization | Recharts |
| State | React Context |
| Parsing | PapaParse |

### Key Files

| Path | Purpose |
|------|---------|
| `src/lib/data-context.tsx` | Global state, filtering logic, and statistics computation |
| `src/lib/csv-parser.ts` | CSV ingestion and type coercion |
| `src/components/` | Modular visualization and filter components |
| `public/wm2025.csv` | Primary data source |

---

## Deployment

Build the optimized production bundle and deploy to the preferred hosting environment.

```bash
npm run build
npm start
```

---

## Troubleshooting

### Data Not Loading
**Symptom**: Dashboard shows "No data available" or an error message.  
**Cause**: `wm2025.csv` is missing or has incorrect headers.  
**Fix**: Ensure the CSV is present in the `public/` directory and matches the expected schema (Network, Post Type, Published time, etc.).

---

© 2025 Cossette × Walmart Canada. All rights reserved.
