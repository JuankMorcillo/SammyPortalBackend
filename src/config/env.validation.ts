import { ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Matches,
  validateSync,
} from 'class-validator';

// 1. Definimos los entornos válidos
export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

// 2. Clase principal de validación
class EnvironmentVariables {
  // Validación para APP
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXP_IN: string;

  @IsString()
  APP_NAME: string;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  API_PREFIX: string;

  // Validación para Database
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  // Validación para características opcionales
  @IsBoolean()
  CORS_ENABLED: boolean;

  @IsBoolean()
  SWAGGER_ENABLED: boolean;

  @IsString()
  SWAGGER_TITLE: string;

  @IsString()
  SWAGGER_DESCRIPTION: string;

  @IsString()
  SWAGGER_VERSION: string;

  @IsString()
  @Matches(/^\/[a-zA-Z0-9\-_]+$/, {
    message: 'SWAGGER_PATH debe empezar con /',
  })
  SWAGGER_PATH: string;  
}

// 3. Función de validación personalizada
export const validateEnv = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true }, // Conversión automática de tipos
  );

  const errors: ValidationError[] = validateSync(validatedConfig, {
    skipMissingProperties: false, // Fuerza validación de todas las propiedades
    forbidNonWhitelisted: true, // Evita propiedades no definidas
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints || {}).join(', '))
      .join(' | ');
    throw new Error(`Configuración de entorno inválida: ${errorMessages}`);
  }

  return validatedConfig;
};
