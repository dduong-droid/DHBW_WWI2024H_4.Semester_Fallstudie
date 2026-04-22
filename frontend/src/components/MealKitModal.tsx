'use client';
import React, { useState, useEffect } from 'react';
import { X, Utensils, CheckCircle, Loader2, Wallet, ShoppingBag } from 'lucide-react';
import { MealKit } from '../types/apiContracts';
import styles from './MealKitModal.module.css';
import { useCart } from '../context/CartContext';

interface MealKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  kit: MealKit | null;
}

type CheckoutState = 'idle' | 'processing' | 'success';

export default function MealKitModal({ isOpen, onClose, kit }: MealKitModalProps) {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('idle');
  const { addToCart } = useCart();

  // Reset state gracefully when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setCheckoutState('idle'), 400); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!kit) return null;

  const handleCheckout = () => {
    addToCart({
      id: kit.id,
      name: kit.name,
      price: kit.price,
      quantity: 1,
      imageUrl: kit.imageUrl,
    });
    setCheckoutState('success');
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={onClose}>
      <div className={styles.modalSheet} onClick={e => e.stopPropagation()}>
        
        {checkoutState === 'success' ? (
          <div className={styles.successContainer}>
            <CheckCircle size={80} className={styles.checkCircle} strokeWidth={2.5} />
            <h2 className={styles.successTitle}>Im Warenkorb!</h2>
            <p className={styles.successDesc}>
              Dein MealKit wurde erfolgreich zum Warenkorb hinzugefügt.
            </p>
            <button 
              className={styles.applePayBtn} 
              onClick={onClose} 
              style={{marginTop: '2rem', backgroundColor: 'var(--color-primary)'}}
            >
              Weiter shoppen
            </button>
          </div>
        ) : (
          <>
            <div 
              className={styles.heroImage} 
              style={{ backgroundImage: `url(${kit.imageUrl || ''})` }}
            >
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.header}>
                <h2 className={styles.title}>{kit.name}</h2>
                <div className={styles.price}>{kit.price} {kit.currency}</div>
              </div>

              <h3 className={styles.sectionTitle}>Enthaltene Mahlzeiten</h3>
              <div className={styles.mealsList}>
                {kit.meals?.map((meal, idx) => (
                  <div key={idx} className={styles.mealItem}>
                    <Utensils size={20} className={styles.mealIcon} />
                    <span style={{fontWeight: 600, fontSize: '0.875rem'}}>{meal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.stickyFooter}>
              <button 
                className={styles.applePayBtn} 
                onClick={handleCheckout}
                disabled={checkoutState === 'processing'}
              >
                <ShoppingBag size={20} />
                In den Warenkorb
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
