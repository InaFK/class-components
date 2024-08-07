import React from 'react';
import './Flyout.css';

interface FlyoutProps {
  selectedCount: number;
  onUnselectAll: () => void;
  onDownload: () => void;
}

const Flyout: React.FC<FlyoutProps> = ({
  selectedCount,
  onUnselectAll,
  onDownload,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flyout">
      <p>{selectedCount} items are selected</p>
      <button onClick={onUnselectAll}>Unselect all</button>
      <button onClick={onDownload}>Download</button>
    </div>
  );
};

export default Flyout;
