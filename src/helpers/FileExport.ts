// import { useSelector } from 'react-redux';
// import { RootState } from '../store';
// import { saveAs } from 'file-saver';

// interface DataPoint{
//     time: number;
//     value: number;
// }
  

// const { data, samplingRate } = useSelector((state: RootState) => state.acquisition);
// const handleExport = () => {
//     const signalData = data[0]; // Default to SIgnal 1

//     if ( !signalData || signalData.length === 0) {
//         console.error('No data available to export.');
//         return;
//     }
//     const formatDataToCSV = (signalData: DataPoint[]): string => {
//         let csvContent = 'Index,Voltage,Time\n';
        
//         signalData.forEach((point, index) => {
//           csvContent += `${index},${point.value},${point.time}\n`;
//         });
    
//         return csvContent;
//       };
    
//       const csvContent = formatDataToCSV(signalData);
    
//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       saveAs(blob, `signal_data.csv`);
// }

// export default  handleExport;