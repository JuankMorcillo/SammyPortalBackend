import { registerAs } from '@nestjs/config';
import { IJwtConfig } from './interfaces/jwt-config.interface';

export default registerAs('jwt', (): IJwtConfig => {
  return {
    secret: String(process.env.JWT_SECRET),
    accessTokenExpiresIn: process.env.JWT_EXP_IN || '15m',
    refreshTokenSecret: String(process.env.JWT_REFRESH_SECRET),
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXP_IN || '10m',

    // Opciones estándar de JwtModule
    signOptions: {
      algorithm: 'HS256',
      issuer: process.env.JWT_ISSUER || 'my-app',
    },
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
});
