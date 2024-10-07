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
            <div className="flex flex-col p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Data Acquisition Controls</h2>
                <div className="flex items-center justify-between mb-4">
                    <button className="bg-green-500 txt-white py-2 px-4 rounded-lg" onClick={handleStart}>
                        Start
                    </button>
                    <button className="bg-red-500 txt-white py-2 px-4 rounded-lg" onClick={handleStop}>
                        Stop
                    </button>
                    <button className="bg-yellow-500 txt-white py-2 px-4 rounded-lg" onClick={handleSingleAcquisition}>
                        Single Acquisition
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium"> Sampling Rate (Hz): </label>
                    <input
                        type="number"
                        value={samplingRate}
                        onChange={handleSamplingRateChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium">Trigger Type:</label>
                    <select value={trigger} onChange={handleTriggerChange} className='border p-2 rounded w-full'>
                        <option value="manual">Manual</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>
            </div>
        </>
    );
};

export default AcquisitionControls;