"use client";

import { useState } from "react";
import Link from "next/link";
import { searchBPass, type BuildingPermissionSearchResponse } from "@/lib/api";

export default function BPassPage() {
  const [applicationNo, setApplicationNo] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [area, setArea] = useState("");
  const [response, setResponse] =
    useState<BuildingPermissionSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await searchBPass({
        application_no: applicationNo || undefined,
        applicant_name: applicantName || undefined,
        area: area || undefined,
      });
      setResponse(result);
    } catch {
      setResponse({
        success: false,
        permissions: [],
        total_records: 0,
        error: "Failed to connect to API server.",
        source_url: "https://buildnow.telangana.gov.in",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-gray-900">
            TG-bPASS / BuildNow - Building Permissions
          </h1>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Note:</strong> TG-bPASS has been replaced by{" "}
            <a
              href="https://buildnow.telangana.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              BuildNow
            </a>{" "}
            for all new applications in GHMC, HMDA, and DTCP areas. Existing
            applications can still be tracked through TG-bPASS.
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Search Building Permissions
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Number
                </label>
                <input
                  type="text"
                  value={applicationNo}
                  onChange={(e) => setApplicationNo(e.target.value)}
                  placeholder="Enter your application number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applicant Name
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Name of the applicant"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area / Authority
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="">All Areas</option>
                    <option value="GHMC">GHMC</option>
                    <option value="HMDA">HMDA</option>
                    <option value="DTCP">DTCP</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || (!applicationNo && !applicantName)}
                className="w-full px-4 py-2.5 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading
                  ? "Searching BuildNow/TG-bPASS..."
                  : "Search Building Permissions"}
              </button>
            </form>
          </div>

          {/* Results */}
          {response && (
            <div className="space-y-4">
              {response.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {response.error}
                </div>
              )}

              {response.success && response.permissions.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Found {response.total_records} permission(s)
                  </p>
                  {response.permissions.map((perm, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {perm.application_no || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {perm.applicant_name}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {perm.status || "Unknown"}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        {perm.permission_type && (
                          <div>Type: {perm.permission_type}</div>
                        )}
                        {perm.authority && (
                          <div>Authority: {perm.authority}</div>
                        )}
                        {perm.date_applied && (
                          <div>Applied: {perm.date_applied}</div>
                        )}
                        {perm.date_approved && (
                          <div>Approved: {perm.date_approved}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {response.success && response.permissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No building permissions found. The portal may require login for
                  detailed searches.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
