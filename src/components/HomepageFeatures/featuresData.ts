import type { FeatureItem } from './types';

export const FEATURE_LIST: FeatureItem[] = [
  {
    title: 'Arquitetura Modular',
    icon: '🧩',
    description: 'Organizado por domínios de negócio seguindo princípios DDD, com injeção de dependência e responsabilidades bem definidas.',
  },
  {
    title: 'API RESTful com TypeScript',
    icon: '🚀',
    description: 'Backend moderno em Node.js + Express com tipagem estática rigorosa, validação robusta e tratamento centralizado de erros.',
  },
  {
    title: 'Testes Automatizados',
    icon: '✅',
    description: 'Testes unitários e de integração com Vitest e Supertest, seguindo a pirâmide de testes para máxima confiabilidade.',
  },
  {
    title: 'E-mail Transacional',
    icon: '📧',
    description: 'Integração com Resend para envio performático de e-mails do formulário de contato, com fallback e resiliente a falhas.',
  },
  {
    title: 'Documentação Viva',
    icon: '📚',
    description: 'Documentação técnica sempre atualizada via Docusaurus, versionada e hospedada junto ao código da aplicação.',
  },
  {
    title: 'Pronto para Produção',
    icon: '⚡',
    description: 'Configuração completa de CORS, variáveis de ambiente, build otimizado e deploy facilitado para VPS ou nuvem.',
  },
];
