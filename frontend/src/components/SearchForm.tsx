"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SearchFormProps {
  onSearch: (query: string, searchType: string) => void;
  isLoading: boolean;
}

const SEARCH_TYPES = [
  { value: "all", label: "All Portals" },
  { value: "rera", label: "TS-RERA" },
  { value: "bpass", label: "BuildNow" },
  { value: "hmda", label: "HMDA" },
];

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Tab pills */}
      <div className="flex justify-center gap-2 mb-4">
        {SEARCH_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setSearchType(type.value)}
            className={`tab-pill px-4 py-2 rounded-full text-sm font-medium ${
              searchType === type.value
                ? "active"
                : "text-gray-500 bg-white/70"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="search-card p-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter RERA number, project name, or application number..."
              className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none text-base"
              disabled={isLoading}
            />
          </div>
          <motion.button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn-primary px-8 py-4 font-semibold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </motion.button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        Try: P02400007583, &quot;Prestige City&quot;, or any project name
      </p>
    </motion.form>
  );
}
