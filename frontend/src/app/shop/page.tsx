'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  Search, 
  ListFilter, 
  ShoppingCart,
  Plus
} from 'lucide-react';
import styles from './page.module.css';
import { shopMockApi } from '../../services/mockApi';
import { ShopInventory, MealKit } from '../../types/apiContracts';
import MealKitModal from '../../components/MealKitModal';
import CartNavIcon from '../../components/CartNavIcon';

export default function ShopPage() {
  const [inventory, setInventory] = useState<ShopInventory | null>(null);
  const [selectedKit, setSelectedKit] = useState<MealKit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    shopMockApi.getInventory().then(data => setInventory(data));
  }, []);

  const handleOpenKit = (kit: MealKit) => {
    setSelectedKit(kit);
    setIsModalOpen(true);
  };

  if (!inventory) {
    return (
      <div className={styles.container} style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{animation: 'spin 1s linear infinite', border: '4px solid rgba(51, 199, 88, 0.2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', width: '40px', height: '40px'}}></div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {/* Top Navigation */}
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
              <CartNavIcon />
              <div className={styles.avatar}>
                <div 
                  className={styles.avatarImg} 
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9edJZrKoVYMUbVYeAL11mBb9NDRyQd6pXOSuAEU8Xzm26sBMxoNrcvps2apoGo4tKTfTiiE0U67oUUIghGuFfAkXqH2Q9vZwXrA8CiIlScjZxpd7ep81lHgE9-vO7xhdwnzxYL8ro90cofPsAiLNLRKHIx4QHQaUyTAZdyYXFwW7VEDq8MgInJz6INCGHXzzz_WBx0mlPnZcfNUAQTGtUcrpfYJqPStjaCQmkkMB7Rfgpy1VN1hnTT-eZ_Nv9YUFyYr_drHDwYNY')"}} 
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={styles.main}>
          
          {/* Banner */}
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <ShoppingCart size={14} strokeWidth={3} />
                Neues Sortiment
              </div>
              <h1 className={styles.heroTitle}>Klinisch Erprobte<br/>Meal Kits.</h1>
              <p className={styles.heroDesc}>Entwickelt von Ernährungsexperten. Basierend auf deiner Diagnose zur maximalen Unterstützung der Heilung.</p>
            </div>
            <div className={styles.heroImageObj}>
              {/* Abstract representation of a bowl */}
              <div style={{position:'absolute', width:'60%', height:'60%', background:'var(--color-primary)', borderRadius:'50%', top:'20%', left:'20%', opacity:0.2, filter:'blur(20px)'}} />
              <Utensils size={80} color="var(--color-primary)" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', opacity:0.8}} />
            </div>
          </div>

          {/* Filters */}
          <div className={styles.shopFilters}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input type="text" className={styles.searchInput} placeholder="Suche nach Gerichten oder Zutaten..." />
            </div>
            <button className={styles.filterBtn}>
              <ListFilter size={18} />
              Filter (Personalisiert)
            </button>
          </div>

          {/* Product Grid */}
          <div className={styles.productGrid}>
            {inventory.availableMealKits.map((item) => (
              <div 
                key={item.id} 
                className={styles.productCard}
                onClick={() => handleOpenKit(item)}
                style={{cursor: 'pointer'}}
              >
                <div 
                  className={styles.productImagePlaceholder}
                  style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  <div className={styles.dietaryTags}>
                    {item.dietaryTags.map(tag => (
                      <span key={tag} className={styles.dietTag}>{tag}</span>
                    ))}
                  </div>
                  {!item.imageUrl && <Utensils size={48} color="rgba(156, 163, 175, 0.2)" />}
                </div>
                
                <div className={styles.productContent}>
                  <h3 className={styles.productTitle}>{item.name}</h3>
                  <div className={styles.nutritionMini}>
                    <div className={styles.nutritionMiniItem}>
                      <span className={styles.nutritionVal}>{item.nutritionalValues.calories}</span>
                      <span className={styles.nutritionLabel}>kcal</span>
                    </div>
                    <div className={styles.nutritionMiniItem}>
                      <span className={styles.nutritionVal}>{item.nutritionalValues.protein}g</span>
                      <span className={styles.nutritionLabel}>Protein</span>
                    </div>
                    <div className={styles.nutritionMiniItem}>
                      <span className={styles.nutritionVal}>{item.nutritionalValues.carbs}g</span>
                      <span className={styles.nutritionLabel}>Kohlenh.</span>
                    </div>
                    <div className={styles.nutritionMiniItem}>
                      <span className={styles.nutritionVal}>{item.nutritionalValues.fat}g</span>
                      <span className={styles.nutritionLabel}>Fett</span>
                    </div>
                  </div>

                  <div className={styles.productFooter}>
                    <div className={styles.productPrice}>
                      {item.price} <span>{item.currency}</span>
                    </div>
                    <button className={styles.buyBtn} aria-label="In den Warenkorb" onClick={(e) => { e.stopPropagation(); handleOpenKit(item); }}>
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
      
      {/* Absolute Modal Root */}
      <MealKitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        kit={selectedKit} 
      />
    </>
  );
}
