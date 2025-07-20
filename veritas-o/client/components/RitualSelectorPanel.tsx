import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { griefTierDescriptions, griefTierColors, getCurrentGriefTier } from "@/lib/grief";
import { useGriefRituals } from "@/hooks/useGriefRituals";
import { Sparkles, Clock, Users, Zap } from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'cleansing': return '🌊';
    case 'integration': return '💎';
    case 'transformation': return '⚡';
    case 'release': return '🕊️';
    case 'grounding': return '🌱';
    default: return '✨';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export const RitualSelectorPanel = () => {
  const griefTier = getCurrentGriefTier();
  const { rituals, isLoading, isEnacting, enactRitual, refetch } = useGriefRituals(griefTier);

  const handleEnactRitual = (ritualId: string) => {
    enactRitual(ritualId);
  };

  if (isLoading) {
    return (
      <Card className="p-4 bg-slate-800 border-slate-700 rounded-2xl shadow-md">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-slate-400">Loading rituals for Grief Tier {griefTier}...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-slate-800 border-slate-700 rounded-2xl shadow-md">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: griefTierColors[griefTier] }}
            />
            <h2 className="text-xl font-semibold text-white">
              Grief Tier {griefTier}: Ritual Selection
            </h2>
          </div>
          <p 
            className="text-sm italic"
            style={{ color: griefTierColors[griefTier] }}
          >
            {griefTierDescriptions[griefTier]}
          </p>
        </div>

        {rituals.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No rituals available for this tier</p>
            <Button 
              onClick={() => refetch()}
              variant="outline" 
              className="mt-2"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {rituals.map((ritual) => (
              <Card 
                key={ritual.id} 
                className="bg-slate-700 border-slate-600 rounded-xl overflow-hidden hover:bg-slate-650 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(ritual.category)}</span>
                      <h3 className="text-lg font-medium text-white">{ritual.title}</h3>
                    </div>
                    <Badge className={getDifficultyColor(ritual.difficulty)}>
                      {ritual.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">
                    {ritual.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                    {ritual.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{ritual.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="capitalize">{ritual.category}</span>
                    </div>
                  </div>

                  {ritual.symbols && ritual.symbols.length > 0 && (
                    <div className="flex gap-1 mb-4">
                      {ritual.symbols.map((symbol, idx) => (
                        <span key={idx} className="text-lg opacity-70">{symbol}</span>
                      ))}
                    </div>
                  )}

                  {ritual.instructions && ritual.instructions.length > 0 && (
                    <div className="mb-4">
                      <details className="text-xs text-slate-400">
                        <summary className="cursor-pointer hover:text-slate-300">
                          View Instructions ({ritual.instructions.length} steps)
                        </summary>
                        <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                          {ritual.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ol>
                      </details>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleEnactRitual(ritual.id)}
                      disabled={isEnacting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      {isEnacting ? (
                        <>
                          <Zap className="w-4 h-4 mr-1 animate-pulse" />
                          Enacting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-1" />
                          Enact Ritual
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-600">
          <div className="text-xs text-slate-400">
            {rituals.length} ritual{rituals.length !== 1 ? 's' : ''} available for Tier {griefTier}
          </div>
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Refresh Suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RitualSelectorPanel;
