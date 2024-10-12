import React, { useState } from 'react';


interface AcquisitionControlsProps {
    onStart: () => void;
    onStop: () => void;
    onSingleAcquisition: () => void;
    onSamplingRateChange: (rate: number) => void;
    onTriggerChange: (trigger: string) => void;
}

const AcquisitionControls: React.FC<AcquisitionControlsProps> = ({
    onStart,
    onStop,
    onSingleAcquisition,
    onSamplingRateChange,
    onTriggerChange,
}) => {
    const [samplingRate, setSamplingRate] = useState<number>(1000);
    const [trigger, setTrigger] = useState<string>('manual');
    
    const handleStart = () => {
        onStart();
    };
    
    const handleStop = () => {
        onStop();
    };
    
    const handleSingleAcquisition = () => {
        onSingleAcquisition();
    };

    const handleSamplingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rate = parseInt(e.target.value, 10);
        setSamplingRate(rate);
        onSamplingRateChange(rate);
    };

    const handleTriggerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const triggerType = e.target.value;
        setTrigger(triggerType);
        onTriggerChange(triggerType);
    };

    return (
        <>
         <div className="flex items-center justify-between w-full  py-2 px-4 text-white">
      {/* Left: Acquisition Buttons */}
      <div className="flex space-x-4">
        <button className="bg-green-500 hover:bg-green-600 text-sm text-white py-1 px-3 rounded" onClick={handleStart}>
          Start
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-sm text-white py-1 px-3 rounded" onClick={handleStop}>
          Stop
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-sm text-white py-1 px-3 rounded" onClick={handleSingleAcquisition}>
          Single Acquisition
        </button>
      </div>

      {/* Right: Sampling Rate and Trigger */}
      <div className="flex space-x-3 items-center">
        <div className="flex items-center space-x-2">
          <label htmlFor="samplingRate" className="text-sm">Sampling Rate (Hz):</label>
          <input
            id="samplingRate"
            type="number"
            value={samplingRate}
            onChange={handleSamplingRateChange}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="trigger" className="text-sm">Trigger:</label>
          <select
            id="trigger"
            value={trigger}
            onChange={handleTriggerChange}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            <option value="manual">Manual</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
        </>
    );
};

export default AcquisitionControls;