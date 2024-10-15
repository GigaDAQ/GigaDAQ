import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi'; // Icon for dropdown

interface DropdownInputProps{
    value: number;
    onChange: (value: number) => void;
    options: number[] | { label: string, value: number }[];
    // label: string;
};
const DropdownInput: React.FC<DropdownInputProps> = ({
    value,
    onChange,
    options,
}) =>{
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseFloat(e.target.value) || 0;
        onChange(inputValue);
    };

    const handleOptionSelect = (selectedValue: number) => {
        onChange(selectedValue);
        setIsDropdownOpen(false); // Close dropdown after selecting an option
    };

    return (
        <>
            <div className="relative w-full">
                {/* <label className="text-xs font-semibold">{label}</label> */}
                <div className="flex items-center bg-gray-700 text-white px-2 py-1 rounded w-full mb-2 h-6">
                    <input
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    className="bg-transparent w-full text-xs h-full outline-none"
                
                    />
                    <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="ml-1 p-0.5 text-gray-400 flex items-center justify-center"
                    >
                    <FiChevronDown className="w-3 h-3" />
                    </button>
                </div>

                {/* Dropdown list */}
                {isDropdownOpen && (
                    <div className="absolute bg-gray-700 text-white rounded shadow-lg mt-1 w-full z-10">
                    {options.map((option) =>
                        typeof option === 'number' ? (
                        <div
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-600 text-xs"
                        >
                            {option}s
                        </div>
                        ) : (
                        <div
                            key={option.value}
                            onClick={() => handleOptionSelect(option.value)}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-600 text-xs"
                        >
                            {option.label}
                        </div>
                        )
                    )}
                    </div>
                )}
            </div>
        </>
    );
};

export default DropdownInput;