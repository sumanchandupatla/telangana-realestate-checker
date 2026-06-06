from pydantic import BaseModel


class RERASearchRequest(BaseModel):
    certificate_no: str | None = None
    project_name: str | None = None
    promoter_name: str | None = None


class RERAProject(BaseModel):
    sr_no: int
    project_name: str
    promoter_name: str
    last_modified_date: str
    certificate_no: str | None = None
    status: str | None = None


class RERASearchResponse(BaseModel):
    success: bool
    projects: list[RERAProject]
    total_records: int
    error: str | None = None
    source_url: str = "https://rerait.telangana.gov.in/SearchList/Search"


class DharaniSearchRequest(BaseModel):
    district: str
    mandal: str | None = None
    village: str | None = None
    survey_no: str | None = None
    pattadar_passbook_no: str | None = None


class LandRecord(BaseModel):
    survey_no: str | None = None
    subdivision_no: str | None = None
    pattadar_name: str | None = None
    extent: str | None = None
    land_nature: str | None = None
    khata_no: str | None = None
    status: str | None = None


class DharaniSearchResponse(BaseModel):
    success: bool
    records: list[LandRecord]
    total_records: int
    error: str | None = None
    source_url: str = "https://dharani.telangana.gov.in/knowLandStatus"


class BuildingPermissionSearchRequest(BaseModel):
    application_no: str | None = None
    applicant_name: str | None = None
    area: str | None = None  # GHMC, HMDA, DTCP


class BuildingPermission(BaseModel):
    application_no: str | None = None
    applicant_name: str | None = None
    permission_type: str | None = None
    status: str | None = None
    authority: str | None = None
    date_applied: str | None = None
    date_approved: str | None = None
    remarks: str | None = None


class BuildingPermissionSearchResponse(BaseModel):
    success: bool
    permissions: list[BuildingPermission]
    total_records: int
    error: str | None = None
    source_url: str = "https://tgbpass.telangana.gov.in/dashboard"


class HMDASearchRequest(BaseModel):
    application_no: str | None = None
    applicant_name: str | None = None
    locality: str | None = None


class HMDAPermission(BaseModel):
    application_no: str | None = None
    applicant_name: str | None = None
    permission_type: str | None = None
    status: str | None = None
    zone: str | None = None
    date_applied: str | None = None
    date_approved: str | None = None


class HMDASearchResponse(BaseModel):
    success: bool
    permissions: list[HMDAPermission]
    total_records: int
    error: str | None = None
    source_url: str = "https://dpms.hmda.gov.in/BPAMSClient/"


class UnifiedSearchRequest(BaseModel):
    query: str
    search_type: str = "all"  # all, rera, dharani, bpass, hmda


class UnifiedResult(BaseModel):
    source: str
    source_url: str
    status: str
    details: dict
    fetched_at: str


class UnifiedSearchResponse(BaseModel):
    success: bool
    query: str
    results: list[UnifiedResult]
    errors: list[str]
