import React from 'react';
import Plot from 'react-plotly.js';
import { Layout } from 'plotly.js';
import AutoSizer from 'react-virtualized-auto-sizer';

interface WaveformPlotProps {
  data: number[];
  samplingRate: number;
  timeCenter: number;
  channelOffsets: number[];
  channelRanges: number[];
  sidebarOpen: boolean;
}

const WaveformPlot: React.FC<WaveformPlotProps> = (
  { data, 
    samplingRate,
    timeCenter,
    channelOffsets,
    channelRanges,
    sidebarOpen, 
  }
) => {
  // const plotDivRef = useRef<HTMLDivElement>(null); // Use ref to access the plotly chart

  const time = data.map((_, index) => (index / samplingRate) - timeCenter);

  // useEffect(()=>{
  //   if( plotDivRef.current){
  //     Plotly.Plots.resize(plotDivRef.current);
  //   }
  // }, [sidebarOpen]);

  return (
    <div className='w-full h-full'>
    <AutoSizer>
      {({height, width}) =>(
       <Plot
       data={[
         {
           x: time,
           y: data.map((val) => val * channelRanges[0] + channelOffsets[0]),
           type: 'scatter',
           mode: 'lines',
           line: { color: '#00ff00' },  // Green line color for dark mode
           name: 'Channel 1',
         },
         {
           x: time,
           y: data.map((val) => val * channelRanges[1] + channelOffsets[1]),  // Apply channel 2 offset and range
           type: 'scatter',
           mode: 'lines',
           line: { color: '#ff0000' },
           name: 'Channel 2',
         }
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
       style={{ width, height }}
     /> 
      )}
      
    </AutoSizer>
    </div>
  );
};

export default WaveformPlot;
