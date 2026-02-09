# 📬 Desafio Técnico – API de Mensagens

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Autenticação](#-autenticação)
- [Health Check](#-health-check)
- [Endpoints da API](#-endpoints-da-api)
- [Regras de Negócio e Validações](#-regras-de-negócio-e-validações)
- [Padronização de Erros](#-padronização-de-erros)
- [Logs e Observabilidade](#-logs-e-observabilidade)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Testes Automatizados](#-testes-automatizados)

---

## 📌 Visão Geral

Esta aplicação é uma **API RESTful de mensagens**, responsável por:

- Criar mensagens
- Consultar mensagens por **ID**
- Consultar mensagens por **remetente**
- Consultar mensagens por **período**
- Atualizar o **status** da mensagem

Desenvolvida com **Node.js + NestJS**, seguindo princípios de:

- **Clean Architecture**
- **Arquitetura Hexagonal (Ports & Adapters)**
- **Validações explícitas**
- **Autenticação JWT**
- **Logs estruturados**
- **Testes unitários e E2E**

A API foi desenhada para ser **escalável, previsível e testável**, com **100% de cobertura em testes unitários**.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** (>= 18)
- **NestJS**
- **TypeScript**
- **JWT (JSON Web Token)**

### Testes
- **Jest**
- **Supertest**

---

## 🧱 Arquitetura

O projeto segue **Clean Architecture + Hexagonal**, separando claramente responsabilidades.

```
domain/ → Entidades e regras puras
application/ → Casos de uso (regras de negócio)
infrastructure/ → Repositórios e implementações técnicas
interfaces/ → Controllers HTTP
shared/ → Filtros, interceptors e utilitários
```

**Benefícios:**

* Alta testabilidade
* Baixo acoplamento
* Fácil evolução para outros serviços e integrações.

---

## 🔐 Autenticação

Todos os endpoints (exceto login) exigem autenticação via **JWT.**

**1. Realizar Login**

```POST /auth/login
Content-Type: application/json```

**Body**

```{
  "username": "laila",
  "password": "123"
}```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Use o token** no header para chamar os endpoints protegidos: **Authorization: Bearer <token>**

```http
Authorization: Bearer <token>
```

---

## Regras de Token

* Token inválido → 401 Unauthorized
* Token expirado → 401 Unauthorized
* Token ausente → 401 Unauthorized


## ❤️ Health Check

Endpoint utilizado para verificar se a API está ativa e respondendo corretamente.

| Método | Caminho   | Descrição           | Autenticação | Retorno |
|--------|-----------|---------------------|--------------|---------|
| GET    | `/health` | Health check da API | Não          | `{"status":"ok","timestamp":"2026-02-09T01:07:54.694Z"}` |

## Endpoints da API

| Método | Caminho                                             | Descrição           | Respostas                          |
| ------ | --------------------------------------------------- | ------------------- | ---------------------------------- |
| POST   | `/auth/login`                                       | Autenticação JWT    | **201**, **401**                   |
| GET    | `/health`                                           | Health Check        | **200**                            |
| POST   | `/messages`                                         | Cria mensagem       | **201**, **400**, **401**          |
| GET    | `/messages/:id`                                     | Busca por ID        | **200**, **400**, **404**, **401** |
| GET    | `/messages?sender=...`                              | Busca por remetente | **200**, **400**, **404**, **401** |
| GET    | `/messages?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Busca por período   | **200**, **400**, **404**, **401** |
| PATCH  | `/messages/:id/status`                              | Atualiza status     | **200**, **400**, **404**, **401** |

---

## ✅ Regra de Negócio e Validações

1. **Status da Mensagem (Máquina de Estados)**
O status de uma mensagem segue obrigatoriamente este fluxo:

* ✅ `SENT → RECEIVED`
* ✅ `RECEIVED → READ`
* ❌ `SENT → READ` (inválido)

2. **Criação de Mensagem**

* content: obrigatório (máx. 1000 caracteres)
* sender: obrigatório (máx. 80 caracteres)
* Payload inválido → 400

3. **Busca por ID**

* ID inválido → 400
* ID inexistente → 404

4. **Busca por Remetente**

* sender obrigatório
* Case-insensitive (Laila = lAiLa)
* Espaços nas extremidades são ignorados
* sender vazio → **400 Bad Request**
* Nenhuma mensagem encontrada → **404 Not Found**

5. **Busca por Periodo**

* startDate e endDate obrigatórios
* Formato: YYYY-MM-DD
* Intervalo inclusivo
* startDate > endDate → **400**
* Datas inválidas → **400**
* Nenhuma mensagem no período → **404 Not Found**

6.  **Exclusividade de Filtros**

* Apenas um tipo de filtro por vez
   - sender **OU**
   - startDate + endDate
* Nenhum filtro informado → **400 Bad Reques**

---

## ❌ Padronização de Erros

Todas as respostas de erro seguem um padrão consistente:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "sender is required",
  "path": "/messages",
  "method": "GET",
  "timestamp": "2026-02-08T10:30:00.000Z",
  "requestId": "c9878ee4-e54b-41ac-9a89-4a5dc627bb3b"
}
```
---

## 📊 **Logs e Observabilidade**

* Cada request recebe um **requestId** único.
* Logs estruturados em **JSON**, prontos para **CloudWatch / Datadog / ELK.**

Exemplo de log:

```json
{
  "level": "info",
  "msg": "HTTP request",
  "method": "GET",
  "path": "/messages",
  "statusCode": 200,
  "durationMs": 12,
  "requestId": "efe2afef-b9d0-4dc0-8cd8-4420200daf71"
}
```
---

## 🚀 Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Rodar a aplicação
npm run start:dev
```

**API disponível em:**

```
http://localhost:3000
```
---

## 🧪 Testes Automatizados

1. **Testes Unitários**
Focam na lógica de domínio e regras de negócio.

* **Quantidade:** 30 testes.
* **Cobertura:** 100% (Statements, Branches, Functions, Lines).

```bash
npm test
npm run test:cov
```

2. **Testes End-to-End (E2E)**
Validam o fluxo completo da API, simulando o consumidor final com Supertest.

**Cenários Cobertos:**
* ✅ Autenticação via JWT.
* ✅ CRUD completo de mensagens.
* ✅ Validação de transições de status (SENT → RECEIVED → READ).
* ✅ Filtros complexos (Case-insensitive e Datas).

As credenciais de autenticação são injetadas automaticamente no ambiente de testes.

```
npm run test:e2e
```
---









