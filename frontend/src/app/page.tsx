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
    <div className="min-h-screen flex flex-col">
      {/* Header / Nav */}
      <motion.header
        className="relative z-20 px-6 py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl header-gradient flex items-center justify-center text-white font-bold text-sm shadow-md">
              TG
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                TG Real Estate
              </h1>
              <p className="text-[11px] text-gray-400 -mt-0.5">
                Permission Checker
              </p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="/rera" className="text-sm text-gray-500 hover:text-[#7b2eff] transition-colors font-medium">
              TS-RERA
            </a>
            <a href="/dharani" className="text-sm text-gray-500 hover:text-[#7b2eff] transition-colors font-medium">
              Dharani
            </a>
            <a href="/bpass" className="text-sm text-gray-500 hover:text-[#7b2eff] transition-colors font-medium">
              BuildNow
            </a>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="relative hero-gradient">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-10 left-[10%] opacity-[0.15]" width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#7b2eff" strokeWidth="1.5" className="journey-line" />
          </svg>
          <svg className="absolute top-20 right-[15%] opacity-[0.12]" width="80" height="80" viewBox="0 0 80 80">
            <rect x="10" y="10" width="60" height="60" rx="12" fill="none" stroke="#9b5fff" strokeWidth="1.5" className="journey-line" />
          </svg>
          <svg className="absolute bottom-32 left-[20%] opacity-[0.1]" width="60" height="60" viewBox="0 0 60 60">
            <polygon points="30,5 55,50 5,50" fill="none" stroke="#7b2eff" strokeWidth="1.5" className="journey-line" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 mb-5 leading-[1.15] tracking-tight">
              Check real estate{" "}
              <span className="text-[#7b2eff]">permissions</span>
              <br />
              across Telangana
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Verify project approvals across TS-RERA, Dharani, TG-bPASS, and
              HMDA government portals in one search.
            </p>
          </motion.div>

          {/* Search */}
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Wave divider */}
        <div className="wave-decoration">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 -mt-4">
        {/* Results */}
        <SearchResults response={response} isLoading={isLoading} />

        {/* Portal status cards (shown when no search is active) */}
        {!response && !isLoading && (
          <motion.div
            className="mt-12 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Connected Government Portals
              </h3>
              <p className="text-sm text-gray-400">
                Real-time data from official Telangana state portals
              </p>
            </motion.div>
            <PortalStatus />
          </motion.div>
        )}

        {/* How it works section */}
        {!response && !isLoading && (
          <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Enter project details",
                  desc: "Search by RERA number, project name, application number, or land survey details.",
                },
                {
                  step: "2",
                  title: "We check all portals",
                  desc: "Our system queries TS-RERA, Dharani, TG-bPASS, and HMDA simultaneously.",
                },
                {
                  step: "3",
                  title: "Get instant results",
                  desc: "View permission status, registration details, and approval information in seconds.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  className="text-center px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-full bg-[#f5f0ff] text-[#7b2eff] font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        className="border-t border-gray-100 bg-gray-50 py-8 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              Data sourced from official Telangana government portals. Results
              are best-effort and may vary based on portal availability.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://rerait.telangana.gov.in"
                target="_blank"
                className="text-xs text-gray-400 hover:text-[#7b2eff] transition-colors"
              >
                TS-RERA
              </a>
              <span className="text-gray-200">|</span>
              <a
                href="https://dharani.telangana.gov.in"
                target="_blank"
                className="text-xs text-gray-400 hover:text-[#7b2eff] transition-colors"
              >
                Dharani
              </a>
              <span className="text-gray-200">|</span>
              <a
                href="https://buildnow.telangana.gov.in"
                target="_blank"
                className="text-xs text-gray-400 hover:text-[#7b2eff] transition-colors"
              >
                BuildNow
              </a>
              <span className="text-gray-200">|</span>
              <a
                href="https://dpms.hmda.gov.in"
                target="_blank"
                className="text-xs text-gray-400 hover:text-[#7b2eff] transition-colors"
              >
                HMDA
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
