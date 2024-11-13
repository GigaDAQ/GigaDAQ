import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDownload, FiZoomIn, FiZoomOut } from "react-icons/fi";
import {BiShow, BiHide} from 'react-icons/bi';


interface PlotControlBarProps{
    isLegendVisible: boolean;
    onDownload: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToogleLegend: () => void;
}

const PlotControlBar: React.FC<PlotControlBarProps> = ({
    isLegendVisible,
    onDownload,
    onZoomIn,
    onZoomOut,
    onToogleLegend,
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    return (
        // <>
        //     {isExpanded ? (
        //   <div className="absolute top-0 left-16 right-8 flex justify-between items-center space-x-2 p-1 bg-gray-900 dark:bg-gray-700 z-10 rounded-b">
        //   {/* Normal buttons on the left */}
        //   <div className="flex items-center space-x-2">
        //     <button onClick={onDownload} title="Download PNG" className="text-white p-1 rounded hover:bg-gray-700">
        //       <FiDownload size={16} />
        //     </button>
        //     <button onClick={onZoomIn} title="Zoom In" className="text-white p-1 rounded hover:bg-gray-700">
        //       <FiZoomIn size={16} />
        //     </button>
        //     <button onClick={onZoomOut} title="Zoom out" className="text-white p-1 rounded hover:bg-gray-700">
        //       <FiZoomOut size={16} />
        //     </button>
        //     <button onClick={onToogleLegend} className="text-white p-1 rounded hover:bg-gray-700">
        //       {isLegendVisible ? <BiHide size={16} /> : <BiShow size={16} />}
        //     </button>
        //   </div>
        //   {/* Collapse button in the center */}
        //   <button
        //     onClick={() => setIsExpanded(false)}
        //     title={isLegendVisible ? 'Hide Legend' : 'Show Legend'}
        //     className="text-white p-1 rounded hover:bg-gray-700"
        //   >
        //     <FaChevronUp size={16} />
        //   </button>
        // </div>

        //     ):(
        //         <div className="absolute top-0 left-30 right-10 flex  p-1 z-10">
        //             {/* Expand TopBar Button */}
        //             <button onClick={() => setIsExpanded(true)} className="text-white p-1 rounded hover:bg-gray-700">
        //                 <FaChevronDown size={16}/>
        //             </button>
        //         </div>
        //     )}
        // </>
        <>
        {isExpanded ? (
          <div className="absolute top-0 left-16 right-8 flex justify-end items-center space-x-2 p-1 bg-gray-900 dark:bg-gray-700 z-10 rounded-b">
            
                {/* Right-aligned buttons */}
                <button onClick={onDownload} title="Download PNG" className="text-white p-1 rounded hover:bg-gray-700">
                    <FiDownload size={16} />
                </button>
                <button onClick={onZoomIn} title="Zoom In" className="text-white p-1 rounded hover:bg-gray-700">
                    <FiZoomIn size={16} />
                </button>
                <button onClick={onZoomOut} title="Zoom out" className="text-white p-1 rounded hover:bg-gray-700">
                    <FiZoomOut size={16} />
                </button>
                <button onClick={onToogleLegend} className="text-white p-1 rounded hover:bg-gray-700">
                    {isLegendVisible ? <BiHide size={16} /> : <BiShow size={16} />}
                </button>

                {/* Collapse button as the last right-aligned button */}
                <button
                    onClick={() => setIsExpanded(false)}
                    title="Collapse"
                    className="text-white p-1 rounded hover:bg-gray-700"
                >
                    <FaChevronUp size={16} />
                </button>
            </div>
        ) : (
            // Only the expand button when collapsed, right-aligned in the same spot
            <div className="absolute top-0 left-16 right-8 flex justify-end p-1 z-10">
              <button onClick={() => setIsExpanded(true)} className="text-white p-1 rounded hover:bg-gray-700">
                  <FaChevronDown size={16} />
              </button>
            </div>
        )}
      </>
    );
}

export default PlotControlBar;