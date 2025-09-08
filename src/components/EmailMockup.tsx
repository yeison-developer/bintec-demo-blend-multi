'use client';

interface EmailMockupProps {
  userData: { name: string; email: string; position: string };
}

export default function EmailMockup({ userData }: EmailMockupProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-xl font-semibold mb-6">Correo Recibido</h2>
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
      <p className="mt-6 text-center text-gray-600">¡Experiencia completada! Gracias por participar.</p>
    </div>
  );
}
