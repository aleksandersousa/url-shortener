# TECHNICAL_GUIDELINES

## 1. Princípios Gerais

- Priorizar simplicidade
- Evitar abstrações desnecessárias
- Código legível > código inteligente
- Seguir SOLID de forma pragmática

---

## 2. Estrutura de Pastas

```
src/
 ├── urls/
 │   ├── urls.controller.ts
 │   ├── urls.service.ts
 │   ├── urls.repository.ts
 │   ├── urls.module.ts
 ├── common/
 │   ├── filters/
 │   ├── logger/
 │   ├── middleware/
 ├── app.module.ts
 └── main.ts
```

---

## 3. Controllers

- Apenas recebem request e retornam response
- Não contêm lógica de negócio
- Não fazem try/catch

---

## 4. Services

- Contêm regras de negócio
- Lançam exceptions de domínio
- Não lidam com HTTP diretamente

---

## 5. Repositories

- Acesso a dados
- Não fazem log de sucesso
- Apenas logam erros técnicos

---

## 6. Logging Guidelines

- Logs sempre estruturados
- Nunca usar `console.log`
- Logar eventos relevantes
- Evitar logs excessivos

---

## 7. Error Handling Guidelines

- Usar apenas Global Exception Filter
- Nunca retornar stack trace ao cliente
- Padronizar payloads

---

## 8. URL Validation Rules

- URL deve ser válida (formato HTTP/HTTPS)
- Deve começar com `http://` ou `https://`
- Deve ter formato de domínio válido
- URLs relativas são rejeitadas
- URLs vazias ou nulas são rejeitadas
- Usar validação nativa do Node.js ou NestJS validation pipes

---

## 9. Code Generation Guidelines

- Gerar código alfanumérico aleatório (a-z, A-Z, 0-9)
- Comprimento configurável via `CODE_LENGTH` (padrão: 6)
- Código deve ser único (verificar no banco)
- Em caso de colisão, gerar novo código (máximo 3 tentativas)
- Usar gerador criptograficamente seguro (`crypto.randomBytes`)
- Ver detalhes completos em `docs/CODE_GENERATION.md`

---

## 10. Logging Format

**Formato:** JSON estruturado

**Campos obrigatórios:**

- `timestamp`: ISO 8601
- `level`: info, warn, error, debug
- `requestId`: UUID para correlação
- `message`: Mensagem legível
- `context`: Objeto opcional com contexto

**Exemplo:**

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Short URL created",
  "context": {
    "code": "abc123",
    "originalUrl": "https://example.com"
  }
}
```

**Regras:**

- Nunca usar `console.log`
- Logs em stdout/stderr (compatível com CloudWatch)
- Logar eventos de criação e acesso de URLs
- Repositories logam apenas erros técnicos
- Services logam eventos de negócio
- Controllers não fazem log diretamente

---

## 11. Error Response Format

**Formato padrão:**

```json
{
  "statusCode": 400,
  "message": "Mensagem de erro",
  "error": "Tipo do Erro",
  "requestId": "uuid-aqui"
}
```

**Campos:**

- `statusCode`: Código HTTP (número)
- `message`: Mensagem legível (string)
- `error`: Tipo/categoria do erro (string)
- `requestId`: Identificador único da requisição (UUID)

**Status Codes:**

- `400`: Bad Request - Entrada inválida
- `404`: Not Found - Recurso não encontrado
- `500`: Internal Server Error - Erro do servidor
