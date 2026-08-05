---
sidebar_position: 1
title: "Shared — Erros e Middlewares"
description: "Documentação dos componentes globais reutilizáveis: classes de erro, error handler e middleware de validação."
---

# Shared — Componentes Globais

A pasta `src/shared/` contém componentes reutilizáveis por todos os módulos da aplicação. Esses componentes não pertencem a nenhuma funcionalidade específica e são projetados para serem genéricos e extensíveis.

```text
src/shared/
├── errors/
│   └── app-errors.ts        # Classes de erro customizadas da aplicação
└── middlewares/
    ├── error-handler.ts     # Middleware global de tratamento de erros HTTP
    └── validate.ts          # Middleware de validação de schema do body
```

---

## Erros Customizados (`app-errors.ts`)

**Arquivo:** `src/shared/errors/app-errors.ts`

A aplicação utiliza classes de erro customizadas que estendem `Error`. Cada classe representa um tipo específico de falha e é mapeada para um status HTTP pelo `errorHandler`.

### `ValidationError`

Lançado quando o body da requisição falha na validação de schema (campo ausente, tipo errado, formato inválido, etc.).

```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```

**HTTP Status mapeado:** `400 Bad Request`

**Uso:**
```typescript
throw new ValidationError("O campo 'email' deve ser um e-mail válido.");
```

---

### `ProviderError`

Lançado quando há falha na comunicação com um provedor externo (ex: timeout, resposta inválida, erro de autenticação do Resend).

```typescript
export class ProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderError";
  }
}
```

**HTTP Status mapeado:** `502 Bad Gateway`

**Uso:**
```typescript
throw new ProviderError("Timeout na API do Resend.");
```

---

## Middleware: `errorHandler`

**Arquivo:** `src/shared/middlewares/error-handler.ts`

Middleware Express com **4 parâmetros** (assinatura de error handler). É registrado **após todas as rotas** em `app.ts` e centraliza o tratamento de todos os erros da aplicação.

```typescript title="src/shared/middlewares/error-handler.ts"
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof ProviderError) {
    res.status(502).json({ error: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : "Erro interno no servidor.";
  res.status(500).json({ error: message });
};
```

### Tabela de Mapeamento de Erros

| Tipo de Erro | HTTP Status | Descrição |
|---|---|---|
| `ValidationError` | `400 Bad Request` | Dados inválidos na requisição |
| `ProviderError` | `502 Bad Gateway` | Falha em serviço externo |
| Qualquer outro `Error` | `500 Internal Server Error` | Erro inesperado do servidor |

### Registro em `app.ts`

O `errorHandler` é o **último middleware** registrado, garantindo que captura erros de todas as rotas:

```typescript title="src/app.ts"
app.use("/email", emailRouter);
app.use(errorHandler); // sempre após as rotas
```

:::warning Ordem importa
O `errorHandler` deve ser registrado **depois de todas as rotas e middlewares**. Se registrado antes, não irá capturar os erros corretamente.
:::

---

## Middleware: `validate`

**Arquivo:** `src/shared/middlewares/validate.ts`

Middleware de ordem superior (Higher-Order Function) que recebe uma função de schema e retorna um middleware Express. Ele executa a validação do `req.body` e, em caso de sucesso, sobrescreve `req.body` com o valor retornado (sanitizado).

```typescript title="src/shared/middlewares/validate.ts"
export function validate(schema: (data: unknown) => unknown) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema(req.body);
      next();
    } catch (error) {
      next(error); // Propaga para o errorHandler
    }
  };
}
```

### Fluxo de Validação

```
Requisição HTTP chega
      │
      ▼
validate(emailSchema) executado
      │
      ├── ✅ Schema OK → req.body = dado sanitizado → next() → Controller
      │
      └── ❌ Schema lança ValidationError → next(error) → errorHandler → 400
```

### Uso nas Rotas

```typescript title="src/modules/email/routes/email.routes.ts"
import { validate } from "../../../shared/middlewares/validate.js";
import { emailSchema } from "../validation/email.schema.js";

router.post("/", validate(emailSchema), controller.send);
```

:::info Design Pattern
O `validate` é um exemplo do padrão **Middleware Factory**. Ele é genérico e pode ser reutilizado com qualquer função de schema em qualquer módulo futuro (ex: `validate(productSchema)`, `validate(authSchema)`).
:::
