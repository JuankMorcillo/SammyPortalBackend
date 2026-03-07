import {
  JwtModuleOptions,
} from '@nestjs/jwt';

export interface IJwtConfig extends JwtModuleOptions {
  secret: string;
  accessTokenExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
}
