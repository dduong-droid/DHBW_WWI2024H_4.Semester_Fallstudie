import Link from 'next/link';
import { ShoppingBag, ArrowRight, Utensils } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.badge}>
          <Utensils size={16} />
          Eure Gesundheit, unsere Mission
        </div>
        <h1 className={styles.title}>Food 4 Recovery</h1>
        <p className={styles.description}>
          Personalisierte Ernährungslösungen für eine schnellere Genesung. 
          Medizinisch fundiert, frisch geliefert.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/dashboard" className={styles.primaryBtn}>
            Zum Dashboard
            <ArrowRight size={20} />
          </Link>
          <Link href="/shop" className={styles.secondaryBtn}>
            Shop durchstöbern
            <ShoppingBag size={20} />
          </Link>
        </div>
      </div>
    </main>
  );
}
