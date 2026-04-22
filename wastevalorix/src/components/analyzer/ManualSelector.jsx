import React from 'react';
import WasteTypeCard from '../ui/WasteTypeCard';
import { WASTE_TYPES } from '../../constants/wasteData';

const ManualSelector = ({ selectedIds = [], onSelect }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WASTE_TYPES.map((waste) => (
          <WasteTypeCard 
             key={waste.id}
             waste={waste}
             selected={selectedIds.includes(waste.id)}
             onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ManualSelector;
