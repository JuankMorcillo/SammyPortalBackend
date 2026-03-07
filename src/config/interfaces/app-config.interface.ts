import { Environment } from "../env.validation";

export interface IAppConfig {
  env: Environment;
  name: string;
  port: number;
  apiPrefix: string;
  apiVersion: string;
  corsEnabled: boolean;
}