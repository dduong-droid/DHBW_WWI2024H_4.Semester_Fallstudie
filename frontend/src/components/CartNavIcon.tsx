'use client';
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartNavIcon() {
  const { items, setIsCartOpen } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      aria-label={`Warenkorb mit ${totalItems} Artikeln`}
      style={{
        position: 'relative',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '50%',
        transition: 'all 0.2s ease',
      }}
    >
      <ShoppingCart size={22} />
      {totalItems > 0 && (
        <span style={{
          position: 'absolute',
          top: '0',
          right: '0',
          background: 'var(--color-primary)',
          color: 'white',
          borderRadius: '50%',
          width: '1.125rem',
          height: '1.125rem',
          fontSize: '0.625rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}>
          {totalItems}
        </span>
      )}
    </button>
  );
}
