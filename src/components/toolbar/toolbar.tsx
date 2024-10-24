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
    </div>
  );
};

export default Toolbar;
