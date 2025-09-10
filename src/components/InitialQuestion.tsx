'use client';

import { useState } from 'react';

interface InitialQuestionProps {
  question: string;
  setQuestion: (q: string) => void;
  nextStep: () => void;
}

const suggestions = [
  "¿Cómo evolucionará la banca de Bancolombia en los próximos 5 años con IA y tecnología cuántica?",
  "¿Qué impacto tendrán los agentes de IA en la rentabilidad de Bancolombia para 2030?",
  "¿Cómo afectará la criptografía poscuántica a la seguridad bancaria de Bancolombia?",
  "¿Qué escenarios de riesgo digital enfrentará Bancolombia en la próxima década?"
];

export default function InitialQuestion({ question, setQuestion, nextStep }: InitialQuestionProps) {
  const [inputQuestion, setInputQuestion] = useState(question);

  const handleSubmit = () => {
    setQuestion(inputQuestion);
    nextStep();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <img src="/images/Bintec.webp" alt="Bintec" className="h-12 mr-4"/>
          <span className="text-2xl font-bold text-gray-800">2025</span>
        </div>
        <p className="text-orange-500 font-medium mb-2">Tecnología que conecta, innovación que transforma</p>
        <h2 className="text-xl font-semibold text-gray-800">Análisis Prospectivo con IA Especializada</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {suggestions.map((sug, index) => (
          <div
            key={index}
            className="p-4 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => setInputQuestion(sug)}
          >
            {sug}
          </div>
        ))}
      </div>
      <textarea
        value={inputQuestion}
        onChange={(e) => setInputQuestion(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="Consulta sobre el futuro de la banca, escenarios prospectivos, tendencias tecnológicas..."
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded hover:from-orange-600 hover:to-red-600"
        disabled={!inputQuestion.trim()}
      >
        Enviar pregunta
      </button>
    </div>
  );
}
