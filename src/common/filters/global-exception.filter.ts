import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request as any).requestId;

    let statusCode: number;
    let message: string;
    let error: string;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || exception.name;
      } else {
        message = exception.message;
      }

      error = error || exception.name || "HttpException";
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal server error";
      error = "Internal Server Error";
      stack = exception instanceof Error ? exception.stack : undefined;
    }

    const errorResponse = {
      statusCode,
      message,
      error,
      requestId,
    };

    const logContext: Record<string, unknown> = {
      method: request.method,
      path: request.path,
      statusCode,
    };

    if (stack) {
      logContext.stack = stack;
    }

    if (statusCode >= 500) {
      this.logger.error(
        `Unhandled exception: ${message}`,
        requestId,
        logContext
      );
    } else if (request.path !== "/health") {
      this.logger.warn(`Client error: ${message}`, requestId, logContext);
    }

    response.status(statusCode).json(errorResponse);
  }
}
