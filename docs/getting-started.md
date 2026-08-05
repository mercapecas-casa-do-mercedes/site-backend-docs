---
sidebar_position: 2
title: "Guia de Início Rápido"
description: "Passo a passo para configurar, instalar e executar a API do MercaPeças localmente."
---

# Guia de Início Rápido

Este guia cobre todos os passos necessários para ter a API do MercaPeças rodando em seu ambiente local.

## Pré-requisitos

Antes de começar, certifique-se de que possui o seguinte instalado:

- **Node.js** v20 ou superior — [Download](https://nodejs.org/)
- **npm** v10 ou superior (incluído com o Node.js)
- Uma **conta no Resend** para obter sua `API Key` de envio de e-mails — [resend.com](https://resend.com)

---

## Passo 1 — Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd site-backend
```

---

## Passo 2 — Instalar as Dependências

```bash
npm install
```

---

## Passo 3 — Configurar o Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto copiando o exemplo abaixo:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Em seguida, preencha as variáveis:

```env
# Chave da API do Resend (obrigatória)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx

# Endereço de e-mail remetente verificado no Resend (obrigatório)
RESEND_FROM=contato@meudominio.com

# Endereço de e-mail que receberá as mensagens (obrigatório)
MAIL_TO=vendas@meudominio.com

# Origens permitidas pelo CORS (opcional — padrão: http://localhost:5173)
CORS_ORIGIN=http://localhost:5173

# Porta do servidor (opcional — padrão: 3000)
PORT=3000
```

:::warning Variáveis obrigatórias
As variáveis `RESEND_API_KEY`, `RESEND_FROM` e `MAIL_TO` são **obrigatórias**. O servidor irá lançar um erro e abortar a inicialização caso alguma delas esteja ausente.
:::

---

## Passo 4 — Executar em Modo de Desenvolvimento

```bash
npm run dev
```

O comando usa `tsx watch` para habilitar **live-reload** automático. O servidor ficará disponível em:

```
http://localhost:3000
```

---

## Passo 5 — Verificar o Servidor

Faça uma requisição de teste para confirmar que a API está no ar:

```bash
curl -X POST http://localhost:3000/email \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "João Silva",
    "email": "joao@example.com",
    "phone": "+55 11 99999-9999",
    "message": "Olá, gostaria de um orçamento."
  }'
```

**Resposta esperada (`201 Created`):**

```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor em modo de desenvolvimento com live-reload |
| `npm run build` | Compila o TypeScript para JavaScript na pasta `/dist` |
| `npm run start` | Inicia o servidor usando os arquivos compilados em `/dist` |
| `npm run test` | Executa todos os testes com Vitest |

---

## Execução em Produção

```bash
# 1. Compile o TypeScript
npm run build

# 2. Inicie o servidor compilado
npm run start
```

:::info
Em produção, certifique-se de que a variável `CORS_ORIGIN` contém todos os domínios do seu frontend separados por vírgula:

```env
CORS_ORIGIN=https://mercapecas.com.br,https://www.mercapecas.com.br
```
:::
