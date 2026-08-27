# Site

Este site foi desenvolvido usando [Docusaurus](https://docusaurus.io/), um gerador moderno de sites estáticos.

## Instalação

```bash
npm install
```

**Observação**: fique à vontade para usar o gerenciador de pacotes de sua preferência.

## Desenvolvimento Local

```bash
npm run start

ou

npm run serve
```

Esse comando inicia um servidor de desenvolvimento local e abre uma janela do navegador. A maioria das alterações é refletida automaticamente, sem a necessidade de reiniciar o servidor.

## Build

```bash
npm run build
```

Esse comando gera o conteúdo estático dentro do diretório `build`, que pode ser hospedado usando qualquer serviço de hospedagem de conteúdo estático.

## Deploy

Usando SSH:

```bash
USE_SSH=true npm run deploy
```

Sem usar SSH:

```bash
GIT_USER=<Seu usuário do GitHub> npm run deploy
```

Se você estiver usando o GitHub Pages para hospedagem, esse comando é uma maneira conveniente de gerar o site e enviá-lo para a branch `gh-pages`.