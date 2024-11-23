import React, {  useEffect, useState } from 'react';
import WaveformPlot from './components/WaveformPlot';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Sidebar from './components/sidebar/Sidebar';
import Toolbar from './components/toolbar/toolbar';
import { LineProperty } from './components/sidebar/components/settings/LineProperties';
import { exportToCSV, exportToJson } from './helpers/fileExport'; // Import helper functions
import { ExportOptions, XCursor } from './helpers/types';
import CursorConsole from './components/waveform/components/CursorConsole';



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
  const handleExport = (selectedChannels: number[], exportOptions: ExportOptions) => {
    // Extract the data for the selected channels
    const dataToExport = selectedChannels.map((channelIndex) => ({
      channelIndex,
      data: data[channelIndex],
    }));

    // Call the appropriate export function based on the selected format
    if (exportOptions.format === 'csv') {
      exportToCSV(dataToExport, samplingRate, exportOptions.includeHeaders);
    } else if (exportOptions.format === 'json') {
      exportToJson(dataToExport, samplingRate, exportOptions.includeHeaders);
    } else {
      alert('Unsupported export format.');
    }
  };

  // Cursor-related state and functions
  const [xCursors, setXCursors] = useState<XCursor[]>([]);
  const [draggingCursorId, setDraggingCursorId] = useState<number | null>(null);
  const [hoveredCursorId, setHoveredCursorId] = useState<number | null>(null);
  const [visibleProperties, setVisibleProperties] = useState<string[]>([
    'Position',
    'Ref',
    'Delta X',
    '1/Delta X',
    'C1',
    'C1 Delta Y',
    'C1 Delta Y / Delta X',
    'C2',
    'C2 Delta Y',
    'C2 Delta Y / Delta X',
  ]);
  const [consoleExpanded, setConsoleExpanded] = useState<boolean>(false);
  const toggleConsole = () => {
    setConsoleExpanded((prev) => !prev);
  };
  
  // Function to add cursors
  const addXcursor = (type: 'normal' | 'delta' = 'normal') => {
    setXCursors((prevCursors) => {
      const timeRange = 10 * timeBase;
      const xRange = [timePosition - 5 * timeBase, timePosition + 5 * timeBase];

      const nextCursorPosition =
        prevCursors.length > 0
          ? prevCursors[prevCursors.length - 1].position + timeBase
          : xRange[0] + 1;

      const newCursor: XCursor = {
        id: prevCursors.length + 1, // Assign an ID based on the number of cursors available
        position: nextCursorPosition,
        label: (prevCursors.length + 1).toString(),
        refCursorId:
          type === 'delta' && prevCursors.length > 0
            ? prevCursors[prevCursors.length - 1].id
            : null, // default to the position that was ref
      };

      return [...prevCursors, newCursor];
    });
  };

  // Function to calculate cursor properties
  const getCursorProperties = (cursor: XCursor): Record<string, any> => {
    const refCursor = xCursors.find((c) => c.id === cursor.refCursorId);
    const deltaX = refCursor ? cursor.position - refCursor.position : null;
    const inverseDeltaX = deltaX ? 1 / deltaX : null;

    // Calculate intersections and deltas for each channel
    const getCursorIntersections = (cursor: XCursor) => {
      const intersections: { channelIndex: number; value: number }[] = [];

      data.forEach((signal, index) => {
        if (!visibleSignals[index]) return; // Skip if the signal is not visible

        // Find the two data points that surround the cursor's X-position
        const idx = signal.findIndex((point) => point.time >= cursor.position);

        if (idx === -1 || idx === 0) {
          // Cursor position is out of bounds or at the start
          return;
        }

        const pointBefore = signal[idx - 1];
        const pointAfter = signal[idx];

        // Linear interpolation to estimate Y-value at cursor.position
        const slope =
          (pointAfter.value - pointBefore.value) / (pointAfter.time - pointBefore.time);

        const yValue = pointBefore.value + slope * (cursor.position - pointBefore.time);

        intersections.push({
          channelIndex: index,
          value: yValue,
        });
      });

      return intersections;
    };
    const intersections = getCursorIntersections(cursor);
    const refIntersections = refCursor ? getCursorIntersections(refCursor) : [];

    const properties: Record<string, any> = {
      Position: cursor.position.toFixed(3),
      Ref: refCursor ? refCursor.label : '',
      'Delta X': deltaX ? deltaX.toFixed(3) : '',
      '1/Delta X': inverseDeltaX ? inverseDeltaX.toFixed(3) : '',
    };

    intersections.forEach((intersection) => {
      const channelName = `C${intersection.channelIndex + 1}`;
      properties[channelName] = intersection.value.toFixed(3);

      const refIntersection = refIntersections.find(
        (refInt) => refInt.channelIndex === intersection.channelIndex
      );
      if (refIntersection) {
        const deltaY = intersection.value - refIntersection.value;
        properties[`${channelName} Delta Y`] = deltaY.toFixed(3);
        properties[`${channelName} Delta Y / Delta X`] = deltaX
          ? (deltaY / deltaX).toFixed(3)
          : '';
      } else {
        properties[`${channelName} Delta Y`] = '';
        properties[`${channelName} Delta Y / Delta X`] = '';
      }
    });

    return properties;
  };



  

  return (

   

    <div className="h-screen w-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white p-2">
          <h1 className="text-xl font-bold">Scope Waveform</h1>
          <Toolbar onThemeChange={handleThemeChange} currentTheme={theme} onExport={handleExport} />
        </div>
        {/* Waveform plot container */}
        <div className="flex-1 flex relative">
          <div className={`flex-1 p-4 ${sidebarOpen ? 'mr-60' : 'mr-0'}`}>
            <div className="h-full flex flex-col">
              <div
                style={{
                  flex: consoleExpanded ? '1 1 auto' : '1 1 auto',
                  transition: 'flex 0.3s',
                  overflow: 'hidden',
                }}
              >
                <WaveformPlot
                  currentTheme={theme}
                  data={data}
                  samplingRate={samplingRate}
                  timePosition={timePosition}
                  timeBase={timeBase}
                  channelOffsets={channelOffsets}
                  channelRanges={channelRanges}
                  sidebarOpen={sidebarOpen}
                  activeChannel={activeChannel}
                  setActiveChannel={setActiveChannel}
                  expandYAxes={expandYAxes}
                  setExpandYAxes={setExpandYAxes}
                  onOffsetChange={(channelIndex, newOffset) => {
                    const updatedOffsets = [...channelOffsets];
                    updatedOffsets[channelIndex] = newOffset;
                    setChannelOffsets(updatedOffsets);
                  }}
                  channelLineProperties={channelLineProperties}
                  visibleSignals={visibleSignals}
                  xCursors={xCursors}
                  setXCursors={setXCursors}
                  draggingCursorId={draggingCursorId}
                  setDraggingCursorId={setDraggingCursorId}
                  hoveredCursorId={hoveredCursorId}
                  setHoveredCursorId={setHoveredCursorId}
                  getCursorProperties={getCursorProperties}
                  addXcursor={addXcursor} // Pass addXcursor if needed
                />
              </div>
              {/* Console Toggle Button */}
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10 }}>
                <button
                  onClick={toggleConsole}
                  className="bg-gray-800 text-white px-2 py-1 rounded"
                  style={{ fontSize: '12px' }}
                >
                  {consoleExpanded ? 'Hide Console' : 'Show Console'}
                </button>
              </div>
              {/* Cursor Console */}
              {consoleExpanded && (
                <div style={{ flex: '0 0 auto', height: '200px', overflowY: 'auto' }}>
                  <CursorConsole
                    cursors={xCursors}
                    addCursor={addXcursor}
                    clearCursors={() => setXCursors([])}
                    setCursors={setXCursors}
                    visibleProperties={visibleProperties}
                    setVisibleProperties={setVisibleProperties}
                    getCursorProperties={getCursorProperties}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Sidebar that matches the plot's height */}
          <div className="absolute top-0 bottom-0 right-0 h-full">
            <Sidebar
              onTimePositionChange={(center) => setTimePosition(center)}
              onTimeBaseChange={(timeBase) => setTimeBase(timeBase)}
              channelOffsets={channelOffsets}
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
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
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
