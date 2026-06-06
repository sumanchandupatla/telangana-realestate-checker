"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import PortalStatus from "@/components/PortalStatus";
import { unifiedSearch } from "@/lib/api";
import type { UnifiedSearchResponse } from "@/lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<UnifiedSearchResponse | null>(null);

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
        errors: ["Failed to connect to backend. Please try again."],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] float" />
        <div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/8 rounded-full blur-[120px] float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-[100px] float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 py-6 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
            TG
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Telangana Real Estate Checker
            </h1>
            <p className="text-xs text-gray-500 tracking-wide">
              Government Permission & Project Status Verification
            </p>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 pt-8 pb-16">
        {/* Hero */}
        <motion.div
          className="text-center mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Verify Project{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Permissions
            </span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Check approval status across all Telangana government portals — TS-RERA,
            Dharani, TG-bPASS, and HMDA — in one place.
          </p>
        </motion.div>

        {/* Search */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Results */}
        <SearchResults response={response} isLoading={isLoading} />

        {/* Portal status cards (shown when no search is active) */}
        {!response && !isLoading && (
          <motion.div
            className="w-full mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.h3
              className="text-center text-sm text-gray-500 uppercase tracking-widest mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Connected Government Portals
            </motion.h3>
            <PortalStatus />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        className="relative z-10 py-6 px-6 text-center border-t border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xs text-gray-600 max-w-lg mx-auto">
          Data sourced from official Telangana government portals. Results are
          best-effort and may vary based on portal availability.
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <a
            href="https://rerait.telangana.gov.in"
            target="_blank"
            className="text-xs text-gray-500 hover:text-indigo-400 transition-colors"
          >
            TS-RERA
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="https://dharani.telangana.gov.in"
            target="_blank"
            className="text-xs text-gray-500 hover:text-indigo-400 transition-colors"
          >
            Dharani
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="https://buildnow.telangana.gov.in"
            target="_blank"
            className="text-xs text-gray-500 hover:text-indigo-400 transition-colors"
          >
            BuildNow
          </a>
          <span className="text-gray-700">•</span>
          <a
            href="https://dpms.hmda.gov.in"
            target="_blank"
            className="text-xs text-gray-500 hover:text-indigo-400 transition-colors"
          >
            HMDA
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
