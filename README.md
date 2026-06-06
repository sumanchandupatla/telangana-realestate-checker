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
pip install -r requirements.txt
uvicorn server.main:app --reload --port 8000
```

The backend serves both the API and the pre-built frontend from `backend/static/`.

### Frontend Development (optional)

Only needed if you want to modify the frontend:

```bash
cd frontend
npm install
npm run dev
```

Then build the static export for the backend to serve:

```bash
npm run build
cp -r out/ ../backend/static/
```

## Deployment

The backend serves the full application (API + frontend). Deploy `backend/` to any Python hosting platform.

### Render

1. Connect your GitHub repo at [render.com](https://render.com)
2. Create a **Web Service** with root directory set to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn server.main:app --host 0.0.0.0 --port $PORT`

Or use the included `render.yaml` for automatic configuration via [Render Blueprints](https://render.com/docs/blueprint-spec).

### Railway

1. Connect your repo at [railway.app](https://railway.app)
2. Set root directory to `backend`
3. Railway auto-detects the `Procfile` and deploys

### Docker

```bash
cd backend
docker build -t tg-realestate-checker .
docker run -p 8000:8000 tg-realestate-checker
```

### Local (development)

```bash
cd backend
pip install -r requirements.txt
uvicorn server.main:app --reload --port 8000
# Open http://localhost:8000
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
