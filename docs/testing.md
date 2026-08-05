---
sidebar_position: 5
title: "Testes"
description: "Estratégia de testes, como executar a suite e exemplos de casos de teste da API do MercaPeças."
---

# Testes

A API do MercaPeças possui uma suite de testes automatizados cobrindo o módulo de e-mail com **testes unitários** e **testes de integração HTTP**.

**Framework de testes:** [Vitest](https://vitest.dev/)
**Biblioteca de requisições HTTP:** [Supertest](https://github.com/ladjs/supertest)

---

## Executando os Testes

### Executar todos os testes

```bash
npm run test
```

### Executar com watch mode (re-executa ao salvar)

```bash
npx vitest
```

### Executar com relatório de cobertura

```bash
npx vitest run --coverage
```

---

## Estrutura dos Arquivos de Teste

```text
tests/
└── email.routes.spec.ts       # Testes de integração do endpoint POST /email

src/modules/email/
└── email.service.spec.ts      # Testes unitários do EmailService
```

---

## Testes Unitários — `EmailService`

**Arquivo:** `src/modules/email/email.service.spec.ts`

Testa a lógica de negócio do `EmailService` em isolamento, usando um **mock do `EmailProvider`** para evitar chamadas HTTP reais.

### Casos Testados

| # | Descrição | Assertiva |
|---|---|---|
| 1 | Deve chamar o provider com o assunto correto | `subject` contém `"Novo Contato"` e o nome do contato |
| 2 | Deve definir o `replyTo` como o e-mail do contato | `params.replyTo === "joao@example.com"` |
| 3 | Deve incluir nome, e-mail, telefone e mensagem no corpo | `content` contém todos os campos do input |
| 4 | Deve retornar o ID retornado pelo provider em sucesso | `result.id === "test-id-123"` |
| 5 | Deve propagar o `ProviderError` gerado pelo provider | `rejects.toThrow(ProviderError)` |

### Exemplo de Teste Unitário

```typescript
import { describe, it, expect, vi } from "vitest";
import { EmailService } from "./services/email.service.js";
import { ProviderError } from "../../shared/errors/app-errors.js";

// Helper: cria um mock do EmailProvider
const makeMockProvider = (impl?) => ({
  send: impl ?? vi.fn().mockResolvedValue({ id: "test-id-123" }),
});

describe("EmailService", () => {
  const input = {
    fullName: "João Silva",
    email: "joao@example.com",
    phone: "+55 11 99999-9999",
    message: "Gostaria de mais informações.",
  };

  it("deve definir o replyTo como o e-mail do contato", async () => {
    const sendMock = vi.fn().mockResolvedValue({ id: "abc" });
    const service = new EmailService({ send: sendMock });

    await service.send(input);

    const params = sendMock.mock.calls[0][0];
    expect(params.replyTo).toBe("joao@example.com");
  });

  it("deve propagar o ProviderError gerado pelo provider", async () => {
    const provider = makeMockProvider(() => {
      throw new ProviderError("Falha de conexão com o provedor.");
    });
    const service = new EmailService(provider);

    await expect(service.send(input)).rejects.toThrow(ProviderError);
  });
});
```

---

## Testes de Integração — `POST /email`

**Arquivo:** `tests/email.routes.spec.ts`

Testa o endpoint HTTP completo, do roteamento até a resposta HTTP. O `EmailService.prototype.send` é **mockado com `vi.spyOn`** para evitar chamadas reais ao Resend.

### Casos Testados

#### Suite: `CORS para /email`

| # | Descrição | Status Esperado |
|---|---|---|
| 1 | Deve responder com sucesso ao preflight OPTIONS de origem permitida | `204` + headers CORS corretos |
| 2 | Deve incluir header CORS em POST de origem permitida | `201` + `Access-Control-Allow-Origin` correto |
| 3 | Não deve incluir header CORS para origem não configurada | `201` + `Access-Control-Allow-Origin: undefined` |

#### Suite: `POST /email`

| # | Descrição | Status Esperado |
|---|---|---|
| 1 | Deve retornar 201 e o `id` ao receber payload válido | `201 { id: "resend-id-xyz" }` |
| 2 | Deve retornar 400 quando `fullName` estiver ausente | `400 { error: "..." }` |
| 3 | Deve retornar 400 quando `email` estiver ausente | `400 { error: "..." }` |
| 4 | Deve retornar 400 quando `phone` estiver ausente | `400 { error: "..." }` |
| 5 | Deve retornar 400 quando `message` estiver ausente | `400 { error: "..." }` |
| 6 | Deve retornar 400 quando o e-mail for inválido | `400 { error: "..." }` |
| 7 | Deve retornar 400 quando o body estiver completamente vazio | `400 { error: "..." }` |
| 8 | Deve retornar 502 quando o provider lançar um `ProviderError` | `502 { error: "..." }` |

### Exemplo de Teste de Integração

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { EmailService } from "../src/modules/email/services/email.service.js";
import { ProviderError } from "../src/shared/errors/app-errors.js";

const sendSpy = vi.spyOn(EmailService.prototype, "send");

const validPayload = {
  fullName: "Maria Souza",
  email: "maria@example.com",
  phone: "+55 21 98888-7777",
  message: "Preciso de um orçamento.",
};

describe("POST /email", () => {
  beforeEach(() => {
    sendSpy.mockReset();
  });

  it("deve retornar 201 e o id ao receber um payload válido", async () => {
    sendSpy.mockResolvedValue({ id: "resend-id-xyz" });

    const res = await request(app).post("/email").send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "resend-id-xyz" });
  });

  it("deve retornar 400 quando o email for inválido", async () => {
    const res = await request(app)
      .post("/email")
      .send({ ...validPayload, email: "email-invalido" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 502 quando o provider lançar um ProviderError", async () => {
    sendSpy.mockRejectedValue(new ProviderError("Timeout na API do Resend."));

    const res = await request(app).post("/email").send(validPayload);

    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty("error");
  });
});
```

---

## Filosofia de Testes

A estratégia adotada segue a **pirâmide de testes**:

```
        /\
       /  \
      / E2E \       ← Futuro: testes de ponta a ponta
     /--------\
    /Integração\    ← email.routes.spec.ts
   /------------\
  /   Unitários  \  ← email.service.spec.ts
 /________________\
```

- **Testes Unitários** → validam a lógica de negócio em isolamento (mocks para dependências externas)
- **Testes de Integração** → validam o comportamento completo da rota HTTP (validação, controller, error handler)
- **Sem testes do `ResendProvider`** → o provedor real é excluído dos testes automatizados para evitar chamadas à API externa e consumo de cota

:::tip Boas Práticas Aplicadas
- `beforeEach(() => sendSpy.mockReset())` garante que cada teste começa com um estado limpo
- `vi.spyOn` permite interceptar e controlar o comportamento do método real sem modificar o código de produção
- Testes cobrem tanto **caminhos de sucesso** quanto **caminhos de erro** (validação e falha de provedor)
:::
