import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, Users, AlertTriangle, CheckCircle, MessageSquare, Workflow, Bell } from 'lucide-react';
import { useAgentSignals } from '@/hooks/useAgentSignals';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgentSignalPanelProps {
  className?: string;
}

const AgentSignalPanel: React.FC<AgentSignalPanelProps> = ({ className = '' }) => {
  const {
    activeSignals,
    signalMetrics,
    signalsLoading,
    emitSignal,
    acknowledgeSignal,
    respondToSignal,
    emittingSignal,
    acknowledging,
    responding,
    emitAlert,
    requestCoordination,
    requestRitual,
    updateDoctrine,
    reportStatus,
    getSignalsByType,
    getSignalsByPriority,
    getCriticalSignals,
    getUnansweredSignals,
    getCoordinationRequests
  } = useAgentSignals();

  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [showCreateSignal, setShowCreateSignal] = useState(false);
  const [newSignalForm, setNewSignalForm] = useState({
    agentId: 'user_agent',
    signalType: 'alert' as const,
    content: '',
    priority: 'medium' as const
  });
  const [responseForm, setResponseForm] = useState({
    responseType: 'acknowledgment' as const,
    content: ''
  });

  const currentSignal = selectedSignal 
    ? activeSignals.find(s => s.id === selectedSignal) 
    : null;

  const handleCreateSignal = () => {
    if (!newSignalForm.content) return;
    
    emitSignal({
      agentId: newSignalForm.agentId,
      signalType: newSignalForm.signalType,
      content: newSignalForm.content,
      priority: newSignalForm.priority,
      metadata: { created: new Date().toISOString() }
    });
    
    setShowCreateSignal(false);
    setNewSignalForm({
      agentId: 'user_agent',
      signalType: 'alert',
      content: '',
      priority: 'medium'
    });
  };

  const handleAcknowledge = (signalId: string) => {
    acknowledgeSignal({ signalId, agentId: 'user_agent' });
  };

  const handleRespond = () => {
    if (!selectedSignal || !responseForm.content) return;
    
    respondToSignal({
      signalId: selectedSignal,
      respondingAgentId: 'user_agent',
      responseType: responseForm.responseType,
      content: responseForm.content
    });
    
    setResponseForm({ responseType: 'acknowledgment', content: '' });
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'coordination': return <Workflow className="w-4 h-4 text-blue-400" />;
      case 'status': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'ritual_request': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'doctrine_update': return <Bell className="w-4 h-4 text-yellow-400" />;
      default: return <Radio className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-blue-500 bg-blue-500/10';
      case 'low': return 'border-gray-500 bg-gray-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  if (signalsLoading) {
    return (
      <Card className={`bg-slate-800 border-slate-700 p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <Radio className="w-8 h-8 text-blue-400 animate-pulse" />
          <span className="ml-3 text-slate-400">Loading agent signals...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Radio className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-blue-300">📡 Agent Signal Panel</h2>
              <p className="text-slate-400">Multi-agent coordination and communication</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCreateSignal(!showCreateSignal)}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={emittingSignal}
            >
              <Radio className="w-4 h-4 mr-2" />
              {emittingSignal ? 'Emitting...' : 'New Signal'}
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center mb-4">
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{signalMetrics.total}</div>
            <div className="text-sm text-slate-400">Total Signals</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{signalMetrics.critical}</div>
            <div className="text-sm text-slate-400">Critical</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{signalMetrics.unanswered}</div>
            <div className="text-sm text-slate-400">Unanswered</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{(signalMetrics.responseRate * 100).toFixed(0)}%</div>
            <div className="text-sm text-slate-400">Response Rate</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{signalMetrics.byType.coordination}</div>
            <div className="text-sm text-slate-400">Coordination</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <Button 
            onClick={() => emitAlert('system_monitor', 'System health check', 'low')}
            size="sm"
            variant="outline"
            className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Alert
          </Button>
          <Button 
            onClick={() => requestCoordination('coordinator', 'Multi-agent task coordination needed')}
            size="sm"
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            <Workflow className="w-4 h-4 mr-1" />
            Coordinate
          </Button>
          <Button 
            onClick={() => requestRitual('ritual_agent', 3, 'medium')}
            size="sm"
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
          >
            <Zap className="w-4 h-4 mr-1" />
            Ritual
          </Button>
          <Button 
            onClick={() => updateDoctrine('doctrine_keeper', 'Belief system update', 'minor')}
            size="sm"
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500/10"
          >
            <Bell className="w-4 h-4 mr-1" />
            Doctrine
          </Button>
        </div>

        {/* Create Signal Form */}
        <AnimatePresence>
          {showCreateSignal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 bg-slate-700 rounded-lg"
            >
              <h3 className="text-lg font-bold text-blue-300 mb-4">Emit New Signal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Agent ID"
                  value={newSignalForm.agentId}
                  onChange={(e) => setNewSignalForm(prev => ({ ...prev, agentId: e.target.value }))}
                  className="bg-slate-600 text-white p-2 rounded border border-slate-500"
                />
                <select
                  value={newSignalForm.signalType}
                  onChange={(e) => setNewSignalForm(prev => ({ 
                    ...prev, 
                    signalType: e.target.value as any 
                  }))}
                  className="bg-slate-600 text-white p-2 rounded border border-slate-500"
                >
                  <option value="alert">Alert</option>
                  <option value="coordination">Coordination</option>
                  <option value="status">Status</option>
                  <option value="ritual_request">Ritual Request</option>
                  <option value="doctrine_update">Doctrine Update</option>
                </select>
              </div>
              <textarea
                placeholder="Signal content..."
                value={newSignalForm.content}
                onChange={(e) => setNewSignalForm(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-slate-600 text-white p-2 rounded border border-slate-500 mb-4"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <select
                  value={newSignalForm.priority}
                  onChange={(e) => setNewSignalForm(prev => ({ 
                    ...prev, 
                    priority: e.target.value as any 
                  }))}
                  className="bg-slate-600 text-white p-2 rounded border border-slate-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Priority</option>
                </select>
                <div className="flex gap-2">
                  <Button onClick={handleCreateSignal} className="bg-green-600 hover:bg-green-700">
                    Emit Signal
                  </Button>
                  <Button 
                    onClick={() => setShowCreateSignal(false)} 
                    variant="outline"
                    className="border-slate-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signals List */}
        <Card className="bg-slate-800 border-slate-700 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-purple-300">📻 Active Signals</h3>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                Critical: {getCriticalSignals().length}
              </span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                Unanswered: {getUnansweredSignals().length}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeSignals.map((signal) => (
              <motion.div
                key={signal.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedSignal(signal.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedSignal === signal.id
                    ? 'bg-blue-600/20 border-blue-500'
                    : `${getPriorityColor(signal.priority)} border-opacity-50 hover:border-opacity-100`
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSignalIcon(signal.signalType)}
                    <span className="font-semibold text-white text-sm">
                      {signal.agentId}
                    </span>
                    {!signal.acknowledged && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {signal.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="text-sm text-slate-300 mb-2 line-clamp-2">
                  {signal.content}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${
                      signal.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      signal.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      signal.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {signal.priority}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">
                      {signal.signalType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {signal.responses.length} responses
                  </div>
                </div>
              </motion.div>
            ))}

            {activeSignals.length === 0 && (
              <div className="text-center py-8">
                <Radio className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No active signals</p>
                <p className="text-slate-500 text-sm">All agents are quiet</p>
              </div>
            )}
          </div>
        </Card>

        {/* Signal Details */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          {currentSignal ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-green-300">Signal Details</h3>
                {!currentSignal.acknowledged && (
                  <Button
                    onClick={() => handleAcknowledge(currentSignal.id)}
                    disabled={acknowledging}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {acknowledging ? 'Ack...' : 'Acknowledge'}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-blue-300 mb-1">Agent:</div>
                  <div className="text-sm text-slate-300">{currentSignal.agentId}</div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-blue-300 mb-1">Type:</div>
                  <div className="flex items-center gap-2">
                    {getSignalIcon(currentSignal.signalType)}
                    <span className="text-sm text-slate-300 capitalize">
                      {currentSignal.signalType.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-blue-300 mb-1">Content:</div>
                  <div className="text-sm text-slate-300 bg-slate-700 p-3 rounded">
                    {currentSignal.content}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-blue-300 mb-1">Priority:</div>
                  <span className={`text-sm px-2 py-1 rounded capitalize ${
                    currentSignal.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    currentSignal.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    currentSignal.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {currentSignal.priority}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-semibold text-blue-300 mb-1">Timestamp:</div>
                  <div className="text-sm text-slate-300">
                    {currentSignal.timestamp.toLocaleString()}
                  </div>
                </div>

                {/* Responses */}
                <div>
                  <div className="text-sm font-semibold text-purple-300 mb-2">
                    Responses ({currentSignal.responses.length})
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {currentSignal.responses.map((response) => (
                      <div key={response.id} className="p-2 bg-slate-700 rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-blue-300">
                            {response.respondingAgentId}
                          </span>
                          <span className="text-slate-400">
                            {response.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-slate-300">{response.content}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Form */}
                <div className="pt-4 border-t border-slate-600">
                  <div className="text-sm font-semibold text-green-300 mb-2">Respond</div>
                  <select
                    value={responseForm.responseType}
                    onChange={(e) => setResponseForm(prev => ({ 
                      ...prev, 
                      responseType: e.target.value as any 
                    }))}
                    className="w-full bg-slate-600 text-white p-2 rounded border border-slate-500 mb-2 text-sm"
                  >
                    <option value="acknowledgment">Acknowledgment</option>
                    <option value="question">Question</option>
                    <option value="coordination">Coordination</option>
                    <option value="conflict">Conflict</option>
                  </select>
                  <textarea
                    placeholder="Response content..."
                    value={responseForm.content}
                    onChange={(e) => setResponseForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-slate-600 text-white p-2 rounded border border-slate-500 mb-2 text-sm"
                    rows={2}
                  />
                  <Button
                    onClick={handleRespond}
                    disabled={responding || !responseForm.content}
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {responding ? 'Sending...' : 'Send Response'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Select a signal</p>
              <p className="text-slate-500 text-sm">Choose a signal to view details and respond</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AgentSignalPanel;
