'use client';

interface EmailMockupProps {
  userData: { name: string; email: string; position: string };
  goToRegistration: () => void;
}

export default function EmailMockup({ userData, goToRegistration }: EmailMockupProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border border-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-1">Grupo CIBest</h1>
        <p className="text-orange-500 font-medium mb-4">Powered by AWS</p>
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
          <p>Hola {userData.name},</p>
          <p>Gracias por participar en nuestra demo interactiva. Aquí tienes un resumen personalizado basado en tu consulta:</p>
          <p><strong>Resumen de hallazgos actuales:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Cliente en buen estado general.</li>
            <li>Riesgos identificados en algunas filiales.</li>
          </ul>
          <p><strong>Proyección prospectiva personalizada:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Crecimiento esperado en Nequi.</li>
            <li>Recomendaciones para mitigar riesgos.</li>
          </ul>
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
