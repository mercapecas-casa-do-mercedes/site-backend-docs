---
sidebar_position: 1
title: "Introdução"
description: "Visão geral da API do MercaPeças — tecnologias, arquitetura e como começar."
---

# MercaPeças Backend — Documentação Oficial

Bem-vindo à documentação técnica da API do **MercaPeças**. Esta documentação cobre todos os módulos, endpoints, middlewares e guias de integração do backend.

## Visão Geral

A API do MercaPeças é construída com **Node.js + Express + TypeScript** e adota uma **arquitetura modular focada em funcionalidades (feature-based modules)**. O objetivo é organizar o código por domínio de negócio, mantendo arquivos curtos que respeitam o Princípio de Responsabilidade Única (SRP).

### Stack Tecnológico

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | ≥ 20 | Runtime JavaScript |
| TypeScript | ^7.0 | Tipagem estática |
| Express | ^5.2 | Framework HTTP |
| Resend SDK | ^6.17 | Envio de e-mails transacionais |
| dotenv | ^17.4 | Gerenciamento de variáveis de ambiente |
| cors | ^2.8 | Controle de origens CORS |
| Vitest | ^4.1 | Framework de testes |
| Supertest | ^7.2 | Testes de integração HTTP |

---

## Estrutura de Pastas

```text
src/
├── modules/              # Funcionalidades e regras de negócio encapsuladas
│   └── email/
│       ├── controllers/
│       │   └── email.controller.ts
│       ├── services/
│       │   └── email.service.ts
│       ├── providers/
│       │   ├── email-provider.ts    # Interface do provedor
│       │   └── resend.provider.ts   # Implementação com Resend SDK
│       ├── routes/
│       │   └── email.routes.ts
│       ├── types/
│       │   └── email.types.ts
│       ├── validation/
│       │   └── email.schema.ts
│       └── index.ts                 # Composição (Dependency Injection manual)
│
├── shared/               # Componentes reutilizáveis e globais
│   ├── errors/
│   │   └── app-errors.ts            # Classes de erro customizadas
│   └── middlewares/
│       ├── error-handler.ts         # Middleware global de tratamento de erros
│       └── validate.ts              # Middleware de validação de schema
│
├── config/
│   └── env.ts                       # Carregamento e validação de variáveis de ambiente
│
├── app.ts                           # Configuração do Express (CORS, rotas, middlewares)
└── server.ts                        # Inicialização do servidor HTTP
```

---

## Relação com Domain-Driven Design (DDD)

Esta arquitetura se aproxima dos conceitos de **DDD**. Em sistemas mais robustos, cada módulo representa um contexto de negócio bem delimitado:

```text
MercaPeças (Sistema)
├── Email       ✅ Implementado — Formulário de contato
├── Produtos    🔜 Futuro — Listagem, estoque e detalhes de peças
├── Clientes    🔜 Futuro — Perfil do comprador e vendedor
├── Pedidos     🔜 Futuro — Carrinho, checkout e histórico
└── Autenticação 🔜 Futuro — Logins, tokens e permissões
```

---

## Sumário da Documentação

- [Guia de Início Rápido](./getting-started) — Configuração e execução do servidor
- [Configuração de Ambiente](./configuration/environment) — Variáveis de ambiente e CORS
- [Módulo de E-mail](./modules/email/overview) — Arquitetura e componentes do módulo
- [Referência da API — Email](./api/email) — Endpoints HTTP detalhados
- [Shared: Erros e Middlewares](./shared/overview) — Componentes globais reutilizáveis
- [Testes](./testing) — Estratégia, execução e cobertura
