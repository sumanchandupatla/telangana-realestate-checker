// API base URL: uses env var if set, otherwise empty string for same-origin requests
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function getHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}

export interface RERAProject {
  sr_no: number;
  project_name: string;
  promoter_name: string;
  last_modified_date: string;
  certificate_no: string | null;
  status: string | null;
}

export interface RERASearchResponse {
  success: boolean;
  projects: RERAProject[];
  total_records: number;
  error: string | null;
  source_url: string;
}

export interface LandRecord {
  survey_no: string | null;
  subdivision_no: string | null;
  pattadar_name: string | null;
  extent: string | null;
  land_nature: string | null;
  khata_no: string | null;
  status: string | null;
}

export interface DharaniSearchResponse {
  success: boolean;
  records: LandRecord[];
  total_records: number;
  error: string | null;
  source_url: string;
}

export interface BuildingPermission {
  application_no: string | null;
  applicant_name: string | null;
  permission_type: string | null;
  status: string | null;
  authority: string | null;
  date_applied: string | null;
  date_approved: string | null;
  remarks: string | null;
}

export interface BuildingPermissionSearchResponse {
  success: boolean;
  permissions: BuildingPermission[];
  total_records: number;
  error: string | null;
  source_url: string;
}

export interface HMDAPermission {
  application_no: string | null;
  applicant_name: string | null;
  permission_type: string | null;
  status: string | null;
  zone: string | null;
  date_applied: string | null;
  date_approved: string | null;
}

export interface HMDASearchResponse {
  success: boolean;
  permissions: HMDAPermission[];
  total_records: number;
  error: string | null;
  source_url: string;
}

export interface UnifiedResult {
  source: string;
  source_url: string;
  status: string;
  details: Record<string, unknown>;
  fetched_at: string;
}

export interface UnifiedSearchResponse {
  success: boolean;
  query: string;
  results: UnifiedResult[];
  errors: string[];
}

export async function searchRERA(params: {
  certificate_no?: string;
  project_name?: string;
  promoter_name?: string;
}): Promise<RERASearchResponse> {
  const res = await fetch(`${API_BASE}/api/rera/search`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function searchDharani(params: {
  district: string;
  mandal?: string;
  village?: string;
  survey_no?: string;
  pattadar_passbook_no?: string;
}): Promise<DharaniSearchResponse> {
  const res = await fetch(`${API_BASE}/api/dharani/search`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function searchBPass(params: {
  application_no?: string;
  applicant_name?: string;
  area?: string;
}): Promise<BuildingPermissionSearchResponse> {
  const res = await fetch(`${API_BASE}/api/bpass/search`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function searchHMDA(params: {
  application_no?: string;
  applicant_name?: string;
  locality?: string;
}): Promise<HMDASearchResponse> {
  const res = await fetch(`${API_BASE}/api/hmda/search`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function unifiedSearch(params: {
  query: string;
  search_type?: string;
}): Promise<UnifiedSearchResponse> {
  const res = await fetch(`${API_BASE}/api/unified/search`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}
