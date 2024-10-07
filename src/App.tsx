import React, { useEffect } from 'react';
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';
import WaveformPlot from './components/WaveformPlot';
import AcquisitionControls from './components/AcquisitionControls';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import {
  startAcquisition,
  stopAcquisition,
  singleAcquisition,
  setSamplingRate,
  setTrigger,
  updateData,
} from './features/acquisitionSlice';
import Sidebar from './components/sidebar/Sidebar';

const App: React.FC = () => {
  const { data, samplingRate, isAcquiring } = useSelector((state: RootState) => state.acquisition);
  const dispatch = useDispatch<AppDispatch>();

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
//     <>
//   <div className='grid grid-cols-2 gap-4'>
//     <div className='bg-blue-200 p-4'>01</div>
//     <div className='bg-green-200 p-4'>02</div>
//     <div className='bg-red-200 p-4'>03</div>
//     <div className='bg-yellow-200 p-4'>04</div>
//   </div>
// </>

   
    <div className="h-screen flex">
      <Sidebar />
      <div className=" center-container flex-column"> 
        <h1 className="text-2xl font-bold mb-4">Real-Time Waveform</h1>

        <TabGroup>
          <TabList className="flex space-x-4 mb-4">
            <Tab as="button" className={({ selected }) => selected ? 'bg-blue-500 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
              Data Acquisition
            </Tab>
            <Tab as="button" className={({ selected }) => selected ? 'bg-blue-500 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
              Settings
            </Tab>
            <Tab as="button" className={({ selected }) => selected ? 'bg-blue-500 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
              Analytics
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="border rounded-lg h-96 full-width-container">
                <WaveformPlot data={data} samplingRate={samplingRate} />
              </div>
              <AcquisitionControls 
                onStart={() => dispatch(startAcquisition())}
                onStop={() => dispatch(stopAcquisition())}
                onSingleAcquisition={() => dispatch(singleAcquisition(generateSampleData(1000, 5, 1)))}
                onSamplingRateChange={(rate) => dispatch(setSamplingRate(rate))}
                onTriggerChange={(trigger) => dispatch(setTrigger(trigger))}
              />
            </TabPanel>

            <TabPanel>
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
            </TabPanel>

            <TabPanel>
              <h2 className="text-lg font-semibold mb-4">Analytics</h2>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default App;
