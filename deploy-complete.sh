#!/bin/bash

echo "🚀 Deploy completo de Bintec Demo..."

# Variables
STACK_NAME="bintec-demo"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "📋 Account ID: $ACCOUNT_ID"
echo "🌍 Region: $REGION"

# 1. Crear/actualizar rol IAM si no existe
echo "🔐 Verificando rol IAM..."
aws iam get-role --role-name lambda-bedrock-execution-role 2>/dev/null || {
    echo "📝 Creando rol IAM..."
    aws iam create-role \
        --role-name lambda-bedrock-execution-role \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "lambda.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }'
    
    # Adjuntar políticas
    aws iam attach-role-policy \
        --role-name lambda-bedrock-execution-role \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    aws iam put-role-policy \
        --role-name lambda-bedrock-execution-role \
        --policy-name BedrockAndS3Access \
        --policy-document '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": ["bedrock:InvokeModel"],
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": ["lambda:InvokeFunction"],
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": ["s3:*", "ses:*"],
                    "Resource": "*"
                }
            ]
        }'
    
    echo "⏳ Esperando propagación del rol..."
    sleep 10
}

# 2. Empaquetar Lambdas
echo "📦 Empaquetando Lambdas..."
cd aws-lambda

# Crear zips individuales
for agent in documental riesgo regulatorio negocio orchestrator; do
    echo "📦 Empaquetando agent-${agent}..."
    zip -q agent-${agent}.zip agent-${agent}.js 2>/dev/null || echo "Archivo agent-${agent}.js no encontrado"
done

# Empaquetar funciones existentes
for func in bedrock-analysis generate-pdf send-email; do
    if [ -f "${func}.js" ]; then
        echo "📦 Empaquetando ${func}..."
        zip -q ${func}.zip ${func}.js
    fi
done

cd ..

# 3. Deploy con CloudFormation
echo "☁️ Desplegando infraestructura..."

# Verificar si el stack existe y está en mal estado
STACK_STATUS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query 'Stacks[0].StackStatus' --output text 2>/dev/null)

if [ "$STACK_STATUS" = "ROLLBACK_COMPLETE" ] || [ "$STACK_STATUS" = "CREATE_FAILED" ]; then
    echo "🗑️ Eliminando stack en mal estado..."
    aws cloudformation delete-stack --stack-name $STACK_NAME
    echo "⏳ Esperando eliminación completa..."
    aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME
fi

# Deploy del stack
aws cloudformation deploy \
    --template-file cloudformation-template.yaml \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION \
    --parameter-overrides \
        DomainName=blend360.com

if [ $? -eq 0 ]; then
    echo "✅ Stack desplegado exitosamente"
    
    # Obtener endpoint de API Gateway
    API_ENDPOINT=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
        --output text)
    
    echo "🌐 API Endpoint: $API_ENDPOINT"
    
    # Actualizar .env.local
    echo "📝 Actualizando .env.local..."
    cat > .env.local << EOF
NEXT_PUBLIC_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_AWS_REGION=$REGION
NEXT_PUBLIC_API_ENDPOINT=$API_ENDPOINT
NEXT_PUBLIC_S3_BUCKET=bintec-demo-reports-$ACCOUNT_ID
EOF
    
    echo "✅ Deploy completo!"
    echo "🔗 Endpoint: $API_ENDPOINT"
    echo "📁 Variables actualizadas en .env.local"
    
else
    echo "❌ Error en el deploy. Verificando eventos..."
    aws cloudformation describe-stack-events --stack-name $STACK_NAME --max-items 10
fi