import { jsx as _jsx } from "react/jsx-runtime";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
var OfficerAssessmentBarChart = function (_a) {
    var data = _a.data;
    // Normalize data to always be an array
    var normalizedData = Array.isArray(data) ? data : [data];
    if (normalizedData.length === 0) {
        return _jsx("div", { children: "No data available" });
    }
    // Prepare data for Chart.js
    var chartData = {
        labels: normalizedData.map(function (officer) { return officer.officer_name; }),
        datasets: [
            {
                label: 'January',
                data: normalizedData.map(function (officer) { return officer.januaryamount; }),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'February',
                data: normalizedData.map(function (officer) { return officer.februaryamount; }),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'March',
                data: normalizedData.map(function (officer) { return officer.marchamount; }),
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            },
            {
                label: 'April',
                data: normalizedData.map(function (officer) { return officer.aprilamount; }),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'May',
                data: normalizedData.map(function (officer) { return officer.mayamount; }),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'June',
                data: normalizedData.map(function (officer) { return officer.juneamount; }),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
            {
                label: 'July',
                data: normalizedData.map(function (officer) { return officer.julyamount; }),
                backgroundColor: 'rgba(199, 199, 199, 0.6)',
                borderColor: 'rgba(199, 199, 199, 1)',
                borderWidth: 1,
            },
            {
                label: 'August',
                data: normalizedData.map(function (officer) { return officer.augustamount; }),
                backgroundColor: 'rgba(83, 102, 255, 0.6)',
                borderColor: 'rgba(83, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'September',
                data: normalizedData.map(function (officer) { return officer.septemberamount; }),
                backgroundColor: 'rgba(255, 99, 71, 0.6)',
                borderColor: 'rgba(255, 99, 71, 1)',
                borderWidth: 1,
            },
            {
                label: 'October',
                data: normalizedData.map(function (officer) { return officer.octoberamount; }),
                backgroundColor: 'rgba(60, 179, 113, 0.6)',
                borderColor: 'rgba(60, 179, 113, 1)',
                borderWidth: 1,
            },
            {
                label: 'November',
                data: normalizedData.map(function (officer) { return officer.novemberamount; }),
                backgroundColor: 'rgba(255, 20, 147, 0.6)',
                borderColor: 'rgba(255, 20, 147, 1)',
                borderWidth: 1,
            },
            {
                label: 'December',
                data: normalizedData.map(function (officer) { return officer.decemberamount; }),
                backgroundColor: 'rgba(255, 165, 0, 0.6)',
                borderColor: 'rgba(255, 165, 0, 1)',
                borderWidth: 1,
            },
        ],
    };
    // Chart options configuration
    var options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Officer Assessment',
            },
        },
    };
    return (_jsx("div", { children: _jsx(Bar, { data: chartData, options: options }) }));
};
export default OfficerAssessmentBarChart;
