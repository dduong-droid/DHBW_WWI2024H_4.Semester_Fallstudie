"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Utensils, Search, ShoppingBag, Plus, Bell,
  HeartPulse, Package
} from 'lucide-react';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';
import type { MealKit } from '../../services/mockApi';
import { useCart } from '../../context/CartContext';
import CartNavIcon from '../../components/CartNavIcon';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Alle',
  wound_healing: 'Wundheilung',
  oncology: 'Onkologie',
  immune: 'Immunsystem',
  gut_health: 'Darmgesundheit',
  vitality: 'Vitalität',
};

export default function ShopPage() {
  const [kits, setKits] = useState<MealKit[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    recoveryApi.fetchShopInventory().then(data => setKits(data));
  }, []);

  const filteredKits = useMemo(() => {
    if (!kits) return [];
    return kits.filter(kit => {
      const matchesSearch = kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || kit.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [kits, searchQuery, activeCategory]);

  const handleAddToCart = (kit: MealKit) => {
    addToCart({
      id: kit.id,
      name: kit.name,
      price: kit.price,
      quantity: 1,
      imageUrl: kit.imageUrl,
    });
  };

  // Loading
  if (!kits) {
    return (
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <div className={styles.logoArea}>
              <div className={styles.logoIcon}><Utensils size={20} strokeWidth={2.5} /></div>
              <span className={styles.logoText}>Food 4 Recovery</span>
            </div>
          </div>
        </nav>
        <main className={styles.main}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--color-primary)' }}>
            <div style={{ width: '3rem', height: '3rem', border: '4px solid rgba(51,199,88,0.2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontWeight: 600 }}>Lade Shop...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <Utensils size={20} strokeWidth={2.5} />
            </div>
            <span className={styles.logoText}>Food 4 Recovery</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/profile" className={styles.navLink}>Profil</Link>
            <Link href="/recipes" className={styles.navLink}>Rezepte</Link>
            <Link href="/shop" className={`${styles.navLink} ${styles.navLinkActive}`}>Shop</Link>
          </div>
          <div className={styles.userArea}>
            <button className={styles.iconBtn} aria-label="Benachrichtigungen">
              <Bell size={20} />
            </button>
            <CartNavIcon />
            <div className={styles.avatar}>
              <div
                className={styles.avatarImg}
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9edJZrKoVYMUbVYeAL11mBb9NDRyQd6pXOSuAEU8Xzm26sBMxoNrcvps2apoGo4tKTfTiiE0U67oUUIghGuFfAkXqH2Q9vZwXrA8CiIlScjZxpd7ep81lHgE9-vO7xhdwnzxYL8ro90cofPsAiLNLRKHIx4QHQaUyTAZdyYXFwW7VEDq8MgInJz6INCGHXzzz_WBx0mlPnZcfNUAQTGtUcrpfYJqPStjaCQmkkMB7Rfgpy1VN1hnTT-eZ_Nv9YUFyYr_drHDwYNY')" }}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero Banner */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <HeartPulse size={12} />
              Recovery-orientiert
            </div>
            <h1 className={styles.heroTitle}>Recovery Packages</h1>
            <p className={styles.heroDesc}>
              Vorgeplante Ernährungspakete fuer unterschiedliche Regenerationssituationen. Als Demo-Option gedacht und bei medizinischen Fragen mit Fachpersonal abzustimmen.
            </p>
          </div>
          <div className={styles.heroImageObj}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={80} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className={styles.shopFilters}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Meal-Kit suchen..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Meal-Kit suchen"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={styles.filterBtn}
                onClick={() => setActiveCategory(key)}
                style={{
                  backgroundColor: activeCategory === key ? 'var(--color-primary)' : undefined,
                  color: activeCategory === key ? 'white' : undefined,
                  borderColor: activeCategory === key ? 'var(--color-primary)' : undefined,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredKits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>Keine Produkte gefunden</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Versuche eine andere Suche oder Kategorie.</p>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filteredKits.map(kit => (
              <article key={kit.id} className={styles.productCard}>
                {/* Image */}
                <div className={styles.productImagePlaceholder}
                  style={{ backgroundImage: `url('${kit.imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className={styles.dietaryTags}>
                    {kit.tags.map((tag, i) => (
                      <span key={i} className={styles.dietTag}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className={styles.productContent}>
                  <h3 className={styles.productTitle}>{kit.name}</h3>
                  <p className={styles.productDesc}>{kit.description}</p>

                  {/* Nutrition Mini */}
                  <div className={styles.nutritionMini}>
                    <div className={styles.nutritionMiniItem}>
                      <span className={styles.nutritionVal}>{kit.nutrition.calories}</span>
                      <span className={styles.nutritionLabel}>kcal</span>
                    </div>
                    <div className={styles.nutritionMiniItem}>
                      <span className={styles.nutritionVal}>{kit.nutrition.protein}</span>
                      <span className={styles.nutritionLabel}>Protein</span>
                    </div>
                    <div className={styles.nutritionMiniItem}>
                      <span className={styles.nutritionVal}>{kit.nutrition.carbs}</span>
                      <span className={styles.nutritionLabel}>Carbs</span>
                    </div>
                    <div className={styles.nutritionMiniItem}>
                      <span className={styles.nutritionVal}>{kit.nutrition.fat}</span>
                      <span className={styles.nutritionLabel}>Fett</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={styles.productFooter}>
                    <div className={styles.productPrice}>
                      {kit.price.toFixed(2).replace('.', ',')} {kit.currency}
                      <span> / Woche</span>
                    </div>
                    <button
                      className={styles.buyBtn}
                      onClick={() => handleAddToCart(kit)}
                      aria-label={`${kit.name} in den Warenkorb`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
