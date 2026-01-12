import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../common/database/database.service";
import { LoggerService } from "../common/logger/logger.service";
import { Url } from "./url.entity";
import { SCHEMA_NAMES, TABLE_NAMES } from "src/common/database/tableNames";

@Injectable()
export class UrlsRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logger: LoggerService
  ) {}

  async findByCode(code: string): Promise<Url | null> {
    const pool = this.databaseService.getPool();
    try {
      const result = await pool.query(
        `SELECT id, code, original_url, access_count, created_at FROM ${SCHEMA_NAMES.URL_SHORTENER}.${TABLE_NAMES.URLS} WHERE code = $1`,
        [code]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return Url.fromRow(result.rows[0]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Failed to find URL by code", undefined, {
        error: errorMessage,
        code,
      });
      throw error;
    }
  }

  async exists(code: string): Promise<boolean> {
    const pool = this.databaseService.getPool();
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as count FROM ${SCHEMA_NAMES.URL_SHORTENER}.${TABLE_NAMES.URLS} WHERE code = $1`,
        [code]
      );

      return parseInt(result.rows[0].count, 10) > 0;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Failed to check code existence", undefined, {
        error: errorMessage,
        code,
      });
      throw error;
    }
  }

  async create(code: string, originalUrl: string): Promise<Url> {
    const pool = this.databaseService.getPool();
    try {
      const result = await pool.query(
        `INSERT INTO ${SCHEMA_NAMES.URL_SHORTENER}.${TABLE_NAMES.URLS} (code, original_url) VALUES ($1, $2) RETURNING id, code, original_url, access_count, created_at`,
        [code, originalUrl]
      );

      return Url.fromRow(result.rows[0]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Failed to create URL", undefined, {
        error: errorMessage,
        code,
        originalUrl,
      });
      throw error;
    }
  }

  async incrementAccessCount(code: string): Promise<void> {
    const pool = this.databaseService.getPool();
    try {
      await pool.query(
        `UPDATE ${SCHEMA_NAMES.URL_SHORTENER}.${TABLE_NAMES.URLS} SET access_count = access_count + 1 WHERE code = $1`,
        [code]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Failed to increment access count", undefined, {
        error: errorMessage,
        code,
      });
      throw error;
    }
  }
}
