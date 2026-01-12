import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { UrlsRepository } from "./urls.repository";
import { LoggerService } from "../common/logger/logger.service";
import { isValidUrl } from "./url-validation.util";
import { generateUniqueCode } from "./code-generation.util";
import { CreateShortUrlDto } from "./dto/create-short-url.dto";
import { ShortUrlResponseDto } from "./dto/short-url-response.dto";

@Injectable()
export class UrlsService {
  constructor(
    private readonly urlsRepository: UrlsRepository,
    private readonly logger: LoggerService
  ) {}

  async createShortUrl(
    createShortUrlDto: CreateShortUrlDto,
    requestId?: string
  ): Promise<ShortUrlResponseDto> {
    const { url } = createShortUrlDto;

    if (!isValidUrl(url)) {
      this.logger.warn("Invalid URL format provided", requestId, { url });
      throw new BadRequestException("Invalid URL format");
    }

    const checkUniqueness = async (code: string) => {
      const exists = await this.urlsRepository.exists(code);
      return !exists;
    };

    const code = await generateUniqueCode(checkUniqueness);

    const urlEntity = await this.urlsRepository.create(code, url);

    const shortUrlBase = process.env.SHORT_URL_BASE;
    if (!shortUrlBase) {
      this.logger.error(
        "SHORT_URL_BASE environment variable is not set",
        requestId
      );
      throw new Error("Configuration error: SHORT_URL_BASE is required");
    }

    const shortUrl = `${shortUrlBase}/${code}`;

    this.logger.info("Short URL created successfully", requestId, {
      code,
      originalUrl: url,
    });

    return {
      code: urlEntity.code,
      short_url: shortUrl,
    };
  }

  async getOriginalUrl(code: string, requestId?: string): Promise<string> {
    const url = await this.urlsRepository.findByCode(code);

    if (!url) {
      this.logger.warn("Short URL not found", requestId, { code });
      throw new NotFoundException("Short URL not found");
    }

    return url.originalUrl;
  }

  async incrementAccessCount(code: string, requestId?: string): Promise<void> {
    await this.urlsRepository.incrementAccessCount(code);
    this.logger.debug("Access count incremented", requestId, { code });
  }
}
