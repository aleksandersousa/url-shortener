import { ApiProperty } from "@nestjs/swagger";

export class CreateShortUrlDto {
  @ApiProperty({
    description: "The original URL to be shortened",
    example: "https://example.com/minha-url-muito-longa",
    type: String,
  })
  url: string;
}
