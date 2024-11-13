import React, { useEffect, useRef, useState } from 'react';


interface VoltageOffsetIndicatorProps{
    offset: number;
    yRange: number[];
    height: number;
    color: string;
    onClick: () => void;
    isActive: boolean;
    onOffsetChange: (newOffset: number) => void;
    left: string;
    expandYAxes: boolean
}
const VoltageOffsetIndicator: React.FC<VoltageOffsetIndicatorProps> = ({ 
    offset,
    color,
    height,
    yRange,  
    onClick,  
    isActive,
    onOffsetChange,
    left,
    expandYAxes
}) => {

    const [isDragging, setIsDragging] = useState(false);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const [yMin, yMax] = yRange;
    const [positionPercentage, setPositionPercentage] = useState(50); 


    // Recalculate positionPercentage when offset or yRange changes
  
    // Recalculate positionPercentage when offset or yRange changes
    useEffect(() => {
      const newPositionPercentage = ((5 + offset) / (10)) * 100;
      setPositionPercentage(newPositionPercentage);
    }, [offset, yRange]);
    
  
    const initialMouseYRef = useRef<number>(0);
    const initialOffsetRef = useRef<number>(0);
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        initialMouseYRef.current = e.clientY;
        initialOffsetRef.current = offset;
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && indicatorRef.current) {
          const plotRect = indicatorRef.current.parentElement?.getBoundingClientRect();
          if (plotRect) {
            const deltaY = e.clientY - initialMouseYRef.current;
            const voltsPerPixel = (yMax - yMin) / plotRect.height;
            let deltaOffset = deltaY * voltsPerPixel;
            let newOffset = initialOffsetRef.current + deltaOffset;
    
            // Limit the change to ±10 units from initialOffset
            const maxShift = 10;
            const minOffset = initialOffsetRef.current - maxShift;
            const maxOffset = initialOffsetRef.current + maxShift;
            newOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));
    
            // Clamp newOffset within yMin and yMax
            newOffset = Math.max(yMin, Math.min(yMax, newOffset));
    
            onOffsetChange(newOffset);
          }
        }
      };
        
        if (isDragging) {
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        } else {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, yMin, yMax]);

    return (
        <>
            <div
            ref={indicatorRef}
            className={`absolute cursor-pointer ${isActive ? 'border-4 border-white' : ''}`} // to indicate clickability
            onClick={onClick}
            onMouseDown={handleMouseDown}
            style={{
                zIndex: 50,
                top: `${positionPercentage}%`, // Adjust positioning based on the offset
                left: left, //adjust to make it flush against y-axis
                width: 0,
                height: 0,
                borderTop: `5px solid transparent`,
                borderBottom: `5px solid transparent`,
                borderLeft: `10px solid ${color}`,
                transform: 'translateY(-50%)',
            }}
            />
        </>
    );
}


export default VoltageOffsetIndicator;