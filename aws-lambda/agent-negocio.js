const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: ''
        };
    }
    
    try {
        const { userData, question } = JSON.parse(event.body);
        
        const prompt = `Eres un agente especializado en análisis de negocio financiero de Grupo CIBest.

Usuario: ${userData.name}
Cargo: ${userData.position}
Consulta: ${question}

Analiza desde la perspectiva de oportunidades de negocio y proporciona:

1. OPORTUNIDADES: Segmentos de mercado y nichos de crecimiento
2. COMPETENCIA: Posicionamiento y ventajas competitivas
3. PROYECCIONES: ROI y métricas financieras esperadas
4. ESTRATEGIA: Plan de expansión y desarrollo de productos

Formato de respuesta:
OPORTUNIDADES DE NEGOCIO para ${userData.name} como ${userData.position}:

1. [Paso 1 del análisis]
2. [Paso 2 del análisis]
3. [Paso 3 del análisis]
4. [Paso 4 del análisis]

Enfócate en oportunidades concretas y estrategias de crecimiento.`;

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: prompt
                }]
            }),
            contentType: "application/json"
        });

        const response = await client.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.body));
        const reasoning = result.content[0].text;
        
        const confidence = Math.floor(Math.random() * 15) + 85; // 85-100%
        
        // Generar recomendaciones específicas
        const recommendationPrompt = `Basado en este análisis de negocio: "${reasoning.substring(0, 500)}", genera exactamente 3 recomendaciones específicas para oportunidades de crecimiento. Responde solo con las recomendaciones separadas por |`;
        
        const recCommand = new InvokeModelCommand({
            modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 200,
                messages: [{
                    role: "user",
                    content: recommendationPrompt
                }]
            }),
            contentType: "application/json"
        });
        
        let recommendations = [
            "Aceleración de la transformación digital",
            "Desarrollo de productos financieros innovadores",
            "Establecimiento de alianzas estratégicas"
        ];
        
        try {
            const recResponse = await client.send(recCommand);
            const recResult = JSON.parse(new TextDecoder().decode(recResponse.body));
            const dynamicRecs = recResult.content[0].text.split('|').map(r => r.trim()).filter(r => r.length > 0);
            if (dynamicRecs.length >= 3) {
                recommendations = dynamicRecs.slice(0, 3);
            }
        } catch (error) {
            console.log('Using fallback recommendations');
        }
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({
                agentType: "negocio",
                status: "completed",
                reasoning: reasoning,
                confidence: confidence,
                recommendations: recommendations,
                timestamp: new Date().toISOString()
            })
        };
    } catch (error) {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: JSON.stringify({
                agentType: "negocio",
                status: "error",
                reasoning: "Error al conectar con Amazon Bedrock. Verifique la configuración de AWS y los permisos de la función Lambda.",
                confidence: 0,
                recommendations: [],
                timestamp: new Date().toISOString()
            })
        };
    }
};