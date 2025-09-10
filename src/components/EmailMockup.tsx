'use client';

interface EmailMockupProps {
  userData: { name: string; email: string; position: string };
  question: string;
  analysisResult: any;
  goToRegistration: () => void;
}

export default function EmailMockup({ userData, question, analysisResult, goToRegistration }: EmailMockupProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border border-gray-100">
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
        <h2 className="text-xl font-semibold text-gray-800">Correo Recibido</h2>
      </div>
      <div className="border p-6 bg-gray-50">
        <div className="mb-4">
          <strong>Asunto:</strong> Tu experiencia en el stand – Solución de IA Grupo CIBest
        </div>
        <div className="mb-4">
          <strong>De:</strong> no-reply@cibest.com
        </div>
        <div className="mb-4">
          <strong>Para:</strong> {userData.email}
        </div>
        <div className="space-y-4">
          <p>Estimado/a {userData.name},</p>
          <p>Gracias por participar en nuestra demo interactiva. Aquí tienes un resumen personalizado basado en tu consulta:</p>
          <p><strong>“{question}”</strong></p>
          
          <p><strong>Resumen de hallazgos por nuestros agentes IA:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            {analysisResult?.agents?.map((agent: any, index: number) => (
              <li key={index}>
                <strong>{agent.agentType.charAt(0).toUpperCase() + agent.agentType.slice(1)}:</strong> {agent.reasoning?.substring(0, 120)}...
              </li>
            ))}
          </ul>
          
          <p><strong>Recomendaciones principales:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            {analysisResult?.agents?.flatMap((agent: any) => agent.recommendations || []).slice(0, 4).map((rec: string, index: number) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
          
          <p><strong>Confianza del análisis:</strong> {analysisResult?.summary?.averageConfidence?.toFixed(1)}%</p>
          <p>Mensaje de cierre: Gracias por explorar con nosotros cómo la IA y AWS transforman el futuro financiero.</p>
          <p>Atentamente,<br />Equipo Grupo CIBest</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4">¡Experiencia completada! Gracias por participar.</p>
        <button
          onClick={goToRegistration}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🔄 Nueva Experiencia
        </button>
      </div>
    </div>
  );
}
