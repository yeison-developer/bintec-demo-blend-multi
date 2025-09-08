// Configuración AWS simplificada

// Configuración simplificada - no se necesita Amplify SDK para esta demo
export const awsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
  s3Bucket: process.env.NEXT_PUBLIC_S3_BUCKET
};

export default awsConfig;
