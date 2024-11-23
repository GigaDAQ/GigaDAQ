import { saveAs } from 'file-saver';
import { DataPoint, ExportOptions, ChannelData } from './types';
// import { DataPoint } from '../types'; // Adjust the import path as needed
// import * as mat from 'jmatio'; // Assume we're using a library to handle MATLAB .mat files


export const exportToCSV = (
    dataArrays: ChannelData[],
    samplingRate: number,
    includeHeaders: boolean
  ) => {
    // Check if there is at least one channel to export
    if (dataArrays.length === 0) {
      return;
    }
  
    // Assuming all channels have the same time points
    const timeArray = dataArrays[0].data.map((point) => point.time);
  
    // Start building the CSV content
    let csvContent = '';
  
    if (includeHeaders) {
      // Optional: Add metadata at the top
      csvContent += `Sampling Rate: ${samplingRate} Hz\n`;
      csvContent += `Date: ${new Date().toLocaleString()}\n\n`;
  
      // Add the header row
      csvContent += 'Time (s)';
  
      dataArrays.forEach(({ channelIndex }) => {
        csvContent += `,Channel ${channelIndex + 1} (V)`;
      });
      csvContent += '\n';
    }
  
    // Add the data rows
    for (let i = 0; i < timeArray.length; i++) {
      let row = `${timeArray[i]}`; // Time value
  
      dataArrays.forEach(({ data }) => {
        const value = data[i]?.value ?? '';
        row += `,${value}`;
      });
  
      csvContent += row + '\n';
    }
  
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    // Use FileSaver.js to save the file
    saveAs(blob, 'exported_signals.csv');
};

export const exportToJson = (
    dataArrays: ChannelData[],
    samplingRate: number,
    includeHeaders: boolean
) => {
    const exportData: any = {};

  if (includeHeaders) {
    exportData.samplingRate = samplingRate;
    exportData.date = new Date().toLocaleString();
  }

  // Assuming all channels have the same time points
  const timeArray = dataArrays[0].data.map((point) => point.time);
  exportData.time = timeArray;

  dataArrays.forEach(({ channelIndex, data }) => {
    const values = data.map((point) => point.value);
    exportData[`channel${channelIndex + 1}`] = values;
  });

  const jsonString = JSON.stringify(exportData, null, 2); // Pretty-print with 2 spaces

  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });

  saveAs(blob, 'exported_signals.json');
}


// export default  handleExport;