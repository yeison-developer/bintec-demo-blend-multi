import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  API: {
    REST: {
      BintecAPI: {
        endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
      }
    }
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
    }
  }
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;
