import React from 'react';

interface CardSettingsMenuProps {
    settingsContent: React.ReactNode;
    onClose: () => void;
}


const CardSettingsMenu: React.FC<CardSettingsMenuProps> = ({settingsContent, onClose}) =>{
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded shadow-lg text-white dark:text-gray-300 w-96">
                    <button onClick={onClose} className="absolute top-2 right-2 text-white">
                    X {/* Close button */}
                    </button>
                    <h3 className="text-lg font-semibold mb-4">Settings</h3>
                    <div>{settingsContent}</div> {/* Dynamic settings content */}
                </div>
            </div>
        </>
    );
};

export default CardSettingsMenu;