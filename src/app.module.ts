import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "./common/config/config.module";
import { LoggerModule } from "./common/logger/logger.module";
import { MiddlewareModule } from "./common/middleware/middleware.module";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { FiltersModule } from "./common/filters/filters.module";
import { DatabaseModule } from "./common/database/database.module";
import { UrlsModule } from "./urls/urls.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MiddlewareModule,
    FiltersModule,
    DatabaseModule,
    HealthModule,
    UrlsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
