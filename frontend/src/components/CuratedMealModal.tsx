import React from 'react';
import type { CuratedMeal } from '../services/mockApi';

interface CuratedMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: CuratedMeal | null;
}

const CuratedMealModal: React.FC<CuratedMealModalProps> = ({ isOpen, onClose, meal }) => {
  if (!isOpen || !meal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '500px',
        width: '90%',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }} onClick={e => e.stopPropagation()}>
        <img src={meal.image} alt={meal.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
        <div style={{ padding: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text)' }}>{meal.name}</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>{meal.description}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius-lg)' }}>
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Makronährstoffe</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}><span>Kalorien:</span> <strong>{meal.calories} kcal</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}><span>Kohlenhydrate:</span> <strong>{meal.carbs} g</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}><span>Protein:</span> <strong>{meal.protein} g</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}><span>Fett:</span> <strong>{meal.fat} g</strong></div>
            </div>
            {meal.micronutrients && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Mikronährstoffe</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}><span>Vitamin C:</span> <strong>{meal.micronutrients.vitaminC} mg</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}><span>Zink:</span> <strong>{meal.micronutrients.zinc} mg</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}><span>Eisen:</span> <strong>{meal.micronutrients.iron} mg</strong></div>
              </div>
            )}
          </div>
          
          <button 
            onClick={onClose}
            style={{ width: '100%', padding: '12px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default CuratedMealModal;
