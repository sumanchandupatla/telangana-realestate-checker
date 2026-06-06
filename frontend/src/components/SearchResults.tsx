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
          {/* Animated loading indicator */}
          <div className="relative">
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-indigo-500/30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-indigo-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full pulse-glow" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-300 font-medium">
              Querying government portals...
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Connecting to TS-RERA, Dharani, BuildNow & HMDA
            </p>
          </div>

          {/* Shimmer placeholders */}
          <div className="w-full space-y-3 mt-4">
            {[1, 2].map((i) => (
              <div key={i} className="glass rounded-xl p-6 shimmer h-32" />
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
            className="glass rounded-xl p-4 border border-amber-500/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-amber-400 font-medium text-sm mb-2 flex items-center gap-2">
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
            <ul className="text-xs text-amber-300/70 space-y-1">
              {response.errors.map((error, i) => (
                <li key={i}>• {error}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {response.results.length > 0 ? (
          <div className="space-y-4">
            <motion.p
              className="text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found{" "}
              <span className="text-indigo-400 font-semibold">
                {response.results.length}
              </span>{" "}
              result(s) for &quot;
              <span className="text-white">{response.query}</span>&quot;
            </motion.p>
            {response.results.map((result, i) => (
              <ResultCard key={i} result={result} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12 glass rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400">
              No results found for &quot;{response.query}&quot;
            </p>
            <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
              Try a RERA certificate number (e.g., P02400002687), project name,
              or building permission application number.
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
