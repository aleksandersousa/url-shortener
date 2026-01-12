import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUrl } from "class-validator";

export class CreateShortUrlDto {
  @ApiProperty({
    description: "The original URL to be shortened",
    example: "https://example.com/minha-url-muito-longa",
    type: String,
  })
  @IsString({ message: "URL must be a string" })
  @IsNotEmpty({ message: "URL is required" })
  @IsUrl(
    {
      protocols: ["http", "https"],
      require_protocol: true,
      require_valid_protocol: true,
    },
    { message: "URL must be a valid HTTP or HTTPS URL" }
  )
  url: string;
}
