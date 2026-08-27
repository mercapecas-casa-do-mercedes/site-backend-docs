import type { ReactNode } from 'react';
import Layout from '@theme/Layout';

import HomepageHero from '@site/src/components/HomepageHero';
import QuickAccess from '@site/src/components/QuickAccess';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Início"
      description="Documentação técnica oficial do Mercapecas Backend - Guia para Desenvolvedores"
    >
      <HomepageHero />
      <main>
        <QuickAccess />
      </main>
    </Layout>
  );
}
