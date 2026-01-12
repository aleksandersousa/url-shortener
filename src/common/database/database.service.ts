import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool, PoolClient } from "pg";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool | null = null;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
    const databaseUrl = this.configService.getOrThrow<string>("DATABASE_URL");

    try {
      this.pool = new Pool({
        connectionString: databaseUrl,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      this.pool.on("error", (err) => {
        this.logger.error("Unexpected database pool error", undefined, {
          error: err.message,
          stack: err.stack,
        });
      });

      this.logger.info("Database connection pool initialized");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(
        "Failed to initialize database connection pool",
        undefined,
        {
          error: errorMessage,
        }
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.info("Database connection pool closed");
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error("Database pool not initialized");
    }
    return await this.pool.connect();
  }

  getPool(): Pool {
    if (!this.pool) {
      throw new Error("Database pool not initialized");
    }
    return this.pool;
  }
}
