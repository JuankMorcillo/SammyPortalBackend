import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import serverlessExpress from "@vendia/serverless-express"
import { BadRequestException, ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { useContainer } from "class-validator"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

let cachedServer

export const handler = async (event: any, context: any) => {
    if (!cachedServer) {
        const nestApp = await NestFactory.create(AppModule)
        const configService = nestApp.get(ConfigService)

        useContainer(nestApp.select(AppModule), { fallbackOnErrors: true })

        nestApp.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (errors) => {
                const messages = errors
                    .flatMap(error => Object.values(error.constraints || {}))
                    .join(', ')
                throw new BadRequestException(messages)
            }
        }))

        nestApp.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: 'Content-Type,Authorization',
        })

        // Configuración Swagger
        if (configService.get('swagger.enabled')) {
            const config = new DocumentBuilder()
                .setTitle(String(configService.get('swagger.title')))
                .setDescription(String(configService.get('swagger.description')))
                .setVersion(String(configService.get('swagger.version')))
                .addBearerAuth()
                .build()

            const document = SwaggerModule.createDocument(nestApp, config)
            SwaggerModule.setup(
                String(configService.get('swagger.path')),
                nestApp,
                document,
                configService.get('swagger.customOptions')
            )
        }

        await nestApp.init()

        const expressApp = nestApp.getHttpAdapter().getInstance()
        cachedServer = serverlessExpress({ app: expressApp })
    }

    return cachedServer(event, context)
}