'use client';

import { useEffect, useState } from 'react';

interface AgentOrchestrationProps {
  nextStep: () => void;
}

const agents = [
  { name: 'Documental', icon: '📄', response: 'Procesando documentos...' },
  { name: 'Riesgo', icon: '⚠️', response: 'Evaluando riesgos...' },
  { name: 'Regulatorio', icon: '📋', response: 'Verificando regulaciones...' },
  { name: 'Negocio', icon: '💼', response: 'Analizando negocio...' }
];

export default function AgentOrchestration({ nextStep }: AgentOrchestrationProps) {
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 2000);
    setTimeout(() => {
      clearInterval(interval);
      nextStep();
    }, 10000);
    return () => clearInterval(interval);
  }, [nextStep]);

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
      <p className="mt-6 text-gray-600">Procesando tu consulta...</p>
    </div>
  );
}
