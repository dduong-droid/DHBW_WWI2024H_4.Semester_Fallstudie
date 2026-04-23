import React from 'react';

interface CuratedMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: any;
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
    }}>
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2>{meal.name}</h2>
        <p>{meal.description}</p>
        <button onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default CuratedMealModal;
