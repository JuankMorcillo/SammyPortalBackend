import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(String(process.env.DB_PORT), 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nest_mysql',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: false,
    connectTimeout: 60000,
    extra: {
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
    },
    retryAttempts: 10,
    retryDelay: 3000,
    autoLoadEntities: true,
  }),
);
