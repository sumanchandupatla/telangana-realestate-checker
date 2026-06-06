"""Scraper for TG-bPASS / BuildNow (Building Permission Approvals).

Source: https://tgbpass.telangana.gov.in/dashboard
Newer: https://buildnow.telangana.gov.in/
Covers building permissions for GHMC, HMDA, DTCP areas.
"""

import httpx
from bs4 import BeautifulSoup

from server.models.schemas import (
    BuildingPermission,
    BuildingPermissionSearchRequest,
    BuildingPermissionSearchResponse,
)

TGBPASS_DASHBOARD_URL = (
    "https://sw.tgbpass.telangana.gov.in/AutoDCR.Dashboard/tsbpass/dashboard.aspx"
)
BUILDNOW_URL = "https://buildnow.telangana.gov.in"


async def search_building_permissions(
    request: BuildingPermissionSearchRequest,
) -> BuildingPermissionSearchResponse:
    """Search TG-bPASS/BuildNow for building permission status."""
    # Try BuildNow first, then TG-bPASS dashboard
    for url, parser in [
        (BUILDNOW_URL, _parse_buildnow_results),
        (TGBPASS_DASHBOARD_URL, _parse_tgbpass_results),
    ]:
        result = await _try_search(url, request, parser)
        if result.success:
            return result

    return BuildingPermissionSearchResponse(
        success=False,
        permissions=[],
        total_records=0,
        error="Both BuildNow and TG-bPASS portals are unreachable or require login.",
    )


async def _try_search(
    base_url: str,
    request: BuildingPermissionSearchRequest,
    parser: callable,
) -> BuildingPermissionSearchResponse:
    """Attempt to search a building permission portal."""
    try:
        async with httpx.AsyncClient(timeout=30.0, verify=False) as client:
            # Try to access the dashboard/status page
            response = await client.get(base_url)

            if response.status_code != 200:
                return BuildingPermissionSearchResponse(
                    success=False,
                    permissions=[],
                    total_records=0,
                    error=f"Failed to reach {base_url}: HTTP {response.status_code}",
                    source_url=base_url,
                )

            # Check if login is required
            if _requires_login(response.text):
                return BuildingPermissionSearchResponse(
                    success=False,
                    permissions=[],
                    total_records=0,
                    error=f"Portal at {base_url} requires login for detailed search.",
                    source_url=base_url,
                )

            permissions = parser(response.text, request)
            return BuildingPermissionSearchResponse(
                success=True,
                permissions=permissions,
                total_records=len(permissions),
                source_url=base_url,
            )

    except httpx.TimeoutException:
        return BuildingPermissionSearchResponse(
            success=False,
            permissions=[],
            total_records=0,
            error=f"Timeout reaching {base_url}",
            source_url=base_url,
        )
    except Exception as e:
        return BuildingPermissionSearchResponse(
            success=False,
            permissions=[],
            total_records=0,
            error=f"Error: {str(e)}",
            source_url=base_url,
        )


def _requires_login(html: str) -> bool:
    """Check if the page requires authentication."""
    soup = BeautifulSoup(html, "lxml")
    login_indicators = ["login", "sign in", "username", "password"]
    page_text = soup.get_text().lower()
    login_forms = soup.find_all("form", attrs={"action": lambda x: x and "login" in x.lower()})
    return bool(login_forms) or any(
        indicator in page_text and "logout" not in page_text for indicator in login_indicators
    )


def _parse_buildnow_results(
    html: str, request: BuildingPermissionSearchRequest
) -> list[BuildingPermission]:
    """Parse results from BuildNow portal."""
    soup = BeautifulSoup(html, "lxml")
    permissions: list[BuildingPermission] = []

    # BuildNow uses a modern SPA, so data might be in JSON/API calls
    # Look for any visible data tables or status cards
    tables = soup.find_all("table")
    for table in tables:
        rows = table.find_all("tr")
        for row in rows[1:]:
            cells = row.find_all("td")
            if len(cells) >= 3:
                permission = BuildingPermission(
                    application_no=cells[0].get_text(strip=True) if cells else None,
                    applicant_name=cells[1].get_text(strip=True) if len(cells) > 1 else None,
                    status=cells[2].get_text(strip=True) if len(cells) > 2 else None,
                    authority="BuildNow",
                )
                permissions.append(permission)

    return permissions


def _parse_tgbpass_results(
    html: str, request: BuildingPermissionSearchRequest
) -> list[BuildingPermission]:
    """Parse results from TG-bPASS dashboard."""
    soup = BeautifulSoup(html, "lxml")
    permissions: list[BuildingPermission] = []

    # TG-bPASS dashboard shows aggregate stats
    # Look for data tables with application details
    tables = soup.find_all("table")
    for table in tables:
        rows = table.find_all("tr")
        for row in rows[1:]:
            cells = row.find_all("td")
            if len(cells) >= 4:
                permission = BuildingPermission(
                    application_no=cells[0].get_text(strip=True),
                    applicant_name=cells[1].get_text(strip=True) if len(cells) > 1 else None,
                    permission_type=cells[2].get_text(strip=True) if len(cells) > 2 else None,
                    status=cells[3].get_text(strip=True) if len(cells) > 3 else None,
                    authority="TG-bPASS",
                )
                permissions.append(permission)

    return permissions
