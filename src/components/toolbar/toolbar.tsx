import React, {  useEffect, useRef, useState } from 'react';
import AcquisitionControls from '../AcquisitionControls';
import { startAcquisition, stopAcquisition, singleAcquisition, setSamplingRate, setTrigger, updateData } from '../../features/acquisitionSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { FiSettings, FiCheck } from 'react-icons/fi';
import SettingsMenu from './settings/settingsMenu';
import ExportModal from './export/ExportModal';
import { ExportOptions } from '../../helpers/types';

interface ToolbarProps {
    onThemeChange: (theme: 'light' | 'dark') => void;
    currentTheme: 'light' | 'dark'; 
    onExport: (selectedChannels: number[], exportOptions: ExportOptions) => void;
    onToggleCursorConsole: () => void; // add this prop
    consoleExpanded: boolean
}
const Toolbar: React.FC<ToolbarProps> = ({onThemeChange, currentTheme, onExport, onToggleCursorConsole, consoleExpanded}) => {

    
  const dispatch = useDispatch<AppDispatch>();
  const [showSettings, setShowSettings] = useState<Boolean>(false);
  const { data, samplingRate, isAcquiring } = useSelector((state: RootState) => state.acquisition);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [controlMenuOpen, setControlMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false); // New state for View menu
  const [showExportModal, setShowExportModal] = useState(false);

  const fileMenuRef = useRef<HTMLDivElement>(null);
  const controlMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null); // New ref for View menu

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fileMenuOpen &&
        fileMenuRef.current &&
        !fileMenuRef.current.contains(event.target as Node)
      ) {
        setFileMenuOpen(false);
      }
      if (
        controlMenuOpen &&
        controlMenuRef.current &&
        !controlMenuRef.current.contains(event.target as Node)
      ) {
        setControlMenuOpen(false);
      }
      if (
        viewMenuOpen &&
        viewMenuRef.current &&
        !viewMenuRef.current.contains(event.target as Node)
      ) {
        setViewMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fileMenuOpen, controlMenuOpen, viewMenuOpen]);

  // Event handlers for menu items
  const handleNewScope = () => {
    // Implement new scope functionality
  };

  const handleSaveProject = () => {
    // Implement save project functionality
  };

  const handleExport = () => {
    // Open export modal or trigger export function
    // onExport(); 
    setShowExportModal(true);
    setFileMenuOpen(false);
  };
  // Function to handle the export logic
  const handleExportSignals = (selectedChannels: number[], exportOptioms: ExportOptions) => {
    onExport(selectedChannels, exportOptioms);
  };

  const handleCloseScope = () => {
    // Implement close scope functionality
  };

  const handleRun = () => {
    dispatch(startAcquisition());
  };

  const handleStop = () => {
    dispatch(stopAcquisition());
  };

  const handleRecordToFile = () => {
    // Implement recording functionality
  };

  const handleForceTrigger = () => {
    // Implement force trigger functionality
  };

  const handleSingle = () => {
    // dispatch(singleAcquisition());
  };

  const generateSineWave = (length:number, frequency: number, amplitude: number):{time: number, value: number}[] => {
    const timeStep = 1 / samplingRate; // Calculate thee time step based on sampling rate
    return Array.from({length}, (_, i) => {
      const time = (i - length/2) * timeStep; // Center around time = 0
      const value = amplitude * Math.sin(2 * Math.PI * frequency * (i/length));
      return {time, value};
    });
  }
  const generateSquareWave = (length: number, frequency: number, amplitude: number): {time: number, value: number}[] => {
    const timeStep = 1/samplingRate; // Calculate the time step based on sampling rate
    return Array.from({ length }, (_, i) => {
      const time = (i - length / 2) * timeStep;
      const value = Math.sin(2 * Math.PI * frequency * (i/length)) >= 0 ? amplitude : -amplitude;
      return { time, value };
  
    });
  };

  const sampleData = {
    0: [1.23, 2.34, 3.45, 4.56, 5.67], // Sample data for Channel 0
    1: [5.67, 4.56, 3.45, 2.34, 1.23], // Sample data for Channel 1
    // Add more channels as needed
  }

  useEffect(() => {
    if (isAcquiring) {
      const interval = setInterval(() => {
        const newSine = generateSineWave(20000, 5, 1);
        const newSquare = generateSquareWave(20000, 5, 1);
        const newData = [newSine, newSquare];
        dispatch(updateData(newData));
      }, 1000 / samplingRate);

      return () => clearInterval(interval);
    }
  }, [isAcquiring, samplingRate, dispatch]);
  return (
    <div>
        <div className="bg-gray-100 dark:bg-gray-700 py-1 px-3 flex justify-between items-center border-b-2 border-gray-600 z-10">
         {/* Top Toolbar */}
          {/* Left Section - Menus */}
          <div className="flex space-x-3">
            {/* File Menu */}
            <div className="relative">
              <button
                className="text-white text-sm hover:text-gray-300 py-1"
                onClick={() => {
                  setFileMenuOpen(!fileMenuOpen);
                  setControlMenuOpen(false); // Close Control menu when File menu is opened
                  setViewMenuOpen(false);
                }}
                
              >
                File
              </button>
              {fileMenuOpen && (
                <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg z-50">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleNewScope}
                    >
                      New Scope
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleSaveProject}
                    >
                      Save Project
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleExport}
                    >
                      Export
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleCloseScope}
                    >
                      Close Scope
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Control Menu */}
            <div className="relative">
              <button
                className="text-white text-sm hover:text-gray-300 py-1"
                onClick={() => {
                  setControlMenuOpen(!controlMenuOpen);
                  setFileMenuOpen(false); // Close Control menu when File menu is opened
                  }
                }
              >
                Control
              </button>
              {controlMenuOpen && (
                <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg z-50">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleRun}
                    >
                      Run
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleStop}
                    >
                      Stop
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleRecordToFile}
                    >
                      Record to File
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleForceTrigger}
                    >
                      Force Trigger
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={handleSingle}
                    >
                      Single
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* View Menu */}
          <div className="relative" ref={viewMenuRef}>
            <button
              className="text-white text-sm hover:text-gray-300 py-1"
              onClick={() => {
                setViewMenuOpen(!viewMenuOpen);
                setFileMenuOpen(false);
                setControlMenuOpen(false);
              }}
            >
              View
            </button>
            {viewMenuOpen && (
              <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg z-50">
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex items-center"
                    onClick={() => {
                      onToggleCursorConsole();
                      setViewMenuOpen(false);
                    }}
                  >
                    <span className='mr-2'>
                      {consoleExpanded && <FiCheck />}
                    </span>
                    Cursors
                  </li>
                  {/* Add more view options if needed */}
                </ul>
              </div>
            )}
          </div>
          </div>
  
            {/* <div className="flex space-x-3">
                <button className="text-white text-sm hover:text-gray-300">Export</button>
                <button className="text-white text-sm hover:text-gray-300">FFT</button>
                <button className="text-white text-sm hover:text-gray-300">Spectrogram</button>
                <button className="text-white text-sm hover:text-gray-300">Measurements</button>
            </div> */}

            {/* Right Section - Additional Controls */}
          <div className="flex space-x-3">
                <button className="text-white text-sm hover:text-gray-300 py-1">Recording</button>
                <button className="text-white text-sm hover:text-gray-300 py-1">Triggers</button>
                <FiSettings
                    onClick={() => setShowSettings(true)} // Open the settings menu when clicked 
                    className=" cursor-pointer text-gray-700 hover:text-gray-300 dark:text-white"
                />
          </div>
        </div>

        {/* toolbar 2: Acquisition Control is moved here */}
         <div className=" bg-gray-100 dark:bg-gray-800 py-1 px-3 flex justify-between items-center ">
              <AcquisitionControls
                onStart={() => dispatch(startAcquisition())}
                onStop={() => dispatch(stopAcquisition())}
                onSingleAcquisition={() => {
                    const sineWave = generateSineWave(1000, 5, 1);
                    const squareWave = generateSquareWave(1000, 5, 1);
                    dispatch(singleAcquisition([sineWave, squareWave]));
                }}
                onSamplingRateChange={(rate) => dispatch(setSamplingRate(rate))}
                onTriggerChange={(trigger) => dispatch(setTrigger(trigger))}
              />
        </div>
        {/* Conditionally render the Settings Menu */}
        {showSettings && (
            <SettingsMenu 
                onClose= {() => setShowSettings(false)}
                onThemeChange={onThemeChange}
                currentTheme={currentTheme}
            />
        )}

        {/* Conditionally render the ExportModal */}
        {showExportModal && (
          <ExportModal
            onClose={() => setShowExportModal(false)}
            onExport={handleExportSignals}
            availableChannels={[
              { index: 0, name: 'Channel 1' },
              { index: 1, name: 'Channel 2' },
              // Add more channels as needed
            ]}
            sampleData={sampleData}
          />
        )}
    </div>
  );
};

export default Toolbar;
