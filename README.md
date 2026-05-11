# Inspection Booking Prototype

Small React + TypeScript prototype for viewing and managing inspection bookings.

## What I built

The prototype covers the four requested behaviours:

- view a list of inspection bookings
- filter bookings by status
- select a booking and view its details
- change the status of a booking

The app uses seeded mock data and an in-memory service layer so the UI behaves like a real workflow without needing a backend or database.

## Stack

- React 19
- TypeScript
- Vite
- Vitest + React Testing Library

## Structure

- `src/App.tsx` owns the in-memory workflow state and coordinates filtering, selection, and status updates
- `src/components` keeps the list, details panel, and status filter separate so each interaction is easy to explain
- `src/services/bookingService.ts` simulates async backend calls without introducing a real API
- `src/data/mockBookings.ts` holds seeded data shaped around the brief

## Technical choices

- kept state local to the page because the prototype has a single workflow and does not need global state
- used a small service layer so the UI can be extended to a real API later without rewriting component logic
- added a couple of focused tests around the key requested behaviours instead of building a broader test harness
- kept styling lightweight and functional so the time went into behaviour, code structure, and explainability

## Run locally

This repo expects Node `20.19.0` or newer. The repo includes `.nvmrc` pinned to `20.19.0` because Vite 8 warns on older Node 20 releases.

```bash
nvm use
npm_config_cache=./npm-cache npm install
npm run dev
```

Open `http://localhost:5173`.

## Validate

```bash
npm run build
npm run lint
npm test
```

## Netlify

The repo includes a `netlify.toml` so it is ready for static deployment on Netlify.

Typical deployment flow:

1. Push the repo to GitHub.
2. Import the repo into Netlify.
3. Use the default build command `npm run build`.
4. Use the default publish directory `dist`.

## Assumptions

- no authentication
- no persistence after refresh
- no real API integration
- single-page workflow was enough for the prototype scope
- only status editing was implemented because that is the only required mutation

## What I would improve with more time

- add search, sort, and pagination
- show optimistic updates and richer error handling
- add accessibility pass for keyboard and screen-reader polish
- connect to a real API and persist updates
- add broader component tests and a small end-to-end smoke test

## AI usage

AI was used to help outline the implementation plan and speed up some initial boilerplate. I reviewed the output, kept the overall structure intentionally small, rejected unnecessary complexity such as routing/global state/real persistence, and adjusted the final code and README myself so I can explain the trade-offs clearly in the interview.
