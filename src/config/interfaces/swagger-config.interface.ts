import { SwaggerCustomOptions } from "@nestjs/swagger";

export interface ISwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
  customOptions?: SwaggerCustomOptions;
}