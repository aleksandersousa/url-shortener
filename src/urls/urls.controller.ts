import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  Req,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { UrlsService } from "./urls.service";
import { CreateShortUrlDto } from "./dto/create-short-url.dto";
import { ShortUrlResponseDto } from "./dto/short-url-response.dto";
import { GetShortUrlParamsDto } from "./dto/get-short-url-params.dto";

@ApiTags("URLs")
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post("shorten")
  @ApiOperation({ summary: "Create a short URL from an original URL" })
  @ApiBody({ type: CreateShortUrlDto })
  @ApiResponse({
    status: 200,
    description: "Short URL created successfully",
    type: ShortUrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid URL format",
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async shorten(
    @Body() createShortUrlDto: CreateShortUrlDto,
    @Req() req: Request
  ): Promise<ShortUrlResponseDto> {
    const requestId = (req as any).requestId;
    return await this.urlsService.createShortUrl(createShortUrlDto, requestId);
  }

  @Get(":code")
  @ApiOperation({ summary: "Redirect to the original URL" })
  @ApiParam({
    name: "code",
    description: "The short code for the URL",
    example: "abc123",
  })
  @ApiResponse({
    status: 301,
    description: "Redirect to the original URL",
  })
  @ApiResponse({
    status: 404,
    description: "Short URL not found",
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async redirect(
    @Param() params: GetShortUrlParamsDto,
    @Res() res: Response,
    @Req() req: Request
  ): Promise<void> {
    const { code } = params;
    const requestId = (req as any).requestId;
    const originalUrl = await this.urlsService.getOriginalUrl(code, requestId);
    await this.urlsService.incrementAccessCount(code, requestId);
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(originalUrl);
  }
}
