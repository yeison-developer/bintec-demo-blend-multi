# Guía de Despliegue AWS

## Prerrequisitos

1. **AWS CLI instalado y configurado**:
   ```bash
   aws configure
   # Ingresa tu Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
   ```

2. **Node.js y npm instalados**

## Pasos de Despliegue

### 1. Desplegar Infraestructura AWS

```bash
# Ejecutar script de despliegue
bash deploy.sh
```

### 2. Configurar Amazon SES

1. Ve a la consola de Amazon SES
2. Verifica tu dominio de correo
3. Solicita salir del sandbox si es necesario

### 3. Desplegar Frontend en Amplify

1. Ve a AWS Amplify Console
2. Conecta tu repositorio GitHub
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_AWS_REGION`: us-east-1
   - `NEXT_PUBLIC_API_ENDPOINT`: (obtenido del stack)
   - `NEXT_PUBLIC_S3_BUCKET`: (obtenido del stack)

### 4. Instalar Dependencias Lambda

```bash
cd aws-lambda
npm install
```

### 5. Verificar Despliegue

1. Accede a tu URL de Amplify
2. Prueba el flujo completo
3. Verifica que se envíen correos y se generen PDFs

## Servicios AWS Utilizados

- **AWS Amplify**: Hosting del frontend
- **API Gateway**: Endpoints REST
- **AWS Lambda**: Funciones serverless
- **Amazon SES**: Envío de correos
- **Amazon S3**: Almacenamiento de PDFs
- **CloudFormation**: Infraestructura como código

## Costos Estimados

- Amplify: ~$1/mes (tráfico básico)
- Lambda: ~$0.20/mes (1000 invocaciones)
- SES: $0.10 por 1000 correos
- S3: ~$0.50/mes (almacenamiento básico)
- API Gateway: $3.50 por millón de llamadas

**Total estimado: ~$5/mes para uso demo**

## Troubleshooting

### Error de CORS
Si hay errores de CORS, verifica que las funciones Lambda incluyan los headers correctos.

### Error de SES
Asegúrate de que tu dominio esté verificado en SES y que tengas permisos de envío.

### Error de S3
Verifica que el bucket tenga los permisos correctos y que las funciones Lambda puedan escribir en él.