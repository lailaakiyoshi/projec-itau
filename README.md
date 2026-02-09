
# 📬 Desafio Técnico – API de Mensagens 


## 📑 Índice

* [Visão Geral](#-visão-geral)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Arquitetura](#-arquitetura)
* [Endpoints da API](#-endpoints-da-api)
* [Autenticação](#-autenticação)
* [Regras de Negócio e Validações](#-regras-de-negócio-e-validações)
* [Padronização de Erros](#-padronização-de-erros)
* [Logs e Observabilidade](#-logs-e-observabilidade)
* [Como Executar o Projeto](#-como-executar-o-projeto)
* [Testes Automatizados](#-testes-automatizados)

---

## 📌 Visão Geral

Esta aplicação é uma **API RESTful de mensagens**, que visa enviar, consultar e alterar mensagens. Desenvolvida em **Node.js com NestJS**, seguindo princípios de **Clean Architecture**, **boas práticas**, **validações robustas**, **logs estruturados** e **autenticação JWT**.

O projeto foi desenhado para ser **escalável** e **testável**, alcançando **100% de cobertura em testes unitários** e contemplando testes **End-to-End (E2E)** para fluxos críticos.

---

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js:** versão 18 ou superior - Runtime JavaScript
- **NestJS:** Framework para construção de aplicações escaláveis
- **TypeScript:** Linguagem base para garantir tipagem estática e segurança no código.
- **JWT :** Autenticação baseada em tokens

---

## 🧱 Arquitetura

O projeto segue os princípios da Clean Architecture e Arquitetura Hexagonal (Ports & Adapters), estabelecendo uma fundação onde a lógica de negócio é agnóstica em relação a frameworks, bancos de dados e ferramentas externas.

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
* Fácil evolução para outros serviços e integrações.

---

## 🔐 Autenticação

Todos os endpoints (exceto login) exigem autenticação via **JWT.**

**1. Realizar Login**

```POST /auth/login
Content-Type: application/json

{
  "username": "laila",
  "password": "123"
}```

**Exemplo de resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use o token no header para chamar os endpoints protegidos: Authorization: Bearer <token>

```http
Authorization: Bearer <token>
```

---

## 🔐 Endpoints da Api

# Autenticação

| Método | Caminho | Descrição | Autenticação |
| POST | /auth/login | Autenticação JWT | Não |

# Helth Check

| Método | Caminho | Descrição | Autenticação | Retorno |
| GET | /health | Health Check da API | Não | |

# Endpoint

``md
| Método | Caminho                                             | Descrição                          | Respostas                                                                                                                                        |
|------|-----------------------------------------------------|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| POST | `/auth/login`                                       | Autenticação JWT                   | **201** – Token gerado<br>**401** – Credenciais inválidas                                                                                          |
| GET  | `/health`                                           | Health Check da API                | **200** – API saudável                                                                                                                                 |
| POST | `/messages`                                         | Cria uma nova mensagem             | **201** – Mensagem criada<br>**400** – Payload inválido<br>**401** – Não autenticado                                                             |
| GET  | `/messages/:id`                                     | Busca uma mensagem por ID          | **200** – Mensagem encontrada<br>**400** – ID inválido<br>**404** – Mensagem não encontrada<br>**401** – Não autenticado                         |
| GET  | `/messages?sender=...`                              | Filtra mensagens por remetente     | **200** – Lista de mensagens (pode ser vazia)<br>**400** – Query inválida<br>**401** – Não autenticado                                           |
| GET  | `/messages?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Busca mensagens por período        | **200** – Lista de mensagens (pode ser vazia)<br>**400** – Datas inválidas ou incompletas<br>**401** – Não autenticado                           |
| PATCH| `/messages/:id/status`                              | Atualiza o status da mensagem      | **200** – Status atualizado<br>**400** – Status inválido ou transição inválida<br>**404** – Mensagem não encontrada<br>**401** – Não autenticado |

---

## ✅ Regra de Negócio e Validações

1. **Máquina de Estados (Status)**
O status de uma mensagem segue obrigatoriamente este fluxo:

* ✅ `SENT → RECEIVED`
* ✅ `RECEIVED → READ`
* ❌ `SENT → READ` (inválido)

2. **Filtros de Busca**

* **Exclusividade:** Apenas um tipo de filtro por vez (sender OU startDate + endDate). Se nenhum for informado, retorna 400.

* **Remetente:** Case-insensitive (Laila == lAiLa) e ignora espaços nas pontas.

* **Datas:** Formato **YYYY-MM-DD.** Intervalo inclusivo. Ambos os campos são obrigatórios.

3. **Validações de Entrada (DTOs)**
* **Global:** Remove campos desconhecidos e bloqueia payloads vazios.

* **Criação:**

- content: Obrigatório, máx 1000 chars.

- sender: Obrigatório, máx 80 chars.

* **Atualização:** Conversão automática de status (read → READ).

---

## ❌ Padronização de Erros

Todas as respostas de erro seguem o padrão RFC adaptado:

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

* **Quantidade:** 21 testes.
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









