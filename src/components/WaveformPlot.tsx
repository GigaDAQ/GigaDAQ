import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Layout } from 'plotly.js';
import AutoSizer from 'react-virtualized-auto-sizer';
import VoltageOffsetIndicator from './waveform/components/VoltageOffsetIndicator';
import YAxisControl from './waveform/components/YAxisControl';

interface WaveformPlotProps {
  data: number[][];
  samplingRate: number;
  timePosition: number;
  timeBase: number;
  channelOffsets: number[];
  channelRanges: number[];
  sidebarOpen: boolean;
}

const WaveformPlot: React.FC<WaveformPlotProps> = (
  { data, 
    samplingRate,
    timePosition,
    timeBase,
    channelOffsets,
    channelRanges, 
  }
) => {

  const [activeChannel, setActiveChannel] = useState<number>(0);
  const [expandYAxes, setExpandYAxes] = useState<boolean>(false);

  // Safegaurd to ensure data is not empty
  const sineWave = data[0]?.length ? data[0] : Array(1000).fill(0);
  const squareWave = data[1]?.length ? data[1] : Array(1000).fill(0);

  const [xRange, setXRange] = useState<[number, number]>([
    timePosition - (5 * timeBase),
    timePosition + (5 * timeBase),
  ]);

  const totalLength = sineWave.length;
  // const time = Array.from({length: totalLength}, (_, i) => (i/samplingRate) * timeBase + timePosition);
  const time = Array.from({ length: totalLength }, (_, i) => (i / samplingRate) * timeBase);

  // Determine the initial view window (e.g., only show 1000 points at a time)
  const totalDivisions = 10; // 10 divisions on the x-axis

  const visiblePoints = 1000;  // Number of points to display in the initial view
  const visibleStart = Math.max(0, timePosition);  // Start of the visible window
  const visibleEnd = visibleStart + visiblePoints / samplingRate * timeBase;  // End of the visible window
  
  // Y-axis: Determine y-axis range based on channel 1's range and offset
  const yDivisions = 10; // 10 divisions for the y-axis, similar to x-axis
  const channel1Offset = channelOffsets[0];
  const channel1Range = channelRanges[0];
  const channel2Range = channelRanges[1];
  const channel2Offset = channelOffsets[1];
  const yHalfRange = (yDivisions / 2) * channel1Range; // Half range for channel 1
  // const yRangeStart = channel1Offset - yHalfRange;
  // const yRangeEnd = channel1Offset + yHalfRange;

  const yRange = [
    channelOffsets[activeChannel] - 5 * channelRanges[activeChannel],
    channelOffsets[activeChannel] + 5 * channelRanges[activeChannel],
  ];

  // Adjust the signal by applying the range (scaling) and offset (shifting)
  const adjustedSineWave = sineWave.map((val) => (val / channel1Range) + channel1Offset);
  const adjustedSquareWave = squareWave.map((val) => (val / channel2Range) + channel2Offset);

    // Function to update range dynamically based on timePosition and timeBase
  const updateXRange = () => {
    const newXRangeStart = timePosition - (5 * timeBase); // 5 divisions to the left of timePosition
    const newXRangeEnd = timePosition + (5 * timeBase);   // 5 divisions to the right of timePosition
    setXRange([newXRangeStart, newXRangeEnd]);
  };

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
            height={100} // Assuming the height is 100% of plot aread
          ></VoltageOffsetIndicator>
        ))
      }
    <AutoSizer>
      {({height, width}) =>(
       <Plot
       data={[
         {
           x: time.map(t => t/timeBase + timePosition),
           y: adjustedSineWave,
          //  y: sineWave.map((val) => val * channelRanges[0] + channelOffsets[0]),
           type: 'scatter',
           mode: 'lines',
           line: { color: '#00ff00' },  // Green line color for dark mode
           name: 'Channel 1',
         },
         {
           x: time.map(t => t/timeBase + timePosition),
           y: adjustedSquareWave,
          //  y: squareWave.map((val) => val * channelRanges[1] + channelOffsets[1]),  // Apply channel 2 offset and range
           type: 'scatter',
           mode: 'lines',
           line: { color: '#ff0000' },
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
          // [
          //   channelOffsets[0] - (5 * channelRanges[0]),
          //   channelOffsets[0] + (5 * channelRanges[0]),
          // ], // Centered around the channel offset
          // range: [yRangeStart, yRangeEnd],
          showgrid: true, 
          gridcolor: '#444',
          dtick: channelRanges[activeChannel],
          ticklen: yDivisions,
          tickwidth: 2,
          zeroline: false,

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
      //  onUpdate={(figure)=> {
      //   // Update the xRange only when the user pans/zooms manually
      //   const [newStart, newEnd] = figure.layout.xaxis.range;
      //   setXRange([newStart, newEnd]);
      //  }}
     /> 
      )}
      
    </AutoSizer>
    </div>
  );
};

export default WaveformPlot;
