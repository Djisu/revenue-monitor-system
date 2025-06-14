import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the updated data structure
interface OfficerData {
  officer_name: string;
  januaryamount: number;
  februaryamount: number;
  marchamount: number;
  aprilamount: number;
  mayamount: number;
  juneamount: number;
  julyamount: number;
  augustamount: number;
  septemberamount: number;
  octoberamount: number;
  novemberamount: number;
  decemberamount: number;
}

// Define the props for the chart component
interface MyBarChartProps {
  data: OfficerData[];
}

const OfficerAssessmentBarChart: React.FC<MyBarChartProps> = ({ data }) => {
  // Normalize data to always be an array
  const normalizedData = Array.isArray(data) ? data : [data];

  if (normalizedData.length === 0) {
    return <div>No data available</div>; 
  }

  // Prepare data for Chart.js
  const chartData = {
    labels: normalizedData.map(officer => officer.officer_name),
    datasets: [
      {
        label: 'January',
        data: normalizedData.map(officer => officer.januaryamount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'February',
        data: normalizedData.map(officer => officer.februaryamount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'March',
        data: normalizedData.map(officer => officer.marchamount),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'April',
        data: normalizedData.map(officer => officer.aprilamount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'May',
        data: normalizedData.map(officer => officer.mayamount),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'June',
        data: normalizedData.map(officer => officer.juneamount),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'July',
        data: normalizedData.map(officer => officer.julyamount),
        backgroundColor: 'rgba(199, 199, 199, 0.6)',
        borderColor: 'rgba(199, 199, 199, 1)',
        borderWidth: 1,
      },
      {
        label: 'August',
        data: normalizedData.map(officer => officer.augustamount),
        backgroundColor: 'rgba(83, 102, 255, 0.6)',
        borderColor: 'rgba(83, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'September',
        data: normalizedData.map(officer => officer.septemberamount),
        backgroundColor: 'rgba(255, 99, 71, 0.6)',
        borderColor: 'rgba(255, 99, 71, 1)',
        borderWidth: 1,
      },
      {
        label: 'October',
        data: normalizedData.map(officer => officer.octoberamount),
        backgroundColor: 'rgba(60, 179, 113, 0.6)',
        borderColor: 'rgba(60, 179, 113, 1)',
        borderWidth: 1,
      },
      {
        label: 'November',
        data: normalizedData.map(officer => officer.novemberamount),
        backgroundColor: 'rgba(255, 20, 147, 0.6)',
        borderColor: 'rgba(255, 20, 147, 1)',
        borderWidth: 1,
      },
      {
        label: 'December',
        data: normalizedData.map(officer => officer.decemberamount),
        backgroundColor: 'rgba(255, 165, 0, 0.6)',
        borderColor: 'rgba(255, 165, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Officer Assessment',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OfficerAssessmentBarChart;








// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register the necessary components for Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // Define the updated data structure
// interface OfficerData {
//   officer_name: string;
//   januaryamount: number;
//   februaryamount: number;
//   marchamount: number;
//   aprilamount: number;
//   mayamount: number;
//   juneamount: number;
//   julyamount: number;
//   augustamount: number;
//   septemberamount: number;
//   octoberamount: number;
//   novemberamount: number;
//   decemberamount: number;
// }

// // Define the props for the chart component
// interface MyBarChartProps {
//   data: OfficerData[];
// }

// const OfficerAssessmentBarChart: React.FC<MyBarChartProps> = ({ data }) => {
//   const normalizedData = Array.isArray(data) ? data : [data];

//   if (normalizedData.length === 0) {
//     return <div>No data available</div>; 
//   }

//   // Prepare data for Chart.js
//   const chartData = {
//     labels: normalizedData.map(officer => officer.officer_name),
//     datasets: [
//       // Your datasets here (same as before)
//     ],
//   };

//   // Chart options configuration
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       title: {
//         display: true,
//         text: 'Officer Assessment',
//       },
//     },
//   };

//   return (
//     <div>
//       <Bar data={chartData} options={options} height={250} /> {/* Set height here */}
//     </div>
//   );
// };

// export default OfficerAssessmentBarChart;






// // import React from 'react';
// // import { Bar } from 'react-chartjs-2';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from 'chart.js';

// // // Register the necessary components for Chart.js
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // // Define the updated data structure
// // interface OfficerData {
// //   officer_name: string;
// //   januaryamount: number;
// //   februaryamount: number;
// //   marchamount: number;
// //   aprilamount: number;
// //   mayamount: number;
// //   juneamount: number;
// //   julyamount: number;
// //   augustamount: number;
// //   septemberamount: number;
// //   octoberamount: number;
// //   novemberamount: number;
// //   decemberamount: number;
// // }

// // // Define the props for the chart component
// // interface MyBarChartProps {
// //   data: OfficerData[];
// // }

// // const OfficerAssessmentBarChart: React.FC<MyBarChartProps> = ({ data }) => {
// //   // Normalize data to always be an array
// //   const normalizedData = Array.isArray(data) ? data : [data];

// //   if (normalizedData.length === 0) {
// //     return <div>No data available</div>; 
// //   }

// //   // Prepare data for Chart.js
// //   const chartData = {
// //     labels: normalizedData.map(officer => officer.officer_name),
// //     datasets: [
// //       {
// //         label: 'January',
// //         data: normalizedData.map(officer => officer.januaryamount),
// //         backgroundColor: 'rgba(255, 99, 132, 0.6)',
// //         borderColor: 'rgba(255, 99, 132, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'February',
// //         data: normalizedData.map(officer => officer.februaryamount),
// //         backgroundColor: 'rgba(54, 162, 235, 0.6)',
// //         borderColor: 'rgba(54, 162, 235, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'March',
// //         data: normalizedData.map(officer => officer.marchamount),
// //         backgroundColor: 'rgba(255, 206, 86, 0.6)',
// //         borderColor: 'rgba(255, 206, 86, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'April',
// //         data: normalizedData.map(officer => officer.aprilamount),
// //         backgroundColor: 'rgba(75, 192, 192, 0.6)',
// //         borderColor: 'rgba(75, 192, 192, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'May',
// //         data: normalizedData.map(officer => officer.mayamount),
// //         backgroundColor: 'rgba(153, 102, 255, 0.6)',
// //         borderColor: 'rgba(153, 102, 255, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'June',
// //         data: normalizedData.map(officer => officer.juneamount),
// //         backgroundColor: 'rgba(255, 159, 64, 0.6)',
// //         borderColor: 'rgba(255, 159, 64, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'July',
// //         data: normalizedData.map(officer => officer.julyamount),
// //         backgroundColor: 'rgba(199, 199, 199, 0.6)',
// //         borderColor: 'rgba(199, 199, 199, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'August',
// //         data: normalizedData.map(officer => officer.augustamount),
// //         backgroundColor: 'rgba(83, 102, 255, 0.6)',
// //         borderColor: 'rgba(83, 102, 255, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'September',
// //         data: normalizedData.map(officer => officer.septemberamount),
// //         backgroundColor: 'rgba(255, 99, 71, 0.6)',
// //         borderColor: 'rgba(255, 99, 71, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'October',
// //         data: normalizedData.map(officer => officer.octoberamount),
// //         backgroundColor: 'rgba(60, 179, 113, 0.6)',
// //         borderColor: 'rgba(60, 179, 113, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'November',
// //         data: normalizedData.map(officer => officer.novemberamount),
// //         backgroundColor: 'rgba(255, 20, 147, 0.6)',
// //         borderColor: 'rgba(255, 20, 147, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'December',
// //         data: normalizedData.map(officer => officer.decemberamount),
// //         backgroundColor: 'rgba(255, 165, 0, 0.6)',
// //         borderColor: 'rgba(255, 165, 0, 1)',
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   // Chart options configuration
// //   const options = {
// //     responsive: true,
// //     plugins: {
// //       legend: {
// //         position: 'top' as const,
// //       },
// //       title: {
// //         display: true,
// //         text: 'Officer Assessment',
// //       },
// //     },
// //   };

// //   return (
// //     <div>
// //       <Bar data={chartData} options={options} />
// //     </div>
// //   );
// // };

// // export default OfficerAssessmentBarChart;


