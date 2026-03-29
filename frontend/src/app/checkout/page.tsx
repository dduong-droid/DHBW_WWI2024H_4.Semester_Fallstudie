'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, CreditCard, Lock, CheckCircle2, Truck } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplePay = async () => {
    setIsProcessing(true);
    // Simulate Apple Pay auth
    await new Promise(res => setTimeout(res, 2000));
    clearCart(); // empty cart on success
    router.push('/checkout/success');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {/* minimal nav */}
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <Link href="/shop" className={styles.backLink}>
            <ArrowLeft size={20} />
            Zurück
          </Link>
          <div className={styles.secureBadge}>
            <Lock size={14} /> Sichere Kasse
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.checkoutGrid}>
          
          <div className={styles.formColumn}>
            <h1 className={styles.title}>Kasse</h1>
            
            {/* Express Checkout */}
            <div className={styles.expressSection}>
              <h3 className={styles.sectionTitle}>Express Checkout</h3>
              <button 
                className={styles.applePayBtn} 
                onClick={handleApplePay}
                disabled={isProcessing || items.length === 0}
              >
                {isProcessing ? 'Verarbeite Zahlung...' : 'Mit Apple Pay kaufen'}
              </button>
              
              <div className={styles.divider}>
                <span>oder reguläre Kasse</span>
              </div>
            </div>

            {/* Standard Form */}
            <form onSubmit={handleCheckout} className={styles.standardForm}>
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Lieferadresse</h3>
                <div className={styles.formRow}>
                  <input required disabled={isProcessing} type="text" placeholder="Vorname" className={styles.input} />
                  <input required disabled={isProcessing} type="text" placeholder="Nachname" className={styles.input} />
                </div>
                <input required disabled={isProcessing} type="text" placeholder="Straße und Hausnummer" className={styles.input} />
                <div className={styles.formRow}>
                  <input required disabled={isProcessing} type="text" placeholder="PLZ" className={styles.input} />
                  <input required disabled={isProcessing} type="text" placeholder="Ort" className={styles.input} />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Zahlungsmethode</h3>
                <div className={styles.paymentMethod}>
                  <div className={styles.paymentMethodHeader}>
                    <CreditCard size={20} />
                    <span>Kreditkarte</span>
                    <CheckCircle2 size={20} color="var(--color-primary)" className={styles.checkIcon} />
                  </div>
                  <div className={styles.paymentDetails}>
                    <input required disabled={isProcessing} type="text" placeholder="Kartennummer (Mock)" className={styles.input} defaultValue="4242 4242 4242 4242" />
                    <div className={styles.formRow}>
                      <input required disabled={isProcessing} type="text" placeholder="MM/YY" className={styles.input} defaultValue="12/26" />
                      <input required disabled={isProcessing} type="text" placeholder="CVC" className={styles.input} defaultValue="123" />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isProcessing || items.length === 0}
              >
                {isProcessing ? 'Bitte warten...' : `Jetzt zahlen (${totalPrice.toFixed(2)} €)`}
              </button>
            </form>
          </div>

          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Bestellübersicht</h2>
              
              <div className={styles.summaryItems}>
                {items.length === 0 ? (
                  <p style={{color: 'var(--text-muted)'}}>Keine Artikel im Warenkorb.</p>
                ) : (
                  items.map(item => (
                    <div key={item.id} className={styles.summaryItem}>
                      <div className={styles.itemImage} style={{backgroundImage: `url(${item.imageUrl || ''})`}}>
                        <span className={styles.itemQuantity}>{item.quantity}</span>
                      </div>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.totals}>
                <div className={styles.totalsRow}>
                  <span>Zwischensumme</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className={styles.totalsRow}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span>Versand</span>
                    <Truck size={16} color="var(--color-primary)" />
                  </div>
                  <span style={{color: 'var(--color-primary)'}}>Kostenlos</span>
                </div>
                <div className={styles.totalsTotal}>
                  <span>Gesamtsumme</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
