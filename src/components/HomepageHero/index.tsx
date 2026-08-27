import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  illustrationPath?: string;
}

export default function HomepageHero({ 
  title = "📖 Documentação Técnica Mercapecas Backend", 
  subtitle = "Guia completo de arquitetura, referência de APIs RESTful, módulos de negócio e convenções para o time de desenvolvimento.",
  ctaText = "Primeiros Passos",
  ctaLink = "/docs/getting-started",
  secondaryCtaText = "Referência de API",
  secondaryCtaLink = "/docs/api/email",
  illustrationPath = "/img/hero-illustration.svg"
}: HeroProps): ReactNode {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className={styles.heroTitle}>
              {title}
            </Heading>
            <p className={styles.heroSubtitle}>{subtitle}</p>
            <div className={styles.heroButtons}>
              <Link
                className="button button--primary button--lg"
                to={ctaLink}>
                {ctaText}
              </Link>
              <Link
                className="button button--secondary button--lg"
                to={secondaryCtaLink}>
                {secondaryCtaText}
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img 
              src={illustrationPath} 
              alt="Mercapecas Backend Architecture"
              className={styles.heroIllustration}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
