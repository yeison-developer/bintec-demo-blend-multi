'use client';

import { useState } from 'react';
import { sendEmail, generatePDF } from '../services/aws-service';

interface ResultsGenerationProps {
  userData: { name: string; email: string; position: string };
  question: string;
  nextStep: () => void;
}

export default function ResultsGeneration({ userData, question, nextStep }: ResultsGenerationProps) {
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      const result = await sendEmail(userData, question);
      if (result.success) {
        setEmailSent(true);
        alert('Correo enviado exitosamente a ' + userData.email);
      } else {
        alert('Error enviando correo: ' + result.error);
      }
    } catch (error) {
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
    } catch (error) {
      alert('Error generando PDF');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
      <h2 className="text-xl font-semibold mb-6">Generación de Resultados</h2>
      <p className="mb-6">La IA generó automáticamente un reporte para el analista y un correo de respuesta para el cliente.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-medium mb-4">Preview del Reporte PDF</h3>
          <div className="border p-4 bg-gray-50">
            <p><strong>Reporte Ejecutivo</strong></p>
            <p>Cliente: {userData.name}</p>
            <p>Pregunta: {question}</p>
            <p>Hallazgos: Análisis completado.</p>
          </div>
          <button
            onClick={downloadPDF}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Descargar PDF
          </button>
        </div>
        <div>
          <h3 className="font-medium mb-4">Preview del Correo</h3>
          <div className="border p-4 bg-gray-50">
            <p><strong>Asunto:</strong> Tu experiencia en el stand – Solución de IA Grupo CIBest</p>
            <p><strong>Para:</strong> {userData.email}</p>
            <p>Hola {userData.name},</p>
            <p>Resumen de hallazgos actuales...</p>
            <p>Proyección prospectiva personalizada...</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={sending || emailSent}
        >
          {sending ? 'Enviando...' : emailSent ? 'Correo Enviado' : 'Enviar automáticamente'}
        </button>
        <button
          onClick={nextStep}
          className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
        >
          Continuar
        </button>
      </div>
      {sending && <p className="mt-4 text-center animate-pulse">Enviando correo...</p>}
      {emailSent && <p className="mt-4 text-center text-green-600">✅ Correo enviado exitosamente</p>}
    </div>
  );
}
