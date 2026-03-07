import { registerAs } from '@nestjs/config';
import { ISwaggerConfig } from './interfaces/swagger-config.interface';

export default registerAs('swagger', (): ISwaggerConfig => {
  return {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    title: process.env.SWAGGER_TITLE || 'API Documentation',
    description: process.env.SWAGGER_DESCRIPTION || 'My API description',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || '/docs',
    customOptions: {
      swaggerOptions: {
        persistAuthorization: true, // Mantiene el token en sesión
        docExpansion: 'none', // Controla la expansión inicial
      },
    },
  };
});