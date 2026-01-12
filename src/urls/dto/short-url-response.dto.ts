import { ApiProperty } from "@nestjs/swagger";

export class ShortUrlResponseDto {
  @ApiProperty({
    description: "The short code for the URL",
    example: "abc123",
    type: String,
  })
  code: string;

  @ApiProperty({
    description: "The complete short URL",
    example: "https://short.ly/abc123",
    type: String,
  })
  short_url: string;
}
