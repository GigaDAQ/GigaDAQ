import react from 'react';

interface YAxisControlProps {
    activeChannel: number;
    setActiveChannel: (channel: number) => void;
    channelColors: string[];
    expandYAxes: boolean,
    setExpandYAxes: (expand: boolean) => void;
}

const YAxisControl: React.FC<YAxisControlProps> =({
    activeChannel,
    setActiveChannel,
    expandYAxes,
    setExpandYAxes,
    channelColors,
}) => {
    return (
        <>
            <div className='absolute z-50  top-2 left-2 flex items-center space-x-2 text-xs'>
                <div
                    className={`px-1 py-0.5 bg-gray-800 text-white rounded ${
                        expandYAxes ? '' : 'cursor-pointer'
                    }`}
                    style={{backgroundColor: channelColors[activeChannel] }}
                    onClick={() => !expandYAxes && setExpandYAxes(true)}
                >
                    {`C${activeChannel + 1} V`}

                </div>
                {expandYAxes && (
                    <>
                        {channelColors.map((color, index) => (
                            <div
                                key={index}
                                className={`px-1 py-0.5 bg-gray-800 text-white rounded cursor-pointer`}
                                style={{ backgroundColor: color }}
                                onClick={() => setActiveChannel(index)}
                            >
                                {`C${index + 1} V`}
                            </div>
                            
                        ))}
                        <button
                            className="text-white text-xs p-1 bg-gray-800 rounded ml-1"
                            onClick={() => setExpandYAxes(false)}
                        >
                            ↔
                        </button>
                    </>
                )

                }
                {/* <button
                    className='expand-button'
                    onClick={() => {
                        // Logic to expand and show multiple y-axes
                    }}
                >
                    '↔'

                </button> */}
                
            </div>
        </>
    );
}

export default YAxisControl;