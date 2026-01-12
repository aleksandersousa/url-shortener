# API Specification

## Base URL

All endpoints are relative to the base URL. In development: `http://localhost:5000`

---

## Endpoints

### POST /shorten

Creates a short URL from an original URL.

**Request:**

```http
POST /shorten
Content-Type: application/json
```

**Request Body:**

```json
{
  "url": "https://example.com/minha-url-muito-longa"
}
```

**Success Response (200 OK):**

```json
{
  "code": "abc123",
  "short_url": "https://short.ly/abc123"
}
```

**Error Responses:**

**400 Bad Request** - Invalid URL format

```json
{
  "statusCode": 400,
  "message": "Invalid URL format",
  "error": "Bad Request",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**500 Internal Server Error** - Server error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validation Rules:**

- URL must be a valid HTTP/HTTPS URL
- URL must start with `http://` or `https://`
- URL must have a valid domain format
- Relative URLs are rejected
- Empty or null URLs are rejected

---

### GET /{code}

Redirects to the original URL associated with the short code.

**Request:**

```http
GET /abc123
```

**Success Response:**

**301 Moved Permanently** or **302 Found**

```http
HTTP/1.1 301 Moved Permanently
Location: https://example.com/minha-url-muito-longa
```

**Behavior:**

- Looks up the code in the database
- Increments the `access_count` field
- Returns HTTP redirect (301 or 302) to the original URL

**Error Responses:**

**404 Not Found** - Code does not exist

```json
{
  "statusCode": 404,
  "message": "Short URL not found",
  "error": "Not Found",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**500 Internal Server Error** - Server error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### GET /health

Health check endpoint for monitoring and load balancer integration.

**Request:**

```http
GET /health
```

**Success Response (200 OK):**

```json
{
  "status": "ok"
}
```

**Behavior:**

- Should respond quickly
- No database queries required
- Used by load balancers and monitoring systems

---

## Error Response Format

All error responses follow this structure:

```json
{
  "statusCode": 400,
  "message": "Error message describing what went wrong",
  "error": "Error Type",
  "requestId": "uuid-here"
}
```

**Fields:**

- `statusCode`: HTTP status code (number)
- `message`: Human-readable error message (string)
- `error`: Error type/category (string)
- `requestId`: Unique request identifier for correlation (UUID string)

**Status Codes:**

- `400`: Bad Request - Invalid input
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server-side error

---

## Request Headers

**Content-Type:**

- Required for POST requests: `application/json`

**Accept:**

- Optional: `application/json` (default)

---

## Response Headers

**Content-Type:**

- JSON responses: `application/json`

**Location:**

- Redirect responses: Contains the original URL

---

## API Documentation

Interactive API documentation is available via Swagger/OpenAPI:

- **Development:** `http://localhost:5000/api`
- Swagger UI provides interactive testing and endpoint documentation
- All endpoints, request/response schemas, and error formats are documented

---

## Notes

- All timestamps are in ISO 8601 format
- All UUIDs are version 4 (random)
- Request IDs are included in all responses for correlation
- No authentication required (out of scope)
- No rate limiting (out of scope)
