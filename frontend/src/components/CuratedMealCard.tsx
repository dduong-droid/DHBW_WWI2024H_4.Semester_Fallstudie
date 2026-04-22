import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CuratedMeal } from '../types/apiContracts';
import styles from './CuratedMealCard.module.css';

interface CuratedMealCardProps {
  meal: CuratedMeal;
  onClick: (meal: CuratedMeal) => void;
}

export default function CuratedMealCard({ meal, onClick }: CuratedMealCardProps) {
  return (
    <div className={styles.card} onClick={() => onClick(meal)}>
      <div className={styles.image} style={{backgroundImage: `url(${meal.imageUrl})`}} />
      <div className={styles.content}>
        <div className={styles.benefitBadge}>
          <ShieldCheck size={18} strokeWidth={2.5} />
          {meal.medicalBenefit}
        </div>
        <h3 className={styles.title}>{meal.title}</h3>
        <p className={styles.description}>{meal.description}</p>
        <div className={styles.tagsRow}>
          {meal.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
