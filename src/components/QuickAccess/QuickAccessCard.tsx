import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import type { QuickAccessItem } from './types';
import styles from './styles.module.css';

export default function QuickAccessCard({ 
  title, 
  icon, 
  description, 
  link, 
  badge 
}: QuickAccessItem): ReactNode {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.cardLink}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden="true">{icon}</span>
            {badge && <span className={styles.cardBadge}>{badge}</span>}
          </div>
          <Heading as="h3" className={styles.cardTitle}>
            {title}
          </Heading>
          <p className={styles.cardDescription}>{description}</p>
          <span className={styles.cardArrow}>
            Acessar Documentação &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
}
