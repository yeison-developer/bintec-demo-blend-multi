#!/bin/bash

# Script de despliegue para Bintec Demo en AWS

echo "🚀 Iniciando despliegue de Bintec Demo en AWS..."

# 1. Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado. Instálalo primero."
    exit 1
fi

# 2. Eliminar stack existente si existe
echo "🗑️ Eliminando stack anterior si existe..."
aws cloudformation delete-stack --stack-name bintec-demo-stack 2>/dev/null || true
aws cloudformation wait stack-delete-complete --stack-name bintec-demo-stack 2>/dev/null || true

# 3. Crear stack de CloudFormation
echo "📦 Creando infraestructura AWS..."
aws cloudformation create-stack \
    --stack-name bintec-demo-stack \
    --template-body file://cloudformation-template.yaml \
    --capabilities CAPABILITY_IAM \
    --parameters ParameterKey=DomainName,ParameterValue=yourdomain.com

echo "⏳ Esperando que se complete la creación del stack..."
if ! aws cloudformation wait stack-create-complete --stack-name bintec-demo-stack; then
    echo "❌ Error creando stack. Verificando eventos..."
    aws cloudformation describe-stack-events --stack-name bintec-demo-stack --query "StackEvents[?ResourceStatus=='CREATE_FAILED'].[LogicalResourceId,ResourceStatusReason]" --output table
    exit 1
fi

# 3. Obtener outputs del stack
API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name bintec-demo-stack \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
    --output text)

S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name bintec-demo-stack \
    --query 'Stacks[0].Outputs[?OutputKey==`S3Bucket`].OutputValue' \
    --output text)

echo "✅ Infraestructura creada:"
echo "   API Endpoint: $API_ENDPOINT"
echo "   S3 Bucket: $S3_BUCKET"

# 4. Subir código Lambda
echo "📤 Subiendo funciones Lambda..."

# Crear paquetes Lambda
cd aws-lambda
zip -r send-email.zip send-email.js
zip -r generate-pdf.zip generate-pdf.js

# Actualizar funciones Lambda
aws lambda update-function-code \
    --function-name bintec-send-email \
    --zip-file fileb://send-email.zip

aws lambda update-function-code \
    --function-name bintec-generate-pdf \
    --zip-file fileb://generate-pdf.zip

# Bedrock function is updated via CloudFormation inline code

cd ..

# 5. Crear archivo .env.local
echo "📝 Creando archivo de configuración..."
cat > .env.local << EOF
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_API_ENDPOINT=$API_ENDPOINT
NEXT_PUBLIC_S3_BUCKET=$S3_BUCKET
EOF

echo "✅ Despliegue completado!"
echo "🌐 Configura tu dominio en AWS Amplify y actualiza las variables de entorno."
echo "📧 No olvides verificar tu dominio en Amazon SES para envío de correos."