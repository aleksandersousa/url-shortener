import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { ConfigValidatorService } from "./common/config/config-validator.service";

async function bootstrap() {
  const configValidator = new ConfigValidatorService();
  configValidator.validate();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
