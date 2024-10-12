import React, { useState } from 'react';
// import { FiSettings } from 'react-icons/fi'; // Icon for settings

interface SidebarProps{
  onTimePositionChange: (position: number) => void;
  onTimeBaseChange: (base: number) => void;
  onOffsetChange: (channel: number, offset: number) => void;
  onRangeChange: (channel: number, range: number) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onTimeBaseChange,
  onTimePositionChange,
  onOffsetChange,
  onRangeChange,
  isOpen,
  setIsOpen,
}) => {
  // const [isOpen, setIsOpen] = useState<boolean>(true);
  // const [view, setView] = useState<string>('menu'); // Manage the current sidebar view
  const [timePosition, setTimePosition] = useState<number>(0);
  const [timeBase, setTimeBase] = useState<number>(1);
  const [channelOffsets, setChannelOffsets] = useState<number[]>([0,0]);
  const [channelRanges, setChannelRanges] = useState<number[]>([1,1]);

  const handleTimePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseFloat(e.target.value);
    setTimePosition(position);
    onTimePositionChange(position);
  }
  const handleTimeBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const base = parseFloat(e.target.value);
    setTimeBase(base);
    onTimeBaseChange(base);
  };

  const handleChannelOffsetChange = (channel: number, e: React.ChangeEvent<HTMLInputElement>) =>{
    const offset = parseFloat(e.target.value);
    const updatedOffsets = [...channelOffsets];
    updatedOffsets[channel] = offset;
    setChannelOffsets(updatedOffsets);
    onOffsetChange(channel, offset);
  }
  const handleChannelRangeChange = (channel: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const range = parseFloat(e.target.value);
    const updatedRanges = [...channelRanges];
    updatedRanges[channel] = range;
    setChannelRanges(updatedRanges);
    onRangeChange(channel, range); // Pass this to control range
  };


  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }  h-full `}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between">
        <h2 className={`${isOpen? 'block': 'hidden'} text-lg font-bold`}>Channel Controls</h2>
        <button onClick={() => setIsOpen(!isOpen)} className=' focus:outline-none'>
          {isOpen ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* Time Axis Center Control */}
      {isOpen && (
        <>
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-2">Time Position Center</h3>
          <input
            type="number"
            value={timePosition}
            onChange={handleTimePositionChange}
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
          />
        </div>
        <div className="p-4">
        <h3 className="text-sm font-semibold mb-2">Time Base Center</h3>
        <input
          type="number"
          value={timeBase}
          onChange={handleTimeBaseChange}
          className="bg-gray-700 text-white px-2 py-1 rounded w-full"
        />
      </div>
      </>
      )}

      {/* Channel 1 Controls */}
      {isOpen && (
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-2">Channel 1</h3>
          <div className="mb-2">
            <label className="text-xs">Offset (V):</label>
            <input
              type="number"
              value={channelOffsets[0]}
              onChange={(e) => handleChannelOffsetChange(0, e)}
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          </div>
          <div>
            <label className="text-xs">Range (V/Div):</label>
            <input
              type="number"
              value={channelRanges[0]}
              onChange={(e) => handleChannelRangeChange(0, e)}
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          </div>
        </div>
      )}

      {/* Channel 2 Controls */}
      {isOpen && (
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-2">Channel 2</h3>
          <div className="mb-2">
            <label className="text-xs">Offset (V):</label>
            <input
              type="number"
              value={channelOffsets[1]}
              onChange={(e) => handleChannelOffsetChange(1, e)}
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          </div>
          <div>
            <label className="text-xs">Range (V/Div):</label>
            <input
              type="number"
              value={channelRanges[1]}
              onChange={(e) => handleChannelRangeChange(1, e)}
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
            />
          </div>
        </div>
      )}
    </div>

    //   {/* Expand/Collapse Button */}
    //   <div className="p-2">
    //     <button
    //       onClick={() => setIsOpen(!isOpen)}
    //       className="w-full text-white bg-gray-700 hover:bg-gray-600 py-2 rounded"
    //     >
    //       {isOpen ? 'Collapse' : 'Expand'}
    //     </button>
    //   </div>
    // </div>
  );
};

export default Sidebar;
