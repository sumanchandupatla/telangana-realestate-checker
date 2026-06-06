"""Scraper for HMDA DPMS (Development Permission Management System).

Source: https://dpms.hmda.gov.in/BPAMSClient/
Covers layout approvals, building permissions, NOCs within HMDA jurisdiction.
Note: Most HMDA permissions are now processed through BuildNow/TG-bPASS.
"""

import httpx
from bs4 import BeautifulSoup

from app.models.schemas import HMDAPermission, HMDASearchRequest, HMDASearchResponse

DPMS_URL = "https://dpms.hmda.gov.in/BPAMSClient/"


async def search_hmda_permissions(request: HMDASearchRequest) -> HMDASearchResponse:
    """Search HMDA DPMS for layout/building permissions."""
    try:
        async with httpx.AsyncClient(timeout=30.0, verify=False) as client:
            response = await client.get(DPMS_URL)

            if response.status_code != 200:
                return HMDASearchResponse(
                    success=False,
                    permissions=[],
                    total_records=0,
                    error=f"HMDA DPMS unreachable: HTTP {response.status_code}",
                )

            # Check if the portal requires login
            if _requires_login(response.text):
                # HMDA DPMS requires login for individual application search
                # Return info about the portal and what's publicly accessible
                return HMDASearchResponse(
                    success=False,
                    permissions=[],
                    total_records=0,
                    error=(
                        "HMDA DPMS requires login for application-level search. "
                        "Note: New applications are now processed through BuildNow "
                        "(https://buildnow.telangana.gov.in). "
                        "For legacy applications, login at https://dpms.hmda.gov.in/BPAMSClient/"
                    ),
                )

            permissions = _parse_results(response.text, request)
            return HMDASearchResponse(
                success=True,
                permissions=permissions,
                total_records=len(permissions),
            )

    except httpx.TimeoutException:
        return HMDASearchResponse(
            success=False,
            permissions=[],
            total_records=0,
            error="HMDA DPMS timed out.",
        )
    except Exception as e:
        return HMDASearchResponse(
            success=False,
            permissions=[],
            total_records=0,
            error=f"Error: {str(e)}",
        )


def _requires_login(html: str) -> bool:
    """Check if the page requires authentication."""
    soup = BeautifulSoup(html, "lxml")
    login_forms = soup.find_all("input", attrs={"type": "password"})
    return bool(login_forms)


def _parse_results(html: str, request: HMDASearchRequest) -> list[HMDAPermission]:
    """Parse HMDA DPMS results."""
    soup = BeautifulSoup(html, "lxml")
    permissions: list[HMDAPermission] = []

    tables = soup.find_all("table")
    for table in tables:
        rows = table.find_all("tr")
        for row in rows[1:]:
            cells = row.find_all("td")
            if len(cells) >= 4:
                permission = HMDAPermission(
                    application_no=cells[0].get_text(strip=True),
                    applicant_name=cells[1].get_text(strip=True) if len(cells) > 1 else None,
                    permission_type=cells[2].get_text(strip=True) if len(cells) > 2 else None,
                    status=cells[3].get_text(strip=True) if len(cells) > 3 else None,
                    zone=request.locality,
                )
                permissions.append(permission)

    return permissions
