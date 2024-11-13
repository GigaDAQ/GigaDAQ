// ChannelSettings.tsx
import React from 'react';

interface ChannelSettingsProps {
  channelIndex: number;
  offset: number;
  range: number;
  onOffsetChange: (offset: number) => void;
  onRangeChange: (range: number) => void;
}

const ChannelSettings: React.FC<ChannelSettingsProps> = ({
  channelIndex,
  offset,
  range,
  onOffsetChange,
  onRangeChange,
}) => (
  <div>
    <div className="mb-4">
      <label className="block text-xs mb-1">Offset (V):</label>
      <input
        type="number"
        value={offset}
        onChange={(e) => onOffsetChange(parseFloat(e.target.value))}
        className="w-full px-2 py-1 border rounded text-xs"
      />
    </div>
    <div className="mb-4">
      <label className="block text-xs mb-1">Range (V/Div):</label>
      <input
        type="number"
        value={range}
        onChange={(e) => onRangeChange(parseFloat(e.target.value))}
        className="w-full px-2 py-1 border rounded text-xs"
      />
    </div>
  </div>
);

export default ChannelSettings;
