'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Truck, PackageCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './page.module.css';

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${mounted ? styles.animateIcon : ''}`}>
          <CheckCircle size={80} strokeWidth={2.5} />
        </div>
        
        <h1 className={styles.title}>Vielen Dank für deine Bestellung!</h1>
        <p className={styles.subtitle}>
          Deine Zahlung war erfolgreich. Die Bestätigung wurde per Mail gesendet.
        </p>

        <div className={styles.orderInfoList}>
          <div className={styles.orderInfoItem}>
            <div className={styles.infoIconBx}><PackageCheck size={20} /></div>
            <div>
              <p className={styles.infoLabel}>Bestellnummer</p>
              <p className={styles.infoValue}>#F4R-{Math.floor(Math.random() * 90000) + 10000}</p>
            </div>
          </div>
          <div className={styles.orderInfoItem}>
            <div className={styles.infoIconBx}><Truck size={20} /></div>
            <div>
              <p className={styles.infoLabel}>Lieferung</p>
              <p className={styles.infoValue}>Morgen, 08:00 - 10:00 Uhr</p>
            </div>
          </div>
          <div className={styles.orderInfoItem}>
            <div className={styles.infoIconBx}><ShieldCheck size={20} /></div>
            <div>
              <p className={styles.infoLabel}>Therapieplan</p>
              <p className={styles.infoValue}>Erfolgreich synchronisiert</p>
            </div>
          </div>
        </div>

        <Link href="/dashboard" className={styles.dashBtn}>
          Zurück zum Dashboard
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
