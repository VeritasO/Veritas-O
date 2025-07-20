import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AgentCollaborationPanel from '@/components/AgentCollaborationPanel';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function CollaborationTest() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-300">
            🔮 Agent Collaboration Panel Test
          </h1>
          <AgentCollaborationPanel />
        </div>
      </div>
    </QueryClientProvider>
  );
}
