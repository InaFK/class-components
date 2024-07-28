import React from 'react';
import './Flyout.css';

interface FlyoutProps {
  selectedCount: number;
}

const Flyout: React.FC<FlyoutProps> = ({ selectedCount }) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flyout">
      <p>{selectedCount} item(s) selected</p>
    </div>
  );
};

export default Flyout;
