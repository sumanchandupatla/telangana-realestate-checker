"use client";

import { motion } from "framer-motion";
import type { UnifiedResult } from "@/lib/api";

interface ResultCardProps {
  result: UnifiedResult;
  index: number;
}

function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (
    s.includes("registered") ||
    s.includes("approved") ||
    s.includes("active")
  )
    return "bg-green-500/20 text-green-400 border-green-500/30";
  if (s.includes("pending") || s.includes("processing"))
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  if (
    s.includes("rejected") ||
    s.includes("expired") ||
    s.includes("revoked")
  )
    return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

function getSourceGradient(source: string): string {
  if (source.includes("RERA")) return "from-blue-500/10 to-cyan-500/10";
  if (source.includes("bPASS") || source.includes("BuildNow"))
    return "from-orange-500/10 to-amber-500/10";
  if (source.includes("HMDA")) return "from-purple-500/10 to-pink-500/10";
  if (source.includes("Dharani") || source.includes("Bhu"))
    return "from-green-500/10 to-emerald-500/10";
  return "from-gray-500/10 to-gray-500/10";
}

function getSourceIcon(source: string): string {
  if (source.includes("RERA")) return "🏢";
  if (source.includes("bPASS") || source.includes("BuildNow")) return "🏗️";
  if (source.includes("HMDA")) return "📋";
  if (source.includes("Dharani") || source.includes("Bhu")) return "🌍";
  return "📄";
}

export default function ResultCard({ result, index }: ResultCardProps) {
  const details = result.details;

  return (
    <motion.div
      className={`glass rounded-xl p-6 card-hover relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getSourceGradient(result.source)}`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 glass rounded-lg flex items-center justify-center text-2xl">
              {getSourceIcon(result.source)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{result.source}</h3>
              <a
                href={result.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View on official portal →
              </a>
            </div>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(result.status)}`}
          >
            {result.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(details).map(([key, value]) => {
            if (!value || key === "sr_no" || key === "status") return null;
            const label = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <div key={key} className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase tracking-wider">
                  {label}
                </span>
                <span className="text-white font-medium text-sm mt-0.5">
                  {String(value)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Fetched: {new Date(result.fetched_at).toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
}
