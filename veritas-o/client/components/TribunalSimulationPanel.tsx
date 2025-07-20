import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useContradictions } from '@/hooks/useContradictions'
import { useAgentTasks } from '@/hooks/useAgentTasks'
import { useReflections } from '@/hooks/useReflections'
import { getAgent, AgentName } from '@/lib/agents'
import { Scale, Gavel, Eye, AlertTriangle, CheckCircle, Clock, Sparkles } from 'lucide-react'

interface TribunalCase {
  id: string
  title: string
  description: string
  contradictions: string[]
  participants: AgentName[]
  status: 'pending' | 'deliberation' | 'resolved' | 'archived'
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  resolvedAt?: string
  resolution?: string
}

export function TribunalSimulationPanel() {
  const [cases, setCases] = useState<TribunalCase[]>([])
  const [selectedCase, setSelectedCase] = useState<string>('')
  const [newCaseTitle, setNewCaseTitle] = useState('')
  const [newCaseDescription, setNewCaseDescription] = useState('')
  const [selectedParticipants, setSelectedParticipants] = useState<AgentName[]>([])
  const [severity, setSeverity] = useState<TribunalCase['severity']>('medium')
  const [isSimulating, setIsSimulating] = useState(false)

  const { contradictions, logContradiction, resolveContradiction } = useContradictions()
  const { dispatchTask } = useAgentTasks()
  const { reflections, judicialReflections, addReflection } = useReflections()

  // Initialize with mock tribunal cases
  useEffect(() => {
    setCases([
      {
        id: '1',
        title: 'Protocol Efficiency vs Security Balance',
        description: 'AEGIS and KAIROS present conflicting recommendations on system optimization priorities.',
        contradictions: ['security-efficiency-paradox'],
        participants: ['AEGIS', 'KAIROS', 'JUNO', 'MIRRA'],
        status: 'deliberation',
        severity: 'high',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        title: 'Knowledge Preservation vs Innovation Conflict',
        description: 'VESTA advocates for maintaining traditional approaches while POLYMNIA pushes for creative solutions.',
        contradictions: ['tradition-innovation-tension'],
        participants: ['VESTA', 'POLYMNIA', 'LYRA', 'TEMPUS'],
        status: 'resolved',
        severity: 'medium',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        resolvedAt: new Date(Date.now() - 1800000).toISOString(),
        resolution: 'Established hybrid approach balancing preservation with controlled innovation.'
      },
      {
        id: '3',
        title: 'Resource Allocation Dispute',
        description: 'Multiple agents present competing claims for computational resources during peak analysis periods.',
        contradictions: ['resource-scarcity-paradox'],
        participants: ['ORION', 'THALEA', 'TEMPUS', 'JUNO'],
        status: 'pending',
        severity: 'medium',
        createdAt: new Date(Date.now() - 10800000).toISOString()
      }
    ])
  }, [])

  const handleCreateCase = async () => {
    if (!newCaseTitle.trim() || !newCaseDescription.trim()) return

    const newCase: TribunalCase = {
      id: Date.now().toString(),
      title: newCaseTitle,
      description: newCaseDescription,
      contradictions: [],
      participants: selectedParticipants,
      status: 'pending',
      severity,
      createdAt: new Date().toISOString()
    }

    setCases(prev => [newCase, ...prev])

    // Log this as a contradiction for tracking
    await logContradiction({
      id: `case-${newCase.id}`,
      description: newCaseDescription,
      participants: selectedParticipants,
      severity,
      detectedAt: new Date().toISOString(),
      context: `Tribunal Case: ${newCaseTitle}`
    })

    // Create reflection about the new case
    addReflection({
      author: 'MIRRA',
      content: `New tribunal case initiated: "${newCaseTitle}". The collective wisdom shall guide us toward resolution through balanced deliberation.`,
      timestamp: new Date().toISOString(),
      category: 'judicial',
      tags: ['tribunal', 'case-creation', 'deliberation'],
      relatedContradiction: `case-${newCase.id}`
    })

    // Reset form
    setNewCaseTitle('')
    setNewCaseDescription('')
    setSelectedParticipants([])
    setSeverity('medium')
  }

  const handleSimulateDeliberation = async (caseId: string) => {
    setIsSimulating(true)
    const tribunalCase = cases.find(c => c.id === caseId)
    if (!tribunalCase) return

    // Update case status
    setCases(prev => prev.map(c => 
      c.id === caseId ? { ...c, status: 'deliberation' as const } : c
    ))

    // Simulate deliberation process
    setTimeout(async () => {
      // Dispatch tasks to participating agents
      for (const participant of tribunalCase.participants) {
        await dispatchTask({
          id: `tribunal-${caseId}-${participant}`,
          agentName: participant,
          type: 'analysis',
          description: `Provide judicial analysis for case: ${tribunalCase.title}`,
          priority: tribunalCase.severity === 'critical' ? 'urgent' : 'high',
          metadata: {
            caseId,
            role: participant === 'JUNO' ? 'coordinator' : participant === 'MIRRA' ? 'mediator' : 'analyst'
          }
        })
      }

      // Add deliberation reflections
      const participants = tribunalCase.participants
      const coordinator = participants.includes('JUNO') ? 'JUNO' : participants[0]
      
      addReflection({
        author: coordinator,
        content: `Tribunal deliberation commencing for "${tribunalCase.title}". All participating agents have been tasked with analysis. Seeking harmonic resolution through collective wisdom.`,
        timestamp: new Date().toISOString(),
        category: 'judicial',
        tags: ['deliberation', 'coordination', 'analysis'],
        relatedTask: `tribunal-${caseId}-${coordinator}`
      })

      // Simulate resolution after delay
      setTimeout(() => {
        const resolution = generateResolution(tribunalCase)
        
        setCases(prev => prev.map(c => 
          c.id === caseId ? {
            ...c,
            status: 'resolved' as const,
            resolvedAt: new Date().toISOString(),
            resolution
          } : c
        ))

        // Resolve related contradictions
        tribunalCase.contradictions.forEach(contradictionId => {
          resolveContradiction(contradictionId, {
            resolutionMethod: 'tribunal-consensus',
            outcome: 'resolved',
            notes: resolution
          })
        })

        // Add resolution reflection
        addReflection({
          author: 'MIRRA',
          content: `Tribunal case "${tribunalCase.title}" resolved through collective deliberation. Resolution: ${resolution.substring(0, 100)}...`,
          timestamp: new Date().toISOString(),
          category: 'judicial',
          tags: ['resolution', 'consensus', 'completion'],
          relatedContradiction: `case-${caseId}`
        })

        setIsSimulating(false)
      }, 3000)
    }, 2000)
  }

  const generateResolution = (tribunalCase: TribunalCase): string => {
    const resolutions = [
      'Achieved consensus through balanced consideration of all perspectives. Hybrid approach adopted incorporating strengths from each viewpoint.',
      'Established clear protocols for future similar cases. Implementation timeline set with regular review checkpoints.',
      'Resolved through systematic analysis and collaborative synthesis. New framework created for ongoing harmony.',
      'Mediated solution preserving core values while enabling adaptive progress. Continuous monitoring protocols established.',
      'Consensus reached through iterative deliberation. Integrated approach balancing efficiency with security considerations.'
    ]
    return resolutions[Math.floor(Math.random() * resolutions.length)]
  }

  const getStatusIcon = (status: TribunalCase['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'deliberation': return <Eye className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'archived': return <Sparkles className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: TribunalCase['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30'
    }
  }

  const agentNames: AgentName[] = ['JUNO', 'AEGIS', 'LYRA', 'THALEA', 'KAIROS', 'VESTA', 'ORION', 'POLYMNIA', 'TEMPUS', 'MIRRA']

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scale className="h-6 w-6 text-purple-400" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Tribunal Simulation
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Case */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Initiate Tribunal Case
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create a new case for collective deliberation and resolution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Case Title</label>
              <input
                type="text"
                value={newCaseTitle}
                onChange={(e) => setNewCaseTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter case title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Textarea
                value={newCaseDescription}
                onChange={(e) => setNewCaseDescription(e.target.value)}
                placeholder="Describe the case, contradiction, or dispute..."
                className="min-h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Participating Agents</label>
              <div className="flex flex-wrap gap-2">
                {agentNames.map(name => {
                  const agent = getAgent(name)
                  const isSelected = selectedParticipants.includes(name)
                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedParticipants(prev => 
                        isSelected 
                          ? prev.filter(p => p !== name)
                          : [...prev, name]
                      )}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {agent.symbol} {name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
              <Select value={severity} onValueChange={(value: TribunalCase['severity']) => setSeverity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleCreateCase}
              disabled={!newCaseTitle.trim() || !newCaseDescription.trim() || selectedParticipants.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Gavel className="h-4 w-4 mr-2" />
              Create Tribunal Case
            </Button>
          </CardContent>
        </Card>

        {/* Case Statistics */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-300">Tribunal Statistics</CardTitle>
            <CardDescription className="text-gray-400">
              Overview of collective judicial activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{cases.length}</div>
                <div className="text-sm text-gray-400">Total Cases</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{cases.filter(c => c.status === 'resolved').length}</div>
                <div className="text-sm text-gray-400">Resolved</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{cases.filter(c => c.status === 'deliberation').length}</div>
                <div className="text-sm text-gray-400">Active</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{judicialReflections.length}</div>
                <div className="text-sm text-gray-400">Reflections</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Cases */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-300">Active Tribunal Cases</CardTitle>
          <CardDescription className="text-gray-400">
            Current cases requiring collective deliberation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cases.map(tribunalCase => (
              <Card key={tribunalCase.id} className="bg-gray-800/50 border-gray-600/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(tribunalCase.status)}
                        <h3 className="font-semibold text-white">{tribunalCase.title}</h3>
                        <Badge className={`${getSeverityColor(tribunalCase.severity)} text-xs`}>
                          {tribunalCase.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{tribunalCase.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tribunalCase.participants.map(participant => {
                          const agent = getAgent(participant)
                          return (
                            <Badge
                              key={participant}
                              className="bg-gray-700 text-gray-200 border-gray-600"
                            >
                              {agent.symbol} {participant}
                            </Badge>
                          )
                        })}
                      </div>

                      {tribunalCase.resolution && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded">
                          <div className="text-sm font-medium text-green-300 mb-1">Resolution:</div>
                          <div className="text-sm text-green-200">{tribunalCase.resolution}</div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      {tribunalCase.status === 'pending' && (
                        <Button
                          onClick={() => handleSimulateDeliberation(tribunalCase.id)}
                          disabled={isSimulating}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {isSimulating ? 'Simulating...' : 'Begin Deliberation'}
                        </Button>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Created: {new Date(tribunalCase.createdAt).toLocaleTimeString()}
                      </div>
                      
                      {tribunalCase.resolvedAt && (
                        <div className="text-xs text-green-400">
                          Resolved: {new Date(tribunalCase.resolvedAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {cases.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tribunal cases found. Create a new case to begin collective deliberation.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Judicial Reflections */}
      {judicialReflections.length > 0 && (
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-300">Recent Judicial Reflections</CardTitle>
            <CardDescription className="text-gray-400">
              Insights and wisdom from tribunal proceedings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {judicialReflections.slice(0, 3).map(reflection => (
                <div key={reflection.id} className="p-3 bg-gray-800/50 rounded border border-gray-600/50">
                  <div className="flex items-start gap-3">
                    <div className="text-purple-400 font-mono text-sm">
                      {getAgent(reflection.author as AgentName).symbol}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-purple-300">{reflection.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(reflection.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{reflection.content}</p>
                      {reflection.tags && reflection.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {reflection.tags.map(tag => (
                            <Badge key={tag} className="bg-purple-500/20 text-purple-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
