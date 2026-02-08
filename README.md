
# 📬 Desafio Técnico – API de Mensagens 

## 📌 Visão Geral

Esta aplicação é uma **API RESTful de mensagens**, que visa enviar, consultar e alterar mensagnes.Desenvolvida em **Node.js com NestJS**, seguindo princípios de **Clean Architecture**, **boas práticas**, **validações robustas**, **logs estruturados** e **autenticação JWT**.
O projeto foi desenhado para ser **escalável** e **testável**, alcançando **100% de cobertura em testes unitários** e contemplando testes **End-to-End (E2E)** para fluxos críticos.

---

## 📑 Índice

* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Arquitetura](#-arquitetura)
* [Endpoints da API](#-endpoints-da-api)
* [Autenticação](#-autenticação)
* [Regras de Negócio e Validações](#-regras-de-negócio-e-validações)
* [Padronização de Erros e Logs](#-padronização-de-erros-e-logs)
* [Como Executar o Projeto](#-como-executar-o-projeto)
* [Testes (Unitários e E2E)](#-testes-automatizados)
* [Logs e Observabilidade](#-logs-e-observabilidade)

---

## 🛠️ Tecnologias Utilizadas

* **Node.js**
* **NestJS**
* **TypeScript**
* **JWT (Autenticação)**
* **class-validator / class-transformer**
* **Jest (testes unitários)**
* **Clean Architecture com Arquitetura Hexagonal (Domain / Application / Infrastructure / Interfaces)**
* **Persistência: DynamoDB (NoSQL) com implementação via Repositories (Pattern).**

---

## 🧱 Arquitetura

Princípios da Clean Architecture e Arquitetura Hexagonal (Ports & Adapters), estabelecendo uma fundação onde a lógica de negócio é agnóstica em relação a frameworks, bancos de dados e ferramentas externas.

**Organização em camadas:**

```
domain/
application/
infrastructure/
interfaces/
shared/
```

**Benefícios:**

* Alta testabilidade
* Baixo acoplamento
* Fácil evolução para banco real (DynamoDB, PostgreSQL, etc.)

---

## 🔐 Endpoints da Api

| Método | Caminho                                             | Descrição                      | Respostas                                                                                                                                        |
| ------ | --------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/messages`                                         | Cria uma nova mensagem         | **201** – Mensagem criada<br>**400** – Payload inválido<br>**401** – Não autenticado                                                             |
| GET    | `/messages/:id`                                     | Busca uma mensagem por ID      | **200** – Mensagem encontrada<br>**400** – ID inválido (não UUID)<br>**404** – Mensagem não encontrada<br>**401** – Não autenticado              |
| GET    | `/messages?sender=...`                              | Filtra mensagens por remetente | **200** – Lista de mensagens (pode ser vazia)<br>**400** – Query inválida<br>**401** – Não autenticado                                           |
| PATCH  | `/messages/:id/status`                              | Atualiza o status da mensagem  | **200** – Status atualizado<br>**400** – Status inválido ou transição inválida<br>**404** – Mensagem não encontrada<br>**401** – Não autenticado |
| GET    | `/messages?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Busca mensagens por período    | **200** – Lista de mensagens (pode ser vazia)<br>**400** – Datas inválidas ou incompletas<br>**401** – Não autenticado                           |

---

## 🔐 Autenticação

Todas os endpoints exigem autenticação via **JWT**.

**Login**

```http
POST /auth/login
```

**Body:**
```{
  "username": "laila",
  "password": "123"
}```

**Exemplo de resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use o token no header para chamar os endpoints:

```http
Authorization: Bearer <token>
```

---

## ✅ Validações Implementadas

Regra de negócio: o status de uma mensagem segue obrigatoriamente o fluxo.

* ✅ `SENT → RECEIVED`
* ✅ `RECEIVED → READ`
* ❌ `SENT → READ` (inválido)

---

Validações para mensagens por remetente:

* Case-insensitive (`Laila`, `lAiLa`)
* Espaços são ignorados (`"  laila  "`)

---

## Regra de Negócios e Validações

* Datas no formato **YYYY-MM-DD**
* Intervalo **inclusivo**
* `startDate` e `endDate` são obrigatórios juntos
* Retorna array vazio se não houver mensagens no período


Filtros: apenas **um tipo de filtro por vez**:

  * `sender`
  * ou `startDate + endDate`
* Se nenhum filtro for informado → **400**

**Validação Global:**

* Remove campos desconhecidos
* Bloqueia payloads inválidos
* Converte tipos automaticamente

**Criação de Mensagem:**

* `content`:

  * obrigatório
  * máximo de 1000 caracteres
  * não aceita string vazia
* `sender`:

  * obrigatório
  * máximo de 80 caracteres
  * não aceita string vazia


**Atualização de Status:**

* Status obrigatório
* Apenas valores do enum permitido
* Conversão automática (`read` → `READ`)


**Filtros de Query:**

* `sender`: máximo 80 caracteres
* `startDate` / `endDate`:

  * formato `YYYY-MM-DD`
  * validação de intervalo lógico

---

## ❌ Padronização de Erros

Todas as respostas de erro seguem o mesmo formato:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid status transition: SENT -> READ",
  "path": "/messages/123/status",
  "method": "PATCH",
  "timestamp": "2026-02-08T10:30:00.000Z",
  "requestId": "c9878ee4-e54b-41ac-9a89-4a5dc627bb3b"
}
```

---

## 🚀 Como Executar o Projeto

```bash
npm install
npm run start:dev
```

API disponível em:

```
http://localhost:3000
```
---

## 🧪 Testes Automatizados

* **21 testes unitários**
* **100% de cobertura**:

  * Statements
  * Branches
  * Functions
  * Lines

Rodar testes:

```bash
npm test
```

Rodar cobertura:

```bash
npm run test:cov
```

---

 **Testes End-to-End (E2E)**

Além dos testes unitários, o projeto possui testes ***end-to-end (E2E)*** que validam o fluxo completo da API, incluindo autenticação, regras de negócio e filtros.

**Os testes E2E utilizam:**

* Jest
* Supertest

**Os testes E2E validam os seguintes fluxos:**

✅ Autenticação via JWT (POST /auth/login)
✅ Criação de mensagem autenticada (POST /messages)
✅ Busca de mensagem por ID (GET /messages/:id)
✅ Atualização de status com transições válidas:
    * SENT → RECEIVED
    * RECEIVED → READ
✅ Atualização de status com input case-insensitive (received, read)
✅ Filtro de mensagens por remetente (case-insensitive)
✅ Filtro de mensagens por período (YYYY-MM-DD)
✅ Garantia de que mensagens criadas aparecem nos filtros

Esses testes asseguram que a API funciona corretamente do ponto de vista do consumidor final.

▶️ **Como rodar os testes E2E**

```
npm run test:e2e
```

Durante os testes E2E, as credenciais de autenticação são definidas automaticamente no ambiente de teste para garantir consistência e isolamento.

---

## 📊 Logs e Observabilidade

* Cada request recebe um **requestId**
* Logs estruturados em **JSON**
* Pronto para integração com **CloudWatch / Datadog / ELK**

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








