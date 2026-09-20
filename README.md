# OpenTrace

> Find the right website for anything.

**OpenTrace** is a structured map of useful websites and resources across the web. Instead of hoarding bookmarks, explore a searchable directory organized into categories → subcategories → resources.

## What it does

OpenTrace organizes the useful web into a browsable, searchable map:

- Browse categories like **Development**, **AI Tools**, **Design**, **Cybersecurity**, and **Research**
- Drill into subcategories to find hand-curated resources
- Search by name, description, category, subcategory, or tags
- Describe a task ("I need a website to compress images") and get deterministic suggestions — no AI APIs
- Save favorites, build collections, track recently visited resources, and keep private notes

## Core features

| Feature | Description |
| --- | --- |
| Interactive resource map | Category → subcategory → resource exploration with an expandable map UI |
| Instant search | Keyboard-friendly search across all resource fields |
| Task-based search | Local matching for natural-language tasks |
| Filters | Category, subcategory, pricing, platform, type, verified, featured |
| Favorites | Star resources and review them on `/favorites` |
| Collections | Reusable personal collections persisted in the browser |
| Recently visited | Automatic local history of opened resources |
| Personal notes | Per-resource private notes stored only in your browser |
| Submit resources | Add websites to your local directory, clearly marked as pending review |
| Report resources | Flag broken links, incorrect details, duplicates, and miscategorizations |
| Themes | Dark (default) and light modes, persisted locally |

## Tech stack

- **React 19** + **Vite** — fast, modern frontend tooling
- **JavaScript (JSX)** — no TypeScript layers
- **Tailwind CSS v4** — utility-first styling with a custom design system
- **React Router v7** — clean application routing
- **Lucide React** — consistent iconography
- **localStorage** — all user state (favorites, collections, history, notes, submissions, reports, theme)

There is **no backend**. Everything personal lives in your browser, and no accounts are required.

## Project structure

```
src/
  components/        Reusable UI (cards, map, search, filters, modals, layout)
  context/           App state provider composed from feature hooks
  data/
    categories.js    Category and subcategory definitions
    resources/       One data file per category + aggregator index
  hooks/             Feature hooks (favorites, collections, recent, notes, …)
  layouts/           Application shell (top nav, footer, outlet)
  pages/             Route pages
  utils/             Search, task search, filters, storage, URL helpers
  styles/            Design-system tokens built on Tailwind v4
```

Routing:

```
/                        Home — hero, featured, popular, interactive map
/explore                 Search + filters + full directory
/category/:categoryId    Single category view
/resource/:id            Resource details, notes, related, report
/favorites               Starred resources
/collections             Personal collections
/recent                  Recently visited resources
/submit                  Submit a resource
/about                   About OpenTrace
```

## Local setup

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Production build
npm run build

# Preview the production build
npm run preview

# Lint
npm run lint
```

## Feature overview

- **Search everywhere** — press `/` or `Ctrl+K` to focus search from anywhere.
- **Keyboard navigation** — arrow keys move through search results, `Enter` opens.
- **Multi-filter exploration** — combine category, subcategory, pricing, platform, and type filters.
- **Everything local** — clear your browser storage to reset the app to its seeded catalog.
- **Curated data** — resources are real, hand-checked websites with no invented claims.

## Screenshots

Screenshots will be added as they become available.

## Future improvements

- Community-curated resource reviews and vote-based ranking
- Export/import of favorites, collections, and notes
- Browser extension for one-click resource saving
- Offline completeness with PWA support
- Additional categories and continuous catalog expansion

## License

Distributed under the **MIT License**. OpenSource — you are free to use, modify, and distribute it, provided you preserve the license notice. See the repository for details.