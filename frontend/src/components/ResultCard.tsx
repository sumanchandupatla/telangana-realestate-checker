"use client";

import { motion } from "framer-motion";
import type { UnifiedResult } from "@/lib/api";

interface ResultCardProps {
  result: UnifiedResult;
  index: number;
}

function getStatusBadge(status: string): string {
  const s = status.toLowerCase();
  if (
    s.includes("registered") ||
    s.includes("approved") ||
    s.includes("active")
  )
    return "badge-green";
  if (s.includes("pending") || s.includes("processing"))
    return "badge-yellow";
  if (
    s.includes("rejected") ||
    s.includes("expired") ||
    s.includes("revoked")
  )
    return "badge-red";
  return "badge-gray";
}

function getSourceColor(source: string): { bg: string; text: string } {
  if (source.includes("RERA")) return { bg: "#f5f0ff", text: "#7b2eff" };
  if (source.includes("bPASS") || source.includes("BuildNow"))
    return { bg: "#fffbeb", text: "#d97706" };
  if (source.includes("HMDA")) return { bg: "#f5f3ff", text: "#7c3aed" };
  if (source.includes("Dharani") || source.includes("Bhu"))
    return { bg: "#ecfdf5", text: "#059669" };
  return { bg: "#f9fafb", text: "#6b7280" };
}

export default function ResultCard({ result, index }: ResultCardProps) {
  const details = result.details;
  const colors = getSourceColor(result.source);

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {result.source.includes("RERA") && (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3 21h18M3 7v14m18-14v14M8 7V3h8v4" />
              </svg>
            )}
            {(result.source.includes("bPASS") || result.source.includes("BuildNow")) && (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2 20h20M5 20V8l7-5 7 5v12" />
              </svg>
            )}
            {result.source.includes("HMDA") && (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              </svg>
            )}
            {(result.source.includes("Dharani") || result.source.includes("Bhu")) && (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{result.source}</h3>
            <a
              href={result.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#7b2eff] hover:underline"
            >
              View on official portal
            </a>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(result.status)}`}
        >
          {result.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(details).map(([key, value]) => {
          if (!value || key === "sr_no" || key === "status") return null;
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          return (
            <div key={key} className="flex flex-col">
              <span className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                {label}
              </span>
              <span className="text-gray-900 font-medium text-sm">
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-live" />
        Fetched: {new Date(result.fetched_at).toLocaleString()}
      </div>
    </motion.div>
  );
}
