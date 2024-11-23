import React, { useEffect, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
// import Plotly, { Layout } from 'plotly.js';
import Plotly, { Layout, PlotlyHTMLElement } from 'plotly.js-basic-dist';
import AutoSizer from 'react-virtualized-auto-sizer';
import VoltageOffsetIndicator from './waveform/components/VoltageOffsetIndicator';
import YAxisControl from './waveform/components/YAxisControl';
import PlotControlBar from './waveform/components/PlotControlBar';
import { LineProperty } from './sidebar/components/settings/LineProperties';
import { DataPoint, XCursor } from '../helpers/types';
import { GrHadoop } from 'react-icons/gr';
// import CursorConsole from './waveform/components/CursorConsole';


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
  channelLineProperties: LineProperty[];
  visibleSignals: boolean[];
  xCursors: XCursor[];
  setXCursors: React.Dispatch<React.SetStateAction<XCursor[]>>;
  draggingCursorId: number | null;
  setDraggingCursorId: React.Dispatch<React.SetStateAction<number | null>>;
  hoveredCursorId: number | null;
  setHoveredCursorId: React.Dispatch<React.SetStateAction<number | null>>;
  getCursorProperties: (cursor: XCursor) => Record<string, any>;
  addXcursor: (type: 'normal' | 'delta') => void;
  showAllAnnotations: boolean;
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
    channelLineProperties,
    visibleSignals,
    xCursors,
    setXCursors,
    draggingCursorId,
    setDraggingCursorId,
    hoveredCursorId,
    setHoveredCursorId,
    getCursorProperties,
    addXcursor,
    showAllAnnotations,
  }
) => {
  const [graphDiv, setGraphDiv] = useState<HTMLElement | null>(null);
  // const [xCursors, setXCursors] = useState<XCursor[]>([]);
  // const [draggingCursorId, setDraggingCursorId] = useState<number | null>(null);
  // const [hoveredCursorId, setHoveredCursorId] = useState<number | null>(null);
  // Safegaurd to ensure data is not empty
  const sineWave: DataPoint[] = data[0]?.length ? data[0] : Array(1000).fill({time: 0, value: 0});
  const squareWave: DataPoint[] = data[1]?.length ? data[1] : Array(1000).fill({time: 0, value: 0});

  // // State to hold cursor label positions
  // const [cursorLabelPositions, setCursorLabelPositions] = useState<{ id: number; xPixel: number }[]>(
  //   []
  // );

  const [xRange, setXRange] = useState<[number, number]>([
    timePosition - (5 * timeBase),
    timePosition + (5 * timeBase),
  ]);


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
  const plotRef = useRef<PlotlyHTMLElement |  null>(null);

  // Change to make variable instead of hardcoded
  // const channelColors = ['#00ff00', '#ff0000'];

  // Handle mouse down on cursor label
  const handleCursorMouseDown = (cursorId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingCursorId(cursorId);
  };

  const handleCursorDragMouseMove = (e: MouseEvent) => {
    if (draggingCursorId !== null && plotDimensions) {
      const mouseX = e.clientX - plotDimensions.left;
      // const { left, width } = plotDimensions;
  
      // const mouseX = e.clientX - left;
  
      // Calculate x data coordinate
      const xAxisRange = plotLayout.xaxis.range;
      if (mouseX < 0 || mouseX > plotDimensions.width) return;
      const xData =
        ((mouseX / plotDimensions.width) * (xAxisRange[1] - xAxisRange[0])) + xAxisRange[0];
  
      // Update the position of the dragging cursor
      setXCursors((prevCursors) =>
        prevCursors.map((cursor) =>
          cursor.id === draggingCursorId ? { ...cursor, position: xData } : cursor
        )
      );
    }
  };

  const [plotDimensions, setPlotDimensions] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  console.log("the dimensions are :", plotDimensions);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!plotDimensions) return;
  
    // const { left, top, width, height } = plotDimensions;
    const mouseX = e.clientX - plotDimensions.left;
  
    // const mouseX = e.clientX - left;
    // const mouseY = e.clientY - top;
    // Ensure mouseX is within plot area
    if (mouseX < 0 || mouseX > plotDimensions.width) {
      setHoveredCursorId(null);
      return;
    }
  
    // Calculate x data coordinate
    const xAxisRange = plotLayout.xaxis.range;
    const xData =
      ((mouseX / plotDimensions.width) * (xAxisRange[1] - xAxisRange[0])) + xAxisRange[0];
  
    // You can also calculate y data coordinate if needed
  
    // Check proximity to cursors
    const proximityThreshold = (xAxisRange[1] - xAxisRange[0]) * 0.02; // Adjust as needed
    const nearbyCursor = xCursors.find((cursor) =>
      Math.abs(cursor.position - xData) < proximityThreshold
    );
  
    if (nearbyCursor) {
      setHoveredCursorId(nearbyCursor.id);
    } else {
      setHoveredCursorId(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCursorId(null);
  };

  const handlePlotClick = () => {
    setHoveredCursorId(null);
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setDraggingCursorId(null);
  };

  useEffect(() => {
    if (draggingCursorId !== null) {
      window.addEventListener('mousemove', handleCursorDragMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleCursorDragMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  
    return () => {
      window.removeEventListener('mousemove', handleCursorDragMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingCursorId]);


  // // to check plot area bounds for custom divs of cursors
  // const [plotArea, setPlotArea] = useState<{
  //   x: number;
  //   y: number;
  //   width: number;
  //   height: number;
  // } | null>(null);

  // // updating plot area dimensins 
  const updatePlotDimensions = (graphDiv: HTMLElement) => {
    // Try to get the plot area element
    const plotAreaElement = graphDiv.querySelector('.main-svg .cartesianlayer .subplot.xy') as HTMLElement;
  
    if (plotAreaElement) {
      const plotAreaRect = plotAreaElement.getBoundingClientRect();
      setPlotDimensions({
        left: plotAreaRect.left,
        top: plotAreaRect.top,
        width: plotAreaRect.width,
        height: plotAreaRect.height,
      });
    } else {
      // Fallback to the graphDiv dimensions or adjust accordingly
      const rect = graphDiv.getBoundingClientRect();
      setPlotDimensions({
        left: rect.left + 65, // Adjust '65' based on your observation
        top: rect.top,
        width: rect.width - 130, // Adjust '130' to account for both sides
        height: rect.height,
      });
    }
  };
  

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


    const showCH1 = activeChannel === 0 || expandYAxes;
    const showCH2 = activeChannel === 1 || expandYAxes;


  //  Prepare plot data and layout
   const plotData = [
    {
      x: sineWave.map(point => point.time),
      y: sineWave.map(point => point.value), // Use raw values
      type: 'scatter',
      mode: 'lines',
      line: { 
        // color: channelColors[0],
        // width: activeChannel === 0 ? 3 : 1.5 
        color: channelLineProperties[0].color,
        width: channelLineProperties[0].width,
        dash: channelLineProperties[0].style
      },
      name: 'CH 1',
      yaxis: 'y',
      visible: visibleSignals[0] ? true : 'legendonly',
    },
    {
      x: squareWave.map(point => point.time),
      y: squareWave.map(point => point.value), // Use raw values
      type: 'scatter',
      mode: 'lines',
      line: { 
        // color: channelColors[1],
        // width: activeChannel === 1 ? 3 : 1.5 
        color: channelLineProperties[1].color,
        width: channelLineProperties[1].width,
        dash: channelLineProperties[1].style
      },
      name: 'CH 2',
      yaxis: 'y2',
      visible: visibleSignals[1] ? true : 'legendonly',
    }
  ];
  useEffect(() => {
    console.log('Updated line properties:', channelLineProperties);
  }, [channelLineProperties]);

  // Function to calculate intersections
  const getCursorIntersections = (cursor: XCursor) => {
    const intersections: { channelIndex: number; value: number }[] = [];

    data.forEach((signal, index) => {
      if (!visibleSignals[index]) return; // Skip if the signal is not visible

      // Find the two data points that surround the cursor's X-position
      const idx = signal.findIndex((point) => point.time >= cursor.position);

      if (idx === -1 || idx === 0) {
        // Cursor position is out of bounds or at the start
        return;
      }

      const pointBefore = signal[idx - 1];
      const pointAfter = signal[idx];

      // Linear interpolation to estimate Y-value at cursor.position
      const slope =
        (pointAfter.value - pointBefore.value) /
        (pointAfter.time - pointBefore.time);

      const yValue =
        pointBefore.value + slope * (cursor.position - pointBefore.time);

      intersections.push({
        channelIndex: index,
        value: yValue,
      });
    });

    return intersections;
  };

  // Generate annotations for cursors
  const cursorAnnotations = xCursors.flatMap((cursor) => {
    if (!showAllAnnotations && cursor.id !== hoveredCursorId) {
      // Only display annotations for the hovered cursor
      return [];
    }
  
    const intersections = getCursorIntersections(cursor);
  
    // Detect and stagger overlapping annotations
    const staggeredAnnotations = intersections.map((intersection, index, array) => {
      // Calculate the number of overlapping annotations
      const overlaps = array.filter(
        (other) =>
          Math.abs(other.value - intersection.value) < 0.01 && // Close y-values
          other.channelIndex !== intersection.channelIndex // Different channels
      );
  
      // Stagger offset by the index in the overlap array
      const yOffset = overlaps.indexOf(intersection) * 10; // 10px offset for overlapping labels
  
      return {
        x: cursor.position,
        y: intersection.value + yOffset * 0.001, // Adjust Y by offset (scaled to match plot units)
        xref: 'x',
        yref: `y${intersection.channelIndex === 0 ? '' : intersection.channelIndex + 1}`,
        text: `C${intersection.channelIndex + 1}: ${intersection.value.toFixed(3)} V`,
        showarrow: false,
        xanchor: 'center',
        yanchor: 'bottom', // Adjust anchor to stagger vertically
        font: { color: channelLineProperties[intersection.channelIndex].color },
        bgcolor: 'rgba(255,255,255,0.8)',
      };
    });
  
    return staggeredAnnotations;
  });
  



  const plotLayout= {
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
      title:  showCH1 ? `V (CH 1)` : '',
      range: getYAxisRange(0),
      showgrid: true,
      gridcolor: '#444',
      dtick: channelRanges[0],
      ticklen: 4,
      tickwidth: 2,
      showticklabels: showCH1,
      tickfont: { color: channelLineProperties[0].color},
      titlefont: { color: channelLineProperties[0].color },
      side: activeChannel == 0? 'left' : 'right',
    },
    yaxis2:  {
      title: showCH2 ? 'V (CH 2)' : '',
      range: getYAxisRange(1) ,
      showgrid: true,
      gridcolor: '#444',
      dtick: channelRanges[activeChannel?1:0],
      ticklen: 4,
      tickwidth: 2,
      zeroline: true,
      tickfont: { color: channelLineProperties[1].color},
      titlefont: { color: channelLineProperties[1].color },
      overlaying: 'y',
      side: activeChannel == 1 ? 'left' : 'right',
      showticklabels: showCH2,
    },
    paper_bgcolor: currentTheme === 'dark' ? '#111' : '#fff',
    plot_bgcolor: currentTheme === 'dark' ? '#222' : '#fff',
    font: { color: currentTheme === 'dark' ? '#fff': '#000' },
    margin: { t: 40, r: expandYAxes ? 50 : 20, l: 50, b: 40 },
    // hovermode: 'x', // Hover mode for x-axis
    // shapes: cursorShapes,
    shapes: [
      ...xCursors.map((cursor) => ({
        type: 'line',
        x0: cursor.position,
        x1: cursor.position,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: {
          color: 'red',
          width: 1,
          dash: 'dot',
        }
      })),
    ],
    annotations: [
      // include only annotations for the hovered cursor**
      ...cursorAnnotations,
    ]
    // annotations: [
    //   ...xCursors.map((cursor) => ({
    //     x: cursor.position,
    //     y: 1,
    //     xref: 'x',
    //     yref: 'paper',
    //     text: cursor.label,
    //     showarrow: false,
    //     xanchor: 'center',
    //     yanchor: 'bottom',
    //     font: {
    //       color: 'red',
    //     },
    //     bgcolor: 'rgba(255,255,255,0.5)',
    //   }))
    // ]
  };

  return (
    <div
    className="plot-container relative bg-gray-100 dark:bg-gray-700 w-full h-full"
    style={{ position: 'relative', width: '100%', height: '100%' }}
  >
    <PlotControlBar
      isLegendVisible={isLegendVisible}
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
      channelColors={channelLineProperties.map((val) => val.color)}
    />
    {/* Voltage Offset Indicators */}
    {channelOffsets.map((offset, index) => (
      <VoltageOffsetIndicator
        key={index}
        offset={offset}
        expandYAxes={expandYAxes}
        color={channelLineProperties[index].color}
        yRange={getYAxisRange(index)}
        height={100} // Assuming the height is 100% of plot area
        onClick={() => setActiveChannel(index)}
        isActive={index === activeChannel}
        left={expandYAxes ? (index === activeChannel ? '35px' : 'calc(100% - 45px)') : '35px'}
        onOffsetChange={(newOffset) => onOffsetChange(index, newOffset)}
      ></VoltageOffsetIndicator>
    ))}
    <div
      className="plot-overlay"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlotClick}
    >
      <AutoSizer>
        {({ height, width }) => (
          <Plot
            data={plotData}
            layout={plotLayout}
            config={{
              displayModeBar: false,
            }}
            useResizeHandler
            style={{ width, height }}
            onInitialized={(figure, graphDiv) => {
              setGraphDiv(graphDiv); // Update state for topbar functions
              plotRef.current = graphDiv as PlotlyHTMLElement; // Store reference for cursor functionality
              updatePlotDimensions(graphDiv);
              // const rect = graphDiv.getBoundingClientRect();
              // const plotAreaDimensions = calculatePlotAreaDimensions(rect, figure.layout);
              // console.log("dimensions are : ", plotAreaDimensions);
              // setPlotDimensions(plotAreaDimensions);
            }}
            onUpdate={(figure, graphDiv) => {
              plotRef.current = graphDiv as PlotlyHTMLElement;
              // updatePlotAreaDimensions(graphDiv, figure.layout);
              // updatePlotDimensions(graphDiv);
            }}
          />
        )}
      </AutoSizer>
    </div>
    {/* Cursor Labels */}
    {xCursors.map((cursor) => {
      if (!plotDimensions) return null;

      const { left, width } = plotDimensions;
      const xAxisRange = plotLayout.xaxis.range;

      // Calculate pixel position
      const xRatio = (cursor.position - xAxisRange[0]) / (xAxisRange[1] - xAxisRange[0]);
      console.log("xratio, width, : ", xRatio, width);
      const xPos = 30 + left + (xRatio * (width - 45));

      return (
        <div
          key={cursor.id}
          className="cursor-label"
          style={{
            position: 'absolute',
            left: `${xPos}px`,
            bottom: 10,
            // top: `${plotDimensions.top }px`, // Position above the plot area
            transform: 'translate(-50%, 0)',
            zIndex: 10,
          }}
          onMouseDown={(e) => handleCursorMouseDown(cursor.id, e)}
          onClick={() => setHoveredCursorId(cursor.id)}
        >
          <div
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '2px',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            {cursor.label}
          </div>
        </div>
      );
    })}
    {/* Button to add cursors */}
    <button
      onClick={() => {
        addXcursor('normal');
      }}
      className="absolute bottom-1 left-1 bg-gray-800 text-white px-2 py-0 rounded "
      style={{ zIndex: 10 }}
    >
      X
    </button>
  </div>
);
};

export default WaveformPlot;
