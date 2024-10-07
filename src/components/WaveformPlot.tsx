// import React, { useEffect, useState } from "react";
// import Plot from "react-plotly.js";
// import { Layout } from "plotly.js";

// // data types for the props
// interface WaveformPlotProps {
//     data: number[]; // this will be our sample data for now
//     samplingRate: number;
// }

// //WaveformPlot Component
// const WaveformPlot: React.FC<WaveformPlotProps> = ({data, samplingRate}) => {
//     const [time, setTime] = useState<number[]>([]); //This will be our time axis

//     useEffect(() => {
//         // generate the time axis dynamically based on the length of the data and sample rate
//         const timeArray = data.map((_, index) => index/ samplingRate);
//         setTime(timeArray);
//     }, [data, samplingRate]);

//     return (
//         <Plot
//             data={[
//                 {
//                     x: time, // time data for x axis,
//                     y: data, // Voltage ( or sample) data for y axis
//                     type: 'scatter',
//                     mode: 'lines',
//                     line: { color: '#007bff'}, // Customize the line color

//                 },
//             ]}
//             layout={{
//                 autosize: true,
//                 title: 'Real-Time Waveform Plot',
//                 xaxis: { title: 'Time (s)'}, // x axis Label
//                 yaxis: { title: 'Voltage (V)'}, // Y axis label ( adjust based on use case)
//                 margin: { t:40, r: 20, l: 50, b: 40},

//             } as Layout}
//             useResizeHandler
//             style={{ width: '100%', height: '100%'}} // Make it responsive
//         />
//     );
// };

// export default WaveformPlot;

import React from 'react';
import Plot from 'react-plotly.js';
import { Layout } from 'plotly.js';

interface WaveformPlotProps {
  data: number[];
  samplingRate: number;
}

const WaveformPlot: React.FC<WaveformPlotProps> = ({ data, samplingRate }) => {
  const time = data.map((_, index) => index / samplingRate);

  return (
    <Plot
      data={[
        {
          x: time,
          y: data,
          type: 'scatter',
          mode: 'lines',
          line: { color: '#00ff00' },  // Green line color for dark mode
        },
      ]}
      layout={{
        autosize: true,
        title: 'Real-Time Waveform',
        xaxis: { title: 'Time (s)', showgrid: true, gridcolor: '#444' },  // Dark grid lines
        yaxis: { title: 'Voltage (V)', showgrid: true, gridcolor: '#444' },
        paper_bgcolor: '#111',  // Dark background
        plot_bgcolor: '#222',  // Dark plot area
        font: { color: '#fff' },  // White text color
        margin: { t: 40, r: 20, l: 50, b: 40 },
      } as Layout}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default WaveformPlot;
