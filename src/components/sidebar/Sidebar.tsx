import React, { useState } from 'react';
import { FiSettings } from 'react-icons/fi'; // Icon for settings
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import CardSettingsMenu from './components/settings/CardSettingsMenu';
import DropdownInput from './components/DropdownInput';

interface SidebarProps{
  onTimePositionChange: (position: number) => void;
  onTimeBaseChange: (base: number) => void;
  onOffsetChange: (channel: number, offset: number) => void;
  onRangeChange: (channel: number, range: number) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeChannel: number;
  setActiveChannel: (channel: number) => void;
}

// Available time position and time bases
const timePositions = [0, 50, 20, 10, 5, 2, -2, -5, -10, -20, -50];
const timeBases = [
  { label: '1 ns/div', value: 1e-9 },
  { label: '2 ns/div', value: 2e-9 },
  { label: '5 ns/div', value: 5e-9 },
  { label: '10 ns/div', value: 1e-8 },
  { label: '10 ms/div', value: 1e-2 },
  { label: '200 ms/div', value: 2e-1 },
  { label: '500 ms/div', value: 5e-1 },
  { label: '1 s/div', value: 1 },
  { label: '2 s/div', value: 2 },
  { label: '5 s/div', value: 5 },
];

const channelColors = ['#00ff00', '#ff0000']; // for now colors are green for channel 1 and red for channel 2

const Sidebar: React.FC<SidebarProps> = ({
  onTimeBaseChange,
  onTimePositionChange,
  onOffsetChange,
  onRangeChange,
  isOpen,
  setIsOpen,
  activeChannel,
  setActiveChannel,
}) => {
  // const [isOpen, setIsOpen] = useState<boolean>(true);
  // const [view, setView] = useState<string>('menu'); // Manage the current sidebar view
  const [timePosition, setTimePosition] = useState<number>(0);
  const [timeBase, setTimeBase] = useState<number>(1);
  const [channelOffsets, setChannelOffsets] = useState<number[]>([0,0]);
  const [channelRanges, setChannelRanges] = useState<number[]>([1,1]);
  const [showSettings, setShowSettings] = useState(false); // To show/hide the settings modal
  const [activeCard, setActiveCard] = useState(''); // Track which card's settings are open

  const openSettings = (cardName: string) => {
    setActiveCard(cardName);
    setShowSettings(true);
  };

  const closeSettings = () => setShowSettings(false);


  const handleTimePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseFloat(e.target.value) || 0;
    setTimePosition(position);
    onTimePositionChange(position);
  };
  // Handle time position select (common options)
  const handleTimePositionSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPosition = parseFloat(e.target.value);
    setTimePosition(selectedPosition);
    onTimePositionChange(selectedPosition);
  };
  const handleTimeBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    
    let base = parseFloat(e.target.value) || 1;
    base = base === 0 ? 1: base;
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
    let range = parseFloat(e.target.value);
    // Prevent the range from being set to 0
    if ( range == 0) {
      range =1; // Reset it to 1 if 0 or -negative is entered
    }
    const updatedRanges = [...channelRanges];
    updatedRanges[channel] = range;
    setChannelRanges(updatedRanges);
    onRangeChange(channel, range); // Pass this to control range
  };


  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }  h-full dark:bg-gray-900 dark:text-white`}
    >
      {/* Sidebar Header */}
      <div className="p-3 flex items-center justify-between border-b border-gray-700">
        <h2 className={`${isOpen? 'block': 'hidden'} text-sm font-bold`}>
          Channel Controls
        </h2>
        <div className='absolute top-4 right-4'>
        <button onClick={() => setIsOpen(!isOpen)} className=' dark:bg-gray-300 focus:outline-none p-1'>
          {isOpen ? (
            <TbLayoutSidebarRightCollapse className=' text-white dark:text-gray-700 w-4 h-4'/>
          ): (
            <TbLayoutSidebarLeftCollapse className=' text-white dark:text-gray-700 w-4 h-4'/>
          ) }
        </button>
        </div>
      </div>

      {/* Time Axis Center Control */}
      <div className='p-2 bg-gray-200 dark:bg-gray-900'>
        {isOpen && (
          <>
          <div className="p-2 dark:bg-gray-800 border border-gray-600 showdow-sm rounded mb-1">
            <div className='flex justify-between items-center'>
              <h3 className="p-1 text-xs font-semibold mb-1">Time Position</h3>
              <FiSettings className="cursor-pointer dark:text-gray-400" onClick={() => openSettings('time')}/>
            </div>
            <DropdownInput
                value={timePosition}
                onChange={(value) => {
                  setTimePosition(value);
                  onTimePositionChange(value);
                }}
                options={timePositions}
                // label="Time Position"
              />
            <h3 className="p-1 text-xs font-semibold mb-1">Time Base</h3>
            <DropdownInput
                value={timeBase}
                onChange={(value) => {
                  setTimeBase(value);
                  onTimeBaseChange(value);
                }}
                options={timeBases}
              />
          </div>
        </>
        )}

        {/* Channel Controls */}
        {isOpen && 
          [0,1].map((channelIndex) =>(
              <div
                key={channelIndex}
                className={`p-2 dark:bg-gray-800 border border-gray-600 shadow-sm rounded mb-1 ${
                  activeChannel === channelIndex
                    ? `shadow-lg transform scale-100
                       bg-gradient-to-b from-gray-300 to-gray-200 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-800` // Highlight active channel card
                    : ''
                }`}
                onClick={() => setActiveChannel(channelIndex)}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-semibold">{`Channel ${
                    channelIndex + 1
                  }`}</h3>
                  <div className="flex items-center">
                    <span
                      className={`block w-2 h-2 rounded-full mr-2 ${
                        activeChannel === channelIndex
                          ? 'border-2 border-white' // Emphasize active channel color dot
                          : ''
                      }`}
                      style={{ backgroundColor: channelColors[channelIndex] }}
                    ></span>
                    <FiSettings
                      className="cursor-pointer dark:text-gray-400"
                      onClick={() => openSettings(`ch${channelIndex + 1}`)}
                    />
                  </div>
                </div>
                <div className="mb-1">
                  <label className="text-xs">Offset (V):</label>
                  <input
                    type="number"
                    value={channelOffsets[channelIndex]}
                    onChange={(e) => handleChannelOffsetChange(channelIndex, e)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
                  />
                </div>
                <div>
                  <label className="text-xs">Range (V/Div):</label>
                  <input
                    type="number"
                    value={channelRanges[channelIndex]}
                    onChange={(e) => handleChannelRangeChange(channelIndex, e)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
                  />
                </div>
              </div>
          ))
        }

        {/* Channel 1 Controls */}
        {/* {isOpen && (
          <>
          <div className="p-2 dark:bg-gray-800 border border-gray-600 shadow-sm rounded mb-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-semibold">Channel 1</h3>
              <div className='flex items-center'>
                <span
                  className="block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: channelColors[0] }}
                ></span>
                <FiSettings className="cursor-pointer dark:text-gray-400" onClick={() => openSettings('ch1')}/>
              </div>
             
            </div>
            <div className="mb-1">
              <label className="text-xs">Offset (V):</label>
              <input
                type="number"
                value={channelOffsets[0]}
                onChange={(e) => handleChannelOffsetChange(0, e)}
                className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
              />
            </div>
            <div>
              <label className="text-xs">Range (V/Div):</label>
              <input
                type="number"
                value={channelRanges[0]}
                onChange={(e) => handleChannelRangeChange(0, e)}
                className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
              />
            </div>
          </div>
          </>
        )} */}

        {/* Channel 2 Controls */}
        {/* {isOpen && (
          <>
            <div className="p-2 dark:bg-gray-800 border border-gray-600 rounded shadow-smmb-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-semibold">Channel 2</h3>
                <div className='flex items-center'>
                  <span
                    className="block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: channelColors[1] }}
                  ></span>
                  <FiSettings className="cursor-pointer dark:text-gray-400" onClick={() => openSettings('ch2')}/>
                </div>
                
              </div>
              <div className="mb-1">
                <label className="text-xs">Offset (V):</label>
                <input
                  type="number"
                  value={channelOffsets[1]}
                  onChange={(e) => handleChannelOffsetChange(1, e)}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
                />
              </div>
              <div>
                <label className="text-xs">Range (V/Div):</label>
                <input
                  type="number"
                  value={channelRanges[1]}
                  onChange={(e) => handleChannelRangeChange(1, e)}
                  className="bg-gray-700 text-white px-2 py-1 rounded w-full text-xs h-6"
                />
              </div>
            </div>
          </>
        )} */}

      </div>
      {showSettings &&(
        <CardSettingsMenu onClose={closeSettings} settingsContent= {
          <div>Settings for {activeCard}</div>
        }></CardSettingsMenu>
      )}
    </div>
  );
};

export default Sidebar;
