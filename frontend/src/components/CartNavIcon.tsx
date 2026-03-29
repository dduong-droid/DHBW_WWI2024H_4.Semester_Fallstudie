'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './CartNavIcon.module.css';

export default function CartNavIcon() {
  const { items, setIsCartOpen } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button className={styles.iconBtn} onClick={() => setIsCartOpen(true)} aria-label="Warenkorb öffnen">
      <ShoppingBag size={20} strokeWidth={2.5} />
      {totalItems > 0 && (
        <span className={styles.badge}>{totalItems}</span>
      )}
    </button>
  );
}
