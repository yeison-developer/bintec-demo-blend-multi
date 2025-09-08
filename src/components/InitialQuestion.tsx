'use client';

import { useState } from 'react';

interface InitialQuestionProps {
  question: string;
  setQuestion: (q: string) => void;
  nextStep: () => void;
}

const suggestions = [
  "Dame una visión consolidada de este cliente en todo el Grupo CIBest",
  "¿Qué riesgos regulatorios y financieros tiene este cliente en todas las filiales?",
  "Genera un reporte ejecutivo para el comité del Grupo",
  "Simula qué pasaría si aumenta la tasa de interés 100 pb"
];

export default function InitialQuestion({ question, setQuestion, nextStep }: InitialQuestionProps) {
  const [inputQuestion, setInputQuestion] = useState(question);

  const handleSubmit = () => {
    setQuestion(inputQuestion);
    nextStep();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-xl font-semibold mb-4">Formula tu pregunta a la IA</h2>
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
        placeholder="Escribe tu pregunta aquí..."
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        disabled={!inputQuestion.trim()}
      >
        Enviar pregunta
      </button>
    </div>
  );
}
