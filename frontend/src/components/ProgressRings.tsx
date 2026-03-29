'use client';

import React from 'react';
import styles from './ProgressRings.module.css';

interface ProgressRingsProps {
  proteinPercent: number; // 0-100
  energyPercent: number;  // 0-100
  size?: number;
}

export default function ProgressRings({ proteinPercent, energyPercent, size = 160 }: ProgressRingsProps) {
  const strokeWidth = size * 0.12;
  const radius1 = (size - strokeWidth) / 2;
  const radius2 = radius1 - strokeWidth - (size * 0.02);
  const center = size / 2;
  
  const circ1 = 2 * Math.PI * radius1;
  const circ2 = 2 * Math.PI * radius2;
  
  const offset1 = circ1 - (proteinPercent / 100) * circ1;
  const offset2 = circ2 - (energyPercent / 100) * circ2;

  return (
    <div className={styles.ringContainer} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Rings */}
        <circle className={styles.bgRing} cx={center} cy={center} r={radius1} strokeWidth={strokeWidth} style={{ stroke: 'rgba(51, 199, 88, 0.15)' }} />
        <circle className={styles.bgRing} cx={center} cy={center} r={radius2} strokeWidth={strokeWidth} style={{ stroke: 'rgba(249, 115, 22, 0.15)' }} />
        
        {/* Foreground Rings */}
        <circle 
          className={styles.fgRing} 
          cx={center} cy={center} 
          r={radius1} 
          strokeWidth={strokeWidth} 
          style={{ 
            stroke: 'var(--color-primary)', 
            strokeDasharray: circ1, 
            strokeDashoffset: offset1 
          }} 
        />
        <circle 
          className={styles.fgRing} 
          cx={center} cy={center} 
          r={radius2} 
          strokeWidth={strokeWidth} 
          style={{ 
            stroke: '#f97316', 
            strokeDasharray: circ2, 
            strokeDashoffset: offset2 
          }} 
        />
      </svg>
    </div>
  );
}
