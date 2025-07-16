import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";

type Agent = {
  id: number;
  name: string;
  role: string;
  status: string;
  icon: string;
  iconColor: string;
  lastActivity?: string;
};

export default function AgentDashboard() {
  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
    queryFn: () => apiRequest("GET", "/api/agents"),
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {agents.map((agent) => (
        <Card key={agent.id} className="shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className="rounded-full text-xl p-2"
              style={{ backgroundColor: agent.iconColor }}
            >
              {agent.icon}
            </div>
            <div>
              <h3 className="font-bold">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.role}</p>
              <p className="text-xs text-green-600 mt-1">{agent.status}</p>
              {agent.lastActivity && (
                <p className="text-xs text-slate-400">Last seen: {new Date(agent.lastActivity).toLocaleString()}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
