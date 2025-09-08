# Demo Interactiva Grupo CIBest – IA + AWS

Esta es una aplicación de experiencia interactiva para un stand de innovación financiera, desarrollada con Next.js, TypeScript, Tailwind CSS y AWS Amplify.

## Descripción del Flujo

La aplicación guía al usuario a través de una serie de pantallas en secuencia:

1. **Pantalla de Registro**: Formulario para nombre, correo y cargo.
2. **Pantalla de Pregunta Inicial**: Área para formular preguntas a la IA con sugerencias.
3. **Pantalla de Orquestación de Agentes**: Animación visual de agentes procesando la consulta.
4. **Pantalla de Dashboard Consolidado**: Visualización de datos actuales y proyecciones.
5. **Pantalla de Generación de Resultados**: Preview de reporte PDF y correo.
6. **Correo Mockup**: Simulación del correo recibido.

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Gráficos**: Recharts
- **Formularios**: React Hook Form
- **AWS**: Amplify (para futuras integraciones)

## Instalación y Ejecución

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Construcción para Producción

```bash
npm run build
npm start
```

## Despliegue en AWS

Para desplegar en AWS Amplify:

1. Conecta el repositorio a AWS Amplify.
2. Configura las variables de entorno si es necesario.
3. Despliega automáticamente.

## Funcionalidades

- ✅ Formularios con validación (React Hook Form)
- ✅ Animaciones y transiciones
- ✅ Gráficos interactivos (Recharts)
- ✅ Navegación tipo wizard
- ✅ Persistencia de datos (localStorage)
- ✅ Simulación de envío de correos (mock AWS SES)
- ✅ Descarga de reportes PDF (mock)
- ✅ Diseño moderno con colores corporativos
- ✅ Configuración de AWS Amplify lista para despliegue

## Próximos Pasos para AWS

1. **Configurar Credenciales AWS**:
   ```bash
   aws configure
   # Ingresar Access Key, Secret Key, Region, Output format
   ```

2. **Inicializar Amplify**:
   ```bash
   amplify init
   ```

3. **Agregar Servicios**:
   ```bash
   amplify add auth      # Cognito para autenticación
   amplify add api       # API Gateway + Lambda
   amplify add storage   # S3 para PDFs
   amplify add function  # Lambda para IA y correos
   ```

4. **Desplegar**:
   ```bash
   amplify push
   amplify publish
   ```

## Variables de Entorno

Crear `.env.local` con:
```
NEXT_PUBLIC_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_API_ENDPOINT=your_api_endpoint
NEXT_PUBLIC_S3_BUCKET=your_bucket_name
```
# Build fix
