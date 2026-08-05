---
sidebar_position: 1
title: "Variáveis de Ambiente"
description: "Referência completa de todas as variáveis de ambiente utilizadas pela API do MercaPeças."
---

# Configuração de Variáveis de Ambiente

O carregamento e a validação das variáveis de ambiente são centralizados em [`src/config/env.ts`](../../src/config/env.ts). O módulo usa **dotenv** para ler o arquivo `.env` e falha na inicialização caso alguma variável obrigatória esteja ausente.

---

## Variáveis Disponíveis

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `RESEND_API_KEY` | ✅ Sim | — | Chave de autenticação da API do [Resend](https://resend.com) |
| `RESEND_FROM` | ✅ Sim | — | Endereço de e-mail remetente verificado no Resend |
| `MAIL_TO` | ✅ Sim | — | Endereço de e-mail que receberá as mensagens do formulário |
| `PORT` | ❌ Não | `3000` | Porta em que o servidor HTTP irá escutar |
| `CORS_ORIGIN` | ❌ Não | `http://localhost:5173` | Origens permitidas pelo CORS (separadas por vírgula) |

---

## Comportamento de Validação

O arquivo `env.ts` verifica as variáveis obrigatórias em tempo de inicialização:

```typescript title="src/config/env.ts"
const requiredEnvVars = ["RESEND_API_KEY", "RESEND_FROM", "MAIL_TO"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${envVar}`);
  }
}
```

:::warning Falha segura (Fail-Fast)
Se qualquer uma das três variáveis obrigatórias não estiver definida no `.env`, **o servidor não sobe** e lança um `Error` imediatamente. Isso evita que a aplicação rode em estado inválido.
:::

---

## Configuração de CORS Dinâmico

A variável `CORS_ORIGIN` suporta **múltiplos domínios** separados por vírgula. O valor é processado em um array de strings:

```typescript title="src/config/env.ts"
const rawCorsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const corsOrigins = rawCorsOrigin.split(",").map((origin) => origin.trim());

export const env = {
  // ...
  CORS_ORIGINS: corsOrigins,
};
```

### Exemplos de configuração

**Desenvolvimento (padrão):**
```env
CORS_ORIGIN=http://localhost:5173
```

**Múltiplos ambientes:**
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

**Produção:**
```env
CORS_ORIGIN=https://mercapecas.com.br,https://www.mercapecas.com.br
```

:::info
O CORS está configurado para permitir apenas os métodos `GET`, `POST` e `OPTIONS`, e os headers `Content-Type` e `Authorization`.
:::

---

## Objeto `env` Exportado

O módulo exporta um objeto tipado com todas as variáveis processadas:

```typescript
export const env = {
  RESEND_API_KEY: string,   // Chave da API do Resend
  RESEND_FROM: string,      // Remetente de e-mail
  MAIL_TO: string,          // Destinatário de e-mail
  PORT: number,             // Porta do servidor (default: 3000)
  CORS_ORIGINS: string[],   // Array de origens permitidas
}
```

### Uso em outros módulos

```typescript
import { env } from "../../../config/env.js";

// Acessando o destinatário de e-mail
console.log(env.MAIL_TO);

// Acessando a lista de origens CORS
console.log(env.CORS_ORIGINS); // ["https://mercapecas.com.br"]
```

---

## Arquivo `.env` de Exemplo

```env
# ================================================
# API DE E-MAIL (Resend)
# ================================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=contato@meudominio.com
MAIL_TO=vendas@meudominio.com

# ================================================
# SERVIDOR
# ================================================
PORT=3000

# ================================================
# CORS — Domínios permitidos (separados por vírgula)
# ================================================
CORS_ORIGIN=https://mercapecas.com.br
```

:::note
Nunca versione o arquivo `.env` com credenciais reais. Certifique-se de que `.env` está listado no `.gitignore`.
:::
