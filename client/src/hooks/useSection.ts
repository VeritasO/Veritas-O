// Track and update the active section in the UI
import { useState } from "react";
import { Section } from "../components/navigation";

export function useSection(initial: Section = "intro") {
  const [activeSection, setActiveSection] = useState<Section>(initial);
  return { activeSection, setActiveSection };
}
