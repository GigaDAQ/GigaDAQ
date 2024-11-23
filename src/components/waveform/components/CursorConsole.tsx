import React, { useState } from 'react';
import { XCursor } from '../../../helpers/types';

interface CursorConsoleProps {
  cursors: XCursor[];
  addCursor: (type: 'normal' | 'delta') => void;
  clearCursors: () => void;
  setCursors: React.Dispatch<React.SetStateAction<XCursor[]>>;
  visibleProperties: string[];
  setVisibleProperties: React.Dispatch<React.SetStateAction<string[]>>;
  getCursorProperties: (cursor: XCursor) => Record<string, any>;
  showAllAnnotations: boolean;
  setShowAllAnnotations:React.Dispatch<React.SetStateAction<boolean>>;
}

const CursorConsole: React.FC<CursorConsoleProps> = ({
  cursors,
  addCursor,
  clearCursors,
  setCursors,
  visibleProperties,
  setVisibleProperties,
  getCursorProperties,
  showAllAnnotations,
  setShowAllAnnotations,
}) => {
    const [showDropdown,setShowDropdown] = useState<boolean>(false);
  const allProperties = [
    'Position',
    'Ref',
    'Delta X',
    '1/Delta X',
    'C1',
    'C1 Delta Y',
    'C1 Delta Y / Delta X',
    'C2',
    'C2 Delta Y',
    'C2 Delta Y / Delta X',
  ];

  const togglePropertyVisibility = (property: string) => {
    if (visibleProperties.includes(property)) {
      setVisibleProperties(visibleProperties.filter((prop) => prop !== property));
    } else {
      setVisibleProperties([...visibleProperties, property]);
    }
  };

  return (
    <div className="cursor-console" style={{zIndex: 50}}>
      {/* Top Bar */}
      <div className="console-topbar flex items-center space-x-2 p-2 bg-gray-200 dark:bg-gray-700">
        <button onClick={() => addCursor('normal')} className='bg-green-500 text-white px-2 py-1 rounded text-xs'>Normal</button>
        <button onClick={() => addCursor('delta')} className='bg-green-500 text-white px-2 py-1 rounded text-xs'>Delta</button>
        <button onClick={clearCursors}  className="bg-red-500 text-white px-2 py-1 rounded text-xs" >Clear</button>
        <button
          onClick={() => setShowAllAnnotations(!showAllAnnotations)}
          className={`${
            showAllAnnotations ? 'bg-gray-800': 'bg-gray-500'
          } text-white px-2 py-1 rounded text-xs hover:bg-gray-700`}
        >
          {showAllAnnotations ? 'Hide' : 'Show All'}
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowDropdown((prev) => !prev)}
            className="bg-gray-800 text-white px-2 py-1 rounded text-xs">Show</button>
          {showDropdown && (
            <div className="absolute top-full left-0 bg-white border mt-1 text-xs">
                {allProperties.map((prop) => (
                <label key={prop} className="flex items-center px-2 py-1">
                    <input
                    type="checkbox"
                    checked={visibleProperties.includes(prop)}
                    onChange={() => togglePropertyVisibility(prop)}
                    className="mr-2"
                    />
                    {prop}
                </label>
                ))}
            </div>
            )}
        </div>
      </div>

      {/* Cursor Properties Table */}
      <table className="cursor-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th className='border px-1 py-1 '>Cursor</th>
            {visibleProperties.map((prop) => (
              <th className='text-sm' key={prop} style={{ border: '1px solid #ccc', padding: '5px' }}>
                {prop}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cursors.map((cursor) => {
            const properties = getCursorProperties(cursor);
            return (
              <tr key={cursor.id}>
                <td className='border px-1 py-1 text-center'>{cursor.label}</td>
                {visibleProperties.map((prop) => (
                  <td className='text-sm' key={prop} style={{ border: '1px solid #ccc', padding: '5px', }}>
                    {properties[prop]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CursorConsole;
