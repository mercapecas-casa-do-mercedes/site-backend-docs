import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import FeatureCard from './FeatureCard';
import { FEATURE_LIST } from './featuresData';
import styles from './styles.module.css';

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Por que escolher Mercapecas Backend?
          </Heading>
          <p className={styles.sectionSubtitle}>
            Uma base sólida, escalável e bem documentada para sua aplicação
          </p>
        </div>
        <div className={clsx('row', styles.featuresGrid)}>
          {FEATURE_LIST.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
