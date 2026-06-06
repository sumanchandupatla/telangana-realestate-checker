"use client";

const PORTALS = [
  {
    name: "TS-RERA",
    url: "https://rerait.telangana.gov.in/SearchList/Search",
    description: "Real Estate Regulatory Authority - Project Registration & Status",
    icon: "🏢",
  },
  {
    name: "Dharani / Bhu Bharati",
    url: "https://dharani.telangana.gov.in/knowLandStatus",
    description: "Integrated Land Records Management System",
    icon: "🌍",
  },
  {
    name: "TG-bPASS / BuildNow",
    url: "https://buildnow.telangana.gov.in",
    description: "Building Permission Approval & Self-Certification",
    icon: "🏗️",
  },
  {
    name: "HMDA DPMS",
    url: "https://dpms.hmda.gov.in/BPAMSClient/",
    description: "HMDA Development Permission Management",
    icon: "📋",
  },
];

export default function PortalStatus() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mx-auto">
      {PORTALS.map((portal) => (
        <a
          key={portal.name}
          href={portal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="text-2xl mb-2">{portal.icon}</div>
          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
            {portal.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{portal.description}</p>
        </a>
      ))}
    </div>
  );
}
