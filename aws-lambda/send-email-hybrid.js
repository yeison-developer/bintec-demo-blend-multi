const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({ region: "us-east-1" });

exports.handler = async (event) => {
    try {
        const { email, name, question, reportData, analysisResult } = JSON.parse(event.body);
        
        // Lista de emails verificados que pueden recibir correos reales
        const verifiedEmails = [
            'juan.tinjaca@blend360.com',
            'juansebas1307@gmail.com'
        ];
        
        const isVerified = verifiedEmails.includes(email.toLowerCase());
        
        if (isVerified) {
            // Enviar correo real para emails verificados
            const emailParams = {
                Destination: { ToAddresses: [email] },
                Message: {
                    Body: {
                        Html: {
                            Data: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px;">
                                        <div style="margin-bottom: 15px;">
                                            <img src="https://bintec-demo-reports-809263605159-bintec-agents.s3.amazonaws.com/Bintec.webp" alt="Bintec" style="height: 40px; margin-right: 10px; vertical-align: middle;"/>
                                            <span style="font-size: 18px; font-weight: bold; color: #374151; margin: 0 10px; vertical-align: middle;">x</span>
                                            <img src="https://bintec-demo-reports-809263605159-bintec-agents.s3.amazonaws.com/Blend360.webp" alt="Blend360" style="height: 40px; margin-left: 10px; vertical-align: middle;"/>
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                            <span style="font-size: 14px; color: #6b7280; margin-right: 8px;">Powered by</span>
                                            <img src="https://bintec-demo-reports-809263605159-bintec-agents.s3.amazonaws.com/Logo-AWS-smile.webp" alt="AWS" style="height: 24px; vertical-align: middle;"/>
                                        </div>
                                        <h2 style="color: #1e40af; margin: 0;">Tu experiencia en el stand – Análisis Prospectivo con IA</h2>
                                    </div>
                                    <p>Estimado/a ${name},</p>
                                    <p>Gracias por participar en nuestra demostración interactiva.</p>
                                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                        <p><strong>Tu consulta:</strong> "${question}"</p>
                                    </div>
                                    
                                    <h3 style="color: #1e40af;">Análisis de nuestros agentes IA:</h3>
                                    ${analysisResult?.agents?.map(agent => `
                                        <div style="border-left: 4px solid #3b82f6; padding-left: 15px; margin: 15px 0;">
                                            <h4 style="color: #374151; margin: 0 0 8px 0;">${agent.agentType.toUpperCase()} (${agent.confidence}% confianza)</h4>
                                            <p style="margin: 0; color: #6b7280; font-size: 14px;">${agent.reasoning?.substring(0, 300)}...</p>
                                        </div>
                                    `).join('') || '<p>Análisis en proceso...</p>'}
                                    
                                    <h3 style="color: #1e40af;">Recomendaciones principales:</h3>
                                    <ul style="color: #374151;">
                                        ${analysisResult?.agents?.flatMap(agent => agent.recommendations || []).slice(0, 5).map(rec => `<li>${rec}</li>`).join('') || '<li>Recomendaciones personalizadas generadas</li>'}
                                    </ul>
                                    
                                    <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                        <p><strong>Confianza promedio del análisis:</strong> ${analysisResult?.summary?.averageConfidence?.toFixed(1) || 'N/A'}%</p>
                                    </div>
                                    <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                                        <p style="margin: 0;">Saludos cordiales,</p>
                                        <div style="margin: 15px 0;">
                                            <img src="https://bintec-demo-reports-809263605159-bintec-agents.s3.amazonaws.com/Bintec.webp" alt="Bintec" style="height: 30px; margin-right: 8px; vertical-align: middle;"/>
                                            <span style="font-weight: bold; color: #374151; vertical-align: middle;">x</span>
                                            <img src="https://bintec-demo-reports-809263605159-bintec-agents.s3.amazonaws.com/Blend360.webp" alt="Blend360" style="height: 30px; margin-left: 8px; vertical-align: middle;"/>
                                        </div>
                                        <div>
                                            <span style="font-size: 12px; color: #6b7280; margin-right: 6px;">Powered by</span>
                                            <img src="https://bintec-demo-reports-809263605159-bintec-agents.s3.amazonaws.com/Logo-AWS-smile.webp" alt="AWS" style="height: 18px; vertical-align: middle;"/>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                    },
                    Subject: { Data: 'Tu experiencia en el stand – Solución de IA Grupo CIBest' }
                },
                Source: "juan.tinjaca@blend360.com"
            };

            const command = new SendEmailCommand(emailParams);
            const result = await client.send(command);
            
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST'
                },
                body: JSON.stringify({
                    success: true,
                    messageId: result.MessageId,
                    message: `✅ Email REAL enviado a ${email}`,
                    type: 'real'
                })
            };
        } else {
            // Simular envío para otros emails (para demo en stand)
            console.log(`Demo email simulation for ${email}`);
            console.log(`Name: ${name}, Question: ${question}`);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST'
                },
                body: JSON.stringify({
                    success: true,
                    messageId: `demo_${Date.now()}`,
                    message: `📧 Email simulado enviado a ${email} (Demo Stand)`,
                    type: 'demo'
                })
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};