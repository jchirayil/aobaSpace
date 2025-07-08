import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    corsOrigin: process.env.NODE_ENV === 'production' ? 'https://your-aobaspace-web-domain.com' : 'http://localhost:3001',
  },
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'password',
    name: process.env.POSTGRES_DB || 'aobaspace_db',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'yourSuperSecretJwtKey', // Fallback for development
    dummyToken: process.env.DUMMY_ACCESS_TOKEN || 'dummy-jwt-token-abc123', // Dummy token for testing
    // Add other auth-related configs here (e.g., auth0 domain, client ID)
    auth0Domain: process.env.AUTH0_DOMAIN,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
}));