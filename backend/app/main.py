"""Telangana Real Estate Permission Checker API.

Aggregates data from multiple government portals:
- TS-RERA: Project registration status
- Dharani/Bhu Bharati: Land records
- TG-bPASS/BuildNow: Building permissions
- HMDA DPMS: Layout/building permissions in HMDA area
"""

from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import (
    BuildingPermissionSearchRequest,
    BuildingPermissionSearchResponse,
    DharaniSearchRequest,
    DharaniSearchResponse,
    HMDASearchRequest,
    HMDASearchResponse,
    RERASearchRequest,
    RERASearchResponse,
    UnifiedResult,
    UnifiedSearchRequest,
    UnifiedSearchResponse,
)
from app.scrapers import bpass, dharani, hmda, rera

app = FastAPI(
    title="Telangana Real Estate Permission Checker",
    description=(
        "API to check real estate project permissions and status across "
        "Telangana government portals (TS-RERA, Dharani, TG-bPASS, HMDA)"
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "name": "Telangana Real Estate Permission Checker API",
        "version": "0.1.0",
        "portals": {
            "rera": {
                "name": "TS-RERA",
                "url": "https://rerait.telangana.gov.in/SearchList/Search",
                "description": "Telangana Real Estate Regulatory Authority - Project Registration",
            },
            "dharani": {
                "name": "Dharani / Bhu Bharati",
                "url": "https://dharani.telangana.gov.in/knowLandStatus",
                "description": "Integrated Land Records Management System",
            },
            "bpass": {
                "name": "TG-bPASS / BuildNow",
                "url": "https://buildnow.telangana.gov.in",
                "description": "Building Permission Approval and Self-Certification System",
            },
            "hmda": {
                "name": "HMDA DPMS",
                "url": "https://dpms.hmda.gov.in/BPAMSClient/",
                "description": "HMDA Development Permission Management System",
            },
        },
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.post("/api/rera/search", response_model=RERASearchResponse)
async def search_rera(request: RERASearchRequest):
    """Search TS-RERA for registered real estate projects."""
    return await rera.search_rera_projects(request)


@app.post("/api/dharani/search", response_model=DharaniSearchResponse)
async def search_dharani(request: DharaniSearchRequest):
    """Search Dharani/Bhu Bharati for land records."""
    return await dharani.search_land_records(request)


@app.post("/api/bpass/search", response_model=BuildingPermissionSearchResponse)
async def search_bpass(request: BuildingPermissionSearchRequest):
    """Search TG-bPASS/BuildNow for building permission status."""
    return await bpass.search_building_permissions(request)


@app.post("/api/hmda/search", response_model=HMDASearchResponse)
async def search_hmda(request: HMDASearchRequest):
    """Search HMDA DPMS for development permissions."""
    return await hmda.search_hmda_permissions(request)


@app.post("/api/unified/search", response_model=UnifiedSearchResponse)
async def unified_search(request: UnifiedSearchRequest):
    """Search across all portals with a single query.

    The query is interpreted as a RERA certificate number or project name.
    """
    results: list[UnifiedResult] = []
    errors: list[str] = []
    now = datetime.now(timezone.utc).isoformat()

    search_type = request.search_type.lower()

    # Search RERA
    if search_type in ("all", "rera"):
        rera_request = RERASearchRequest(
            certificate_no=request.query if request.query.startswith("P") else None,
            project_name=request.query if not request.query.startswith("P") else None,
        )
        rera_result = await rera.search_rera_projects(rera_request)
        if rera_result.success:
            for project in rera_result.projects:
                results.append(
                    UnifiedResult(
                        source="TS-RERA",
                        source_url=rera_result.source_url,
                        status=project.status or "Registered",
                        details=project.model_dump(),
                        fetched_at=now,
                    )
                )
        elif rera_result.error:
            errors.append(f"RERA: {rera_result.error}")

    # Search Building Permissions
    if search_type in ("all", "bpass"):
        bpass_request = BuildingPermissionSearchRequest(
            application_no=request.query,
        )
        bpass_result = await bpass.search_building_permissions(bpass_request)
        if bpass_result.success:
            for perm in bpass_result.permissions:
                results.append(
                    UnifiedResult(
                        source="TG-bPASS / BuildNow",
                        source_url=bpass_result.source_url,
                        status=perm.status or "Unknown",
                        details=perm.model_dump(),
                        fetched_at=now,
                    )
                )
        elif bpass_result.error:
            errors.append(f"bPASS: {bpass_result.error}")

    # Search HMDA
    if search_type in ("all", "hmda"):
        hmda_request = HMDASearchRequest(
            application_no=request.query,
        )
        hmda_result = await hmda.search_hmda_permissions(hmda_request)
        if hmda_result.success:
            for perm in hmda_result.permissions:
                results.append(
                    UnifiedResult(
                        source="HMDA DPMS",
                        source_url=hmda_result.source_url,
                        status=perm.status or "Unknown",
                        details=perm.model_dump(),
                        fetched_at=now,
                    )
                )
        elif hmda_result.error:
            errors.append(f"HMDA: {hmda_result.error}")

    return UnifiedSearchResponse(
        success=len(results) > 0 or len(errors) == 0,
        query=request.query,
        results=results,
        errors=errors,
    )
