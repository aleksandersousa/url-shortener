# ARCHITECTURE

## Visão Geral

Arquitetura propositalmente simples para maximizar aprendizado em cloud.

```
ALB
 |
ECS Fargate
 |
PostgreSQL (RDS)
```

---

## Decisões Arquiteturais

- Monólito modular (mais simples)
- Sem cache (evitar complexidade)
- Stateless (facilita escala)
- Logs em stdout (CloudWatch)

---

## Banco de Dados

**Sistema:** PostgreSQL

**Configuração:**

- Local: Docker container ou instalação local
- Produção: AWS RDS PostgreSQL

**Conexão:**

- Via variável de ambiente `DATABASE_URL`
- Formato: `postgresql://user:pass@host:port/database`
- Ver `docs/DATABASE.md` para schema completo

**Características:**

- Tabela única: `urls`
- Índice único em `code` para lookups rápidos
- Stateless (sem sessões ou estado no banco)

---

## Configuração

**Abordagem:** Variáveis de ambiente apenas

**Variáveis principais:**

- `DATABASE_URL`: String de conexão PostgreSQL
- `SHORT_URL_BASE`: URL base para links curtos
- `PORT`: Porta da aplicação (padrão: 3000)
- `CODE_LENGTH`: Comprimento do código (padrão: 6)
- `NODE_ENV`: Ambiente (development/production)
- `LOG_LEVEL`: Nível de log (debug/info/warn/error)

**Ver `docs/ENV_VARS.md` para lista completa.**

---

## Logging

**Infraestrutura:**

- Logs estruturados em JSON
- Escrita em stdout/stderr
- Compatível com CloudWatch Logs (AWS)
- Formato padronizado com `requestId` para correlação

**Ver `docs/TECHNICAL_GUIDELINES.md` para formato detalhado.**

---

## Evoluções Futuras (não implementar agora)

- Redis
- CDN
- Rate limiting
- Multi-AZ
