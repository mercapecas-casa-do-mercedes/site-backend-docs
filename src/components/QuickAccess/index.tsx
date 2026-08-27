import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import QuickAccessCard from './QuickAccessCard';
import { QUICK_ACCESS_ITEMS } from './quickAccessData';
import styles from './styles.module.css';

export default function QuickAccess(): ReactNode {
  return (
    <section className={styles.quickAccessSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            ⚡ Acesso Rápido à Documentação
          </Heading>
          <p className={styles.sectionSubtitle}>
            Navegue diretamente pelos módulos, guias e referências técnicas do Mercapecas Backend
          </p>
        </div>
        <div className={clsx('row', styles.grid)}>
          {QUICK_ACCESS_ITEMS.map((item, idx) => (
            <QuickAccessCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
