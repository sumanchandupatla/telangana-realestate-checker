"use client";

import { useState } from "react";
import Link from "next/link";
import { searchDharani, type DharaniSearchResponse } from "@/lib/api";

const DISTRICTS = [
  "Adilabad",
  "Bhadradri Kothagudem",
  "Hyderabad",
  "Jagtial",
  "Jangaon",
  "Jayashankar Bhupalpally",
  "Jogulamba Gadwal",
  "Kamareddy",
  "Karimnagar",
  "Khammam",
  "Komaram Bheem Asifabad",
  "Mahabubabad",
  "Mahabubnagar",
  "Mancherial",
  "Medak",
  "Medchal-Malkajgiri",
  "Mulugu",
  "Nagarkurnool",
  "Nalgonda",
  "Narayanpet",
  "Nirmal",
  "Nizamabad",
  "Peddapalli",
  "Rajanna Sircilla",
  "Ranga Reddy",
  "Sangareddy",
  "Siddipet",
  "Suryapet",
  "Vikarabad",
  "Wanaparthy",
  "Warangal Rural",
  "Warangal Urban",
  "Yadadri Bhuvanagiri",
];

export default function DharaniPage() {
  const [district, setDistrict] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [passbookNo, setPassbookNo] = useState("");
  const [response, setResponse] = useState<DharaniSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await searchDharani({
        district,
        survey_no: surveyNo || undefined,
        pattadar_passbook_no: passbookNo || undefined,
      });
      setResponse(result);
    } catch {
      setResponse({
        success: false,
        records: [],
        total_records: 0,
        error: "Failed to connect to API server.",
        source_url: "https://dharani.telangana.gov.in/knowLandStatus",
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
            Dharani / Bhu Bharati - Land Records
          </h1>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Search Land Records</h2>
            <p className="text-sm text-gray-500 mb-6">
              Search the Dharani / Bhu Bharati portal for land ownership details,
              survey numbers, and pattadar information.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select District</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Survey Number
                  </label>
                  <input
                    type="text"
                    value={surveyNo}
                    onChange={(e) => setSurveyNo(e.target.value)}
                    placeholder="e.g., 123/A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pattadar Passbook Number
                  </label>
                  <input
                    type="text"
                    value={passbookNo}
                    onChange={(e) => setPassbookNo(e.target.value)}
                    placeholder="e.g., 0012345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !district}
                className="w-full px-4 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Searching Dharani..." : "Search Land Records"}
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

              {response.success && response.records.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Found {response.total_records} record(s)
                  </p>
                  {response.records.map((record, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg p-5"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        {record.survey_no && (
                          <div>
                            <span className="text-gray-500">Survey No:</span>{" "}
                            <span className="font-medium">
                              {record.survey_no}
                            </span>
                          </div>
                        )}
                        {record.pattadar_name && (
                          <div>
                            <span className="text-gray-500">Pattadar:</span>{" "}
                            <span className="font-medium">
                              {record.pattadar_name}
                            </span>
                          </div>
                        )}
                        {record.extent && (
                          <div>
                            <span className="text-gray-500">Extent:</span>{" "}
                            <span className="font-medium">{record.extent}</span>
                          </div>
                        )}
                        {record.land_nature && (
                          <div>
                            <span className="text-gray-500">Nature:</span>{" "}
                            <span className="font-medium">
                              {record.land_nature}
                            </span>
                          </div>
                        )}
                        {record.khata_no && (
                          <div>
                            <span className="text-gray-500">Khata No:</span>{" "}
                            <span className="font-medium">
                              {record.khata_no}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {response.success && response.records.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No land records found for the given criteria.
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-400 text-center">
            Source:{" "}
            <a
              href="https://dharani.telangana.gov.in/knowLandStatus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              dharani.telangana.gov.in
            </a>{" "}
            /{" "}
            <a
              href="https://bhubharati.telangana.gov.in/knowLandStatus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              bhubharati.telangana.gov.in
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
