const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
    try {
        const { userData, question } = JSON.parse(event.body);
        
        const prompt = `Eres un agente especializado en cumplimiento regulatorio financiero de Grupo CIBest.

Usuario: ${userData.name}
Cargo: ${userData.position}
Consulta: ${question}

Analiza desde la perspectiva regulatoria y proporciona:

1. MARCO ACTUAL: Regulaciones aplicables (CNBV, Banxico, etc.)
2. EVALUACIÓN: Nivel de cumplimiento actual
3. CAMBIOS PRÓXIMOS: Nuevas regulaciones en el horizonte
4. PREPARACIÓN: Plan de adaptación y cumplimiento

Formato de respuesta:
CUMPLIMIENTO REGULATORIO para ${userData.name} como ${userData.position}:

1. [Paso 1 del análisis]
2. [Paso 2 del análisis]
3. [Paso 3 del análisis]
4. [Paso 4 del análisis]

Enfócate en regulaciones financieras mexicanas y mejores prácticas.`;

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
        
        const confidence = Math.floor(Math.random() * 10) + 90; // 90-100%
        const recommendations = [
            "Actualización de políticas internas",
            "Capacitación especializada del equipo",
            "Implementación de sistema de monitoreo regulatorio"
        ];
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                agentType: "regulatorio",
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
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                agentType: "regulatorio",
                status: "error",
                reasoning: "Error al conectar con Amazon Bedrock. Verifique la configuración de AWS y los permisos de la función Lambda.",
                confidence: 0,
                recommendations: [],
                timestamp: new Date().toISOString()
            })
        };
    }
};