import type { QuickAccessItem } from './types';

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    title: 'Primeiros Passos',
    icon: '🚀',
    description: 'Setup do ambiente local, requisitos do Node.js, instalação de dependências e comandos de execução.',
    link: '/docs/getting-started',
    badge: 'Ambiente',
  },
  {
    title: 'Referência de API',
    icon: '📡',
    description: 'Especificação técnica dos endpoints RESTful, contratos DTOs, cabeçalhos HTTP e respostas de erro.',
    link: '/docs/api/email',
    badge: 'REST API',
  },
  {
    title: 'Módulos do Sistema',
    icon: '🧩',
    description: 'Visão geral da arquitetura por domínios (Domain, Application, Infrastructure) seguindo DDD.',
    link: '/docs/modules/email/overview',
    badge: 'Arquitetura',
  },
  {
    title: 'Guia de Testes',
    icon: '🧪',
    description: 'Execução de testes unitários e de integração com Vitest e Supertest, mocks e cobertura de código.',
    link: '/docs/testing',
    badge: 'Qualidade',
  },
  {
    title: 'Configurações & ENV',
    icon: '⚙️',
    description: 'Mapeamento de variáveis de ambiente (`.env`), CORS, chave da API do Resend e portas do servidor.',
    link: '/docs/configuration/environment',
    badge: 'Setup',
  },
  {
    title: 'Integração de Formulário',
    icon: '🛠️',
    description: 'Tutorial passo a passo de como conectar o frontend Mercapecas ao serviço de e-mail do backend.',
    link: '/docs/tutorials/integration-contact-form',
    badge: 'Tutorial',
  },
];
