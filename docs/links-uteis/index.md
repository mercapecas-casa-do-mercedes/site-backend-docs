---
sidebar_position: 7
title: "Links Úteis"
description: "Acesso rápido às ferramentas e plataformas utilizadas na gestão e operação do projeto MercaPeças."
---

# Links Úteis

Referência centralizada de todas as plataformas e ferramentas utilizadas na gestão, operação e infraestrutura do projeto MercaPeças.

---

## 🗂️ Resumo de Acessos

| Plataforma | URL | Finalidade |
|---|---|---|
| ClickUp | [app.clickup.com](https://app.clickup.com) | Gestão de tarefas e backlog |
| Resend | [resend.com](https://resend.com) | Envio de e-mails transacionais |
| Bitwarden | [vault.bitwarden.com](https://vault.bitwarden.com) | Gestão de senhas e chaves de API |
| HostGator | [hostgator.com.br](https://www.hostgator.com.br) | Hospedagem VPS do backend |

---

## 📋 Gestão de Tarefas

### ClickUp
Plataforma utilizada para gerenciamento de tarefas, sprints, epics e acompanhamento do progresso do projeto.

- **Acesso:** [app.clickup.com](https://app.clickup.com)
- **Uso:** Criação e acompanhamento de tasks, definição de prioridades e organização do backlog

:::tip
Use o ClickUp para registrar bugs, features e melhorias antes de começar qualquer desenvolvimento. Mantenha o status das tasks sempre atualizado.
:::

---

## 📧 Serviço de E-mail

### Resend
Provedor de e-mails transacionais utilizado pelo backend para envio das mensagens do formulário de contato.

- **Acesso:** [resend.com](https://resend.com)
- **Dashboard de e-mails:** [resend.com/emails](https://resend.com/emails)
- **Gerenciamento de API Keys:** [resend.com/api-keys](https://resend.com/api-keys)
- **Domínios verificados:** [resend.com/domains](https://resend.com/domains)
- **Documentação oficial:** [resend.com/docs](https://resend.com/docs)
- **Uso:** Envio de e-mails transacionais via SDK (`resend` npm package)

:::warning Atenção com a API Key
A `RESEND_API_KEY` é uma credencial sensível. Nunca a exponha em repositórios públicos. Gerencie-a pelo Bitwarden (ver abaixo) e configure via variável de ambiente no servidor.
:::

---

## 🔐 Gestão de Senhas e Chaves

### Bitwarden
Gerenciador de senhas e segredos utilizado para armazenar credenciais, API Keys e acessos do projeto com segurança.

- **Acesso:** [vault.bitwarden.com](https://vault.bitwarden.com)
- **Uso:** Armazenamento seguro de chaves de API, senhas de servidor, credenciais de banco de dados e demais acessos sensíveis do projeto

:::info Boas práticas
Todos os acessos e credenciais do projeto (incluindo `RESEND_API_KEY`, senha do painel HostGator e acessos SSH) devem ser armazenados no Bitwarden e nunca compartilhados via chat ou e-mail.
:::

---

## 🖥️ Infraestrutura — Hospedagem

### HostGator (VPS)
Provedor de hospedagem onde o backend da API do MercaPeças está implantado em um servidor VPS (Virtual Private Server).

- **Acesso ao painel:** [hostgator.com.br](https://www.hostgator.com.br)
- **Central do cliente:** [financeiro.hostgator.com.br](https://financeiro.hostgator.com.br)
- **Uso:** Hospedagem da API Node.js em VPS Linux, gerenciamento do servidor e domínios

#### Informações do Servidor

| Item | Descrição |
|---|---|
| Tipo | VPS (Virtual Private Server) |
| Provedor | HostGator Brasil |
| Runtime | Node.js (processo gerenciado via PM2 ou similar) |
| Acesso | SSH — credenciais no Bitwarden |

:::note Acesso SSH
As credenciais de acesso SSH ao servidor VPS estão armazenadas no Bitwarden. Consulte a entrada correspondente antes de tentar conectar ao servidor.
:::

#### Comandos úteis no servidor

```bash
# Verificar status da aplicação (se usar PM2)
pm2 status

# Ver logs em tempo real
pm2 logs mercapecas-backend

# Reiniciar a aplicação após um deploy
pm2 restart mercapecas-backend

# Verificar a porta em uso
ss -tlnp | grep 3000
```


