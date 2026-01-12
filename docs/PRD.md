# PRD – URL Shortener (Projeto de Aprendizado AWS)

## 1. Visão Geral

### 1.1 Objetivo do Produto

Criar um **encurtador de URLs simples**, com foco exclusivo em **aprendizado técnico**, especialmente para servir como base de estudo e posterior deploy em AWS.

O projeto **não tem objetivo comercial**, nem requisitos de escala extrema. Ele deve ser:

- Simples de entender
- Simples de manter
- Fácil de evoluir para aprender infraestrutura em cloud

### 1.2 Público-alvo

- Desenvolvedor backend/fullstack
- Nível mid-level
- Objetivo: aprender AWS e cloud fundamentals

### 1.3 Problema que o produto resolve

Permitir que um usuário:

- Encurte uma URL longa
- Acesse a URL curta
- Seja redirecionado para a URL original

---

## 2. Escopo do Projeto

### 2.1 O que ESTÁ no escopo

- API HTTP
- Criação de URLs curtas
- Redirecionamento
- Contagem simples de acessos
- Persistência em banco de dados
- Health check para monitoramento

### 2.2 O que NÃO está no escopo (intencionalmente)

- Autenticação de usuários
- Interface gráfica (frontend)
- Alta disponibilidade
- Cache distribuído
- Rate limiting
- URLs customizadas
- Expiração automática de links (fase inicial)
- Analytics avançado

Esses itens ficam fora para **reduzir complexidade** e manter foco em AWS.

---

## 3. Requisitos Funcionais

### RF-01 – Criar URL curta

O sistema deve permitir criar uma URL curta a partir de uma URL original.

**Entrada:**

- URL original (string)

**Saída:**

- Código curto
- URL encurtada completa

---

### RF-02 – Redirecionar URL curta

O sistema deve redirecionar o usuário da URL curta para a URL original.

**Comportamento:**

- Incrementar contador de acessos
- Retornar HTTP 301 ou 302

---

### RF-03 – Consultar health check

O sistema deve expor um endpoint para verificação de saúde.

**Objetivo:**

- Monitoramento
- Integração futura com Load Balancer

---

## 4. Requisitos Não Funcionais

### RNF-01 – Simplicidade

A solução deve priorizar simplicidade de código e arquitetura.

---

### RNF-02 – Observabilidade básica

- Logs estruturados
- Logs para criação e acesso de URLs

---

### RNF-03 – Portabilidade

A aplicação deve rodar:

- Localmente (Docker)
- Em ambiente cloud futuramente

---

### RNF-04 – Performance aceitável

- Redirecionamento em tempo razoável
- Sem requisitos de latência extrema

---

## 5. API – Especificação Inicial

### 5.1 Criar URL curta

**Endpoint:**

```
POST /shorten
```

**Request body:**

```json
{
  "url": "https://example.com/minha-url-muito-longa"
}
```

**Response:**

```json
{
  "code": "abc123",
  "short_url": "https://short.ly/abc123"
}
```

---

### 5.2 Redirecionar URL

**Endpoint:**

```
GET /{code}
```

**Comportamento:**

- Busca o código no banco
- Incrementa contador
- Redireciona

---

### 5.3 Health Check

**Endpoint:**

```
GET /health
```

**Response:**

```json
{
  "status": "ok"
}
```

---

## 6. Modelo de Dados

### 6.1 Tabela: urls

| Campo        | Tipo           | Descrição             |
| ------------ | -------------- | --------------------- |
| id           | integer / uuid | Identificador interno |
| code         | string         | Código curto único    |
| original_url | string         | URL original          |
| access_count | integer        | Quantidade de acessos |
| created_at   | timestamp      | Data de criação       |

---

## 7. Regras de Negócio

- O código curto deve ser único
- URLs inválidas devem ser rejeitadas
- Caso o código não exista, retornar erro apropriado (404)

### 7.1 Validação de URL

- URL deve ser válida (formato HTTP/HTTPS)
- Deve começar com `http://` ou `https://`
- Deve ter formato de domínio válido
- URLs relativas são rejeitadas
- URLs vazias ou nulas são rejeitadas
- Validação deve ocorrer antes de salvar no banco

### 7.2 Geração de Código

- Código deve ser alfanumérico (a-z, A-Z, 0-9)
- Comprimento padrão: 6 caracteres (configurável)
- Código deve ser único no banco de dados
- Em caso de colisão, gerar novo código (máximo 3 tentativas)
- Usar gerador criptograficamente seguro
- Ver detalhes em `docs/CODE_GENERATION.md`

---

## 8. Considerações Técnicas (Fase de Código)

### 8.1 Stack Técnica

- **Framework:** NestJS
- **Linguagem:** TypeScript
- **Arquitetura:** Monólito modular
- **Padrão:** Simples, seguindo princípios SOLID e Clean Code
- **Aplicação stateless** (12-factor app)

---

### 8.2 Estrutura de Projeto

- Estrutura padrão do NestJS (`modules`, `controllers`, `services`)
- Um único módulo principal para o domínio de URLs
- Separação clara entre Controller, Service e Repository

---

### 8.3 Logging

- Logs estruturados em JSON
- Escrita em stdout/stderr (compatível com CloudWatch)
- Níveis: `info`, `warn`, `error`, `debug`
- Inclusão de `requestId` em todos os logs
- Nenhum log em arquivo

---

### 8.4 Error Handling

- Uso de **Global Exception Filter**
- Exceptions de domínio baseadas em `HttpException`
- Payload de erro padronizado
- Stack trace apenas para erros inesperados (5xx)
- Nenhum `try/catch` espalhado no código

---

### 8.5 Configuração

- Configuração via variáveis de ambiente
- Nenhuma configuração hardcoded
- Compatível com execução local e cloud

---

## 9. Critérios de Aceitação

- Criar URL curta com sucesso
- Redirecionar corretamente
- Contador de acessos funcionando
- Health check respondendo
- Aplicação rodando via Docker

---

## 10. Métricas de Sucesso do Projeto

- Código simples e legível
- Fácil de subir e derrubar ambiente
- Infra poderá ser adicionada sem refatorar código
- Projeto explicável em entrevistas técnicas

---

## 11. Evoluções Futuras (fora do escopo atual)

- Expiração de URLs
- Cache (Redis)
- CDN
- Autenticação
- Rate limiting
- Analytics

Essas evoluções existem **apenas como estudo posterior**.
