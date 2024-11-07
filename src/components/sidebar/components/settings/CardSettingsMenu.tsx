import React, { useEffect, useRef } from 'react';

interface CardSettingsMenuProps {
    settingsContent: React.ReactNode;
    onClose: () => void;
    position: {top: number; right: number;};
}





const CardSettingsMenu: React.FC<CardSettingsMenuProps> = ({settingsContent, onClose, position}) =>{

    const menuRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(()=>{
        const handleClickOutside = (e: MouseEvent) =>{
            if (menuRef.current && !menuRef.current.contains(e.target as Node)){
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
    }, [onClose]);
    
    return (
        <>
            {/* <div className="absolute top-0 right-0 mt-8 mr-2 bg-gray-800 p-3 rounded shadow-lg text-white text-xs z-20"> */}
                <div 
                    ref={menuRef}
                    style={{
                        position: 'absolute',
                        top: position.top,
                        right: position.right,
                        width: '16rem',
                    }}
                    className="bg-gray-800 p-3 rounded shadow-lg text-white text-xs z-20">
                    <button onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-gray-200">
                        X {/* Close button */}
                    </button>
                    <h3 className="text-sm font-semibold mb-4">Settings</h3>
                    <div>{settingsContent}</div> {/* Dynamic settings content */}
                </div>
            {/* </div> */}
        </>
    );
};

export default CardSettingsMenu;