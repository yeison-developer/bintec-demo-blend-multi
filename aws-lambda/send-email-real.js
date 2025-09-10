const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({ region: "us-east-1" });

exports.handler = async (event) => {
    try {
        const { email, name, question, reportData } = JSON.parse(event.body);
        
        const emailParams = {
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Html: {
                        Data: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #1e40af;">Tu experiencia en el stand – Solución de IA Grupo CIBest</h2>
                                <p>Estimado/a ${name},</p>
                                <p>Gracias por participar en nuestra demostración interactiva de IA financiera.</p>
                                
                                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                    <p><strong>Tu consulta:</strong></p>
                                    <p style="font-style: italic;">"${question}"</p>
                                </div>
                                
                                <p><strong>Resumen de hallazgos de nuestros agentes IA:</strong></p>
                                <ul style="line-height: 1.6;">
                                    <li><strong>Análisis Documental:</strong> Evaluación de procesos documentales completada</li>
                                    <li><strong>Evaluación de Riesgos:</strong> Identificación y mitigación de riesgos operacionales</li>
                                    <li><strong>Cumplimiento Regulatorio:</strong> Verificación de adherencia normativa</li>
                                    <li><strong>Oportunidades de Negocio:</strong> Análisis de crecimiento y optimización</li>
                                </ul>
                                
                                <p><strong>Próximos pasos recomendados:</strong></p>
                                <ul style="line-height: 1.6;">
                                    <li>Implementación de soluciones de automatización</li>
                                    <li>Optimización de procesos financieros</li>
                                    <li>Fortalecimiento de controles de riesgo</li>
                                </ul>
                                
                                <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                    <p><strong>¿Interesado en conocer más?</strong></p>
                                    <p>Nuestro equipo está disponible para una consulta personalizada sobre cómo la IA puede transformar tus procesos financieros.</p>
                                </div>
                                
                                <p>Saludos cordiales,<br>
                                <strong>Equipo Grupo CIBest</strong><br>
                                <em>Powered by AWS</em></p>
                            </div>
                        `
                    }
                },
                Subject: {
                    Data: 'Tu experiencia en el stand – Solución de IA Grupo CIBest'
                }
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
                message: `Email enviado exitosamente a ${email}`
            })
        };
    } catch (error) {
        console.error('Error sending email:', error);
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