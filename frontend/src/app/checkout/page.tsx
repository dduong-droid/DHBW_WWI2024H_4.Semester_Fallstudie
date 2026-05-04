"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils, Bell, Lock, Truck, MapPin, CreditCard, Wallet,
  CheckCircle2, ShieldCheck, Minus, Plus,
  Package, ShoppingBag, ArrowRight, Trash2
} from 'lucide-react';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';
import { useCart } from '../../context/CartContext';
import CartNavIcon from '../../components/CartNavIcon';

const TIME_SLOTS = ['08:00 – 10:00', '10:00 – 12:00', '14:00 – 16:00', '18:00 – 20:00'];

const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Kreditkarte', icon: <CreditCard size={28} /> },
  { id: 'paypal', label: 'PayPal', icon: <span style={{ fontWeight: 800, fontStyle: 'italic', color: '#003087', fontSize: '1.125rem' }}>PayPal</span> },
];

const MOCK_ADDRESSES = [
  { street: 'Musterstraße 1', zip: '10115', city: 'Berlin' },
  { street: 'Königsallee 42', zip: '40212', city: 'Düsseldorf' },
  { street: 'Marienplatz 1', zip: '80331', city: 'München' },
  { street: 'Hauptstraße 100', zip: '20095', city: 'Hamburg' },
  { street: 'Schillerstraße 10', zip: '60313', city: 'Frankfurt am Main' }
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
  const [deliveryWindow, setDeliveryWindow] = useState('');
  const [backendOrderUsed, setBackendOrderUsed] = useState(false);
  
  // Autocomplete State
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState(MOCK_ADDRESSES);

  useEffect(() => {
    recoveryApi.fetchPatientProfile().then(p => {
      if (p.firstName || p.lastName) {
        setFullName(`${p.firstName} ${p.lastName}`.trim());
      }
    }).catch(err => console.warn('[Checkout] Fetch failed:', err instanceof Error ? err.message : String(err)));
  }, []);

  const shippingCost = 0;
  const taxRate = 0.07;
  const subtotal = totalPrice;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shippingCost;

  const canOrder = fullName.trim() && street.trim() && zip.trim() && city.trim() && items.length > 0;

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStreet(val);
    if (val.trim() === '') {
      setFilteredAddresses(MOCK_ADDRESSES);
      setShowAutocomplete(false);
    } else {
      const filtered = MOCK_ADDRESSES.filter(addr =>
        addr.street.toLowerCase().includes(val.toLowerCase()) ||
        addr.city.toLowerCase().includes(val.toLowerCase()) ||
        addr.zip.includes(val)
      );
      setFilteredAddresses(filtered);
      setShowAutocomplete(filtered.length > 0);
    }
  };

  const selectAddress = (addr: typeof MOCK_ADDRESSES[0]) => {
    setStreet(addr.street);
    setZip(addr.zip);
    setCity(addr.city);
    setShowAutocomplete(false);
  };

  const handleOrder = async () => {
    if (!canOrder) return;
    setProcessing(true);

    const order = await recoveryApi.submitCheckoutOrder({
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      fullName,
      street,
      zip,
      city,
      paymentMethod,
      timeSlot,
    });

    // Aktiviere die gekauften Meal-Kits für das Dashboard (mit Menge)
    for (const item of items) {
      await recoveryApi.activatePurchasedKit(item.id, item.quantity);
    }

    setOrderId(order.orderId);
    setDeliveryWindow(order.deliveryWindow);
    setBackendOrderUsed(order.backendUsed);
    setProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  // === Bestellbestätigung ===
  if (orderComplete) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={48} />
            </div>
            <h1 className={styles.successTitle}>
              Vielen Dank für<br />deine Bestellung!
            </h1>
            <p className={styles.successDesc}>
              Deine Demo-Bestellung wurde erfasst. Es wurde keine echte Zahlung ausgelöst.
            </p>

            {/* Order Details */}
            <div className={styles.successCard}>
              <div className={styles.successDetailRow} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <span className={styles.successDetailLabel}>Bestellnummer</span>
                <span className={styles.successDetailValue}>#{orderId}</span>
              </div>
              <div className={styles.successDetailRow}>
                <span className={styles.successDetailLabel}>Lieferfenster</span>
                <span className={styles.successDetailValue} style={{ color: 'var(--color-primary)' }}>{deliveryWindow || timeSlot}</span>
              </div>
              <div className={styles.successDetailRow}>
                <span className={styles.successDetailLabel}>Adresse</span>
                <span className={styles.successDetailValue}>{street}, {zip} {city}</span>
              </div>
              <div className={styles.successDetailRow}>
                <span className={styles.successDetailLabel}>Modus</span>
                <span className={styles.successDetailValue}>{backendOrderUsed ? 'Backend-Order-API' : 'lokaler Demo-Fallback'}</span>
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
                <div className={styles.formGridFull} style={{ position: 'relative' }}>
                  <label htmlFor="co-street" className={styles.label}>Straße & Hausnummer</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <MapPin size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
                    <input 
                      id="co-street" 
                      className={styles.input} 
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Tippe z.B. Musterstraße..." 
                      value={street} 
                      onChange={handleStreetChange}
                      onFocus={() => {
                        if (street.trim() !== '' && filteredAddresses.length > 0) setShowAutocomplete(true);
                      }}
                      onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                      autoComplete="off"
                    />
                  </div>
                  {showAutocomplete && (
                    <ul style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                      background: 'var(--surface)', border: '1px solid var(--border)', 
                      borderRadius: 'var(--radius-md)', marginTop: '0.25rem', padding: '0.5rem 0',
                      boxShadow: 'var(--shadow-md)', listStyle: 'none', maxHeight: '200px', overflowY: 'auto'
                    }}>
                      {filteredAddresses.map((addr, idx) => (
                        <li 
                          key={idx} 
                          style={{ padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background 0.2s ease', borderBottom: idx < filteredAddresses.length - 1 ? '1px solid var(--border)' : 'none' }}
                          onMouseDown={(e) => {
                              e.preventDefault(); // Prevents input onBlur
                              selectAddress(addr);
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(51, 199, 88, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{addr.street}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{addr.zip} {addr.city}</div>
                        </li>
                      ))}
                    </ul>
                  )}
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
                {processing ? 'Wird verarbeitet...' : 'Demo-Bestellung absenden'}
              </button>

              <p className={styles.legalText}>
                Demo-Checkout ohne echte Zahlung. Zahlungsdaten werden nicht verarbeitet.
              </p>

              <div className={styles.trustRow}>
                <span className={styles.trustItem}><ShieldCheck size={14} /> lokaler Demo-Modus</span>
                <span className={styles.trustItem}><Truck size={14} /> keine echte Zahlung</span>
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
