"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { searchDharani } from "@/lib/api";
import type { DharaniSearchResponse } from "@/lib/api";

const DISTRICTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
  "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
  "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar",
  "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
  "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
  "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet",
  "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri",
];

export default function DharaniPage() {
  const [district, setDistrict] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [passbook, setPassbook] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DharaniSearchResponse | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district) return;
    setIsLoading(true);
    setSearched(true);
    try {
      const result = await searchDharani({ district, survey_no: surveyNo, pattadar_passbook_no: passbook });
      setResponse(result);
    } catch {
      setResponse({ success: false, records: [], total_records: 0, error: "Connection failed", source_url: "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <motion.header
        className="py-4 px-6 border-b border-gray-100"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 max-w-3xl mx-auto">
          <Link href="/" className="text-[#7b2eff] hover:text-[#5a1ecc] transition-colors text-sm flex items-center gap-1 font-medium">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-lg font-bold text-gray-900">Dharani / Bhu Bharati - Land Records</h1>
        </div>
      </motion.header>

      {/* Main */}
      <main className="flex-1 px-6 py-8">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Form Card */}
          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Land Records</h2>
              <p className="text-gray-500 text-sm">
                Search the Dharani / Bhu Bharati portal for land ownership details, survey numbers, and pattadar information.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none bg-white appearance-none"
                >
                  <option value="">Select District</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Survey Number</label>
                  <input
                    type="text"
                    value={surveyNo}
                    onChange={(e) => setSurveyNo(e.target.value)}
                    placeholder="e.g., 123/A"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Pattadar Passbook Number</label>
                  <input
                    type="text"
                    value={passbook}
                    onChange={(e) => setPassbook(e.target.value)}
                    placeholder="e.g., 0012345678"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !district}
                className="w-full btn-primary py-4 font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Searching Dharani...
                  </span>
                ) : (
                  "Search Land Records"
                )}
              </motion.button>
            </form>

            <div className="mt-4 text-center text-xs text-gray-400">
              Source:{" "}
              <a href="https://dharani.telangana.gov.in/knowLandStatus" target="_blank" className="text-[#7b2eff] hover:underline">
                dharani.telangana.gov.in
              </a>
              {" / "}
              <a href="https://bhubharati.telangana.gov.in/knowLandStatus" target="_blank" className="text-[#7b2eff] hover:underline">
                bhubharati.telangana.gov.in
              </a>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {response?.error && (
              <motion.div
                className="mt-6 rounded-xl p-4 bg-amber-50 border border-amber-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-amber-700 text-sm">{response.error}</p>
              </motion.div>
            )}

            {response && response.records.length > 0 && (
              <motion.div
                className="mt-6 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-gray-500">
                  Found <span className="text-[#059669] font-semibold">{response.records.length}</span> record(s)
                </p>
                {response.records.map((record, i) => (
                  <motion.div
                    key={i}
                    className="card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(record).map(([key, value]) => {
                        if (!value) return null;
                        const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                        return (
                          <div key={key}>
                            <span className="text-gray-400 text-xs uppercase tracking-wider">{label}</span>
                            <p className="text-gray-900 font-medium text-sm mt-0.5">{String(value)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {searched && !isLoading && response && response.records.length === 0 && !response.error && (
              <motion.div
                className="mt-6 text-center py-8 card-flat rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-500">No land records found for the given criteria.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
