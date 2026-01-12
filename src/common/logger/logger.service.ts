type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  requestId?: string;
  message: string;
  context?: Record<string, unknown>;
}

export class LoggerService {
  private readonly logLevel: LogLevel;
  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    const envLogLevel = (
      process.env.LOG_LEVEL || "info"
    ).toLowerCase() as LogLevel;
    this.logLevel = this.isValidLogLevel(envLogLevel) ? envLogLevel : "info";
  }

  private isValidLogLevel(level: string): level is LogLevel {
    return ["debug", "info", "warn", "error"].includes(level);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  private writeLog(level: LogLevel, entry: LogEntry): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formatted = this.formatLog(entry);
    const output = level === "error" ? process.stderr : process.stdout;
    output.write(formatted + "\n");
  }

  debug(
    message: string,
    requestId?: string,
    context?: Record<string, unknown>
  ): void {
    this.writeLog("debug", {
      timestamp: new Date().toISOString(),
      level: "debug",
      requestId,
      message,
      context,
    });
  }

  info(
    message: string,
    requestId?: string,
    context?: Record<string, unknown>
  ): void {
    this.writeLog("info", {
      timestamp: new Date().toISOString(),
      level: "info",
      requestId,
      message,
      context,
    });
  }

  warn(
    message: string,
    requestId?: string,
    context?: Record<string, unknown>
  ): void {
    this.writeLog("warn", {
      timestamp: new Date().toISOString(),
      level: "warn",
      requestId,
      message,
      context,
    });
  }

  error(
    message: string,
    requestId?: string,
    context?: Record<string, unknown>
  ): void {
    this.writeLog("error", {
      timestamp: new Date().toISOString(),
      level: "error",
      requestId,
      message,
      context,
    });
  }
}
