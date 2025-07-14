// Navigation component scaffold
import React from "react";
// ...existing code...

export type Section =
  | "intro"
  | "books"
  | "agents"
  | "cvttime"
  | "doctrine"
  | "reflection"
  | "analytics"
  | "rituals"
  | "sandbox"
  | "councilReview"
  | "mirraMonitor"
  | "audit"
  | "symbols";

interface NavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const sections: { key: Section; label: string }[] = [
  { key: "intro", label: "System Overview" },
  { key: "books", label: "Canonical Books" },
  { key: "agents", label: "Meet the Agents" },
  { key: "cvttime", label: "Coordinated Time" },
  { key: "doctrine", label: "Doctrine" },
  { key: "reflection", label: "Submit Reflection" },
  { key: "analytics", label: "System Analytics" },
  { key: "rituals", label: "Ritual Registry" },
  { key: "sandbox", label: "Sandbox" },
  { key: "councilReview", label: "Council Review" },
  { key: "mirraMonitor", label: "MIRRA Monitor" },
  { key: "audit", label: "Reflection Audit" },
  { key: "symbols", label: "Ritual Suggestions" },
];

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="flex flex-wrap gap-2">
      {sections.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onSectionChange(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
            ${activeSection === key ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
