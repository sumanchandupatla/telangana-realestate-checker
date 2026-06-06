"""Scraper for Dharani / Bhu Bharati (Telangana Land Records).

Source: https://dharani.telangana.gov.in/knowLandStatus
Also: https://bhubharati.telangana.gov.in/knowLandStatus (replacement portal)
Supports search by survey number, pattadar passbook number.
"""

import httpx
from bs4 import BeautifulSoup

from server.models.schemas import DharaniSearchRequest, DharaniSearchResponse, LandRecord

DHARANI_URL = "https://dharani.telangana.gov.in"
BHUBHARATI_URL = "https://bhubharati.telangana.gov.in"
LAND_STATUS_PATH = "/knowLandStatus"


async def search_land_records(request: DharaniSearchRequest) -> DharaniSearchResponse:
    """Search Dharani/Bhu Bharati for land records."""
    # Try Bhu Bharati first (newer portal), fall back to Dharani
    for base_url in [BHUBHARATI_URL, DHARANI_URL]:
        result = await _try_search(base_url, request)
        if result.success:
            return result

    return DharaniSearchResponse(
        success=False,
        records=[],
        total_records=0,
        error="Both Bhu Bharati and Dharani portals are unreachable.",
    )


async def _try_search(base_url: str, request: DharaniSearchRequest) -> DharaniSearchResponse:
    """Attempt search against a specific portal URL."""
    try:
        async with httpx.AsyncClient(timeout=30.0, verify=False) as client:
            # Load the search page first
            search_url = f"{base_url}{LAND_STATUS_PATH}"
            page_response = await client.get(search_url)

            if page_response.status_code != 200:
                return DharaniSearchResponse(
                    success=False,
                    records=[],
                    total_records=0,
                    error=f"Failed to load {base_url}: HTTP {page_response.status_code}",
                    source_url=search_url,
                )

            # Build the search form data
            form_data: dict[str, str] = {
                "district": request.district,
            }
            if request.mandal:
                form_data["mandal"] = request.mandal
            if request.village:
                form_data["village"] = request.village
            if request.survey_no:
                form_data["surveyNo"] = request.survey_no
            if request.pattadar_passbook_no:
                form_data["pattadarPassbookNo"] = request.pattadar_passbook_no

            # Submit the search
            response = await client.post(search_url, data=form_data)

            if response.status_code != 200:
                return DharaniSearchResponse(
                    success=False,
                    records=[],
                    total_records=0,
                    error=f"Search failed: HTTP {response.status_code}",
                    source_url=search_url,
                )

            records = _parse_land_results(response.text)
            return DharaniSearchResponse(
                success=True,
                records=records,
                total_records=len(records),
                source_url=search_url,
            )

    except httpx.TimeoutException:
        return DharaniSearchResponse(
            success=False,
            records=[],
            total_records=0,
            error=f"Timeout reaching {base_url}",
            source_url=f"{base_url}{LAND_STATUS_PATH}",
        )
    except Exception as e:
        return DharaniSearchResponse(
            success=False,
            records=[],
            total_records=0,
            error=f"Error: {str(e)}",
            source_url=f"{base_url}{LAND_STATUS_PATH}",
        )


def _parse_land_results(html: str) -> list[LandRecord]:
    """Parse land record results from Dharani/Bhu Bharati HTML."""
    soup = BeautifulSoup(html, "lxml")
    records: list[LandRecord] = []

    # Look for result tables or cards
    table = soup.find("table", class_="table")
    if table:
        rows = table.find_all("tr")
        for row in rows[1:]:
            cells = row.find_all("td")
            if len(cells) >= 3:
                record = LandRecord(
                    survey_no=cells[0].get_text(strip=True) if len(cells) > 0 else None,
                    pattadar_name=cells[1].get_text(strip=True) if len(cells) > 1 else None,
                    extent=cells[2].get_text(strip=True) if len(cells) > 2 else None,
                    land_nature=cells[3].get_text(strip=True) if len(cells) > 3 else None,
                    khata_no=cells[4].get_text(strip=True) if len(cells) > 4 else None,
                )
                records.append(record)

    # Also check for JSON data in script tags (some portals use client-side rendering)
    scripts = soup.find_all("script")
    for script in scripts:
        if script.string and "landDetails" in (script.string or ""):
            # Try to extract JSON data
            pass

    return records
