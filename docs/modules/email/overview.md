---
sidebar_position: 1
title: "Módulo de E-mail — Visão Geral"
description: "Arquitetura, componentes e fluxo de dados do módulo de e-mail do MercaPeças."
---

# Módulo de E-mail

O módulo de e-mail é responsável pelo processamento e envio de mensagens de contato originadas do formulário do site MercaPeças. Ele utiliza o SDK do **Resend** como provedor de envio transacional.

**Localização:** `src/modules/email/`

---

## Arquitetura e Responsabilidades

O módulo é composto por seis camadas com responsabilidades bem definidas:

```text
src/modules/email/
├── index.ts              # Composição (Dependency Injection manual)
├── controllers/
│   └── email.controller.ts   # Recebe a requisição HTTP e delega ao Service
├── services/
│   └── email.service.ts      # Regra de negócio: monta assunto, corpo e replyTo
├── providers/
│   ├── email-provider.ts     # Interface (contrato) que o Provider deve cumprir
│   └── resend.provider.ts    # Implementação concreta usando o Resend SDK
├── routes/
│   └── email.routes.ts       # Define a rota POST / e aplica o middleware de validação
├── types/
│   └── email.types.ts        # Interfaces TypeScript: EmailInput, SendEmailParams, SendEmailResult
└── validation/
    └── email.schema.ts       # Função de validação e sanitização do body da requisição
```

---

## Fluxo de Dados (Request Lifecycle)

```
HTTP POST /email
      │
      ▼
[express.Router]
      │
      ▼
[Middleware: validate(emailSchema)]   ← valida e sanitiza o body
      │
      ▼ (body validado: EmailInput)
[EmailController.send()]             ← delega para o Service
      │
      ▼
[EmailService.send()]                ← monta subject, content e replyTo
      │
      ▼
[ResendProvider.send()]              ← envia via Resend SDK
      │
      ▼
[HTTP Response 201 Created]          ← { id: "resend-id-xxx" }
```

---

## Composição via Injeção de Dependência

O arquivo `index.ts` é responsável por **instanciar e conectar** todas as camadas do módulo, seguindo o padrão de Injeção de Dependência manual:

```typescript title="src/modules/email/index.ts"
import { ResendProvider } from "./providers/resend.provider.js";
import { EmailService } from "./services/email.service.js";
import { EmailController } from "./controllers/email.controller.js";
import { createEmailRouter } from "./routes/email.routes.js";

const emailProvider = new ResendProvider();
const emailService = new EmailService(emailProvider);
const emailController = new EmailController(emailService);
const emailRouter = createEmailRouter(emailController);

export default emailRouter;
```

:::info Por que Injeção de Dependência?
Ao injetar o `EmailProvider` no `EmailService`, desacoplamos a regra de negócio do mecanismo de envio. Isso facilita a **substituição do provedor** (ex: trocar Resend por SendGrid) e a **escrita de testes unitários** sem precisar realizar chamadas HTTP reais.
:::

---

## Tipos TypeScript

As interfaces centrais do módulo estão em `src/modules/email/types/email.types.ts`:

```typescript title="src/modules/email/types/email.types.ts"
/** Dados recebidos do corpo da requisição HTTP */
export interface EmailInput {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

/** Parâmetros internos enviados ao provedor de e-mail */
export interface SendEmailParams {
  subject: string;
  content: string;
  replyTo: string;
}

/** Resultado retornado pelo provedor após envio bem-sucedido */
export interface SendEmailResult {
  id: string;
}
```

---

## Componentes Detalhados

### EmailController

**Arquivo:** `src/modules/email/controllers/email.controller.ts`

Responsável por receber a requisição HTTP e orquestrar a resposta. **Não contém regra de negócio.**

```typescript
export class EmailController {
  constructor(private emailService: EmailService) {}

  send = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.emailService.send(req.body);
      res.status(201).json({ id: result.id });
    } catch (error) {
      next(error); // Delega para o errorHandler global
    }
  };
}
```

---

### EmailService

**Arquivo:** `src/modules/email/services/email.service.ts`

Contém a **regra de negócio** do módulo: formata o assunto e o corpo do e-mail e define o `reply-to` como o e-mail do contato.

```typescript
export class EmailService {
  constructor(private emailProvider: EmailProvider) {}

  async send(input: EmailInput): Promise<SendEmailResult> {
    const subject = `Novo Contato - Site Mercapeças (${input.fullName})`;
    const content = `Nome: ${input.fullName}
E-mail: ${input.email}
Telefone: ${input.phone}
Mensagem: ${input.message}`;

    return this.emailProvider.send({
      subject,
      content,
      replyTo: input.email,
    });
  }
}
```

:::note
O campo `replyTo` é configurado automaticamente com o e-mail do cliente, permitindo que a equipe do MercaPeças responda diretamente ao contato a partir do cliente de e-mail.
:::

---

### EmailProvider (Interface)

**Arquivo:** `src/modules/email/providers/email-provider.ts`

Define o **contrato** (interface) que qualquer provedor de e-mail deve implementar:

```typescript
export interface EmailProvider {
  send(params: SendEmailParams): Promise<SendEmailResult>;
}
```

---

### ResendProvider

**Arquivo:** `src/modules/email/providers/resend.provider.ts`

Implementação concreta do `EmailProvider` usando o **Resend SDK**:

```typescript
export class ResendProvider implements EmailProvider {
  private resend: Resend;
  private from: string;
  private to: string;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
    this.from = env.RESEND_FROM;
    this.to = env.MAIL_TO;
  }

  async send(params: SendEmailParams): Promise<SendEmailResult> {
    const { data, error } = await this.resend.emails.send({
      from: this.from,
      to: [this.to],
      replyTo: params.replyTo,
      subject: params.subject,
      text: params.content,
    });

    if (error) throw new ProviderError(error.message);
    if (!data?.id) throw new ProviderError("Resposta inválida do provedor Resend.");

    return { id: data.id };
  }
}
```

---

### emailSchema (Validação)

**Arquivo:** `src/modules/email/validation/email.schema.ts`

Função de validação e sanitização executada pelo middleware `validate()`. Realiza as seguintes verificações:

| Campo | Regras de Validação |
|---|---|
| `fullName` | Obrigatório, tipo `string`, não pode ser vazio |
| `email` | Obrigatório, tipo `string`, não pode ser vazio, deve ser e-mail válido (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| `phone` | Obrigatório, tipo `string`, não pode ser vazio, apenas dígitos/espaços/`()+-` |
| `message` | Obrigatório, tipo `string`, não pode ser vazio |

:::note Sanitização
Todos os campos passam por `.trim()` antes da validação de conteúdo para remover espaços em branco acidentais.
:::
