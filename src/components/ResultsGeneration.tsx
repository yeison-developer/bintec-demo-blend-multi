'use client';

import { useState } from 'react';
import { sendEmail, generatePDF } from '../services/aws-service';

interface ResultsGenerationProps {
  userData: { name: string; email: string; position: string };
  question: string;
  analysisResult: any;
  nextStep: () => void;
}

export default function ResultsGeneration({ userData, question, analysisResult, nextStep }: ResultsGenerationProps) {
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      const result = await sendEmail(userData, question, analysisResult);
      if (result.success) {
        setEmailSent(true);
        alert('Correo enviado exitosamente a ' + userData.email);
      } else {
        alert('Error enviando correo: ' + result.error);
      }
    } catch {
      alert('Error enviando correo');
    } finally {
      setSending(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const result = await generatePDF(userData, question);
      if (result.success) {
        window.open(result.pdfUrl, '_blank');
      } else {
        alert('Error generando PDF: ' + result.error);
      }
    } catch {
      alert('Error generando PDF');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <img src="/images/Bintec.webp" alt="Bintec" className="h-8 mr-2"/>
          <span className="text-lg font-bold text-gray-800">x</span>
          <img src="/images/Blend360.webp" alt="Blend360" className="h-8 ml-2"/>
        </div>
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm text-gray-600 mr-2">Powered by</span>
          <img src="/images/Logo-AWS-smile.webp" alt="AWS" className="h-6"/>
        </div>
        <h2 className="text-xl font-semibold">Generación de Resultados</h2>
      </div>
      <p className="mb-6">La IA generó automáticamente un reporte para el analista y un correo de respuesta para el cliente.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-medium mb-4">Preview del Reporte</h3>
          <div className="border p-4 bg-gray-50 max-h-64 overflow-y-auto">
            <p><strong>Reporte Ejecutivo - Análisis IA</strong></p>
            <p><strong>Cliente:</strong> {userData.name} ({userData.position})</p>
            <p><strong>Consulta:</strong> {question}</p>
            <hr className="my-2" />
            {analysisResult?.agents?.map((agent: any, index: number) => (
              <div key={index} className="mb-3">
                <p><strong>{agent.agentType.toUpperCase()}:</strong> {agent.confidence}% confianza</p>
                <p className="text-sm text-gray-600">{agent.reasoning?.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        
        </div>
        <div>
          <h3 className="font-medium mb-4">Preview del Correo</h3>
          <div className="border p-4 bg-gray-50 max-h-64 overflow-y-auto">
            <p><strong>Asunto:</strong> Tu experiencia en el stand – Solución de IA Grupo CIBest</p>
            <p><strong>Para:</strong> {userData.email}</p>
            <p>Estimado/a {userData.name},</p>
            <p className="mt-2">Gracias por tu consulta: "{question}"</p>
            <p className="mt-2"><strong>Resumen ejecutivo:</strong></p>
            {analysisResult?.agents?.slice(0, 2).map((agent: any, index: number) => (
              <p key={index} className="text-sm mt-1">• {agent.agentType}: {agent.reasoning?.substring(0, 100)}...</p>
            ))}
            <p className="mt-2">Confianza promedio: {analysisResult?.summary?.averageConfidence?.toFixed(1)}%</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-900 to-orange-500 text-white p-2 rounded hover:from-blue-800 hover:to-orange-600"
          disabled={sending || emailSent}
        >
          {sending ? 'Enviando...' : emailSent ? 'Correo Enviado' : 'Enviar automáticamente'}
        </button>
        <button
          onClick={nextStep}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded hover:from-green-700 hover:to-green-800"
        >
          Continuar
        </button>
      </div>
      {sending && <p className="mt-4 text-center animate-pulse">Enviando correo...</p>}
      {emailSent && <p className="mt-4 text-center text-green-600">✅ Correo enviado exitosamente</p>}
    </div>
  );
}
