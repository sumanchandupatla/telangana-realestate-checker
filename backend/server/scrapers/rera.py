"""Scraper for TS-RERA (Telangana Real Estate Regulatory Authority).

Source: https://rerait.telangana.gov.in/SearchList/Search
Supports search by certificate number, project name, or promoter name.
"""

import httpx
from bs4 import BeautifulSoup

from server.models.schemas import RERAProject, RERASearchRequest, RERASearchResponse

BASE_URL = "https://rerait.telangana.gov.in"
SEARCH_URL = f"{BASE_URL}/SearchList/Search"


async def search_rera_projects(request: RERASearchRequest) -> RERASearchResponse:
    """Search TS-RERA for registered real estate projects."""
    try:
        async with httpx.AsyncClient(timeout=30.0, verify=False) as client:
            # If certificate number is provided, use direct URL
            if request.certificate_no:
                url = f"{SEARCH_URL}?CertficateNo={request.certificate_no}"
                response = await client.get(url)
            else:
                # First get the search page to obtain any tokens/cookies
                page_response = await client.get(SEARCH_URL)
                if page_response.status_code != 200:
                    return RERASearchResponse(
                        success=False,
                        projects=[],
                        total_records=0,
                        error=f"Failed to load search page: HTTP {page_response.status_code}",
                    )

                # Build search parameters
                params: dict[str, str] = {}
                if request.project_name:
                    params["ProjectName"] = request.project_name
                if request.promoter_name:
                    params["PromoterName"] = request.promoter_name

                response = await client.get(SEARCH_URL, params=params)

            if response.status_code != 200:
                return RERASearchResponse(
                    success=False,
                    projects=[],
                    total_records=0,
                    error=f"Search request failed: HTTP {response.status_code}",
                )

            projects = _parse_search_results(response.text)
            return RERASearchResponse(
                success=True,
                projects=projects,
                total_records=len(projects),
            )

    except httpx.TimeoutException:
        return RERASearchResponse(
            success=False,
            projects=[],
            total_records=0,
            error="Request timed out. TS-RERA server may be slow or unreachable.",
        )
    except Exception as e:
        return RERASearchResponse(
            success=False,
            projects=[],
            total_records=0,
            error=f"Unexpected error: {str(e)}",
        )


def _parse_search_results(html: str) -> list[RERAProject]:
    """Parse the HTML search results page from TS-RERA."""
    soup = BeautifulSoup(html, "lxml")
    projects: list[RERAProject] = []

    # Find the results table
    table = soup.find("table")
    if not table:
        return projects

    rows = table.find_all("tr")
    for row in rows[1:]:  # Skip header row
        cells = row.find_all("td")
        if len(cells) >= 5:
            # Columns: Sr No, Project Name, Promoter Name, View Details, Last Modified Date, ...
            project = RERAProject(
                sr_no=int(cells[0].get_text(strip=True) or "0"),
                project_name=cells[1].get_text(strip=True),
                promoter_name=cells[2].get_text(strip=True),
                last_modified_date=cells[4].get_text(strip=True),
                status="Registered",
            )
            projects.append(project)

    return projects
