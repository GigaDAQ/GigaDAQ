import React, { useState } from 'react';

const Preferences: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(14);  // Default font size is 14px

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Preferences</h2>
      
      {/* Font Size Setting */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Font Size:</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <p className="text-sm text-gray-500">Adjust the default font size of the application.</p>
    </div>
  );
};

export default Preferences;
