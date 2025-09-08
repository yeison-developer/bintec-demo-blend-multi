'use client';

import { useEffect, useState } from 'react';
import { analyzeWithBedrock } from '../services/aws-service';

interface AgentOrchestrationProps {
  userData: { name: string; email: string; position: string };
  question: string;
  setAnalysisResult: (result: any) => void;
  nextStep: () => void;
}

const agents = [
  { name: 'Documental', icon: '📄', response: 'Procesando documentos...' },
  { name: 'Riesgo', icon: '⚠️', response: 'Evaluando riesgos...' },
  { name: 'Regulatorio', icon: '📋', response: 'Verificando regulaciones...' },
  { name: 'Negocio', icon: '💼', response: 'Analizando negocio...' }
];

export default function AgentOrchestration({ userData, question, setAnalysisResult, nextStep }: AgentOrchestrationProps) {
  const [activeAgent, setActiveAgent] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 2000);
    
    // Iniciar análisis con Bedrock
    const performAnalysis = async () => {
      setAnalyzing(true);
      try {
        const result = await analyzeWithBedrock(userData, question);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Error en análisis:', error);
        // Fallback con datos mock
        setAnalysisResult({
          success: true,
          analysis: 'Análisis completado con datos simulados',
          prospectiveData: {
            growthProjection: '15.2%',
            riskLevel: 'Medio',
            timeframe: '12 meses',
            confidence: '85%'
          }
        });
      }
      setAnalyzing(false);
    };
    
    performAnalysis();
    
    setTimeout(() => {
      clearInterval(interval);
      nextStep();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [userData, question, setAnalysisResult, nextStep]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full text-center">
      <h2 className="text-xl font-semibold mb-6">Orquestación de Agentes</h2>
      <div className="flex justify-center items-center mb-8">
        <div className="bg-blue-600 text-white p-4 rounded-full">
          🤖 Agente Orquestador
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {agents.map((agent, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`text-4xl mb-2 ${index === activeAgent ? 'animate-bounce' : ''}`}>
              {agent.icon}
            </div>
            <p className="font-medium">{agent.name}</p>
            <div className={`mt-2 p-2 bg-gray-100 rounded ${index === activeAgent ? 'bg-yellow-100' : ''}`}>
              {agent.response}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-gray-600">
        {analyzing ? 'Analizando con IA...' : 'Procesando tu consulta...'}
      </p>
      {analyzing && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
