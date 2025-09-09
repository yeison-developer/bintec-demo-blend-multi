const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'us-east-1' });

const AGENT_FUNCTIONS = {
    documental: 'agent-documental',
    riesgo: 'agent-riesgo', 
    regulatorio: 'agent-regulatorio',
    negocio: 'agent-negocio'
};

exports.handler = async (event) => {
    try {
        const { userData, question } = JSON.parse(event.body);
        
        // Ejecutar todos los agentes en paralelo
        const agentPromises = Object.entries(AGENT_FUNCTIONS).map(async ([agentType, functionName]) => {
            try {
                const params = {
                    FunctionName: functionName,
                    Payload: JSON.stringify({
                        body: JSON.stringify({ userData, question })
                    })
                };
                
                const result = await lambda.invoke(params).promise();
                const response = JSON.parse(result.Payload);
                return JSON.parse(response.body);
            } catch (error) {
                console.error(`Error invoking ${agentType}:`, error);
                return {
                    agentType,
                    status: 'error',
                    error: error.message
                };
            }
        });
        
        const agentResults = await Promise.all(agentPromises);
        
        // Consolidar resultados
        const consolidatedAnalysis = {
            orchestrationId: `orch_${Date.now()}`,
            timestamp: new Date().toISOString(),
            userData,
            question,
            agents: agentResults,
            summary: {
                totalAgents: agentResults.length,
                completedAgents: agentResults.filter(r => r.status === 'completed').length,
                averageConfidence: agentResults
                    .filter(r => r.confidence)
                    .reduce((acc, r) => acc + r.confidence, 0) / 
                    agentResults.filter(r => r.confidence).length || 0
            }
        };
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(consolidatedAnalysis)
        };
        
    } catch (error) {
        console.error('Orchestration error:', error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                error: 'Orchestration failed',
                message: error.message
            })
        };
    }
};