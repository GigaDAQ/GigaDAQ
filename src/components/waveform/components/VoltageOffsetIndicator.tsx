import react from 'react';


interface VoltageOffsetIndicatorProps{
    offset: number;
    yRange: number[];
    height: number;
    color: string;
}
const VoltageOffsetIndicator: React.FC<VoltageOffsetIndicatorProps> = ({ 
    offset,
    color,
    height,
    yRange,    
}) => {

    const [yMin, yMax] = yRange;
    const positionPercentage = ((offset - yMin)/ ( yMax - yMin)*100);
    return (
        <>
            <div
            className='absolute'
            style={{
                zIndex: 50,
                top: `${100 - positionPercentage}%`, // Adjust positioning based on the offset
                left: '45px', //adjust to make it flush against y-axis
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