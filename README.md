# URL Shortener

Simple URL shortener project focused on AWS learning and cloud deployment.

## Overview

This is a learning project to understand:

- NestJS framework
- TypeScript backend development
- AWS cloud infrastructure
- PostgreSQL database
- Docker containerization

**Note:** This project is **not commercial** and prioritizes simplicity and learning over production-scale features.

## Features

- Create short URLs from long URLs
- Redirect short URLs to original URLs
- Track access counts
- Health check endpoint
- Structured logging
- Docker support

## Tech Stack

- **Framework:** NestJS 11.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL
- **Architecture:** Monolithic modular

## Project Structure

```
url-shortener/
├── docs/              # Project documentation
├── src/               # Source code
├── .env.example       # Environment variables template
└── package.json       # Dependencies
```

## Documentation

All project documentation is in the `docs/` folder:

- **PRD.md** - Product requirements and specifications
- **ARCHITECTURE.md** - System architecture and decisions
- **API.md** - API endpoint specifications
- **DATABASE.md** - Database schema and design
- **ENV_VARS.md** - Environment variables reference
- **CODE_GENERATION.md** - Short code generation algorithm
- **TECHNICAL_GUIDELINES.md** - Coding standards and patterns
- **DEVELOPMENT_RULES.md** - Development workflow rules
- **TASKS.md** - Implementation checklist

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)
- Yarn or npm

### Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

4. Configure `.env` with your database connection

5. Start the application:
   ```bash
   yarn start:dev
   # or
   npm run start:dev
   ```

## Environment Variables

See `.env.example` for all required variables. Detailed documentation in `docs/ENV_VARS.md`.

**Required:**

- `DATABASE_URL` - PostgreSQL connection string
- `SHORT_URL_BASE` - Base URL for short links

**Optional:**

- `PORT` - Server port (default: 3000)
- `CODE_LENGTH` - Short code length (default: 6)
- `NODE_ENV` - Environment mode (default: development)
- `LOG_LEVEL` - Logging level (default: info)

## API Endpoints

- `POST /shorten` - Create a short URL
- `GET /{code}` - Redirect to original URL
- `GET /health` - Health check

See `docs/API.md` for complete API documentation.

## Development

### Rules

1. Never implement features outside the PRD
2. Always explain approach before generating code
3. Create code incrementally (one file at a time)
4. Prefer simple solutions
5. Don't introduce dependencies without justification

See `docs/DEVELOPMENT_RULES.md` for complete rules.

### Code Style

- Follow NestJS conventions
- Use TypeScript strict mode
- Follow SOLID principles pragmatically
- Prioritize readability over cleverness

See `docs/TECHNICAL_GUIDELINES.md` for detailed guidelines.

## Database

PostgreSQL database with a single `urls` table. See `docs/DATABASE.md` for complete schema.

## Docker

Docker support will be added in the implementation phase. See `docs/TASKS.md` for checklist.

## License

MIT

## Status

**Early Development** - Basic NestJS setup complete. See `docs/TASKS.md` for implementation progress.
