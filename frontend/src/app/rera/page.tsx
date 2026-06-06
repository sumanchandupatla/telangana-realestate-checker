"use client";

import { useState } from "react";
import Link from "next/link";
import { searchRERA, type RERASearchResponse } from "@/lib/api";

export default function RERAPage() {
  const [certificateNo, setCertificateNo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [promoterName, setPromoterName] = useState("");
  const [response, setResponse] = useState<RERASearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await searchRERA({
        certificate_no: certificateNo || undefined,
        project_name: projectName || undefined,
        promoter_name: promoterName || undefined,
      });
      setResponse(result);
    } catch {
      setResponse({
        success: false,
        projects: [],
        total_records: 0,
        error: "Failed to connect to API server.",
        source_url: "https://rerait.telangana.gov.in/SearchList/Search",
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
            TS-RERA Project Search
          </h1>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Search Registered Projects
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Search the Telangana Real Estate Regulatory Authority database for
              registered projects. You can search by RERA certificate number,
              project name, or promoter name.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RERA Certificate Number
                </label>
                <input
                  type="text"
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  placeholder="e.g., P02400002687"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div className="text-center text-xs text-gray-400">— OR —</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Prestige City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promoter Name
                  </label>
                  <input
                    type="text"
                    value={promoterName}
                    onChange={(e) => setPromoterName(e.target.value)}
                    placeholder="e.g., My Home Constructions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  (!certificateNo && !projectName && !promoterName)
                }
                className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Searching TS-RERA..." : "Search TS-RERA"}
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

              {response.success && response.projects.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Found {response.total_records} project(s)
                  </p>
                  {response.projects.map((project, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {project.project_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {project.promoter_name}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {project.status || "Registered"}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>
                          Certificate:{" "}
                          <span className="text-gray-700">
                            {project.certificate_no || "—"}
                          </span>
                        </div>
                        <div>
                          Last Updated:{" "}
                          <span className="text-gray-700">
                            {project.last_modified_date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {response.success && response.projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No projects found matching your search criteria.
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-400 text-center">
            Source:{" "}
            <a
              href="https://rerait.telangana.gov.in/SearchList/Search"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              rerait.telangana.gov.in
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
