---
sidebar_position: 6
title: "Tutorial — Integrando o Formulário de Contato"
description: "Guia passo a passo para integrar o frontend com o endpoint POST /email da API do MercaPeças."
---

# Tutorial — Integrando o Formulário de Contato

Este tutorial mostra como integrar um formulário HTML/JavaScript com o endpoint `POST /email` da API do MercaPeças.

---

## Pré-requisitos

- API do MercaPeças rodando (veja o [Guia de Início Rápido](./getting-started))
- Frontend servido em uma das origens configuradas em `CORS_ORIGIN` (ex: `http://localhost:5173`)

---

## Passo 1 — Estrutura do Formulário HTML

Crie o formulário com os campos esperados pela API:

```html
<form id="contact-form">
  <div>
    <label for="fullName">Nome completo</label>
    <input type="text" id="fullName" name="fullName" required />
  </div>

  <div>
    <label for="email">E-mail</label>
    <input type="email" id="email" name="email" required />
  </div>

  <div>
    <label for="phone">Telefone</label>
    <input type="tel" id="phone" name="phone" required />
  </div>

  <div>
    <label for="message">Mensagem</label>
    <textarea id="message" name="message" rows="5" required></textarea>
  </div>

  <button type="submit">Enviar mensagem</button>

  <p id="feedback-message" aria-live="polite"></p>
</form>
```

---

## Passo 2 — Lógica de Envio com `fetch`

```javascript
const API_URL = "http://localhost:3000"; // Substitua pela URL de produção

const form = document.getElementById("contact-form");
const feedback = document.getElementById("feedback-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Coleta os dados do formulário
  const payload = {
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim(),
  };

  // Desabilita o botão durante o envio
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  feedback.textContent = "Enviando...";

  try {
    const response = await fetch(`${API_URL}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      // Status 201 — sucesso
      feedback.textContent = "✅ Mensagem enviada com sucesso! Entraremos em contato em breve.";
      form.reset();
    } else {
      // Status 400, 502 — erro da API
      feedback.textContent = `❌ Erro: ${data.error}`;
    }
  } catch (error) {
    // Erro de rede (servidor offline, CORS, etc.)
    feedback.textContent = "❌ Não foi possível conectar ao servidor. Tente novamente mais tarde.";
    console.error("Erro de rede:", error);
  } finally {
    submitButton.disabled = false;
  }
});
```

---

## Passo 3 — Integração com React (exemplo)

Se o seu frontend usa **React**, aqui está um exemplo com hooks:

```tsx
import { useState, FormEvent } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setForm({ fullName: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Ocorreu um erro inesperado.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Nome completo"
        required
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="E-mail"
        required
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Telefone"
        required
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Sua mensagem"
        required
      />

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviar mensagem"}
      </button>

      {status === "success" && (
        <p style={{ color: "green" }}>✅ Mensagem enviada com sucesso!</p>
      )}
      {status === "error" && (
        <p style={{ color: "red" }}>❌ {errorMessage}</p>
      )}
    </form>
  );
}
```

:::tip Variável de Ambiente no Frontend
Use variáveis de ambiente para configurar a URL da API. Com Vite:

```env
# .env (frontend)
VITE_API_URL=https://api.mercapecas.com.br
```

```typescript
const API_URL = import.meta.env.VITE_API_URL;
```
:::

---

## Códigos de Status e Tratamento de Erros

| Status HTTP | Situação | Ação recomendada no frontend |
|---|---|---|
| `201 Created` | E-mail enviado com sucesso | Exibir mensagem de sucesso e limpar o formulário |
| `400 Bad Request` | Dados inválidos | Exibir a mensagem de erro retornada pela API no campo adequado |
| `502 Bad Gateway` | Falha no provedor de e-mail | Informar que o serviço está temporariamente indisponível |
| `500 Internal Server Error` | Erro inesperado | Exibir mensagem genérica de erro |
| Erro de rede | Servidor offline / CORS | Verificar se a API está rodando e se a origem está configurada |

---

## Depuração de Problemas Comuns

### Erro de CORS no navegador

**Sintoma:** `Access to fetch at 'http://localhost:3000/email' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solução:** Verifique se a origem do frontend está listada em `CORS_ORIGIN` no arquivo `.env` da API:

```env
CORS_ORIGIN=http://localhost:5173
```

---

### `400 Bad Request` inesperado

**Sintoma:** A requisição retorna 400 mesmo com todos os campos preenchidos.

**Soluções:**
1. Verifique se o `Content-Type: application/json` está no header da requisição
2. Certifique-se de que o body está serializado como JSON (usando `JSON.stringify`)
3. Valide se o campo `email` tem um formato válido (ex: `usuario@dominio.com`)
4. Certifique-se de que nenhum campo está sendo enviado como `null` ou vazio

---

### `502 Bad Gateway`

**Sintoma:** A API retorna 502 após alguns segundos.

**Soluções:**
1. Verifique se `RESEND_API_KEY` é válida em [resend.com/api-keys](https://resend.com/api-keys)
2. Verifique se `RESEND_FROM` é um domínio verificado no Resend
3. Consulte o painel do Resend para mensagens de erro detalhadas
