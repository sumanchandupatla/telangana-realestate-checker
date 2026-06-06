"use client";

import { motion } from "framer-motion";

const PORTALS = [
  {
    name: "TS-RERA",
    url: "https://rerait.telangana.gov.in/SearchList/Search",
    description: "Real Estate Project Registration & Compliance Status",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#7b2eff" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M10 11h.01M10 15h.01M10 19h.01M14 11h.01M14 15h.01M14 19h.01M18 11h.01M18 15h.01M18 19h.01M8 7V3h8v4" />
      </svg>
    ),
    color: "#7b2eff",
    bgColor: "#f5f0ff",
    status: "Live",
  },
  {
    name: "Dharani / Bhu Bharati",
    url: "https://dharani.telangana.gov.in/knowLandStatus",
    description: "Land Records, Ownership & Survey Details",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#059669" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    color: "#059669",
    bgColor: "#ecfdf5",
    status: "Live",
  },
  {
    name: "BuildNow / TG-bPASS",
    url: "https://buildnow.telangana.gov.in",
    description: "Building Permission Approval & Self-Certification",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#d97706" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-6h6v6" />
      </svg>
    ),
    color: "#d97706",
    bgColor: "#fffbeb",
    status: "Partial",
  },
  {
    name: "HMDA DPMS",
    url: "https://dpms.hmda.gov.in/BPAMSClient/",
    description: "Layout & Development Permissions (HMDA Area)",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" />
      </svg>
    ),
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    status: "Partial",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PortalStatus() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {PORTALS.map((portal) => (
        <motion.a
          key={portal.name}
          href={portal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card p-5 group block"
          variants={cardVariants}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: portal.bgColor }}
            >
              {portal.icon}
            </div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                portal.status === "Live"
                  ? "badge-green"
                  : "badge-yellow"
              }`}
            >
              {portal.status}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5 group-hover:text-[#7b2eff] transition-colors">
            {portal.name}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            {portal.description}
          </p>
          <div className="mt-3 flex items-center text-xs font-medium text-[#7b2eff] opacity-0 group-hover:opacity-100 transition-opacity">
            Visit portal
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-1">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
