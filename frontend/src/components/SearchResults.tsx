"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { UnifiedSearchResponse } from "@/lib/api";
import ResultCard from "./ResultCard";

interface SearchResultsProps {
  response: UnifiedSearchResponse | null;
  isLoading: boolean;
}

export default function SearchResults({
  response,
  isLoading,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <motion.div
        className="w-full max-w-3xl mx-auto mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="relative">
            <motion.div
              className="w-14 h-14 rounded-full border-2 border-[#7b2eff]/20"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 w-14 h-14 rounded-full border-2 border-transparent border-t-[#7b2eff]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#7b2eff] rounded-full pulse-live" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-medium">
              Querying government portals...
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Connecting to TS-RERA, Dharani, BuildNow & HMDA
            </p>
          </div>

          <div className="w-full space-y-3 mt-4">
            {[1, 2].map((i) => (
              <div key={i} className="card-flat p-6 shimmer h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!response) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="w-full max-w-3xl mx-auto mt-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {response.errors.length > 0 && (
          <motion.div
            className="rounded-xl p-4 bg-amber-50 border border-amber-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-amber-700 font-medium text-sm mb-2 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Some portals returned warnings
            </h4>
            <ul className="text-xs text-amber-600 space-y-1">
              {response.errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {response.results.length > 0 ? (
          <div className="space-y-4">
            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found{" "}
              <span className="text-[#7b2eff] font-semibold">
                {response.results.length}
              </span>{" "}
              result(s) for &quot;
              <span className="text-gray-900 font-medium">{response.query}</span>&quot;
            </motion.p>
            {response.results.map((result, i) => (
              <ResultCard key={i} result={result} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16 card-flat rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              No results found for &quot;{response.query}&quot;
            </p>
            <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
              Try a RERA certificate number (e.g., P02400002687), project name,
              or building permission application number.
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
