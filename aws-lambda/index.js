const https = require('https');

// Función para llamar a los agentes reales
const callAgent = async (agentType, userData, question) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ userData, question });
        
        const options = {
            hostname: 'zz7s9c3k78.execute-api.us-east-1.amazonaws.com',
            port: 443,
            path: `/prod/agent-${agentType}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve(result);
                } catch (error) {
                    resolve({
                        agentType,
                        status: 'error',
                        reasoning: `Error parsing response from ${agentType} agent`,
                        confidence: 0,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            resolve({
                agentType,
                status: 'error', 
                reasoning: `Error connecting to ${agentType} agent: ${error.message}`,
                confidence: 0,
                timestamp: new Date().toISOString()
            });
        });
        
        req.write(data);
        req.end();
    });
};

// Configuración de agentes para simulación

exports.handler = async (event) => {
    try {
        const { userData, question } = JSON.parse(event.body);
        
        // Llamar a los agentes reales con Bedrock
        const agentTypes = ['documental', 'riesgo', 'regulatorio', 'negocio'];
        const agentPromises = agentTypes.map(agentType => callAgent(agentType, userData, question));
        
        const agentResults = await Promise.all(agentPromises);
        
        // Consolidar resultados
        const consolidatedAnalysis = {
            success: true,
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
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "POST,OPTIONS"
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
                success: false,
                error: 'Orchestration failed',
                message: error.message
            })
        };
    }
};