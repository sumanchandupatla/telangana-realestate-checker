"use client";

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
      <div className="w-full max-w-3xl mx-auto mt-8">
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          <p className="text-gray-500">
            Querying government portals... This may take a moment.
          </p>
        </div>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-4">
      {response.errors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="text-amber-800 font-medium text-sm mb-2">
            Some portals returned errors:
          </h4>
          <ul className="text-xs text-amber-700 space-y-1">
            {response.errors.map((error, i) => (
              <li key={i}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {response.results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Found {response.results.length} result(s) for &quot;{response.query}
            &quot;
          </p>
          {response.results.map((result, i) => (
            <ResultCard key={i} result={result} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No results found for &quot;{response.query}&quot;
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Try a RERA certificate number (e.g., P02400002687), project name, or
            application number.
          </p>
        </div>
      )}
    </div>
  );
}
