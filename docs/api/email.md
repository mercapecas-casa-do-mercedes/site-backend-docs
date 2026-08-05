---
sidebar_position: 1
title: "API — Email"
description: "Referência completa do endpoint POST /email para envio de mensagens de contato."
---

# Referência da API — Módulo de E-mail

Esta página documenta todos os endpoints HTTP disponíveis no módulo de e-mail da API do MercaPeças.

**Base URL:** `http://localhost:3000` (desenvolvimento)

---

## Endpoints

### `POST /email`

Recebe os dados do formulário de contato do site e envia um e-mail transacional para a equipe do MercaPeças via [Resend](https://resend.com).

- **Método:** `POST`
- **Rota:** `/email`
- **Content-Type:** `application/json`

---

#### Parâmetros do Body

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `fullName` | `string` | ✅ Sim | Nome completo do cliente |
| `email` | `string` | ✅ Sim | E-mail válido do cliente (usado como `reply-to`) |
| `phone` | `string` | ✅ Sim | Telefone do cliente (aceita dígitos, espaços, `+`, `(`, `)`, `-`) |
| `message` | `string` | ✅ Sim | Mensagem de contato do cliente |

---

#### Exemplo de Requisição

```bash
curl -X POST https://api.mercapecas.com.br/email \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "João Silva",
    "email": "joao@example.com",
    "phone": "+55 11 99999-9999",
    "message": "Gostaria de mais informações sobre o painel de instrumentos do Civic 2018."
  }'
```

```javascript
// Exemplo com fetch (JavaScript)
const response = await fetch("https://api.mercapecas.com.br/email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: "João Silva",
    email: "joao@example.com",
    phone: "+55 11 99999-9999",
    message: "Gostaria de mais informações sobre o painel de instrumentos do Civic 2018.",
  }),
});

const data = await response.json();
console.log(data); // { id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }
```

---

#### Resposta de Sucesso

**HTTP Status:** `201 Created`

```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | ID único do e-mail gerado pelo Resend SDK |

---

#### Respostas de Erro

##### `400 Bad Request` — Validação falhou

Retornado quando o body da requisição está ausente, incompleto ou contém dados inválidos.

```json
{
  "error": "O campo 'email' deve ser um e-mail válido."
}
```

**Casos que geram 400:**

| Cenário | Mensagem de erro |
|---|---|
| Body não é um objeto | `"O corpo da requisição deve ser um objeto válido."` |
| `fullName` ausente | `"O campo 'fullName' é obrigatório."` |
| `email` ausente | `"O campo 'email' é obrigatório."` |
| `phone` ausente | `"O campo 'phone' é obrigatório."` |
| `message` ausente | `"O campo 'message' é obrigatório."` |
| `fullName` não é string | `"O campo 'fullName' deve ser uma string."` |
| `fullName` é vazio | `"O campo 'fullName' não pode ser vazio."` |
| `email` formato inválido | `"O campo 'email' deve ser um e-mail válido."` |
| `phone` caracteres inválidos | `"O campo 'phone' contém caracteres inválidos."` |
| `message` é vazio | `"O campo 'message' não pode ser vazio."` |

---

##### `502 Bad Gateway` — Falha no provedor de e-mail

Retornado quando há falha na comunicação com o serviço Resend (timeout, chave inválida, etc.).

```json
{
  "error": "Timeout na API do Resend."
}
```

---

##### `500 Internal Server Error` — Erro inesperado

Retornado para erros não tratados explicitamente.

```json
{
  "error": "Erro interno no servidor."
}
```

---

## Comportamento CORS

A API implementa CORS dinâmico. O endpoint `/email` aceita requisições somente das origens configuradas na variável `CORS_ORIGIN`.

### Preflight Request (`OPTIONS /email`)

Navegadores modernos enviam uma requisição preflight antes do `POST`. A API responde corretamente:

```bash
curl -X OPTIONS http://localhost:3000/email \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Resposta:** `204 No Content`

| Header | Valor |
|---|---|
| `Access-Control-Allow-Origin` | `http://localhost:5173` (ou a origem configurada) |
| `Access-Control-Allow-Methods` | `GET, POST, OPTIONS` |
| `Access-Control-Allow-Headers` | `Content-Type, Authorization` |

:::warning Origem não configurada
Se a requisição vier de uma origem **não listada** em `CORS_ORIGIN`, o header `Access-Control-Allow-Origin` **não será incluído** na resposta. A requisição ainda será processada (status 201), mas o navegador irá bloquear a leitura da resposta por política de CORS.
:::

---

## E-mail Gerado

O e-mail enviado ao destinatário (`MAIL_TO`) tem o seguinte formato:

| Campo | Valor |
|---|---|
| **De (from)** | Valor de `RESEND_FROM` (ex: `contato@mercapecas.com.br`) |
| **Para (to)** | Valor de `MAIL_TO` (ex: `vendas@mercapecas.com.br`) |
| **Assunto** | `Novo Contato - Site Mercapeças (João Silva)` |
| **Reply-To** | E-mail do cliente (ex: `joao@example.com`) |
| **Corpo (text)** | Nome, e-mail, telefone e mensagem do cliente |

**Exemplo do corpo do e-mail:**

```text
Nome: João Silva
E-mail: joao@example.com
Telefone: +55 11 99999-9999
Mensagem: Gostaria de mais informações sobre o painel de instrumentos do Civic 2018.
```
