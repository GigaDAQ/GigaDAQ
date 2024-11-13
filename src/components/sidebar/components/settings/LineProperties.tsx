import React from "react";

interface LinePropertiesProp {
    channelIndex: number;
    lineProperties: LineProperty;
    onChange: (channelIndex: number, newProperties: LineProperty) => void;

}

export interface LineProperty {
    color: string;
    width: number;
    style: 'solid' | 'dash' | 'dot';
}

const predefinedColors = [
    '#fb8072', // Red
    '#b3de69', // Green
    '#80b1d3', // Blue
    '#ffffb3',// yellow
    '#bebada', // magenta
    '#fdb462', // light orange
    '#fccde5', // light pink
    '#8dd3c7', // cyan
    // '#FFFF00', // Yellow
    // '#FF00FF', // Magenta
    // '#00FFFF', // Cyan
    // '#FFFFFF', // White
    // '#000000', // Black
]

const LineProperties: React.FC<LinePropertiesProp> = ({
    channelIndex,
    lineProperties,
    onChange

}) => {

    const handleColorChange = (color: string) => {
        onChange(channelIndex, {...lineProperties, color});
    }

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const width = parseFloat(e.target.value);
        onChange(channelIndex, { ...lineProperties, width });
    };
    
    const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const style = e.target.value as 'solid' | 'dash' | 'dot';
        onChange(channelIndex, { ...lineProperties, style });
    };

    return (
        <>
            <div>
            <h3 className="text-sm font-semibold mb-2">Line Properties</h3>
            {/* Line Color */}
            <div className="mb-4">
                <label className="block text-xs mb-1">Line Color:</label>
                <div className="flex flex-wrap">
                {predefinedColors.map((color) => (
                    <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 m-1 border-2 ${
                        lineProperties.color === color ? 'border-black' : 'border-transparent'
                    }`}
                    ></button>
                ))}
                </div>
            </div>
            {/* Line Width */}
            <div className="mb-4">
                <label className="block text-xs mb-1">Line Width:</label>
                <input
                type="range"
                min={1}
                max={10}
                value={lineProperties.width}
                onChange={handleWidthChange}
                className="w-full px-2 py-1 border rounded text-xs text-black"
                />
            </div>
            {/* Line Style */}
            <div className="mb-4">
                <label className="block text-xs mb-1">Line Style:</label>
                <select
                value={lineProperties.style}
                onChange={handleStyleChange}
                className="w-full px-2 py-1 border rounded text-xs text-black"
                >
                <option value="solid">Solid</option>
                <option value="dash">Dashed</option>
                <option value="dot">Dotted</option>
                </select>
            </div>
            </div>
        </>
    );
}

export default LineProperties;