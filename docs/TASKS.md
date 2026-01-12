# TASKS

## Etapa 1 – Código

### Infraestrutura Base

- [x] Setup do projeto NestJS
- [x] docker-compose
- [x] Configuração de env vars
- [x] Logger estruturado
- [ ] Middleware de requestId
- [ ] Global Exception Filter

### Banco de Dados

- [ ] Configuração de conexão PostgreSQL (TypeORM ou pg)
- [ ] Criação do schema (migration ou SQL script)
- [ ] Validação de variáveis de ambiente no startup

### Módulo Urls - Camada de Domínio

- [ ] DTOs (CreateShortUrlDto, ShortUrlResponseDto)
- [ ] Entidade Url
- [ ] Utility: Validação de URL
- [ ] Utility: Geração de código (com retry e colisão)
- [ ] Repository (acesso ao banco de dados)
- [ ] Service (regras de negócio)

### Módulo Urls - Camada de API

- [ ] Controller
- [ ] POST /shorten
- [ ] GET /:code (redirecionamento)

### Health Check

- [ ] Health Controller
- [ ] GET /health

### Finalização

- [ ] Validação de todos os endpoints
- [ ] Testes manuais básicos
