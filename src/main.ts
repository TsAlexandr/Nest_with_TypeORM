import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationException } from './common/exceptions/validation.exception';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');

async function sendHook(url: string) {
  const token = `5921370285:AAEI1trd_DvwALxyoMBOGZjqdWmOcsWHEwg`;
  await axios.post(`https://api.telegram.org/bot${token}/setWebHook`, {
    url: url,
  });
}

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true);
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors = errors.map((e) => {
          const firstError = JSON.stringify(e.constraints);
          return { field: e.property, message: firstError };
        });
        throw new BadRequestException(customErrors);
      },
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new ValidationException());
  await app.listen(PORT, () => console.log('Server started on port ' + PORT));

  const baseUrl = 'https://4c92-88-204-48-37.eu.ngrok.io';
  await sendHook(baseUrl + '/notification/telegram');
}

try {
  bootstrap();
} catch (e) {
  console.log(e);
}
