# TASKS

## Etapa 1 – Código

### Infraestrutura Base

- [x] Setup do projeto NestJS
- [x] docker-compose
- [x] Configuração de env vars
- [x] Logger estruturado
- [x] Middleware de requestId
- [x] Global Exception Filter
- [x] Swagger/OpenAPI documentation

### Banco de Dados

- [x] Configuração de conexão PostgreSQL (TypeORM ou pg)
- [x] Criação do schema (migration ou SQL script)
- [x] Validação de variáveis de ambiente no startup

### Módulo Urls - Camada de Domínio

- [x] DTOs (CreateShortUrlDto, ShortUrlResponseDto)
- [x] Entidade Url
- [x] Utility: Validação de URL
- [x] Utility: Geração de código (com retry e colisão)
- [x] Repository (acesso ao banco de dados)
- [x] Service (regras de negócio)

### Módulo Urls - Camada de API

- [x] Controller
- [x] POST /shorten
- [x] GET /:code (redirecionamento)

### Health Check

- [ ] Health Controller
- [ ] GET /health

### Finalização

- [ ] Validação de todos os endpoints
- [ ] Testes manuais básicos
