"use client";

import { motion } from "framer-motion";

const PORTALS = [
  {
    name: "TS-RERA",
    url: "https://rerait.telangana.gov.in/SearchList/Search",
    description: "Real Estate Project Registration & Compliance Status",
    icon: "🏢",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "hover:border-blue-400/40",
    status: "Live",
  },
  {
    name: "Dharani / Bhu Bharati",
    url: "https://dharani.telangana.gov.in/knowLandStatus",
    description: "Land Records, Ownership & Survey Details",
    icon: "🌍",
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "hover:border-green-400/40",
    status: "Live",
  },
  {
    name: "BuildNow / TG-bPASS",
    url: "https://buildnow.telangana.gov.in",
    description: "Building Permission Approval & Self-Certification",
    icon: "🏗️",
    color: "from-orange-500/20 to-amber-500/20",
    borderColor: "hover:border-orange-400/40",
    status: "Partial",
  },
  {
    name: "HMDA DPMS",
    url: "https://dpms.hmda.gov.in/BPAMSClient/",
    description: "Layout & Development Permissions (HMDA Area)",
    icon: "📋",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "hover:border-purple-400/40",
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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PortalStatus() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mx-auto"
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
          className={`glass rounded-xl p-5 card-hover group relative overflow-hidden ${portal.borderColor}`}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{portal.icon}</span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  portal.status === "Live"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                {portal.status}
              </span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">
              {portal.name}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {portal.description}
            </p>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
