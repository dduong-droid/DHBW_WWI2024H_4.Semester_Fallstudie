'use client';
import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import styles from './CartSidebar.module.css';

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`} onClick={() => setIsCartOpen(false)}>
      <div className={styles.sidebar} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingBag size={24} strokeWidth={2.5} />
            <h2>Warenkorb</h2>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <p>Dein Warenkorb ist noch leer.</p>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {items.map(item => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemImage} style={{backgroundImage: `url(${item.imageUrl || ''})`}}></div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemTitleRow}>
                      <h4>{item.name}</h4>
                      <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                        <X size={16}/>
                      </button>
                    </div>
                    <div className={styles.itemPriceRow}>
                      <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</span>
                      <div className={styles.quantityControls}>
                        <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14}/></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14}/></button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>Zwischensumme</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Therapie-Versand (Kühltransport)</span>
              <span style={{color: 'var(--color-primary)', fontWeight: 600}}>Kostenlos</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Gesamt</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Sicher zur Kasse
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
