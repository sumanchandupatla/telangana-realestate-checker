"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { searchRERA } from "@/lib/api";
import type { RERAProject } from "@/lib/api";

export default function RERAPage() {
  const [certificateNo, setCertificateNo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [promoterName, setPromoterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RERAProject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await searchRERA({ certificate_no: certificateNo, project_name: projectName, promoter_name: promoterName });
      if (response.success) {
        setResults(response.projects);
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

  const canSubmit = certificateNo || projectName || promoterName;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-[120px] float" style={{ animationDelay: "3s" }} />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 py-6 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 max-w-3xl mx-auto">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm flex items-center gap-1">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Link>
          <h1 className="text-xl font-bold text-white">TS-RERA Project Search</h1>
        </div>
      </motion.header>

      {/* Main */}
      <main className="relative z-10 flex-1 px-6 pb-16">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Search Form Card */}
          <div className="glass-strong rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Search Registered Projects</h2>
              <p className="text-gray-400 text-sm">
                Search the Telangana Real Estate Regulatory Authority database for registered projects.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">RERA Certificate Number</label>
                <input
                  type="text"
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  placeholder="e.g., P02400002687"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Prestige City"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Promoter Name</label>
                  <input
                    type="text"
                    value={promoterName}
                    onChange={(e) => setPromoterName(e.target.value)}
                    placeholder="e.g., My Home Constructions"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !canSubmit}
                className="w-full btn-primary py-4 text-white font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
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
                    Searching TS-RERA...
                  </span>
                ) : (
                  "Search TS-RERA"
                )}
              </motion.button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-xs text-gray-500">Source: </span>
              <a href="https://rerait.telangana.gov.in/SearchList/Search" target="_blank" className="text-xs text-indigo-400 hover:text-indigo-300">
                rerait.telangana.gov.in
              </a>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="mt-6 glass rounded-xl p-4 border border-red-500/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {results.length > 0 && (
              <motion.div
                className="mt-6 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-gray-400">
                  Found <span className="text-indigo-400 font-semibold">{results.length}</span> project(s)
                </p>
                {results.map((project, i) => (
                  <motion.div
                    key={i}
                    className="glass rounded-xl p-6 card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-white text-lg">{project.project_name}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                        {project.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Promoter</span>
                        <p className="text-white font-medium mt-0.5">{project.promoter_name}</p>
                      </div>
                      {project.last_modified_date && (
                        <div>
                          <span className="text-gray-500 text-xs uppercase tracking-wider">Last Modified</span>
                          <p className="text-white font-medium mt-0.5">{project.last_modified_date}</p>
                        </div>
                      )}
                      {project.certificate_no && (
                        <div>
                          <span className="text-gray-500 text-xs uppercase tracking-wider">Certificate No</span>
                          <p className="text-white font-medium mt-0.5">{project.certificate_no}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {searched && !isLoading && results.length === 0 && !error && (
              <motion.div
                className="mt-6 text-center py-8 glass rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-400">No projects found matching your search criteria.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
