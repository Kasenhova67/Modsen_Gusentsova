import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SWAGGER_TITLE, SWAGGER_DESCRIPTION, SWAGGER_VERSION, SWAGGER_PATH } from './constants';
import { AllExceptionsFilter } from './common/error/error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server on http://localhost:${port}`);
  console.log(`Swagger on http://localhost:${port}/${SWAGGER_PATH}`);
}
bootstrap();

