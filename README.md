# 🛒 Walmart Canada Social Insights
Internal analytics platform for **Cossette × Walmart Canada** to monitor organic social media performance across TikTok and Instagram.

[Live Demo](https://wm2025.vercel.app/) • [Getting Started](#local-development-setup) • [Architecture](#architecture)

- **Performance Trends**: Time-series visualization with daily, weekly, and monthly granularity.
- **Network Distribution**: Comparative analysis between TikTok and Instagram performance.
- **Content Inventory**: Searchable, sortable breakdown of all organic posts.
- **Executive Metrics**: Real-time tracking of Impressions, Engagements, and Engagement Rates.

Last reviewed: February 2026

---

## Local Development Setup

### Prerequisites

- **Node.js**: 18.17 or later
- **npm**: 9+

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Add Data
# Place the source CSV in `public/wm2025.csv`.

# 3. Start Development Server
npm run dev
```

Access Dashboard: Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

This dashboard is built as a highly responsive Next.js application using a centralized data context for efficient filtering and state management.

```
[CSV Data] -> [PapaParse] -> [React Context] -> [Recharts/Tailwind UI]
```

### Key Files

| Path | Purpose |
|------|---------|
| `src/lib/data-context.tsx` | Global state, filtering logic, and statistics computation |
| `src/lib/csv-parser.ts` | CSV ingestion and type coercion |
| `src/components/` | Modular visualization and filter components |
| `public/wm2025.csv` | Primary data source |

## Runbooks

### Updating Dashboard Data

1. Obtain the latest social media export CSV.
2. Ensure columns match the expected schema (Network, Post Type, Published time, Impressions, Engagements, Views).
3. Replace the existing `public/wm2025.csv` file with the newly exported, cleaned data.
4. Deploy the latest version of the application.

## Troubleshooting

### Data Not Loading

**Symptom**: Dashboard shows "No data available" or an error message.  
**Cause**: `wm2025.csv` is missing or has incorrect headers.  
**Fix**: Ensure the CSV is present in the `public/` directory and matches the expected schema strictly.

---

© 2025-2026 Cossette × Walmart Canada. All rights reserved.
