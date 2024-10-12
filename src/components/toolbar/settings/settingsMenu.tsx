import React, {useState} from "react";
import DisplaySettings from "./DisplaySettings";
import Preferences from "./Preferences";


interface SettingsMenuProps {
    onClose: () => void; // Function to close the settings menu
    onThemeChange: (theme: 'light' | 'dark') => void;
    currentTheme: 'light' | 'dark'; 
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onClose , currentTheme, onThemeChange})=> {
    const [activeTab, setActiveTab] = useState<'display' | 'preferences'>('display');
    return (
        <>
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
                <div className="absolute top-0 left-0 right-0 mx-auto mt-0 w-full md:w-3/5 bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-out translate-y-0 p-6">
                {/* Tabs */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            className={`py-2 px-4 rounded ${activeTab === 'display'? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('display')}
                        >
                            Display
                        </button>
                        <button
                            className={`py-2 px-4 rounded ${activeTab === 'preferences' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab('preferences')}
                        >
                            Preferences
                        </button>
                    </div>
                    {/* Render the correct tab */}
                    {activeTab === 'display' ? <DisplaySettings  currentTheme={currentTheme} onThemeChange={onThemeChange}/> : <Preferences />}
                    <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        OK
                    </button>
                    </div>

                </div>
            </div>
        </>
    );
}
export default SettingsMenu;