// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { OfficerData } from '../officer/officerSlice';

// const PropertyCollectorElectoralArea: React.FC = () => {
//   const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
//   const [officerNumbers, setOfficerNumbers] = useState<string[]>([]);
//   const [selectedOfficerNo, setSelectedOfficerNo] = useState<string>('');
//   const [selectedElectoralArea, setSelectedElectoralArea] = useState<string>('');
//   const [collectors, setCollectors] = useState<OfficerData[]>([]);

//   useEffect(() => {
//     populateElectoralAreas();
//     populateOfficerNumbers();
//     refreshCollectorsList();
//   }, []);

//   const populateElectoralAreas = async () => {
//     // Simulated API call to fetch electoral areas
//     const areas = ['Area A', 'Area B', 'Area C']; // Replace with actual API call
//     setElectoralAreas(areas);
//   };

//   const populateOfficerNumbers = async () => {
//     // Simulated API call to fetch officer numbers
//     const officers = ['001 - John Doe', '002 - Jane Smith']; // Replace with actual API call
//     setOfficerNumbers(officers);
//   };

//   const refreshCollectorsList = async () => {
//     // Simulated API call to fetch collectors
//     const data = [
//       { officer_no: '001', officer_name: 'John Doe', photo: '' }, // Add photo property
//       { officer_no: '002', officer_name: 'Jane Smith', photo: '' }, // Add photo property
//     ]; // Replace with actual API call
//     setCollectors(data);
//   };

//   const addRecord = async () => {
//     if (!selectedOfficerNo || !selectedElectoralArea) {
//       alert('Please select both Officer No and Electoral Area.');
//       return;
//     }

//     // Simulated API call to add record
//     alert(`Record added: Officer No ${selectedOfficerNo}, Electoral Area ${selectedElectoralArea}`);
//     refreshCollectorsList();
//   };

//   const deleteRecord = async () => {
//     if (!selectedOfficerNo || !selectedElectoralArea) {
//       alert('Please select a record to delete.');
//       return;
//     }

//     // Simulated API call to delete record
//     alert(`Record deleted: Officer No ${selectedOfficerNo}, Electoral Area ${selectedElectoralArea}`);
//     refreshCollectorsList();
//   };

//   return (
//     <div style={{ backgroundColor: '#FFC0C0', padding: '20px', height: '100vh' }}>
//       <h1>Add Property Rate Collector to an Electoral Area</h1>
//       <div>
//         <label>
//           Collector:
//           <select value={selectedOfficerNo} onChange={(e) => setSelectedOfficerNo(e.target.value)}>
//             <option value="">Select Officer No</option>
//             {officerNumbers.map((officer) => (
//               <option key={officer} value={officer}>{officer}</option>
//             ))}
//           </select>
//         </label>
//         <br />
//         <label>
//           Electoral Area:
//           <select value={selectedElectoralArea} onChange={(e) => setSelectedElectoralArea(e.target.value)}>
//             <option value="">Select Electoral Area</option>
//             {electoralAreas.map((area) => (
//               <option key={area} value={area}>{area}</option>
//             ))}
//           </select>
//         </label>
//       </div>
//       <div style={{ marginTop: '20px' }}>
//         <button onClick={addRecord}>Add New Record</button>
//         <button onClick={deleteRecord}>Delete</button>
//         <button onClick={() => alert('Exiting...')}>Exit</button>
//       </div>
//       <div>
//         <h2>List of Collectors And Their Layouts</h2>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th style={{ border: '1px solid black', padding: '8px' }}>Officer No</th>
//               <th style={{ border: '1px solid black', padding: '8px' }}>Officer Name</th>
//               <th style={{ border: '1px solid black', padding: '8px' }}>Electoral Area</th>
//             </tr>
//           </thead>
//           <tbody>
//             {collectors.map((collector) => (
//               <tr key={collector.officer_no}>
//                 <td style={{ border: '1px solid black', padding: '8px' }}>{collector.officer_no}</td>
//                 <td style={{ border: '1px solid black', padding: '8px' }}>{collector.officer_name}</td>
//                 <td style={{ border: '1px solid black', padding: '8px' }}>{collector.electoralArea}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
            
//       <Link to="/main" className="primary m-3">
//           Go Back
//       </Link>
              
//     </div>
//   );
// };

// export default PropertyCollectorElectoralArea;