import React, {  useEffect, useState } from 'react';
import AcquisitionControls from '../AcquisitionControls';
import { startAcquisition, stopAcquisition, singleAcquisition, setSamplingRate, setTrigger, updateData } from '../../features/acquisitionSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { FiSettings } from 'react-icons/fi';
import SettingsMenu from './settings/settingsMenu';

interface ToolbarProps {
    onThemeChange: (theme: 'light' | 'dark') => void;
    currentTheme: 'light' | 'dark'; 
}
const Toolbar: React.FC<ToolbarProps> = ({onThemeChange, currentTheme}) => {

    
  const dispatch = useDispatch<AppDispatch>();
  const [showSettings, setShowSettings] = useState<Boolean>(false);
  const { data, samplingRate, isAcquiring } = useSelector((state: RootState) => state.acquisition);
  const generateSampleData = (length: number, frequency: number, amplitude: number): number[] => {
    const data = [];
    for (let i = 0; i < length; i++) {
      data.push(amplitude * Math.sin(2 * Math.PI * frequency * (i / length)));
    }
    return data;
  };

  useEffect(() => {
    if (isAcquiring) {
      const interval = setInterval(() => {
        const newData = generateSampleData(1000, 5, 1);
        dispatch(updateData(newData));
      }, 1000 / samplingRate);

      return () => clearInterval(interval);
    }
  }, [isAcquiring, samplingRate, dispatch]);
  return (
    <div>
        <div className="bg-gray-100 dark:bg-gray-700 py-1 px-3 flex justify-between items-center border-b-2 border-gray-600">
        {/* Left Section - Application-specific options */}
        <div className="flex space-x-3">
            {/* <button className="text-white text-sm hover:text-gray-300">Settings</button> */}
            <button className="text-white text-sm hover:text-gray-300">Export</button>
            <button className="text-white text-sm hover:text-gray-300">FFT</button>
            <button className="text-white text-sm hover:text-gray-300">Spectrogram</button>
            <button className="text-white text-sm hover:text-gray-300">Measurements</button>
        </div>

        {/* Right Section - Additional Controls */}
        <div className="flex space-x-3">
            <button className="text-white text-sm hover:text-gray-300">Recording</button>
            <button className="text-white text-sm hover:text-gray-300">Triggers</button>
            <FiSettings
                onClick={() => setShowSettings(true)} // Open the settings menu when clicked 
                className=" text-sm cursor-pointer text-white hover:text-gray-300"
            />
        </div>
        </div>

        {/* toolbar 2: Acquisition Control is moved here */}
         <div className=" bg-gray-100 dark:bg-gray-800 py-1 px-3 flex justify-between items-center ">
              <AcquisitionControls
                onStart={() => dispatch(startAcquisition())}
                onStop={() => dispatch(stopAcquisition())}
                onSingleAcquisition={() => dispatch(singleAcquisition(generateSampleData(1000, 5, 1)))}
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
    </div>
  );
};

export default Toolbar;
