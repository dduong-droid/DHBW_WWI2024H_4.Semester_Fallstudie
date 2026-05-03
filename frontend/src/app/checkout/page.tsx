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
import { nutritionMockApi } from '../../services/mockApi';
import { useRef } from 'react';

const GmpMap = 'gmp-map' as any;
const GmpBasicPlaceAutocomplete = 'gmp-basic-place-autocomplete' as any;
const GmpPlaceDetailsCompact = 'gmp-place-details-compact' as any;
const GmpPlaceDetailsPlaceRequest = 'gmp-place-details-place-request' as any;
const GmpPlaceStandardContent = 'gmp-place-standard-content' as any;

const TIME_SLOTS = ['08:00 – 10:00', '10:00 – 12:00', '14:00 – 16:00', '18:00 – 20:00'];


const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Kreditkarte', icon: <CreditCard size={28} /> },
  { id: 'paypal', label: 'PayPal', icon: <span style={{ fontWeight: 800, fontStyle: 'italic', color: '#003087', fontSize: '1.125rem' }}>PayPal</span> },
];

// Google Places Autocomplete handled by use-places-autocomplete hook

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

  // Web Component Ref
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    recoveryApi.fetchPatientProfile().then(p => {
      if (p.firstName || p.lastName) {
        setFullName(`${p.firstName} ${p.lastName}`.trim());
      }
    }).catch(err => console.warn('[Checkout] Fetch failed:', err instanceof Error ? err.message : String(err)));
  }, []);

  useEffect(() => {
    const initMap = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window === 'undefined' || !(window as any).google) return;
      
      const placeAutocompleteElement = document.querySelector('gmp-basic-place-autocomplete') as any;
      const placeDetailsElement = document.querySelector('gmp-place-details-compact') as any;
      const gmpMapElement = document.querySelector('gmp-map') as any;

      if (!placeAutocompleteElement || !placeDetailsElement || !gmpMapElement) return;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window as any).google.maps.importLibrary('places');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { AdvancedMarkerElement } = await (window as any).google.maps.importLibrary('marker');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { InfoWindow } = await (window as any).google.maps.importLibrary('maps');

        let map = gmpMapElement.innerMap;
        if (!map) {
          await new Promise(r => setTimeout(r, 300));
          map = gmpMapElement.innerMap;
        }
        if (!map) return;

        const center = gmpMapElement.center || { lat: 51.165, lng: 10.45 };
        placeAutocompleteElement.locationBias = center;

        map.setOptions({
            clickableIcons: false,
            mapTypeControl: false,
            streetViewControl: false,
        });

        const advancedMarkerElement = new AdvancedMarkerElement({
            map: map,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            collisionBehavior: (window as any).google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
        });

        const infoWindow = new InfoWindow({
            minWidth: 360,
            disableAutoPan: true,
            headerDisabled: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pixelOffset: new (window as any).google.maps.Size(0, -10),
        });

        const placeDetailsParent = placeDetailsElement.parentElement;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        placeAutocompleteElement.addEventListener('gmp-placeselect', async (event: any) => {
            if (placeDetailsParent) placeDetailsParent.appendChild(placeDetailsElement);
            placeDetailsElement.style.display = 'block';
            advancedMarkerElement.position = null;
            infoWindow.close();
            
            const placeDetailsRequest = placeDetailsElement.querySelector('gmp-place-details-place-request');
            if (placeDetailsRequest) placeDetailsRequest.place = event.place.id;

            try {
                // Manually fetch fields to guarantee React State update immediately
                await event.place.fetchFields({ fields: ['displayName', 'formattedAddress', 'addressComponents', 'location'] });
                const place = event.place;

                // Move Map
                advancedMarkerElement.position = place.location;
                infoWindow.setContent(placeDetailsElement);
                infoWindow.open({
                    map,
                    anchor: advancedMarkerElement,
                });
                map.setCenter(place.location);

                // Update React Form State
                let addr = place.formattedAddress;
                if (!addr && place.displayName) {
                    addr = typeof place.displayName === 'string' ? place.displayName : place.displayName.text;
                }
                
                // FALLBACK: Wenn die API weder formattedAddress noch displayName liefert, nutze den Text aus dem Suchfeld
                if (!addr && placeAutocompleteElement.inputValue) {
                    addr = placeAutocompleteElement.inputValue;
                }

                if (addr) setStreet(addr);
                
                let extractedZip = 'N/A';
                let extractedCity = 'N/A';
                const components = place.addressComponents || [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                components.forEach((c: any) => {
                  if (c.types.includes('postal_code')) extractedZip = c.longText;
                  if (c.types.includes('locality')) extractedCity = c.longText;
                });
                setZip(extractedZip);
                setCity(extractedCity);
            } catch (err) {
                console.warn('Could not fetch place fields:', err);
            }
        });

        map.addListener('click', () => {
            infoWindow.close();
            advancedMarkerElement.position = null;
        });

        map.addListener('idle', () => {
            const newCenter = map.getCenter();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            placeAutocompleteElement.locationBias = new (window as any).google.maps.Circle({
                center: {
                    lat: newCenter.lat(),
                    lng: newCenter.lng(),
                },
                radius: 10000,
            });
        });

      } catch (err) {
        console.warn('Google Maps Autocomplete failed to initialize', err);
      }
    };

    const intervalId = setInterval(() => {
        if (document.querySelector('gmp-map') && (window as any).google) {
            clearInterval(intervalId);
            initMap();
        }
    }, 150);

    return () => clearInterval(intervalId);
  }, []);

  const shippingCost = 0;
  const taxRate = 0.07;
  const subtotal = totalPrice;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shippingCost;

  const canOrder = fullName.trim() && street.trim() && items.length > 0;


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
      await nutritionMockApi.activateMealKit(item.id, item.quantity);
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
                  <label htmlFor="co-street" className={styles.label}>Adresse</label>
                  
                  <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    {isClient && (
                      <>
                        <GmpMap
                            zoom="6"
                            center="51.165691,10.451526"
                            map-id="DEMO_MAP_ID">
                            <GmpBasicPlaceAutocomplete
                                slot="control-inline-start-block-start"
                                style={{ position: 'absolute', top: '10px', left: '10px', width: 'clamp(200px, 90%, 400px)', height: '40px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px', zIndex: 10 }}
                            ></GmpBasicPlaceAutocomplete>
                        </GmpMap>
                        
                        {/* Place Details Element inside InfoWindow */}
                        <GmpPlaceDetailsCompact
                            orientation="horizontal"
                            style={{
                                width: '360px',
                                display: 'none',
                                border: 'none',
                                padding: '0',
                                margin: '0',
                                backgroundColor: 'transparent',
                                colorScheme: 'light'
                            }}>
                            <GmpPlaceDetailsPlaceRequest></GmpPlaceDetailsPlaceRequest>
                            <GmpPlaceStandardContent></GmpPlaceStandardContent>
                        </GmpPlaceDetailsCompact>
                      </>
                    )}
                  </div>

                  {street ? (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                        <CheckCircle2 size={18} />
                        <span style={{ fontWeight: 600 }}>Lieferadresse bestätigt</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>{street}</p>
                      {(zip !== 'N/A' || city !== 'N/A') && (
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{zip} {city}</p>
                      )}
                    </div>
                  ) : (
                    <p className={styles.inputHelp}>Suche direkt auf der Karte nach deiner Lieferadresse, um sie zu bestätigen.</p>
                  )}
                  
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
                title={!fullName.trim() ? 'Bitte gib deinen Namen ein' : !street.trim() ? 'Bitte wähle eine Lieferadresse' : ''}
              >
                <Lock size={18} />
                {processing ? 'Wird verarbeitet...' : !fullName.trim() ? 'Name fehlt' : !street.trim() ? 'Adresse fehlt' : 'Demo-Bestellung absenden'}
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
