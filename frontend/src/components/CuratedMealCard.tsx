import React from 'react';
import Image from 'next/image';
import type { CuratedMeal } from '../services/mockApi';

interface CuratedMealCardProps {
  meal: CuratedMeal;
  onClick: (meal: CuratedMeal) => void;
}

const CuratedMealCard: React.FC<CuratedMealCardProps> = ({ meal, onClick }) => {
  return (
    <div 
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--surface)',
        transition: 'all 0.2s ease',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={() => onClick(meal)}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
    >
      <div style={{ position: 'relative' }}>
        <Image
          src={meal.image}
          alt={meal.name}
          width={800}
          height={400}
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            // Fallback image if Unsplash fails
            (e.target as any).src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800';
          }}
        />
        {meal.boxName && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'var(--color-primary)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Aus: {meal.boxName}
          </div>
        )}
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)' }}>{meal.name}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px', flexGrow: 1 }}>
          {meal.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>{meal.calories} kcal</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {meal.tags && meal.tags.slice(0, 2).map((tag, i) => (
              <span key={i} style={{ fontSize: '0.7rem', background: 'var(--background)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuratedMealCard;
