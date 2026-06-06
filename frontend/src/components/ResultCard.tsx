"use client";

import type { UnifiedResult } from "@/lib/api";

interface ResultCardProps {
  result: UnifiedResult;
}

function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("registered") || s.includes("approved") || s.includes("active"))
    return "bg-green-100 text-green-800 border-green-200";
  if (s.includes("pending") || s.includes("processing"))
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (s.includes("rejected") || s.includes("expired") || s.includes("revoked"))
    return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
}

function getSourceIcon(source: string): string {
  if (source.includes("RERA")) return "🏢";
  if (source.includes("bPASS") || source.includes("BuildNow")) return "🏗️";
  if (source.includes("HMDA")) return "📋";
  if (source.includes("Dharani") || source.includes("Bhu")) return "🌍";
  return "📄";
}

export default function ResultCard({ result }: ResultCardProps) {
  const details = result.details;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getSourceIcon(result.source)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{result.source}</h3>
            <a
              href={result.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View on official portal →
            </a>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}
        >
          {result.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {Object.entries(details).map(([key, value]) => {
          if (!value || key === "sr_no" || key === "status") return null;
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          return (
            <div key={key} className="flex flex-col">
              <span className="text-gray-500 text-xs">{label}</span>
              <span className="text-gray-900 font-medium">
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
        Fetched: {new Date(result.fetched_at).toLocaleString()}
      </div>
    </div>
  );
}
