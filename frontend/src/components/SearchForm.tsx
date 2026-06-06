"use client";

import { useState } from "react";

interface SearchFormProps {
  onSearch: (query: string, searchType: string) => void;
  isLoading: boolean;
}

const SEARCH_TYPES = [
  { value: "all", label: "All Portals" },
  { value: "rera", label: "TS-RERA (Project Registration)" },
  { value: "bpass", label: "TG-bPASS / BuildNow (Building Permissions)" },
  { value: "hmda", label: "HMDA (Layout Permissions)" },
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
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter RERA number (e.g. P02400002687), project name, or application number..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {SEARCH_TYPES.map((type) => (
            <label
              key={type.value}
              className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors ${
                searchType === type.value
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="searchType"
                value={type.value}
                checked={searchType === type.value}
                onChange={(e) => setSearchType(e.target.value)}
                className="sr-only"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}
