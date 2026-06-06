"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SearchFormProps {
  onSearch: (query: string, searchType: string) => void;
  isLoading: boolean;
}

const SEARCH_TYPES = [
  { value: "all", label: "All Portals", icon: "🔍" },
  { value: "rera", label: "TS-RERA", icon: "🏢" },
  { value: "bpass", label: "BuildNow", icon: "🏗️" },
  { value: "hmda", label: "HMDA", icon: "📋" },
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
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex flex-col gap-5">
        {/* Search input */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-40 blur transition-opacity duration-300" />
          <div className="relative flex flex-col sm:flex-row gap-3 glass-strong rounded-xl p-2">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400">
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
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none text-lg"
                disabled={isLoading}
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="btn-primary px-8 py-4 text-white font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
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

        {/* Search type tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {SEARCH_TYPES.map((type) => (
            <motion.label
              key={type.value}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer border transition-all duration-300 ${
                searchType === type.value
                  ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-300 glow"
                  : "glass border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                name="searchType"
                value={type.value}
                checked={searchType === type.value}
                onChange={(e) => setSearchType(e.target.value)}
                className="sr-only"
              />
              <span className="mr-1.5">{type.icon}</span>
              {type.label}
            </motion.label>
          ))}
        </div>
      </div>
    </motion.form>
  );
}
