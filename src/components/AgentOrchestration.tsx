'use client';

import { useEffect, useState } from 'react';
import { orchestrateAgents, invokeAgent } from '../services/aws-service';

interface AgentOrchestrationProps {
  userData: { name: string; email: string; position: string };
  question: string;
  setAnalysisResult: (result: any) => void;
  nextStep: () => void;
}

interface AgentResult {
  agentType: string;
  status: string;
  reasoning: string;
  analysis?: string;
  projections?: string;
  recommendations?: string[];
  confidence: number;
  timestamp: string;
}

const agents = [
  { name: 'Documental', icon: '📄', type: 'documental', color: 'bg-blue-50 border-blue-400 shadow-blue-100' },
  { name: 'Riesgo', icon: '⚠️', type: 'riesgo', color: 'bg-orange-50 border-orange-400 shadow-orange-100' },
  { name: 'Regulatorio', icon: '📋', type: 'regulatorio', color: 'bg-green-50 border-green-400 shadow-green-100' },
  { name: 'Negocio', icon: '💼', type: 'negocio', color: 'bg-purple-50 border-purple-400 shadow-purple-100' }
];

export default function AgentOrchestration({ userData, question, setAnalysisResult, nextStep }: AgentOrchestrationProps) {
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [activeAgent, setActiveAgent] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startAnalysis = async () => {
    setHasStarted(true);
    setAnalyzing(true);
    setAgentResults([]);
    
    try {
      // Simular procesamiento visual mientras se ejecuta el orquestador
      const animationPromise = (async () => {
        for (let i = 0; i < agents.length; i++) {
          setActiveAgent(i);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      })();
      
      // Llamar directamente a los agentes individuales
      const agentPromises = agents.map(agent => invokeAgent(agent.type, userData, question));
      
      // Esperar ambas promesas
      const [, agentResults] = await Promise.all([animationPromise, Promise.all(agentPromises)]);
      
      setAgentResults(agentResults);
      
      setAnalyzing(false);
      setIsCompleted(true);
      
    } catch (error) {
      console.error('Agent error:', error);
      setAnalyzing(false);
      setIsCompleted(true);
    }
  };
  
  useEffect(() => {
    if (agentResults.length === agents.length) {
      setAnalysisResult({
        success: true,
        agents: agentResults,
        summary: {
          totalAgents: agentResults.length,
          averageConfidence: agentResults.reduce((acc, r) => acc + (r.confidence || 0), 0) / agentResults.length
        }
      });
    }
  }, [agentResults, setAnalysisResult]);

  return (
    <div className="bg-white agent-card p-8 rounded-xl shadow-xl max-w-7xl w-full border border-gray-100">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <img src="/images/Bintec.webp" alt="Bintec" className="h-8 mr-2"/>
          <span className="text-lg font-bold text-gray-800">x</span>
          <img src="/images/Blend360.webp" alt="Blend360" className="h-8 ml-2"/>
        </div>
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm text-gray-600 mr-2">Powered by</span>
          <img src="/images/Logo-AWS-smile.webp" alt="AWS" className="h-6"/>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Orquestación de Agentes IA</h2>
      </div>
      
      <div className="flex justify-center items-center mb-8">
        <div className="bg-gradient-to-r from-blue-900 to-orange-500 text-white px-6 py-3 rounded-full animate-pulse shadow-lg">
          🤖 Agente Orquestador
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {agents.map((agent, index) => {
          const result = agentResults.find(r => r.agentType === agent.type);
          const isActive = index === activeAgent && analyzing;
          const isCompleted = result?.status === 'completed';
          const showContent = hasStarted;
          
          return (
            <div 
              key={index} 
              className={`p-6 rounded-xl border-2 transition-all shadow-md ${
                isCompleted ? agent.color : 'bg-gray-50 border-gray-300'
              } ${isActive ? 'ring-2 ring-blue-500 shadow-xl transform scale-105' : 'hover:shadow-lg'}`}
            >
              <div className="flex items-center mb-4">
                <div className={`text-3xl mr-3 ${isActive ? 'animate-bounce' : ''}`}>
                  {agent.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{agent.name}</h3>
                  <div className="text-sm">
                    {result?.status === 'error' ? (
                      <span className="text-red-600 font-semibold">⚠ Error</span>
                    ) : isCompleted ? (
                      <span className="text-green-700 font-semibold">✓ Completado</span>
                    ) : isActive ? (
                      <span className="text-blue-700 font-medium">Procesando...</span>
                    ) : (
                      <span className="text-gray-500">En espera</span>
                    )}
                  </div>
                </div>
                {result?.confidence && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-700">
                      {result.confidence}%
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Confianza</div>
                  </div>
                )}
              </div>
              
              {showContent && result && (
                <div className={`p-4 rounded border ${
                  result.status === 'error' ? 'bg-red-50 border-red-200' : 'bg-white'
                }`}>
                  <h4 className="font-medium mb-2 text-gray-800">
                    {result.status === 'error' ? 'Error:' : 'Razonamiento:'}
                  </h4>
                  <div className={`text-sm whitespace-pre-line max-h-32 overflow-y-auto ${
                    result.status === 'error' ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {result.reasoning}
                  </div>
                  
                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <h5 className="font-medium text-xs text-gray-600 mb-1">Recomendaciones:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {result.recommendations.slice(0, 2).map((rec, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {showContent && !result && !analyzing && (
                <div className="bg-gray-100 p-4 rounded border text-center text-sm text-gray-500">
                  Esperando análisis...
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
        {!hasStarted ? (
          <div>
            <p className="text-gray-700 font-medium mb-4">
              Listo para analizar tu consulta con agentes especializados
            </p>
            <button
              onClick={startAnalysis}
              className="bg-gradient-to-r from-blue-900 to-orange-500 hover:from-blue-800 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Iniciar Análisis IA
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 font-medium mb-2">
              {analyzing ? 'Procesando análisis con IA especializada...' : 'Análisis completado - Revisa el razonamiento de cada agente'}
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>Progreso: {agentResults.length} / {agents.length}</span>
              {agentResults.length > 0 && (
                <span>Confianza promedio: {Math.round(agentResults.reduce((acc, r) => acc + (r.confidence || 0), 0) / agentResults.length)}%</span>
              )}
            </div>
            {analyzing && (
              <div className="mb-4 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
            {isCompleted && (
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                → Continuar al Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
