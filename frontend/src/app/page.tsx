"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import PortalStatus from "@/components/PortalStatus";
import { unifiedSearch, type UnifiedSearchResponse } from "@/lib/api";

export default function Home() {
  const [response, setResponse] = useState<UnifiedSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string, searchType: string) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await unifiedSearch({ query, search_type: searchType });
      setResponse(result);
    } catch {
      setResponse({
        success: false,
        query,
        results: [],
        errors: [
          "Failed to connect to the API server. Please ensure the backend is running.",
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            TG
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Telangana Real Estate Checker
            </h1>
            <p className="text-xs text-gray-500">
              Government Permission & Project Status Verification
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Hero */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Check Real Estate Project Status
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Verify project permissions and approval status across all
              Telangana government portals — TS-RERA, Dharani, TG-bPASS, and
              HMDA — in one place.
            </p>
          </div>

          {/* Search */}
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {/* Results */}
          <SearchResults response={response} isLoading={isLoading} />

          {/* Portal Cards */}
          {!response && !isLoading && (
            <div className="space-y-4">
              <h3 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wide">
                Connected Government Portals
              </h3>
              <PortalStatus />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="max-w-5xl mx-auto text-center text-xs text-gray-400 space-y-1">
          <p>
            Data sourced from official Telangana government portals. Results are
            best-effort and may vary based on portal availability.
          </p>
          <p>
            Portals:{" "}
            <a
              href="https://rerait.telangana.gov.in"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TS-RERA
            </a>
            {" • "}
            <a
              href="https://dharani.telangana.gov.in"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dharani
            </a>
            {" • "}
            <a
              href="https://buildnow.telangana.gov.in"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BuildNow
            </a>
            {" • "}
            <a
              href="https://dpms.hmda.gov.in"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HMDA
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
