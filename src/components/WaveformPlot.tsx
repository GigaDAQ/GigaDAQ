import React, { useEffect, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
// import Plotly, { Layout } from 'plotly.js';
import Plotly, { Layout } from 'plotly.js-basic-dist';
import AutoSizer from 'react-virtualized-auto-sizer';
import VoltageOffsetIndicator from './waveform/components/VoltageOffsetIndicator';
import YAxisControl from './waveform/components/YAxisControl';
import PlotControlBar from './waveform/components/PlotControlBar';

// const Plot = createPlotlyComponent(Plotly);


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
  currentTheme: 'light' | 'dark';
  onOffsetChange: (channelIndex: number, newOffset: number) => void; 
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
    currentTheme,
    onOffsetChange,
  }
) => {
  const [graphDiv, setGraphDiv] = useState<HTMLElement | null>(null);
  // Safegaurd to ensure data is not empty
  const sineWave: DataPoint[] = data[0]?.length ? data[0] : Array(1000).fill({time: 0, value: 0});
  const squareWave: DataPoint[] = data[1]?.length ? data[1] : Array(1000).fill({time: 0, value: 0});

  const [xRange, setXRange] = useState<[number, number]>([
    timePosition - (5 * timeBase),
    timePosition + (5 * timeBase),
  ]);


  // const yRange = [
  //   channelOffsets[activeChannel] - 5,
  //   channelOffsets[activeChannel] + 5
  // ]

  const getYAxisRange = (channelIndex: number) => {
    const range = 5 * channelRanges[channelIndex]; // 5 divisions up and down
    const offset = channelOffsets[channelIndex];
    return [offset - range, offset + range];
  };


    // Function to update range dynamically based on timePosition and timeBase
  const updateXRange = () => {
    const newXRangeStart = timePosition - (5 * timeBase); // 5 divisions to the left of timePosition
    const newXRangeEnd = timePosition + (5 * timeBase);   // 5 divisions to the right of timePosition
    setXRange([newXRangeStart, newXRangeEnd]);
  };

  // Change to make variable instead of hardcoded
  const channelColors = ['#00ff00', '#ff0000'];

  const [isLegendVisible, setIsLegendVisible] = useState<boolean>(true);

  const handleDownload = () => {
    if (graphDiv) {
      Plotly.downloadImage(graphDiv, {format: 'png', filename: 'plot', width: 800, height: 600});
    }
    else {
      console.error('GraphDiv is not initialized yet');
    }
  }

  const handleZoomIn = () => {
    if (graphDiv) {
      Plotly.relayout(graphDiv, {
        'xaxis.range': [timePosition - 2 * timeBase, timePosition + 2 * timeBase],
      });
    }
    else {
      console.error('GraphDIv is not initialized yet');
    }
  };

  const handleZoomOut = () => {
    if (graphDiv) {
      Plotly.relayout(graphDiv, {
        'xaxis.range': [timePosition - 10 * timeBase, timePosition + 10 * timeBase],
      });
    }
    else {
      console.error('GraphDiv is not initialized yet.');
    }
  };

  const handleToggleLegend = () => {
    setIsLegendVisible((prev) => !prev);
    if (graphDiv) {
      Plotly.relayout(graphDiv, {
        showlegend: !isLegendVisible,
      });
    }
    else {
      console.error('GraphDiv is not initialized yet.');
    }
    
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

  // // index of the other channel based on active channel, must be compatible with 4 channel
  // const otherChannel = activeChannel === 0 ? 1 : 0;



  //  Prepare plot data and layout
   const plotData = [
    {
      x: sineWave.map(point => point.time),
      y: sineWave.map(point => point.value), // Use raw values
      type: 'scatter',
      mode: 'lines',
      line: { color: channelColors[0], width: activeChannel === 0 ? 3 : 1.5 },
      name: 'CH 1',
      // yaxis: expandYAxes || activeChannel === 0 ? 'y' : 'y2',
    },
    {
      x: squareWave.map(point => point.time),
      y: squareWave.map(point => point.value), // Use raw values
      type: 'scatter',
      mode: 'lines',
      line: { color: channelColors[1], width: activeChannel === 1 ? 3 : 1.5 },
      name: 'CH 2',
      // yaxis: expandYAxes || activeChannel === 1 ? 'y' : 'y2',
      yaxis: 'y2',
    }
  ];

  const plotLayout = {
    autosize: true,
    showlegend: isLegendVisible,
    legend: {
      x: 1,
      y: 1,
      xanchor: 'right',
      yanchor: 'top',
      bgcolor: 'rgba(255,255,255,0.5)',
    },
    xaxis: {
      title: 'Time',
      range: xRange,
      showgrid: true,
      gridcolor: '#444',
      dtick: timeBase,
      ticklen: 10,
      tickwidth: 2,
      gridwidth: 0.5,
      zeroline: false,
      tick0: 0,
      minor: {
        dtick: 0.1 * timeBase,
        ticklen: 5,
        ticks: 'inside',
        gridwidth: 0.25,
        gridcolor: '#111',
      },
    },
    yaxis: {
      title:  `V (CH 1)`,
      range: getYAxisRange(0),
      showgrid: true,
      gridcolor: '#444',
      dtick: channelRanges[0],
      ticklen: 10,
      tickwidth: 2,
      // zeroline: true,
      // zerolinecolor: channelColors[0],
      // tickfont: { color: activeChannel === 1 ? channelColors[1] : channelColors[0]},
      // titlefont: { color: activeChannel === 1 ? channelColors[1] : channelColors[0] },
      tickfont: { color: channelColors[0]},
      titlefont: { color: channelColors[0] },
      side: activeChannel == 0? 'left' : 'right',
    },
    yaxis2:  {
      title: 'V (CH 2)',
      range: getYAxisRange(1) ,
      showgrid: true,
      gridcolor: '#444',
      dtick: channelRanges[activeChannel?1:0],
      ticklen: 10,
      tickwidth: 2,
      zeroline: true,
      // automargin: true,
      // zerolinecolor: channelColors[1],
      tickfont: { color: activeChannel === 1 ? channelColors[0] : channelColors[1]},
      titlefont: { color: activeChannel === 1 ? channelColors[0] : channelColors[1] },
      overlaying: 'y',
      side: 'right',
      showticklabels: expandYAxes,
      // ticks: expandYAxes ? 'outside' : '', 
      // showline: expandYAxes,
      // anchor: 'x',
      // visible: expandYAxes
    },
    paper_bgcolor: currentTheme === 'dark' ? '#111' : '#fff',
    plot_bgcolor: currentTheme === 'dark' ? '#222' : '#fff',
    font: { color: currentTheme === 'dark' ? '#fff': '#000' },
    margin: { t: 40, r: expandYAxes ? 50 : 20, l: 50, b: 40 },
  };
  console.log("the 2nd axis is shown: ", expandYAxes );

  return (
    <div className='plot-container relative bg-gray-100 dark:bg-gray-700 w-full h-full'>
      <PlotControlBar
        isLegendVisible= {isLegendVisible}
        onDownload={handleDownload}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToogleLegend={handleToggleLegend}
      />
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
            yRange={getYAxisRange(index)}
            height={100} // Assuming the height is 100% of plot aread,
            onClick={() => setActiveChannel(index)}
            isActive={index === activeChannel}
            left={expandYAxes ? (index === activeChannel ? '35px' : 'calc(100% - 30px)') : '35px'}
            onOffsetChange={(newOffset) => onOffsetChange(index, newOffset)}
          ></VoltageOffsetIndicator>
        ))
      }
    <AutoSizer>
      {({height, width}) =>(
       <Plot
      //  divId='waveform-plot'
      //  ref={plotRef}
       data= 
       {plotData}
       layout= 
       {plotLayout}
       config={{
        displayModeBar: false,
       }}
       useResizeHandler
       style={{ width, height }}
       onInitialized={(figure, graphDiv) => setGraphDiv(graphDiv)}
      
     /> 
      )}
      
    </AutoSizer>
    </div>
  );
};

export default WaveformPlot;
