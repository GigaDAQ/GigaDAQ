// TimeSettings.tsx
import React from 'react';

interface TimeSettingsProps {
  onTimeBaseChange: (base: number) => void;
  onTimePositionChange: (position: number) => void;
}

const TimeSettings: React.FC<TimeSettingsProps> = ({ onTimeBaseChange, onTimePositionChange }) => (
  <div>
    <label className="block mb-1 text-xs">Time Settings</label>
    <div className="mb-1">
      <label className="text-xs">Time Base:</label>
      <input
        type="number"
        onChange={(e) => onTimeBaseChange(parseFloat(e.target.value))}
        className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
      />
    </div>
    <div>
      <label className="text-xs">Time Position:</label>
      <input
        type="number"
        onChange={(e) => onTimePositionChange(parseFloat(e.target.value))}
        className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
      />
    </div>
  </div>
);

export default TimeSettings;
