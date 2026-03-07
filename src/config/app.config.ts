import { registerAs } from '@nestjs/config';
import { Environment } from './env.validation';
import { IAppConfig } from './interfaces/app-config.interface';


// Configuración principal usando registerAs
export default registerAs('app', (): IAppConfig => {
  return {
    env: process.env.NODE_ENV as Environment || Environment.Development,
    name: process.env.APP_NAME || '',
    port: parseInt(String(process.env.APP_POMyNestAppRT), 10) || 3000,
    apiPrefix: 'api',
    apiVersion: 'v1',
    corsEnabled: true,
  };
});