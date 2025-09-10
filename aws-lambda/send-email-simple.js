exports.handler = async (event) => {
    try {
        const { email, name, question, reportData } = JSON.parse(event.body);
        
        // Mock email sending for demo
        console.log(`Sending email to ${email} for ${name}`);
        console.log(`Question: ${question}`);
        
        // Simulate processing time
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
                messageId: `msg_${Date.now()}`,
                message: `Email enviado exitosamente a ${email}`
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