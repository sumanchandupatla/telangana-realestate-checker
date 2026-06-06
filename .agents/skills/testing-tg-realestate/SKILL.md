---
name: testing-tg-realestate
description: Test the TG Real Estate Checker app end-to-end. Use when verifying UI changes, search functionality, or portal integrations.
---

# Testing TG Real Estate Checker

## Local Setup

1. Start the backend server (serves both API and static frontend):
   ```bash
   cd backend && uvicorn server.main:app --host 0.0.0.0 --port 8000
   ```
2. Open `http://localhost:8000` in the browser.

## Key Test Flows

### Homepage UI Verification
- Verify the page loads with the correct theme (currently light/Zoopla-inspired)
- Check header: "TG Real Estate" logo, nav links (TS-RERA, Dharani, BuildNow)
- Check hero section with search form and tab pills (All Portals, TS-RERA, BuildNow, HMDA)
- Check portal status cards section (4 cards: TS-RERA, Dharani, BuildNow, HMDA)
- Check "How it works" section (3 steps)
- Check footer with portal links

### Search Functionality
- Use RERA certificate number `P02400007583` as test data
- Expected result: "SARK NORTH MEADOWS 1" by "SARK PROJECTS (INDIA) PRIVATE LIMITED AND OTHERS", status "Registered"
- Source should show "TS-RERA"
- Note: Some portals (HMDA, Dharani) may time out — this is expected and should display as an amber warning banner, not an error

### Sub-Pages
- Navigate to `/rera`, `/dharani`, `/bpass` and verify:
  - Consistent theme with homepage
  - Purple "Back" link navigates to homepage
  - Form inputs and submit buttons render correctly
  - `/bpass` has an amber warning notice about portal limitations

## Important Notes

- The frontend is a static Next.js export served from `backend/static/`. After making frontend changes, rebuild with `cd frontend && npm run build`, then copy output: `rm -rf ../backend/static && cp -r out ../backend/static`
- Portal card links in the homepage point to external government portals (not internal routes) — clicking them navigates away from the app
- Nav header links (TS-RERA, Dharani, BuildNow) point to internal routes (`/rera`, `/dharani`, `/bpass`)
- The React input field requires native keyboard input (not just setting `.value`) to trigger React state updates. Use the native input value setter pattern if scripting.
- Government portal scraping can take 10-20 seconds — wait for results to load

## Devin Secrets Needed

No secrets required — the app scrapes public government portals without authentication.
