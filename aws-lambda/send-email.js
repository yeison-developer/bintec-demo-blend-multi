const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: process.env.AWS_REGION });

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
                            <h2>Tu experiencia en el stand – Solución de IA Grupo CIBest</h2>
                            <p>Hola ${name},</p>
                            <p>Gracias por participar en nuestra demostración interactiva.</p>
                            <p><strong>Tu pregunta:</strong> ${question}</p>
                            <p><strong>Resumen de hallazgos:</strong></p>
                            <ul>
                                <li>Análisis completado exitosamente</li>
                                <li>Riesgos identificados y mitigados</li>
                                <li>Recomendaciones implementadas</li>
                            </ul>
                            <p><strong>Proyección prospectiva:</strong></p>
                            <ul>
                                <li>Crecimiento esperado del 15% en los próximos meses</li>
                                <li>Optimización de recursos financieros</li>
                            </ul>
                            <p>Saludos,<br>Equipo Grupo CIBest</p>
                        `
                    }
                },
                Subject: {
                    Data: 'Tu experiencia en el stand – Solución de IA Grupo CIBest'
                }
            },
            Source: process.env.SES_FROM_EMAIL
        };

        const result = await ses.sendEmail(emailParams).promise();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST'
            },
            body: JSON.stringify({
                success: true,
                messageId: result.MessageId
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