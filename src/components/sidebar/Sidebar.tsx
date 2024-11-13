import React, { useEffect, useRef, useState } from 'react';
import { FiSettings } from 'react-icons/fi'; // Icon for settings
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import CardSettingsMenu from './components/settings/CardSettingsMenu';
import DropdownInput from './components/DropdownInput';
import LineProperties, { LineProperty } from './components/settings/LineProperties';

interface SidebarProps{
  onTimePositionChange: (position: number) => void;
  onTimeBaseChange: (base: number) => void;
  channelOffsets: number[];
  onOffsetChange: (channel: number, offset: number) => void;
  onRangeChange: (channel: number, range: number) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeChannel: number;
  setActiveChannel: (channel: number) => void;
  channelLineProperties: LineProperty[];
  setChannelLineProperties: (properties: LineProperty[]) => void;
  visibleSignals: boolean[];
  handleCheckSignal: (channelIdx: number) => void;
}

export type SettingsCardIndex = number | 'time' | null;

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
  channelOffsets,
  channelLineProperties,
  setChannelLineProperties,
  visibleSignals,
  handleCheckSignal,
}) => {
  // const [isOpen, setIsOpen] = useState<boolean>(true);
  // const [view, setView] = useState<string>('menu'); // Manage the current sidebar view
  const [timePosition, setTimePosition] = useState<number>(0);
  const [timeBase, setTimeBase] = useState<number>(1);
  // const [channelOffsets, setChannelOffsets] = useState<number[]>([0,0]);
  const [channelRanges, setChannelRanges] = useState<number[]>([1,1]);
  const [showSettings, setShowSettings] = useState(false); // To show/hide the settings modal
  const [activeCard, setActiveCard] = useState<string | null>(null); // Track which card's settings are open
  const [settingsChannelIndex, setSettingsChannelIndex] = useState<SettingsCardIndex>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number; } | null>(null);
  // const [visibleSignals, setVisibleSignals] = useState<boolean[]>([true, true]);

  const cogIconRef = useRef<HTMLDivElement | null>(null);

  const handleLinePropertiesChange = (channelIndex: number, newProperties: LineProperty) => {
    const updatedProperties = [...channelLineProperties];
    updatedProperties[channelIndex] = newProperties;
    setChannelLineProperties(updatedProperties);
  };

  

  const openSettings = (channelIndex: 'time' | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const cogIcon = (e.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ top: cogIcon.bottom, right: window.innerWidth - cogIcon.right });
    // setActiveCard(cardName);
    setSettingsChannelIndex(channelIndex);
    setShowSettings((prev) => !prev);
  }

  const closeSettings = () => {
    setSettingsChannelIndex(null);
    setShowSettings(false);
  }

  // const handleCheckSignal = (channelIdx: number, e: React.ChangeEvent<HTMLInputElement> ) => {
  //   setVisibleSignals( prev => prev.map((val, idx) => idx === channelIdx ? !val : val));
  // };
  // // Log the latest state after it updates
  // useEffect(() => {
  //   console.log("Updated visibleSignals:", visibleSignals);
  // }, [visibleSignals]);

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
    // setChannelOffsets(updatedOffsets);
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

  const [contextMenu, setContextMenu] = useState({
    position:{
      x: 0,
      y: 0,
    },
    toggled: false,
  })

  console.log('active card is:', activeCard);

  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0'
      }  h-full dark:bg-gray-900 dark:text-white`}
    >
      {/* Sidebar Header */}
      <div className="p-3 flex items-center justify-between border-b border-gray-700">
        <h2 className={`${isOpen? 'block': 'hidden'} text-sm font-bold`}>
          Channel Controls
        </h2>
        <div className={`absolute top-4 right-4`}>
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
              <FiSettings 
                className="cursor-pointer dark:text-gray-400" 
                onClick={(e) => openSettings('time', e)}
              />
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
                  <div className="flex space-x-2">
                    <input
                      type='checkbox'
                      checked={visibleSignals[channelIndex]}
                      onChange={(e) => {handleCheckSignal(channelIndex)}}
                    />
                    <h3 className="text-xs font-semibold">{`Channel ${
                      channelIndex + 1
                    }`}</h3>
                  </div>
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
                      onClick={(e) => openSettings(channelIndex, e)}
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

      </div>
      {/* replace with COntext Menu instead of this solution */}
      {showSettings && menuPosition && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-0 z-10" onClick={closeSettings}>
          <CardSettingsMenu 
            onClose={closeSettings}
            channelIndex= {settingsChannelIndex as Exclude<SettingsCardIndex,null>}
            channelLineProperties={channelLineProperties}
            setChannelLineProperties={setChannelLineProperties}
            position={menuPosition}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
