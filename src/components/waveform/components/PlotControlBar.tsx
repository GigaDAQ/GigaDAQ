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
        <>
            {isExpanded ? (
                <div className="absolute top-0 left-16 right-8 flex justify-left items-center space-x-2 p-1 bg-gray-900 dark:bg-gray-700 z-10 rounded-b">
                    {/* DOwnload Button */}
                    <button onClick={onDownload} title="Download PNG" className=" text-white p-1 rounded hover:bg-gray-700">
                        <FiDownload size={16}/>
                        {/* <span>Download PNG</span> */}
                    </button>
                    {/* <button onClick={onZoomOut} className="flex items-center space-x-1 text-sm">
                        <FiZoomIn />
                        <span>Zoom In</span>
                    </button> */}
                    <button onClick={onZoomOut} title="Zoom In" className="text-white p-1 rounded hover:bg-gray-700">
                        <FiZoomIn size={16} />
                    </button>
                    <button onClick={onZoomOut} title="Zoom out" className="text-white p-1 rounded hover:bg-gray-700">
                        <FiZoomOut size={16}/>
                    </button>
                    <button onClick={onToogleLegend} className="text-white p-1 rounded hover:bg-gray-700">
                        { isLegendVisible ? <BiHide size={16}/> : <BiShow size={16}/>}

                    </button>
                    {/* Collapse TopBar Button */}
                    <button 
                        onClick={() => setIsExpanded(false)}
                        title={isLegendVisible ? 'Hide Legend' : 'Show Legend'}
                        className="text-white p-1 rounded hover:bg-gray-700"
                    >
                        <FaChevronUp size={16}/>
                    </button>
                </div>
            ):(
                <div className="absolute top-0 left-0 right-0 flex justify-center p-1 z-10">
                    {/* Expand TopBar Button */}
                    <button onClick={() => setIsExpanded(true)} className="text-white p-1 rounded hover:bg-gray-700">
                        <FaChevronDown size={16}/>
                    </button>
                </div>
            )}
        </>
    );
}

export default PlotControlBar;