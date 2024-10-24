import React, {  useEffect, useState } from 'react';
import WaveformPlot from './components/WaveformPlot';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Sidebar from './components/sidebar/Sidebar';
import Toolbar from './components/toolbar/toolbar';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>{
    // Get theme from localStorage or default to light
    const storedTheme = localStorage.getItem('item') as 'light' | 'dark';
    return storedTheme || 'light';
  });

  const { data, samplingRate } = useSelector((state: RootState) => state.acquisition);

  const [timePosition, setTimePosition] = useState<number>(0);
  const [timeBase, setTimeBase] = useState<number>(1);
  const [channelOffsets, setChannelOffsets] = useState<number[]>([0, 0]);
  const [channelRanges, setChannelRanges] = useState<number[]>([1, 1]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); 
  const [activeChannel, setActiveChannel] = useState<number>(0); // New active channel state
  const [expandYAxes, setExpandYAxes] = useState<boolean>(false);

  useEffect(() => {
    if(theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },[theme]);

  
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persist theme change in localStorage
  };
  

  return (

   

     <div className="h-screen w-screen flex flex-col">
      <div className="flex-1 flex flex-col"> 
        <div className=" bg-gray-300  dark:bg-gray-800 text-black dark:text-white p-2">
          <h1 className="text-xl font-bold">Scope Waveform</h1>
          <Toolbar onThemeChange={handleThemeChange} currentTheme={theme}/>
        </div>
        {/* Waveform plot container */}
        <div className="flex-1 flex relative">
          <div className={`flex-1 p-4 ${sidebarOpen? 'mr-60': 'mr-16'}`}>
            <div className='h-full'>
              <WaveformPlot 
                data={data}
                samplingRate={samplingRate}
                timePosition={timePosition}
                timeBase={timeBase}
                channelOffsets= {channelOffsets}
                channelRanges={channelRanges}
                sidebarOpen={sidebarOpen}
                activeChannel={activeChannel}
                setActiveChannel={setActiveChannel}
                expandYAxes= {expandYAxes}
                setExpandYAxes={setExpandYAxes}
              />
            </div>  
          </div>
          {/* Sidebar that matches the plot's height */}
          <div className="absolute top-0 bottom-0 right-0 h-full">
            <Sidebar 
              onTimePositionChange={(center) => setTimePosition(center)}
              onTimeBaseChange={(timeBase) => setTimeBase(timeBase)}
              onOffsetChange={(channel, offset) => {
                const updatedOffsets = [...channelOffsets];
                updatedOffsets[channel] = offset;
                setChannelOffsets(updatedOffsets);
              }}
              onRangeChange={(channel, range) => {
                const updatedRanges = [...channelRanges];
                updatedRanges[channel] = range;
                setChannelRanges(updatedRanges);
              }}
              isOpen ={sidebarOpen}
              setIsOpen= {setSidebarOpen}
              activeChannel={activeChannel} // Pass activeChannel to Sidebar
              setActiveChannel={setActiveChannel} // Pass setActiveChannel to Sidebar
            />
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default App;
