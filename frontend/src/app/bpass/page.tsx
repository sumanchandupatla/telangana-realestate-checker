"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { searchBPass } from "@/lib/api";
import type { BuildingPermission } from "@/lib/api";

export default function BPassPage() {
  const [applicationNo, setApplicationNo] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [area, setArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BuildingPermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await searchBPass({ application_no: applicationNo, applicant_name: applicantName, area });
      if (response.success) {
        setResults(response.permissions);
      } else {
        setError(response.error || "Search failed");
        setResults([]);
      }
    } catch {
      setError("Failed to connect to server");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = applicationNo || applicantName;

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
          <h1 className="text-lg font-bold text-gray-900">TG-bPASS / BuildNow - Building Permissions</h1>
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
          {/* Notice */}
          <motion.div
            className="rounded-xl p-4 mb-6 bg-amber-50 border border-amber-200"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <svg width="20" height="20" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 shrink-0">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="text-sm text-amber-800">
                <strong className="text-amber-900">Note:</strong> TG-bPASS has been replaced by{" "}
                <a href="https://buildnow.telangana.gov.in" target="_blank" className="text-amber-700 underline hover:text-amber-900">
                  BuildNow
                </a>{" "}
                for all new applications in GHMC, HMDA, and DTCP areas. Existing applications can still be tracked.
              </p>
            </div>
          </motion.div>

          {/* Form Card */}
          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Building Permissions</h2>
              <p className="text-gray-500 text-sm">
                Search for building permission approvals and their current status.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Application Number</label>
                <input
                  type="text"
                  value={applicationNo}
                  onChange={(e) => setApplicationNo(e.target.value)}
                  placeholder="Enter your application number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Applicant Name</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Name of the applicant"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Area / Authority</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none bg-white appearance-none"
                  >
                    <option value="">All Areas</option>
                    <option value="GHMC">GHMC</option>
                    <option value="HMDA">HMDA</option>
                    <option value="DTCP">DTCP</option>
                  </select>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !canSubmit}
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
                    Searching...
                  </span>
                ) : (
                  "Search Building Permissions"
                )}
              </motion.button>
            </form>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="mt-6 rounded-xl p-4 bg-red-50 border border-red-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            {results.length > 0 && (
              <motion.div
                className="mt-6 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-gray-500">
                  Found <span className="text-[#d97706] font-semibold">{results.length}</span> permission(s)
                </p>
                {results.map((perm, i) => (
                  <motion.div
                    key={i}
                    className="card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(perm).map(([key, value]) => {
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

            {searched && !isLoading && results.length === 0 && !error && (
              <motion.div
                className="mt-6 text-center py-8 card-flat rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-500">No building permissions found.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
