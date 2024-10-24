import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Layout } from 'plotly.js';
import AutoSizer from 'react-virtualized-auto-sizer';
import VoltageOffsetIndicator from './waveform/components/VoltageOffsetIndicator';
import YAxisControl from './waveform/components/YAxisControl';

interface DataPoint{
  time: number;
  value: number;
}

interface WaveformPlotProps {
  data: DataPoint[][];
  samplingRate: number;
  timePosition: number;
  timeBase: number;
  channelOffsets: number[];
  channelRanges: number[];
  sidebarOpen: boolean;
  activeChannel: number;
  setActiveChannel: (channel: number) => void;
  expandYAxes: boolean;
  setExpandYAxes: (expand: boolean) => void;
}

const WaveformPlot: React.FC<WaveformPlotProps> = (
  { data, 
    samplingRate,
    timePosition,
    timeBase,
    channelOffsets,
    channelRanges, 
    activeChannel,
    setActiveChannel,
    expandYAxes,
    setExpandYAxes,
  }
) => {

  // Safegaurd to ensure data is not empty
  const sineWave: DataPoint[] = data[0]?.length ? data[0] : Array(1000).fill({time: 0, value: 0});
  const squareWave: DataPoint[] = data[1]?.length ? data[1] : Array(1000).fill({time: 0, value: 0});

  const [xRange, setXRange] = useState<[number, number]>([
    timePosition - (5 * timeBase),
    timePosition + (5 * timeBase),
  ]);

  const totalLength = sineWave.length;
  // const time = Array.from({length: totalLength}, (_, i) => (i/samplingRate) * timeBase + timePosition);
  const time = Array.from({ length: totalLength }, (_, i) => (i / samplingRate) * timeBase);

  const totalDivisions = 10; 
  
  // Y-axis: Determine y-axis range based on channel 1's range and offset
  const yDivisions = 10; // 10 divisions for the y-axis, similar to x-axis
  const channel1Offset = channelOffsets[0];
  const channel1Range = channelRanges[0];
  const channel2Range = channelRanges[1];
  const channel2Offset = channelOffsets[1];

  // const yRange = [
  //   Math.min(...channelOffsets.map((offset, index) => offset - 5 * channelRanges[index])),
  //   Math.max(...channelOffsets.map((offset, index) => offset + 5 * channelRanges[index])),
  // ];

  // To do : make the plot not shift rather just the signal and signal values

  const yRange = [
    channelOffsets[activeChannel] - 5,
    channelOffsets[activeChannel] + 5
  ]

  // Adjust the signal by applying the range (scaling) and offset (shifting)
  const adjustedSineWave = sineWave.map(({value}) => (value / channel1Range) + channel1Offset);
  const adjustedSquareWave = squareWave.map(({value}) => (value / channel2Range) + channel2Offset);

    // Function to update range dynamically based on timePosition and timeBase
  const updateXRange = () => {
    const newXRangeStart = timePosition - (5 * timeBase); // 5 divisions to the left of timePosition
    const newXRangeEnd = timePosition + (5 * timeBase);   // 5 divisions to the right of timePosition
    setXRange([newXRangeStart, newXRangeEnd]);
  };

  // Change to make variable instead of hardcoded
  const channelColors = ['#00ff00', '#ff0000'];


  useEffect(() => {
    setXRange([
      timePosition - 5 * timeBase,
      timePosition + 5 * timeBase,
    ]);
  }, [timePosition, timeBase]);

  useEffect(() => {
    updateXRange();
  }, [timePosition, timeBase]);

  return (
    <div className='plot-container relative bg-gray-100 dark:bg-gray-700 w-full h-full'>
      <YAxisControl
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
        expandYAxes={expandYAxes}
        setExpandYAxes={setExpandYAxes}
        channelColors={['#00ff00', '#ff0000']}
      />
      {/*Voltage Offset Indicators*/}
      {
        channelOffsets.map((offset, index) =>(
          <VoltageOffsetIndicator
            key={index}
            offset={offset}
            color={index === 0 ? '#00ff00' : '#ff0000'}
            yRange={yRange}
            height={100} // Assuming the height is 100% of plot aread,
            onClick={() => setActiveChannel(index)}
            isActive={index === activeChannel}
          ></VoltageOffsetIndicator>
        ))
      }
    <AutoSizer>
      {({height, width}) =>(
       <Plot
       data={[
         {
           x: sineWave.map(point => point.time),
           y: adjustedSineWave,
           type: 'scatter',
           mode: 'lines',
           line: { color: '#00ff00', width: activeChannel === 0 ? 3 : 1.5 }, // Highlight active channel
           name: 'Channel 1',
         },
         {
           x: squareWave.map(point => point.time),
           y: adjustedSquareWave,
           type: 'scatter',
           mode: 'lines',
           line: { color: '#ff0000', width: activeChannel === 1 ? 3 : 1.5 }, // Highlight active channel
           name: 'Channel 2',
         }
       ]}
       layout={{
         autosize: true,
         xaxis: { 
          title: 'Time',
          range: xRange,
          showgrid: true, 
          gridcolor: '#444', 
          dtick: timeBase,
          ticklen: totalDivisions,
          tickwidth: 2,
          gridwidth: 0.5, // Minor grid line width
          zeroline: false,
          tick0: 0,
          minor: {
            dtick: 0.1 * timeBase, // Subdivision tick
            ticklen: 5, // Length of minor ticks
            ticks: 'inside',
            gridwidth: 0.25,
            gridcolor: '#111',
          },
         }, 
         yaxis: {

          title: expandYAxes ? `Voltage (Channels 1 & 2)` : `Voltage (Channel ${activeChannel + 1})`,
          range: yRange,
          showgrid: true, 
          gridcolor: channelOffsets.length > 1 ? '#888' : channelColors[activeChannel],
          dtick: channelRanges[activeChannel],
          ticklen: yDivisions,
          tickwidth: 2,
          zeroline: false,
          tickfont: {
            color: channelColors[activeChannel], // Set y-axis label color to match the active channel
          },
          minor: {
            dtick: 0.1 * channel1Range, // modify to math
            ticklen: 5,
            gridwidth: 0.25,
            gridcolor: '#111',
          }

        },
        paper_bgcolor: '#111',  // Dark background
        plot_bgcolor: '#222',  // Dark plot area
        font: { color: '#fff' },  // White text color
        margin: { t: 40, r: 20, l: 50, b: 40 },
       } as Partial<Layout>}
       useResizeHandler
       style={{ width, height }}
      
     /> 
      )}
      
    </AutoSizer>
    </div>
  );
};

export default WaveformPlot;
