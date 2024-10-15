import React, { useEffect, useState } from 'react';

interface DisplaySettingsProps {
    currentTheme: 'light' | 'dark'; //pass current theme to keep track
    onThemeChange: (theme: 'light' | 'dark' ) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({ currentTheme, onThemeChange}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(currentTheme);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    onThemeChange(newTheme); // Notify parent
    localStorage.setItem('theme', newTheme); // Store in localStorage for persistence
  }
  useEffect(() => {
    onThemeChange(theme);
  }, [theme, onThemeChange]);
  
  return (
    <div className='dark:bg-gray-700'>
      <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
        {/* Theme Selection */}
        <div className="mb-4">
            <label className="block text-sm text-black dark:text-white  font-medium">Theme:</label>
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            </select>
        </div>
      {/* Add your display settings here */}
      <p>Here you can adjust the display settings...</p>
    </div>
  );
};

export default DisplaySettings;
