'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConsolidatedDashboardProps {
  analysisResult?: any;
  nextStep: () => void;
}

const businessData = [
  { name: 'Bancolombia', status: 'Activo', risk: 'Bajo' },
  { name: 'Nequi', status: 'Crecimiento', risk: 'Medio' },
  { name: 'Fiduciaria', status: 'Estable', risk: 'Bajo' },
  { name: 'Leasing', status: 'Activo', risk: 'Alto' },
  { name: 'Sufi', status: 'Riesgo', risk: 'Alto' },
  { name: 'Banistmo', status: 'Activo', risk: 'Medio' },
  { name: 'BAM', status: 'Estable', risk: 'Bajo' },
  { name: 'Banco Agrícola', status: 'Crecimiento', risk: 'Medio' }
];

const projectionData = [
  { month: 'Ene', nequi: 100, suficiencia: 95 },
  { month: 'Feb', nequi: 110, suficiencia: 92 },
  { month: 'Mar', nequi: 120, suficiencia: 90 },
  { month: 'Abr', nequi: 130, suficiencia: 88 }
];

const recommendations = [
  'Oportunidad de inversión fiduciaria',
  'Monitorear clientes en riesgo alto'
];

export default function ConsolidatedDashboard({ analysisResult, nextStep }: ConsolidatedDashboardProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full">
      <h2 className="text-xl font-semibold mb-6">Dashboard Consolidado</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-medium mb-4">Estado Actual - Matriz de Negocios</h3>
          <div className="space-y-2">
            {businessData.map((biz, index) => (
              <div key={index} className="flex justify-between p-2 border rounded">
                <span>{biz.name}</span>
                <span className={`px-2 py-1 rounded text-sm ${biz.risk === 'Alto' ? 'bg-red-100 text-red-800' : biz.risk === 'Medio' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {biz.status} - {biz.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-4">Proyecciones Prospectivas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="nequi" stroke="#8884d8" />
              <Line type="monotone" dataKey="suficiencia" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-medium mb-4">Análisis IA + Recomendaciones</h3>
        {analysisResult?.analysis && (
          <div className="bg-blue-50 p-4 rounded mb-4">
            <h4 className="font-medium text-blue-800 mb-2">Análisis Prospectivo:</h4>
            <p className="text-sm text-blue-700">{analysisResult.analysis}</p>
          </div>
        )}
        {analysisResult?.prospectiveData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-green-600">Crecimiento Proyectado</p>
              <p className="font-bold text-green-800">{analysisResult.prospectiveData.growthProjection}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-sm text-yellow-600">Nivel de Riesgo</p>
              <p className="font-bold text-yellow-800">{analysisResult.prospectiveData.riskLevel}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm text-purple-600">Marco Temporal</p>
              <p className="font-bold text-purple-800">{analysisResult.prospectiveData.timeframe}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-600">Confianza</p>
              <p className="font-bold text-blue-800">{analysisResult.prospectiveData.confidence}</p>
            </div>
          </div>
        )}
        <ul className="list-disc list-inside space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={nextStep}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Continuar
      </button>
    </div>
  );
}
