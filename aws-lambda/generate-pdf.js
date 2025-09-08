const AWS = require('aws-sdk');
const PDFDocument = require('pdfkit');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const { name, email, position, question } = JSON.parse(event.body);
        
        // Crear PDF
        const doc = new PDFDocument();
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {});
        
        // Contenido del PDF
        doc.fontSize(20).text('Reporte Ejecutivo - Grupo CIBest', 100, 100);
        doc.fontSize(12).text(`Cliente: ${name}`, 100, 150);
        doc.text(`Correo: ${email}`, 100, 170);
        doc.text(`Cargo: ${position}`, 100, 190);
        doc.text(`Pregunta: ${question}`, 100, 220);
        doc.text('Resumen de Hallazgos:', 100, 260);
        doc.text('• Análisis completado exitosamente', 120, 280);
        doc.text('• Riesgos identificados y mitigados', 120, 300);
        doc.text('• Recomendaciones implementadas', 120, 320);
        doc.text('Proyección Prospectiva:', 100, 360);
        doc.text('• Crecimiento esperado del 15%', 120, 380);
        doc.text('• Optimización de recursos financieros', 120, 400);
        doc.text(`Generado: ${new Date().toLocaleDateString()}`, 100, 440);
        
        doc.end();
        
        const pdfBuffer = Buffer.concat(chunks);
        const fileName = `reporte-${Date.now()}.pdf`;
        
        // Subir a S3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: fileName,
            Body: pdfBuffer,
            ContentType: 'application/pdf'
        };
        
        const uploadResult = await s3.upload(uploadParams).promise();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST'
            },
            body: JSON.stringify({
                success: true,
                pdfUrl: uploadResult.Location,
                fileName: fileName
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