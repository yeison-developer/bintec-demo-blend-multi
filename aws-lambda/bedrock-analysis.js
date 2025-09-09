const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const client = new BedrockRuntimeClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    try {
        const { question, userData } = JSON.parse(event.body);
        
        const prompt = `Eres un analista financiero experto de Grupo CIBest. 
        
Cliente: ${userData.name} (${userData.position})
Pregunta: ${question}

Proporciona un análisis financiero profesional que incluya:
1. Análisis de la situación actual
2. Identificación de riesgos y oportunidades  
3. Proyección prospectiva específica
4. Recomendaciones estratégicas

Responde de forma concisa y profesional en español.`;

        const params = {
            modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: prompt
                }]
            })
        };

        const command = new InvokeModelCommand(params);
        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST'
            },
            body: JSON.stringify({
                success: true,
                analysis: responseBody.content[0].text,
                prospectiveData: generateProspectiveData(question)
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};

function generateProspectiveData(question) {
    // Generar datos prospectivos basados en la pregunta
    const baseGrowth = Math.random() * 20 + 5; // 5-25%
    
    return {
        growthProjection: `${baseGrowth.toFixed(1)}%`,
        riskLevel: question.toLowerCase().includes('riesgo') ? 'Alto' : 'Medio',
        timeframe: '12 meses',
        confidence: '85%',
        keyMetrics: [
            { name: 'ROI Proyectado', value: `${(baseGrowth * 0.8).toFixed(1)}%` },
            { name: 'Reducción de Costos', value: `${(Math.random() * 15 + 5).toFixed(1)}%` },
            { name: 'Eficiencia Operativa', value: `+${(Math.random() * 30 + 10).toFixed(0)}%` }
        ]
    };
}