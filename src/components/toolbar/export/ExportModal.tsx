import { useEffect, useRef, useState } from "react";
import { ExportOptions } from "../../../helpers/types";

interface ExportModalProps {
    onClose: () => void;
    availableChannels: {index: number; name: string}[];
    onExport: (selectedChannels: number[], exportOptions: ExportOptions) => void;
}

// interface ExportOptions {
//     format: 'csv' | 'mat';
//     includeHeaders: boolean;
// }

const ExportModal: React.FC<ExportModalProps> = (
    {
        onClose,
        availableChannels,
        onExport,
    }
) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [selectedChannels, setSelectedChannels] = useState<number[]>(
        availableChannels.map((channel) => channel.index)
    );
    const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
    const [includeHeaders, setIncludeHeaders] = useState<boolean>(true);

    const toggleChannel = (index: number) => {
        setSelectedChannels( (prev) => 
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    }
    const selectAll = () => {
        setSelectedChannels(availableChannels.map((channel) => channel.index));
    };
    
    const deselectAll = () => {
        setSelectedChannels([]);
    };
    
    const handleExport = () => {
        const exportOptions: ExportOptions = {
            format: exportFormat,
            includeHeaders: includeHeaders,
        }
        onExport(selectedChannels, exportOptions);
        onClose();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (headerRef.current && headerRef.current.contains(e.target as Node)) {
          setIsDragging(true);
          setOffset({
            x: e.clientX - (modalRef.current?.getBoundingClientRect().left ?? 0),
            y: e.clientY - (modalRef.current?.getBoundingClientRect().top ?? 0),
          });
        }
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
      };
    
    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && modalRef.current) {
          modalRef.current.style.left = `${e.clientX - offset.x}px`;
          modalRef.current.style.top = `${e.clientY - offset.y}px`;
        }
    };
    
    useEffect(() => {
        if (isDragging) {
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        } else {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        }
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset]);

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-10" onMouseDown={handleMouseDown}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

                {/* Modal */}
                <div ref={modalRef} className="relative bg-white dark:bg-gray-800 p-4 w-96 rounded shadow-lg" style={{position: 'absolute'}}>
                    {/* Draggable Header */}
                    <div ref={headerRef} className="cursor-move p-2 bg-gray-200 dark:bg-gray-700 rounded-t">
                    <h2 className="text-lg font-bold">Export Signals</h2>
                    </div>

                    {/* Content */}
                    <div className="p-2">
                    <p>Select the signals you want to export:</p>
                    <div className="mt-2">
                        {availableChannels.map((channel) => (
                        <div key={channel.index} className="flex items-center">
                            <input
                            type="checkbox"
                            checked={selectedChannels.includes(channel.index)}
                            onChange={() => toggleChannel(channel.index)}
                            />
                            <label className="ml-2">{channel.name}</label>
                        </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        <button onClick={selectAll} className="text-blue-500 hover:underline">
                        Select All
                        </button>
                        <button onClick={deselectAll} className="text-blue-500 hover:underline">
                        Deselect All
                        </button>
                    </div>
                         {/* Export Options */}
                    <div className="mt-4">
                        <h3 className="text-sm font-semibold mb-2">Export Format</h3>
                        <div className="flex items-center mb-2">
                            <input
                            type="radio"
                            id="formatCsv"
                            name="exportFormat"
                            value="csv"
                            checked={exportFormat === 'csv'}
                            onChange={() => setExportFormat('csv')}
                            />
                            <label htmlFor="formatCsv" className="ml-2">CSV</label>
                        </div>
                        <div className="flex items-center mb-2">
                            <input
                            type="radio"
                            id="formatJson"
                            name="exportFormat"
                            value="json"
                            checked={exportFormat === 'json'}
                            onChange={() => setExportFormat('json')}
                            />
                            <label htmlFor="formatJson" className="ml-2">JSON</label>
                        </div>

                        {/* Include Headers Option */}
                        <div className="flex items-center mt-4">
                            <input
                            type="checkbox"
                            id="includeHeaders"
                            checked={includeHeaders}
                            onChange={() => setIncludeHeaders(!includeHeaders)}
                            />
                            <label htmlFor="includeHeaders" className="ml-2">Include Headers</label>
                        </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Export
                    </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ExportModal;