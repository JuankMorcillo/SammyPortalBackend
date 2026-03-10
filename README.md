# Backend Sammy Portal

API REST construida con **NestJS 11**, **TypeORM** y **MySQL**, desplegada en **AWS Lambda** mediante **Serverless Framework**.

El proyecto fue desplegado en aws lambda y se puede acceder a través de la siguiente URL: [https://1r4gg6adjb.execute-api.us-east-1.amazonaws.com](https://1r4gg6adjb.execute-api.us-east-1.amazonaws.com)

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución local](#ejecución-local)
- [Tests](#tests)
- [Variables de entorno](#variables-de-entorno)
- [Despliegue a AWS Lambda](#despliegue-a-aws-lambda)
- [Solución de problemas de despliegue](#solución-de-problemas-de-despliegue)

---

## Requisitos previos

- **Node.js** >= 20.x
- **pnpm** (gestor de paquetes)
- **AWS CLI** configurado con credenciales válidas
- **Serverless Framework** v4 instalado globalmente:
  ```bash
  pnpm install -g serverless
  ```
- Una base de datos **MySQL** accesible (local o remota)

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd backend_portal

# Instalar dependencias
pnpm install
```

---

## Ejecución local

### Modo desarrollo (NestJS)

```bash
pnpm run start:dev
```

La API estará disponible en `http://localhost:<APP_PORT>` (por defecto `3000`).

### Modo local simulando Lambda (Serverless Offline)

```bash
pnpm run build
serverless offline
```

Esto levanta un servidor local que simula API Gateway + Lambda.

---

## Tests

```bash
# Tests unitarios
pnpm run test

# Tests unitarios en modo watch
pnpm run test:watch

# Tests end-to-end
pnpm run test:e2e

# Cobertura de tests
pnpm run test:cov
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

| Variable              | Tipo      | Descripción                                 | Ejemplo                  |
|-----------------------|-----------|---------------------------------------------|--------------------------|
| `NODE_ENV`            | `string`  | Entorno de ejecución                        | `development`            |
| `APP_NAME`            | `string`  | Nombre de la aplicación                     | `backend_portal`         |
| `APP_PORT`            | `number`  | Puerto de la aplicación                     | `3000`                   |
| `API_PREFIX`          | `string`  | Prefijo de las rutas de la API              | `api`                    |
| `JWT_SECRET`          | `string`  | Clave secreta para tokens JWT               | `mi_clave_secreta`       |
| `JWT_EXPIRATION`      | `string`  | Tiempo de expiración del access token       | `15m`                    |
| `JWT_REFRESH_SECRET`  | `string`  | Clave secreta para refresh tokens           | `mi_refresh_secret`      |
| `JWT_REFRESH_EXP_IN`  | `string`  | Tiempo de expiración del refresh token      | `10m`                    |
| `DB_HOST`             | `string`  | Host de la base de datos MySQL              | `localhost`              |
| `DB_PORT`             | `number`  | Puerto de la base de datos                  | `3306`                   |
| `DB_USERNAME`         | `string`  | Usuario de la base de datos                 | `root`                   |
| `DB_PASSWORD`         | `string`  | Contraseña de la base de datos              | `password`               |
| `DB_NAME`             | `string`  | Nombre de la base de datos                  | `nest_mysql`             |
| `CORS_ENABLED`        | `boolean` | Habilitar CORS                              | `true`                   |
| `SWAGGER_ENABLED`     | `boolean` | Habilitar documentación Swagger             | `true`                   |
| `SWAGGER_TITLE`       | `string`  | Título de la documentación                  | `API Documentation`      |
| `SWAGGER_DESCRIPTION` | `string`  | Descripción de la documentación             | `Mi API`                 |
| `SWAGGER_VERSION`     | `string`  | Versión de la documentación                 | `1.0`                    |
| `SWAGGER_PATH`        | `string`  | Ruta donde se sirve Swagger (debe iniciar con `/`) | `/docs`           |

> **Nota:** El plugin `serverless-dotenv-plugin` cargará automáticamente el archivo `.env` durante el despliegue con Serverless.

---

## Despliegue a AWS Lambda

### Pasos de alto nivel

1. **Configurar credenciales de AWS** (si aún no lo has hecho):
   ```bash
   aws configure
   ```

2. **Construir el proyecto**:
   ```bash
   pnpm run build
   ```

3. **Desplegar con Serverless Framework**:
   ```bash
   serverless deploy
   ```

   Esto empaqueta el código y lo sube a AWS Lambda en la región `us-east-1` (configurada en `serverless.yml`).

4. **Verificar el despliegue**: Al finalizar, Serverless mostrará la URL del API Gateway. Puedes probar los endpoints usando esa URL base.

### Configuración actual del despliegue (`serverless.yml`)

- **Runtime:** Node.js 24.x (ARM64)
- **Región:** us-east-1
- **Memoria:** 1024 MB
- **Timeout:** 10 segundos
- **Stage:** production
- **Bucket de despliegue:** `sammy-bucket-deploy`

---

## Solución de problemas de despliegue

### Error: El bucket de despliegue no existe

Si al ejecutar `serverless deploy` ves un error como:

```
ServerlessError: The S3 bucket "sammy-bucket-deploy" does not exist.
```

**Solución:** Crear el bucket manualmente antes de desplegar:

```bash
aws s3 mb s3://sammy-bucket-deploy --region us-east-1
```

> El `serverless.yml` tiene configurado un `deploymentBucket` personalizado. Si no existe, Serverless no lo creará automáticamente porque se especificó un nombre fijo.

### Error: Tamaño del paquete demasiado grande

Si el paquete excede el límite de Lambda (250 MB descomprimido), puede que se estén incluyendo dependencias innecesarias.

**Solución:** Verificar que las exclusiones en `serverless.yml` estén activas. El archivo ya excluye paquetes de desarrollo como `@types/*`, `typescript`, `jest`, `eslint`, `prettier`, etc. Si el problema persiste, puedes usar webpack para empaquetar:

```bash
pnpm run build
npx webpack --config webpack.config.js
```

Y ajustar el handler en `serverless.yml` para apuntar al bundle generado en `.webpack/`.

### Error: Timeout al conectar a la base de datos

Si Lambda no puede conectarse a la base de datos MySQL:

**Solución:**
1. Verificar que la base de datos sea accesible desde la VPC de Lambda (o sea pública).
2. Asegurar que los Security Groups permitan tráfico entrante en el puerto `3306` desde Lambda.
3. Si usas RDS, verificar que esté en la misma región y que la configuración de red sea correcta.

### Error: Credenciales de AWS no configuradas

```
ServerlessError: AWS provider credentials not found.
```

**Solución:**
```bash
aws configure
# Ingresar Access Key ID, Secret Access Key, región (us-east-1) y formato (json)
```

O configurar las variables de entorno directamente:

```bash
set AWS_ACCESS_KEY_ID=tu_access_key
set AWS_SECRET_ACCESS_KEY=tu_secret_key
set AWS_DEFAULT_REGION=us-east-1
```

### Error: `esbuild` no encontrado o conflictos de build

Serverless puede intentar usar `esbuild` para empaquetar. El proyecto tiene `esbuild: false` en `serverless.yml` para evitar esto, pero si surge algún conflicto:

**Solución:** Asegurarse de que la sección `build` en `serverless.yml` contenga:

```yaml
build:
  esbuild: false
```

Y que el handler apunte a `dist/lambda.handler` (la salida de `nest build`).

### Error: Módulos nativos incompatibles (bcrypt)

Si ves errores relacionados con `bcrypt` al ejecutar en Lambda (ej. `Error: /var/task/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node: invalid ELF header`):

**Solución:** Este error ocurre porque `bcrypt` compila binarios nativos para la arquitectura de tu máquina local, pero Lambda usa `arm64` (Linux). Para resolverlo:

1. Reinstalar dependencias en un entorno compatible:
   ```bash
   # Forzar la instalación para la plataforma de Lambda
   pnpm install --force
   ```

2. O mejor aún, reemplazar `bcrypt` por `bcryptjs` que es una implementación pura en JavaScript (sin binarios nativos):
   ```bash
   pnpm remove bcrypt
   pnpm add bcryptjs
   pnpm add -D @types/bcryptjs
   ```
   Luego actualizar los imports en el código de `bcrypt` a `bcryptjs`.

---

## Estructura del proyecto

```
src/
├── main.ts                  # Punto de entrada local
├── lambda.ts                # Punto de entrada para AWS Lambda
├── app.module.ts            # Módulo raíz
├── common/                  # Decoradores y DTOs comunes
├── config/                  # Configuración (app, DB, JWT, Swagger)
└── modules/
    ├── auth/                # Autenticación (login, guards, JWT)
    ├── posts/               # CRUD de posts
    └── users/               # CRUD de usuarios
```