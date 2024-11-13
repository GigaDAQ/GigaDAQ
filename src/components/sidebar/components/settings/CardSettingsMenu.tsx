import React, { useEffect, useRef, useState } from 'react';
import { SettingsCardIndex } from '../../Sidebar';
import LineProperties, { LineProperty } from './LineProperties';
import ChannelSettings from './ChannelSettings';

interface CardSettingsMenuProps {
    // settingsContent: React.ReactNode;
    onClose: () => void;
    position: {top: number; right: number;};
    channelIndex: Exclude<SettingsCardIndex,null>;
    channelLineProperties: LineProperty[];
    setChannelLineProperties: (properties: LineProperty[]) => void;
}





const CardSettingsMenu: React.FC<CardSettingsMenuProps> = ({ 
    onClose,
    channelIndex,
    channelLineProperties,
    setChannelLineProperties,
    position
}) =>{

    const menuRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'line'>('general');
    
    useEffect(()=>{
        const handleClickOutside = (e: MouseEvent) =>{
            if (menuRef.current && !menuRef.current.contains(e.target as Node)){
                onClose();
            }
        };

        // document.addEventListener('mousedown', handleClickOutside, true);
        return () => {
        //   document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, [onClose]);
    
    const handleLinePropertiesChange = (newProperties: LineProperty) => {
        if (typeof channelIndex === 'number') {
          const updatedProperties = [...channelLineProperties];
          updatedProperties[channelIndex] = newProperties;
          setChannelLineProperties(updatedProperties);
        }
    };

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
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-800 p-3 rounded shadow-lg text-white text-xs z-20">
                    <button onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-gray-200">
                        X {/* Close button */}
                    </button>
                    {channelIndex === 'time' ? (
                        // Render simple time settings
                        <div>
                        <h3 className="text-sm font-semibold mb-4">Settings for Time</h3>
                        {/* Add any additional time-specific settings or message here */}
                        </div>
                    ) : (
                         // Render channel settings
                        <>
                            <h3 className="text-sm font-semibold mb-4">{`Channel ${channelIndex + 1} Settings`}</h3>
                            <div className="flex mb-2">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`mr-2 px-2 py-1 rounded ${
                                activeTab === 'general' ? 'bg-gray-600' : 'bg-gray-700'
                                }`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab('line')}
                                className={`px-2 py-1 rounded ${
                                activeTab === 'line' ? 'bg-gray-600' : 'bg-gray-700'
                                }`}
                            >
                                Line Properties
                            </button>
                            </div>
                            <div>
                            {activeTab === 'general' && (
                                <ChannelSettings
                                        channelIndex={channelIndex} offset={0} range={0} onOffsetChange={function (offset: number): void {
                                            throw new Error('Function not implemented.');
                                        } } onRangeChange={function (range: number): void {
                                            throw new Error('Function not implemented.');
                                        } }                                // Pass necessary props from parent to allow channel settings in menu
                                />
                            )}
                            {activeTab === 'line' && (
                                <LineProperties
                                channelIndex={channelIndex}
                                lineProperties={channelLineProperties[channelIndex]}
                                onChange={(index, newProperties) => handleLinePropertiesChange(newProperties)}
                                />
                            )}
                            </div>
                        </>
                    )}
                </div>
        </>
    );
};

export default CardSettingsMenu;