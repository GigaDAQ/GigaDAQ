import React, { useState } from 'react';
import { FiSettings } from 'react-icons/fi'; // Icon for settings

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [view, setView] = useState<string>('menu'); // Manage the current sidebar view

  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } bg-gray-800 text-white h-screen flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between">
        {view === 'menu' ? (
          <h2 className={`${isOpen ? 'block' : 'hidden'} text-lg font-bold`}>Menu</h2>
        ) : (
          <h2 className={`${isOpen ? 'block' : 'hidden'} text-lg font-bold`}>Display Settings</h2>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? '⬅️' : '➡️'}
        </button>
      </div>

      {/* Menu or Settings */}
      {view === 'menu' ? (
        <ul className="flex-grow">
          <li
            className="p-2 hover:bg-gray-700 flex items-center cursor-pointer"
            onClick={() => setView('settings')}
          >
            <FiSettings className="text-lg" />
            {isOpen && <span className="ml-4">Display Settings</span>}
          </li>
        </ul>
      ) : (
        <div className="p-4 flex-grow">
          <p className="text-sm">Customize your display options here.</p>
          <button
            onClick={() => setView('menu')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to Menu
          </button>
        </div>
      )}

      {/* Expand/Collapse Button */}
      <div className="p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-white bg-gray-700 hover:bg-gray-600 py-2 rounded"
        >
          {isOpen ? 'Collapse' : 'Expand'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
