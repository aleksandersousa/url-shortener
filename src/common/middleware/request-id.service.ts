import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class RequestIdService {
  getRequestId(req: Request): string | undefined {
    return req["requestId"];
  }
}
