"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils, Bell, Lock, Truck, MapPin, CreditCard, Wallet,
  CheckCircle2, ShieldCheck, ChevronRight, Minus, Plus,
  Package, ShoppingBag, ArrowRight, Trash2
} from 'lucide-react';
import styles from './page.module.css';
import { useCart } from '../../context/CartContext';
import CartNavIcon from '../../components/CartNavIcon';

const TIME_SLOTS = ['08:00 – 10:00', '10:00 – 12:00', '14:00 – 16:00', '18:00 – 20:00'];

const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Kreditkarte', icon: <CreditCard size={28} /> },
  { id: 'paypal', label: 'PayPal', icon: <span style={{ fontWeight: 800, fontStyle: 'italic', color: '#003087', fontSize: '1.125rem' }}>PayPal</span> },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  // Form State
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shippingCost = 0;
  const taxRate = 0.07;
  const subtotal = totalPrice;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shippingCost;

  const canOrder = fullName.trim() && street.trim() && zip.trim() && city.trim() && items.length > 0;

  const handleOrder = async () => {
    if (!canOrder) return;
    setProcessing(true);

    // Mock: Simuliere POST /api/frontend/orders
    console.log('[MockAPI] Bestellung aufgegeben:', {
      items: items.map(i => ({ id: i.id, name: i.name, qty: i.quantity })),
      address: { fullName, street, zip, city },
      timeSlot,
      paymentMethod,
      total,
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const id = `F4R-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    setOrderId(id);
    setProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  // === Bestellbestätigung ===
  if (orderComplete) {
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
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={48} />
            </div>
            <h1 className={styles.successTitle}>
              Vielen Dank für<br />deine Bestellung!
            </h1>
            <p className={styles.successDesc}>
              Dein Recovery-Paket wird gerade vorbereitet und ist bald auf dem Weg zu dir.
            </p>

            {/* Order Details */}
            <div className={styles.successCard}>
              <div className={styles.successDetailRow} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <span className={styles.successDetailLabel}>Bestellnummer</span>
                <span className={styles.successDetailValue}>#{orderId}</span>
              </div>
              <div className={styles.successDetailRow}>
                <span className={styles.successDetailLabel}>Lieferfenster</span>
                <span className={styles.successDetailValue} style={{ color: 'var(--color-primary)' }}>{timeSlot}</span>
              </div>
              <div className={styles.successDetailRow}>
                <span className={styles.successDetailLabel}>Adresse</span>
                <span className={styles.successDetailValue}>{street}, {zip} {city}</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className={styles.successCard} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Nächste Schritte</h3>
              {[
                { icon: <Package size={16} />, title: 'Verpackung', desc: 'Wir stellen deine Box mit regenerativen Nährstoffen zusammen.', active: true },
                { icon: <Truck size={16} />, title: 'Versand', desc: 'Du erhältst eine Tracking-Nummer, sobald das Paket unser Haus verlässt.', active: false },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', opacity: step.active ? 1 : 0.5 }}>
                  <div style={{
                    width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--background)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    color: step.active ? 'var(--color-primary)' : 'var(--text-muted)',
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>{step.title}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.successActions}>
              <button className={styles.successPrimaryBtn} onClick={() => router.push('/dashboard')}>
                Zurück zum Dashboard
              </button>
              <button className={styles.successSecondaryBtn} onClick={() => router.push('/shop')}>
                Weiter einkaufen
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // === Leerer Warenkorb ===
  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <div className={styles.logoArea}>
              <div className={styles.logoIcon}><Utensils size={20} strokeWidth={2.5} /></div>
              <span className={styles.logoText}>Food 4 Recovery</span>
            </div>
            <div className={styles.navLinks}>
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
              <Link href="/shop" className={styles.navLink}>Shop</Link>
            </div>
            <div className={styles.userArea}><CartNavIcon /></div>
          </div>
        </nav>
        <main className={styles.main}>
          <div className={styles.emptyCart}>
            <ShoppingBag size={64} style={{ opacity: 0.2 }} />
            <h2 className={styles.emptyCartTitle}>Dein Warenkorb ist leer</h2>
            <p>Füge Meal-Kits aus dem Shop hinzu, um eine Bestellung aufzugeben.</p>
            <Link href="/shop" className={styles.emptyCartLink}>
              Zum Shop <ArrowRight size={18} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // === Checkout Formular ===
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logoArea}>
            <div className={styles.logoIcon}><Utensils size={20} strokeWidth={2.5} /></div>
            <span className={styles.logoText}>Food 4 Recovery</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/profile" className={styles.navLink}>Profil</Link>
            <Link href="/recipes" className={styles.navLink}>Rezepte</Link>
            <Link href="/shop" className={styles.navLink}>Shop</Link>
          </div>
          <div className={styles.userArea}>
            <button className={styles.iconBtn} aria-label="Benachrichtigungen"><Bell size={20} /></button>
            <CartNavIcon />
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Kasse</h1>
          <p className={styles.pageSubtitle}>Schließe deine Bestellung für deine Genesung ab.</p>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Forms */}
          <div>
            {/* Lieferdetails */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Truck size={22} className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Lieferdetails</h3>
              </div>
              <div>
                <label className={styles.label}>Zeitfenster wählen</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      className={`${styles.timeSlot} ${timeSlot === slot ? styles.timeSlotActive : ''}`}
                      onClick={() => setTimeSlot(slot)}
                    >
                      <span>{slot}</span>
                      {timeSlot === slot && <CheckCircle2 size={18} />}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Lieferadresse */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <MapPin size={22} className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Lieferadresse</h3>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGridFull}>
                  <label htmlFor="co-name" className={styles.label}>Vollständiger Name</label>
                  <input id="co-name" className={styles.input} placeholder="Max Mustermann" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div className={styles.formGridFull}>
                  <label htmlFor="co-street" className={styles.label}>Straße & Hausnummer</label>
                  <input id="co-street" className={styles.input} placeholder="Beispielstraße 123" value={street} onChange={e => setStreet(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="co-zip" className={styles.label}>Postleitzahl</label>
                  <input id="co-zip" className={styles.input} placeholder="10115" value={zip} onChange={e => setZip(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="co-city" className={styles.label}>Stadt</label>
                  <input id="co-city" className={styles.input} placeholder="Berlin" value={city} onChange={e => setCity(e.target.value)} />
                </div>
              </div>
            </section>

            {/* Zahlungsmethode */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Wallet size={22} className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Zahlungsmethode</h3>
              </div>
              <div className={styles.paymentGrid}>
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    className={`${styles.paymentCard} ${paymentMethod === pm.id ? styles.paymentCardActive : ''}`}
                    onClick={() => setPaymentMethod(pm.id)}
                  >
                    <span style={{ color: paymentMethod === pm.id ? 'var(--color-primary)' : 'var(--text-muted)' }}>{pm.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pm.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Bestellübersicht</h3>

              {/* Cart Items */}
              {items.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImage} style={{ backgroundImage: item.imageUrl ? `url('${item.imageUrl}')` : undefined }} />
                  <div className={styles.summaryItemInfo}>
                    <div>
                      <div className={styles.summaryItemName}>{item.name}</div>
                      <div className={styles.summaryItemMeta}>
                        <div className={styles.qtyControls} style={{ marginTop: '0.5rem' }}>
                          <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)} aria-label="Weniger">
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: 700, minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                          <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)} aria-label="Mehr">
                            <Plus size={14} />
                          </button>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Entfernen"
                            style={{ marginLeft: '0.5rem', color: '#ba1a1a', borderColor: 'rgba(186,26,26,0.2)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className={styles.summaryItemPrice}>
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                    </span>
                  </div>
                </div>
              ))}

              {/* Calculations */}
              <div style={{ marginBottom: '0.5rem' }}>
                <div className={styles.summaryRow}>
                  <span>Zwischensumme</span>
                  <span className={styles.summaryRowValue}>{subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Versandkosten</span>
                  <span className={styles.summaryRowValue} style={{ color: 'var(--color-primary)' }}>Kostenlos</span>
                </div>
                <div className={styles.summaryRow} style={{ fontSize: '0.75rem' }}>
                  <span>Inkl. MwSt. (7%)</span>
                  <span>{tax.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              <div className={styles.summaryTotal}>
                <span className={styles.summaryTotalLabel}>Gesamtsumme</span>
                <span className={styles.summaryTotalValue}>{total.toFixed(2).replace('.', ',')} €</span>
              </div>

              <button
                className={styles.ctaBtn}
                onClick={handleOrder}
                disabled={!canOrder || processing}
              >
                <Lock size={18} />
                {processing ? 'Wird verarbeitet...' : 'Jetzt zahlungspflichtig bestellen'}
              </button>

              <p className={styles.legalText}>
                Durch Klicken akzeptierst du unsere AGB und Datenschutzbestimmungen.
              </p>

              <div className={styles.trustRow}>
                <span className={styles.trustItem}><ShieldCheck size={14} /> SSL Gesichert</span>
                <span className={styles.trustItem}><Truck size={14} /> CO₂ Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700 }}>Food 4 Recovery GmbH</span>
          </div>
          <div className={styles.footerLinks}>
            <a>Impressum</a>
            <a>Datenschutz</a>
            <a>AGB</a>
            <a>Kontakt</a>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2026 Food 4 Recovery</span>
        </div>
      </footer>
    </div>
  );
}
