import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import type { FeatureItem } from './types';
import styles from './styles.module.css';

export default function FeatureCard({ title, icon, description }: FeatureItem): ReactNode {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon} aria-hidden="true">{icon}</div>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}
