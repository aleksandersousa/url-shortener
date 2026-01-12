export class ConfigValidatorService {
  validate(): void {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.validateRequired(errors);
    this.validateOptional(warnings);

    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        console.warn(`[Config] ${warning}`);
      });
    }

    if (errors.length > 0) {
      const errorMessage = `Environment variable validation failed:\n${errors.join(
        "\n"
      )}`;
      console.error(`[Config] ${errorMessage}`);
      process.exit(1);
    }
  }

  private validateRequired(errors: string[]): void {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      errors.push("DATABASE_URL is required");
    } else if (!this.isValidPostgresUrl(databaseUrl)) {
      errors.push(
        "DATABASE_URL must be a valid PostgreSQL connection string (format: postgresql://user:pass@host:port/db)"
      );
    }

    const shortUrlBase = process.env.SHORT_URL_BASE;
    if (!shortUrlBase) {
      errors.push("SHORT_URL_BASE is required");
    } else if (!this.isValidUrl(shortUrlBase)) {
      errors.push("SHORT_URL_BASE must be a valid HTTP/HTTPS URL");
    } else if (shortUrlBase.endsWith("/")) {
      errors.push("SHORT_URL_BASE must not end with a trailing slash");
    }
  }

  private validateOptional(warnings: string[]): void {
    const port = process.env.PORT;
    if (port !== undefined) {
      const portNum = parseInt(port, 10);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        warnings.push(
          `PORT must be a valid port number (1-65535), using default: 3000`
        );
      }
    }

    const codeLength = process.env.CODE_LENGTH;
    if (codeLength !== undefined) {
      const codeLengthNum = parseInt(codeLength, 10);
      if (isNaN(codeLengthNum) || codeLengthNum < 1) {
        warnings.push(
          `CODE_LENGTH must be a positive integer, using default: 6`
        );
      } else if (codeLengthNum < 4 || codeLengthNum > 10) {
        warnings.push(
          `CODE_LENGTH is outside recommended range (4-10), current: ${codeLengthNum}`
        );
      }
    }

    const logLevel = process.env.LOG_LEVEL;
    if (logLevel !== undefined) {
      const validLogLevels = ["debug", "info", "warn", "error"];
      if (!validLogLevels.includes(logLevel.toLowerCase())) {
        warnings.push(
          `LOG_LEVEL must be one of: ${validLogLevels.join(
            ", "
          )}, using default: info`
        );
      }
    }

    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv !== undefined) {
      const validNodeEnvs = ["development", "production"];
      if (!validNodeEnvs.includes(nodeEnv.toLowerCase())) {
        warnings.push(
          `NODE_ENV should be one of: ${validNodeEnvs.join(
            ", "
          )}, current: ${nodeEnv}`
        );
      }
    }
  }

  private isValidPostgresUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.protocol === "postgresql:" || urlObj.protocol === "postgres:"
      );
    } catch {
      return false;
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  }
}
