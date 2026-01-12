import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerModule } from "./common/logger/logger.module";
import { MiddlewareModule } from "./common/middleware/middleware.module";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { FiltersModule } from "./common/filters/filters.module";

@Module({
  imports: [LoggerModule, MiddlewareModule, FiltersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
