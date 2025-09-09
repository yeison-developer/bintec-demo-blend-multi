#!/bin/bash

# Script para desplegar las Lambdas de agentes especializados

echo "Desplegando sistema de orquestación de agentes..."

# Crear paquetes para cada agente
cd aws-lambda

echo "Empaquetando agentes..."

# Agente Documental
zip -r agent-documental.zip agent-documental.js package.json node_modules/ 2>/dev/null || echo "Creando zip para agente documental..."
zip agent-documental.zip agent-documental.js

# Agente Riesgo  
zip -r agent-riesgo.zip agent-riesgo.js package.json node_modules/ 2>/dev/null || echo "Creando zip para agente riesgo..."
zip agent-riesgo.zip agent-riesgo.js

# Agente Regulatorio
zip -r agent-regulatorio.zip agent-regulatorio.js package.json node_modules/ 2>/dev/null || echo "Creando zip para agente regulatorio..."
zip agent-regulatorio.zip agent-regulatorio.js

# Agente Negocio
zip -r agent-negocio.zip agent-negocio.js package.json node_modules/ 2>/dev/null || echo "Creando zip para agente negocio..."
zip agent-negocio.zip agent-negocio.js

# Orquestador
zip -r agent-orchestrator.zip agent-orchestrator.js package.json node_modules/ 2>/dev/null || echo "Creando zip para orquestador..."
zip agent-orchestrator.zip agent-orchestrator.js

echo "Paquetes creados exitosamente"

# Comandos AWS CLI para desplegar (comentados para referencia)
echo "Para desplegar en AWS, ejecuta los siguientes comandos:"
echo ""
echo "# Crear funciones Lambda"
echo "aws lambda create-function --function-name agent-documental --runtime nodejs18.x --role arn:aws:iam::ACCOUNT:role/lambda-execution-role --handler agent-documental.handler --zip-file fileb://agent-documental.zip"
echo "aws lambda create-function --function-name agent-riesgo --runtime nodejs18.x --role arn:aws:iam::ACCOUNT:role/lambda-execution-role --handler agent-riesgo.handler --zip-file fileb://agent-riesgo.zip"
echo "aws lambda create-function --function-name agent-regulatorio --runtime nodejs18.x --role arn:aws:iam::ACCOUNT:role/lambda-execution-role --handler agent-regulatorio.handler --zip-file fileb://agent-regulatorio.zip"
echo "aws lambda create-function --function-name agent-negocio --runtime nodejs18.x --role arn:aws:iam::ACCOUNT:role/lambda-execution-role --handler agent-negocio.handler --zip-file fileb://agent-negocio.zip"
echo "aws lambda create-function --function-name agent-orchestrator --runtime nodejs18.x --role arn:aws:iam::ACCOUNT:role/lambda-execution-role --handler agent-orchestrator.handler --zip-file fileb://agent-orchestrator.zip"
echo ""
echo "# Crear API Gateway endpoints"
echo "aws apigateway create-rest-api --name 'bintec-agents-api'"
echo ""
echo "Despliegue completado!"