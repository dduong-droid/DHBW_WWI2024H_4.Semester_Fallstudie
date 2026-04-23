import React from 'react';

interface CuratedMealCardProps {
  meal: any;
  onClick: (meal: any) => void;
}

const CuratedMealCard: React.FC<CuratedMealCardProps> = ({ meal, onClick }) => {
  return (
    <div 
      style={{
        border: '1px solid #eee',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'white',
        transition: 'transform 0.2s'
      }}
      onClick={() => onClick(meal)}
    >
      <img src={meal.image} alt={meal.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>{meal.name}</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>{meal.description}</p>
      </div>
    </div>
  );
};

export default CuratedMealCard;
