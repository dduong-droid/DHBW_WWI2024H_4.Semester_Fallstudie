'use client';

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CuratedMeal } from '../types/apiContracts';
import styles from './CuratedMealModal.module.css';
import { useCart } from '../context/CartContext';

interface CuratedMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: CuratedMeal | null;
}

export default function CuratedMealModal({ isOpen, onClose, meal }: CuratedMealModalProps) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setAdded(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!meal) return null;

  const handleAdd = () => {
    setAdded(true);
    addToCart({
      id: meal.id,
      name: meal.title,
      price: 15.99, // Curated baseline price
      quantity: 1,
      imageUrl: meal.imageUrl,
    });
    // Optional API delay, then close
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={onClose}>
      <div className={styles.modalSheet} onClick={e => e.stopPropagation()}>
        
        <div className={styles.header}>
          <h2 className={styles.title}>Zutaten & Details</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <ul className={styles.ingredientsList}>
            {meal.ingredients.map((ing, idx) => (
              <li key={idx} className={styles.ingredientItem}>
                <div className={styles.bullet} />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.stickyFooter}>
          <button 
            className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`} 
            onClick={handleAdd}
            disabled={added}
          >
            {added ? (
              <>
                <Check size={20} strokeWidth={3} />
                In Recovery-Box
              </>
            ) : (
              'In meine Box aufnehmen'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
