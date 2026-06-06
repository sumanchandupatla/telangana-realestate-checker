# Telangana Real Estate Permission Checker

A web application that checks real estate project permissions and government approval status by connecting to Telangana state government portals.

## Overview

This tool aggregates data from multiple government sources:

| Portal | Purpose | URL |
|--------|---------|-----|
| **TS-RERA** | Real estate project registration & compliance | [rerait.telangana.gov.in](https://rerait.telangana.gov.in/SearchList/Search) |
| **Dharani / Bhu Bharati** | Land records, ownership, survey details | [dharani.telangana.gov.in](https://dharani.telangana.gov.in/knowLandStatus) |
| **TG-bPASS / BuildNow** | Building permission approvals | [buildnow.telangana.gov.in](https://buildnow.telangana.gov.in) |
| **HMDA DPMS** | Layout & development permissions (HMDA area) | [dpms.hmda.gov.in](https://dpms.hmda.gov.in/BPAMSClient/) |

## Architecture

```
┌─────────────────────┐     ┌─────────────────────────┐
│   Next.js Frontend  │────▶│   FastAPI Backend        │
│   (React + Tailwind)│     │   (Python Scrapers)      │
└─────────────────────┘     └──────────┬──────────────┘
                                       │
                            ┌──────────▼──────────────┐
                            │  Government Portals      │
                            │  - TS-RERA               │
                            │  - Dharani/Bhu Bharati   │
                            │  - TG-bPASS/BuildNow    │
                            │  - HMDA DPMS             │
                            └─────────────────────────┘
```

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Python 3.11+, FastAPI, httpx, BeautifulSoup4
- **Scraping**: httpx (async HTTP) + BeautifulSoup4 (HTML parsing)

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be at http://localhost:3000 and connects to the backend at http://localhost:8000.

### Environment Variables

Create a `.env.local` in `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rera/search` | Search TS-RERA registered projects |
| POST | `/api/dharani/search` | Search Dharani/Bhu Bharati land records |
| POST | `/api/bpass/search` | Search TG-bPASS/BuildNow building permissions |
| POST | `/api/hmda/search` | Search HMDA development permissions |
| POST | `/api/unified/search` | Search across all portals |

## Limitations

- Government portals may have CAPTCHAs, rate limits, or require login for certain data
- Some portals (HMDA DPMS, BuildNow) require authentication for detailed searches
- Data availability depends on portal uptime and accessibility
- Scraping is best-effort; portal structure changes may require scraper updates
- Dharani is being replaced by Bhu Bharati — the app tries both

## License

MIT
