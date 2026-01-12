# Environment Variables

All configuration is done via environment variables. No hardcoded values.

---

## Required Variables

### DATABASE_URL

**Description:** PostgreSQL connection string

**Format:**

```
postgresql://username:password@host:port/database
```

**Example:**

```
DATABASE_URL=postgresql://user:password@localhost:5432/urlshortener
```

**Validation:**

- Must be a valid PostgreSQL connection string
- Must include username, password, host, port, and database name

**Production:**

- Provided by AWS RDS connection string
- Format: `postgresql://user:pass@rds-endpoint.region.rds.amazonaws.com:5432/dbname`

---

### SHORT_URL_BASE

**Description:** Base URL for generating short URL responses

**Format:** Full URL with protocol

**Example:**

```
SHORT_URL_BASE=https://short.ly
```

**Validation:**

- Must be a valid HTTP/HTTPS URL
- Must not end with a trailing slash
- Used to construct the `short_url` field in API responses

**Production:**

- Domain configured in AWS (e.g., `https://short.ly`)

---

## Optional Variables

### PORT

**Description:** Port number for the HTTP server

**Default:** `3000`

**Example:**

```
PORT=3000
```

**Validation:**

- Must be a valid port number (1-65535)
- Used by NestJS application to listen for requests

---

### CODE_LENGTH

**Description:** Length of generated short codes

**Default:** `6`

**Example:**

```
CODE_LENGTH=6
```

**Validation:**

- Must be a positive integer
- Recommended range: 4-10
- Shorter codes = higher collision probability
- Longer codes = less user-friendly

**Note:** Code length affects uniqueness probability. With 62 possible characters (a-z, A-Z, 0-9) and length 6, there are 62^6 = ~56 billion possible combinations.

---

### NODE_ENV

**Description:** Environment mode

**Default:** `development`

**Values:**

- `development`: Development mode (detailed errors, stack traces)
- `production`: Production mode (minimal error details)

**Example:**

```
NODE_ENV=production
```

**Behavior:**

- Affects error handling (stack traces in development only)
- May affect logging verbosity

---

### LOG_LEVEL

**Description:** Minimum log level to output

**Default:** `info`

**Values:**

- `debug`: All logs (most verbose)
- `info`: Info, warn, and error logs
- `warn`: Warn and error logs only
- `error`: Error logs only (least verbose)

**Example:**

```
LOG_LEVEL=debug
```

**Validation:**

- Must be one of: `debug`, `info`, `warn`, `error`

---

## Environment File Setup

### Development

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/urlshortener

# Application
PORT=3000
SHORT_URL_BASE=http://localhost:3000
CODE_LENGTH=6

# Environment
NODE_ENV=development
LOG_LEVEL=debug
```

### Production

Set environment variables in your deployment platform (AWS ECS, etc.):

```env
DATABASE_URL=postgresql://user:pass@rds-endpoint.region.rds.amazonaws.com:5432/dbname
PORT=3000
SHORT_URL_BASE=https://short.ly
CODE_LENGTH=6
NODE_ENV=production
LOG_LEVEL=info
```

---

## Variable Loading

**NestJS Configuration:**

- Uses `@nestjs/config` module for environment variable management
- Automatically loads `.env` file in development
- Loads from environment variables in production
- Global configuration module available throughout the application
- Validation occurs on application startup via `ConfigValidatorService`

**Validation:**

- Validate required variables on application startup
- Fail fast if required variables are missing
- Log warnings for missing optional variables with defaults
- Uses `ConfigService.getOrThrow()` for required variables

---

## Security Notes

- **Never commit `.env` files** to version control
- Use `.env.example` as a template (without sensitive values)
- In production, use secure secret management (AWS Secrets Manager, etc.)
- Database passwords should be strong and rotated regularly

---

## Example .env.example

See `.env.example` file in project root for a template.
