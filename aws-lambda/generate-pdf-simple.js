exports.handler = async (event) => {
    try {
        const { name, email, position, question } = JSON.parse(event.body);
        
        // Mock PDF generation for demo
        console.log(`Generating PDF for ${name} (${position})`);
        console.log(`Question: ${question}`);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const fileName = `reporte_${name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        const mockUrl = `https://bintec-demo-reports-809263605159-bintec-agents.s3.amazonaws.com/${fileName}`;
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST'
            },
            body: JSON.stringify({
                success: true,
                pdfUrl: mockUrl,
                fileName: fileName,
                message: `PDF generado exitosamente para ${name}`
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