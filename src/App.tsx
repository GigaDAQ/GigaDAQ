import React, {  useEffect, useState } from 'react';
import WaveformPlot from './components/WaveformPlot';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Sidebar from './components/sidebar/Sidebar';
import Toolbar from './components/toolbar/toolbar';
// import handleExport from './helpers/FileExport.ts';
import { saveAs } from 'file-saver';
import { LineProperty } from './components/sidebar/components/settings/LineProperties';


interface DataPoint{
  time: number;
  value: number;
}


const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>{
    // Get theme from localStorage or default to light
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    return storedTheme || 'light';
  });

  const { data, samplingRate } = useSelector((state: RootState) => state.acquisition);

  const [timePosition, setTimePosition] = useState<number>(0);
  const [timeBase, setTimeBase] = useState<number>(1);
  const [channelOffsets, setChannelOffsets] = useState<number[]>([0, 0]);
  const [channelRanges, setChannelRanges] = useState<number[]>([1, 1]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); 
  const [activeChannel, setActiveChannel] = useState<number>(0); // New active channel state
  const [expandYAxes, setExpandYAxes] = useState<boolean>(false)
  const [channelLineProperties, setChannelLineProperties] = useState<LineProperty[]>([ // Channels line properties default
    { color: '#00FF00', width: 2, style: 'solid' }, // Channel 1 default
    { color: '#FF0000', width: 2, style: 'solid' }, // Channel 2 default
  ]);
  const [visibleSignals, setVisibleSignals] = useState<boolean[]>([true,true]);

  const handleCheckSignal = (channelIdx: number ) => {
    setVisibleSignals( prev => prev.map((val, idx) => idx === channelIdx ? !val : val));
  };

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

  // Export function
  const handleExport = (selectedChannels: number[]) => {
    // Extract the data for the selected channels
    const dataToExport = selectedChannels.map((channelIndex) => ({
      channelIndex,
      data: data[channelIndex],
    }));

    if (!dataToExport|| data.length === 0) {
      alert('No data available to export.');
      return;
    }

    // Generate the CSV content
    const csvContent = generateCSVContent(dataToExport);

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Use FileSaver.js to save the file
    saveAs(blob, 'exported_signals.csv');

    
  };

  const generateCSVContent = (dataArrays: { channelIndex: number; data: DataPoint[] }[]) => {
    // Check if there is at least one channel to export
    if (dataArrays.length === 0) {
      return '';
    }
  
    // Assuming all channels have the same time points
    const timeArray = dataArrays[0].data.map((point) => point.time);
  
    // Start building the CSV content
    let csvContent = '';
  
    // Optional: Add metadata at the top
    csvContent += `Sampling Rate: ${samplingRate} Hz\n`;
    csvContent += `Date: ${new Date().toLocaleString()}\n\n`;
  
    // Add the header row
    csvContent += 'Time (s)';
  
    dataArrays.forEach(({ channelIndex }) => {
      csvContent += `,Channel ${channelIndex + 1} (V)`;
    });
    csvContent += '\n';
  
    // Add the data rows
    for (let i = 0; i < timeArray.length; i++) {
      let row = `${timeArray[i]}`; // Time value
  
      dataArrays.forEach(({ data }) => {
        const value = data[i]?.value ?? '';
        row += `,${value}`;
      });
  
      csvContent += row + '\n';
    }
  
    return csvContent;
  };

  

  return (

   

     <div className="h-screen w-screen flex flex-col">
      <div className="flex-1 flex flex-col"> 
        <div className=" bg-gray-300  dark:bg-gray-800 text-black dark:text-white p-2">
          <h1 className="text-xl font-bold">Scope Waveform</h1>
          <Toolbar onThemeChange={handleThemeChange} currentTheme={theme} onExport={handleExport}/>
        </div>
        {/* Waveform plot container */}
        <div className="flex-1 flex relative">
          <div className={`flex-1 p-4 ${sidebarOpen? 'mr-60': 'mr-0'}`}>
            <div className='h-full'>
              <WaveformPlot 
                currentTheme={theme}
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
                onOffsetChange={(channelIndex, newOffset) => {
                  const updatedOffsets = [...channelOffsets];
                  updatedOffsets[channelIndex] = newOffset;
                  setChannelOffsets(updatedOffsets);
                }}
                channelLineProperties={channelLineProperties}
                visibleSignals={visibleSignals}
              />
            </div>  
          </div>
          {/* Sidebar that matches the plot's height */}
          <div className="absolute top-0 bottom-0 right-0 h-full">
            <Sidebar 
              onTimePositionChange={(center) => setTimePosition(center)}
              onTimeBaseChange={(timeBase) => setTimeBase(timeBase)}
              channelOffsets= {channelOffsets}
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
              setChannelLineProperties={setChannelLineProperties}
              channelLineProperties={channelLineProperties}
              visibleSignals={visibleSignals}
              handleCheckSignal={handleCheckSignal}
            />
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default App;
