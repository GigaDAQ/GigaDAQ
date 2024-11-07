// ChannelSettings.tsx
import React from 'react';

interface ChannelSettingsProps {
  channelIndex: number;
  onOffsetChange: (offset: number) => void;
  onRangeChange: (range: number) => void;
}

const ChannelSettings: React.FC<ChannelSettingsProps> = ({ channelIndex, onOffsetChange, onRangeChange }) => (
  <div>
    <label className="block mb-1 text-xs">Channel {channelIndex + 1} Settings</label>
    <div className="mb-1">
      <label className="text-xs">Offset (V):</label>
      <input
        type="number"
        onChange={(e) => onOffsetChange(parseFloat(e.target.value))}
        className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
      />
    </div>
    <div>
      <label className="text-xs">Range (V/Div):</label>
      <input
        type="number"
        onChange={(e) => onRangeChange(parseFloat(e.target.value))}
        className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
      />
    </div>
  </div>
);

export default ChannelSettings;
