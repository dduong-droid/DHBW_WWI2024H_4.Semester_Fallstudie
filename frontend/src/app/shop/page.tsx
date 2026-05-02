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



export default function ShopPage() {
  const [kits, setKits] = useState<MealKit[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    recoveryApi.fetchShopInventory().then(data => setKits(data));
  }, []);

  const filteredKits = useMemo(() => {
    if (!kits) return [];
    return kits.filter(kit => {
      return kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [kits, searchQuery]);

  const handleAddToCart = async (kit: MealKit) => {
    addToCart({
      id: kit.id,
      name: kit.name,
      price: kit.price,
      quantity: 1,
      imageUrl: kit.imageUrl,
    });
    alert(`"${kit.name}" wurde zum Warenkorb hinzugefügt!`);
  };

  // Loading
  if (!kits) {
    return (
      <div className={styles.container}>
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
              Vorgeplante Ernährungspakete für unterschiedliche Regenerationssituationen. Als Demo-Option gedacht und bei medizinischen Fragen mit Fachpersonal abzustimmen.
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

                  {/* Meals List */}
                  <details style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Utensils size={16} /> Enthaltene Mahlzeiten ansehen
                    </summary>
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {kit.meals.map(meal => (
                        <div key={meal.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--surface)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundImage: `url('${meal.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{meal.label}</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{meal.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{meal.calories} kcal • {meal.prepTime}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>

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
