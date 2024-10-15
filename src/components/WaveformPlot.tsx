import React from 'react';
import Plot from 'react-plotly.js';
import { Layout } from 'plotly.js';
import AutoSizer from 'react-virtualized-auto-sizer';

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

  // Safegaurd to ensure data is not empty
  const sineWave = data[0]?.length ? data[0] : Array(1000).fill(0);
  const squareWave = data[1]?.length ? data[1] : Array(1000).fill(0);

  const totalLength = sineWave.length;
  const time = Array.from({length: totalLength}, (_, i) => (i/samplingRate) * timeBase + timePosition);

  // Determine the initial view window (e.g., only show 1000 points at a time)
  const totalDivisions = 10; // 10 divisions on the x-axis
  const halfRange = (totalDivisions / 2) * timeBase;
  const xRangeStart = timePosition - halfRange;
  const xRangeEnd = timePosition + halfRange;

  const visiblePoints = 1000;  // Number of points to display in the initial view
  const visibleStart = Math.max(0, timePosition);  // Start of the visible window
  const visibleEnd = visibleStart + visiblePoints / samplingRate * timeBase;  // End of the visible window
  

  return (
    <div className='plot bg-gray-100 dark:bg-gray-700 w-full h-full'>
    <AutoSizer>
      {({height, width}) =>(
       <Plot
       data={[
         {
           x: time,
           y: sineWave.map((val) => val * channelRanges[0] + channelOffsets[0]),
           type: 'scatter',
           mode: 'lines',
           line: { color: '#00ff00' },  // Green line color for dark mode
           name: 'Channel 1',
         },
         {
           x: time,
           y: squareWave.map((val) => val * channelRanges[1] + channelOffsets[1]),  // Apply channel 2 offset and range
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
          showgrid: true, 
          gridcolor: '#444', 
          range: [xRangeStart, xRangeEnd],
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

          title: 'Voltage',
          showgrid: true, 
          gridcolor: '#444',
          // dtick: 10,
          minor: {
            dtick: 0.1, // modify to math
            ticklen: 5,
            gridwidth: 0.25,
            gridcolor: '#111',
          }
        },
        // xaxis: {
        //   range: [-5, 5], // Range for 10 units on x-axis
        //   dtick: 1, // Major tick every unit
        //   ticklen: 10, // Length of major ticks
        //   tickwidth: 2, // Width of major ticks
        //   showgrid: true,
        //   gridwidth: 0.5, // Minor grid line width
        //   gridcolor: '#bdbdbd',
        //   zeroline: false,
        //   tick0: 0,
        //   minor: {
        //     dtick: 0.2, // Subdivision tick
        //     ticklen: 5, // Length of minor ticks
        //     gridwidth: 0.25,
        //     gridcolor: '#111',
        //   },
        // },
        // yaxis: {
        //   range: [-5, 5], // Range for 10 units on y-axis
        //   dtick: 1, // Major tick every unit
        //   ticklen: 10, // Length of major ticks
        //   tickwidth: 2, // Width of major ticks
        //   showgrid: true,
        //   gridwidth: 0.5, // Minor grid line width
        //   gridcolor: '#bdbdbd',
        //   zeroline: false,
        //   tick0: 0,
        //   minor: {
        //     dtick: 0.2, // Subdivision tick
        //     ticklen: 5, // Length of minor ticks
        //     gridwidth: 0.25,
        //     gridcolor: '#111',
        //   },
        // },
        // shapes: [ // Line shapes for longer ticks at 0.5
        //   {
        //     type: 'line',
        //     x0: -5,
        //     x1: 5,
        //     y0: 0,
        //     y1: 0,
        //     line: {
        //       width: 2,
        //       color: '#000',
        //     },
        //   },
        // ],
         paper_bgcolor: '#111',  // Dark background
         plot_bgcolor: '#222',  // Dark plot area
         font: { color: '#fff' },  // White text color
         margin: { t: 40, r: 20, l: 50, b: 40 },
       } as Layout}
       useResizeHandler
       style={{ width, height }}
     /> 
      )}
      
    </AutoSizer>
    </div>
  );
};

export default WaveformPlot;
