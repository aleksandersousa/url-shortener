export class Url {
  id: string;
  code: string;
  originalUrl: string;
  accessCount: number;
  createdAt: Date;

  constructor(
    id: string,
    code: string,
    originalUrl: string,
    accessCount: number,
    createdAt: Date
  ) {
    this.id = id;
    this.code = code;
    this.originalUrl = originalUrl;
    this.accessCount = accessCount;
    this.createdAt = createdAt;
  }

  static fromRow(row: {
    id: string;
    code: string;
    original_url: string;
    access_count: number;
    created_at: Date;
  }): Url {
    return new Url(
      row.id,
      row.code,
      row.original_url,
      row.access_count,
      row.created_at
    );
  }
}
