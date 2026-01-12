import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class GetShortUrlParamsDto {
  @ApiProperty({
    description: "The short code for the URL",
    example: "abc123",
    type: String,
  })
  @IsString({ message: "Code must be a string" })
  @IsNotEmpty({ message: "Code is required" })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: "Code must contain only alphanumeric characters",
  })
  code: string;
}
