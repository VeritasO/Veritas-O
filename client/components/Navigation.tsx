import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";

// ✅ Ensure PascalCase and correct folder nesting
import SearchBar from "@/components/SearchBar";
import SystemOverview from "@/components/sections/SystemOverview";
import BooksLibrary from "@/components/sections/BooksLibrary";
import AgentsDirectory from "@/components/sections/AgentsDirectory";
import CVTTimeDisplay from "@/components/sections/CVTTimeDisplay";
import DoctrineManagement from "@/components/sections/DoctrineManagement";
import ReflectionSubmission from "@/components/sections/ReflectionSubmission";
import SystemAnalytics from "@/components/sections/SystemAnalytics";
import ReflectionAuditPanel from "@/components/sections/ReflectionAuditPanel";
import SymbolicSuggestions from "@/components/SymbolicSuggestions";
import ContradictionMonitor from "@/components/ContradictionMonitor";
import AgentTaskComposer from "@/components/AgentTaskComposer";

// ✅ Hook & lib imports
import { useToast } from "@/hooks/useToast";
import { apiRequest } from "@/lib/queryClient";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { useSymbolicSuggestions } from "@/hooks/useSymbolicSuggestions";
import { useContradictions } from "@/hooks/useContradictions";

// ✅ Optional ErrorBoundary for safe rendering
import { ErrorBoundary } from "react-error-boundary";

export type Section =
  | "intro"
  | "books"
  | "agents"
  | "cvttime"
  | "doctrine"
  | "reflection"
  | "analytics"
  | "audit"
  | "symbolic"
  | "contradictions"
  | "tasks";

function MainContent({ renderActiveSection }: { renderActiveSection: () => React.ReactElement }) {
  return (
    <ErrorBoundary fallback={<div className="text-red-600">Something went wrong in this section.</div>}>
      <div className="animate-fade-in">{renderActiveSection()}</div>
    </ErrorBoundary>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("intro");
  const [cvtTime, setCvtTime] = useState("");
  const { toast } = useToast();

  const { data: books } = useQuery({ queryKey: ["/api/books"] });
  const { data: agents } = useQuery({ queryKey: ["/api/agents"] });
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
    refetchInterval: 60000,
  });

  const logInteraction = async (action: string, details?: string) => {
    try {
      await apiRequest("POST", "/api/interactions", {
        action,
        details,
        sessionId: "web-session",
      });
    } catch (error) {
      console.warn("Failed to log interaction:", error);
    }
  };

  const updateCVTTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    setCvtTime(
      `${year}.${month}.${day} / ${hours}:${minutes}:${seconds}.${milliseconds}`
    );
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    logInteraction("section_view", section);
  };

  useEffect(() => {
    updateCVTTime();
    const interval = setInterval(updateCVTTime, 1000);
    setTimeout(() => {
      toast({
        title: "Welcome to Veritas.O",
        description: "Justice System Portal – Built for fairness across time",
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [toast]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "intro":
        return <SystemOverview agents={agents} analytics={analytics} />;
      case "books":
        return <BooksLibrary books={books} onInteraction={logInteraction} />;
      case "agents":
        return <AgentsDirectory agents={agents} onInteraction={logInteraction} />;
      case "cvttime":
        return <CVTTimeDisplay cvtTime={cvtTime} onInteraction={logInteraction} />;
      case "doctrine":
        return <DoctrineManagement onInteraction={logInteraction} />;
      case "reflection":
        return <ReflectionSubmission onInteraction={logInteraction} />;
      case "analytics":
        return <SystemAnalytics analytics={analytics} onInteraction={logInteraction} />;
      case "audit":
        return <ReflectionAuditPanel />;
      case "symbolic":
        return <SymbolicSuggestions />;
      case "contradictions":
        return <ContradictionMonitor />;
      case "tasks":
        return <AgentTaskComposer />;
      default:
        return <SystemOverview agents={agents} analytics={analytics} />;
    }
  };

  const { pathname } = useLocation();
  const sections = [
    { path: "/", label: "Home" },
    { path: "/books", label: "Books" },
    { path: "/agents", label: "Agents" },
    { path: "/doctrine", label: "Doctrine" },
    { path: "/reflections", label: "Reflections" },
    { path: "/tasks", label: "Tasks" },
    { path: "/contradictions", label: "Contradictions" },
    // add more as needed
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <i className="fas fa-balance-scale text-2xl text-blue-400"></i>
              <h1 className="text-xl font-bold">Veritas.O</h1>
              <span className="hidden sm:block text-sm text-slate-300">
                Justice System Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-300">
                <i className="fas fa-clock"></i>
                <span className="cvt-time">CVT: {cvtTime}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-slate-300">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800 text-white p-4 shadow flex justify-center gap-6">
        {sections.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:underline ${
                isActive ? "text-veritas-200 underline" : "text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <SearchBar onSearch={(query) => logInteraction("search", query)} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MainContent renderActiveSection={renderActiveSection} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-slate-400">
            <p>
              &copy; 2025 Veritas.O System – All Rights Harmonized | Built for Fairness
              Across Time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
