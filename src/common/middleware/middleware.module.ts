import { Module } from "@nestjs/common";
import { RequestIdMiddleware } from "./request-id.middleware";
import { RequestIdService } from "./request-id.service";

@Module({
  providers: [RequestIdMiddleware, RequestIdService],
  exports: [RequestIdMiddleware, RequestIdService],
})
export class MiddlewareModule {}
