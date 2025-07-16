import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import SearchBar from "@/components/search-bar";
import SystemOverview from "@/components/sections/system-overview";
import BooksLibrary from "@/components/sections/books-library";
import AgentsDirectory from "@/components/sections/agents-directory";
import CVTTimeDisplay from "@/components/sections/cvt-time-display";
import DoctrineManagement from "@/components/sections/doctrine-management";
import ReflectionSubmission from "@/components/sections/reflection-submission";
import SystemAnalytics from "@/components/sections/system-analytics";
import ReflectionAuditPanel from "@/components/ReflectionAuditPanel";
import SymbolicSuggestions from "@/components/SymbolicSuggestions";
import AgentTaskComposer from "@/components/AgentTaskComposer";
import { useToast } from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";


export type Section =
  | "intro"
  | "books"
  | "agents"
  | "cvttime"
  | "doctrine"
  | "reflection"
  | "analytics"
  | "audit"
  | "rituals"
  | "tasks";

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
    } catch (err) {
      console.warn("Interaction logging failed:", err);
    }
  };

  const updateCVTTime = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const timeStr = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(
      now.getDate()
    )} / ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}.${String(now.getMilliseconds()).padStart(3, "0")}`;
    setCvtTime(timeStr);
  };

  useEffect(() => {
    updateCVTTime();
    const interval = setInterval(updateCVTTime, 1000);
    setTimeout(() => {
      toast({
        title: "Welcome to Veritas.O",
        description: "Restoration-first portal for fairness across time.",
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [toast]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "intro":
        return <SystemOverview agents={agents} analytics={analytics} />;
      case "books":
        return (
          <BooksLibrary books={books} onInteraction={logInteraction} />
        );
      case "agents":
        return (
          <AgentsDirectory agents={agents} onInteraction={logInteraction} />
        );
      case "cvttime":
        return (
          <CVTTimeDisplay cvtTime={cvtTime} onInteraction={logInteraction} />
        );
      case "doctrine":
        return <DoctrineManagement onInteraction={logInteraction} />;
      case "reflection":
        return <ReflectionSubmission onInteraction={logInteraction} />;
      case "analytics":
        return (
          <SystemAnalytics analytics={analytics} onInteraction={logInteraction} />
        );
      case "audit":
        return <ReflectionAuditPanel />;
      case "rituals":
        return <SymbolicSuggestions />;
      case "tasks":
        return <AgentTaskComposer />;
      default:
        return <SystemOverview agents={agents} analytics={analytics} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <i className="fas fa-balance-scale text-xl text-blue-400"></i>
              <h1 className="text-xl font-bold">Veritas.O</h1>
              <span className="hidden sm:block text-sm text-slate-300">
                Earth-Based Justice System
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <span className="hidden md:flex items-center gap-1">
                <i className="fas fa-clock"></i> CVT: {cvtTime}
              </span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>System Active</span>
            </div>
          </div>
        </div>
      </header>

      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <SearchBar onSearch={(q) => logInteraction("search", q)} />

      <main className="max-w-7xl mx-auto p-6">
        <div className="animate-fade-in">{renderActiveSection()}</div>
      </main>

      <footer className="bg-slate-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-400">
          &copy; 2025 Veritas.O — Built for Fairness Across Time
        </div>
      </footer>
    </div>
  );
}

