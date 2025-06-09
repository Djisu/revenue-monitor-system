import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchOfficerBudget } from '../officerBudget/officerBudgetSlice';
import { fetchOfficers } from '../officer/officerSlice'; 
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface MonthlyBudgetData {
    january_budget: string;
    january_actual: string;
    february_budget: string;
    february_actual: string;
    march_budget: string;
    march_actual: string;
    april_budget: string;
    april_actual: string;
    may_budget: string;
    may_actual: string;
    june_budget: string;
    june_actual: string;
    july_budget: string;
    july_actual: string;
    august_budget: string;
    august_actual: string;
    september_budget: string;
    september_actual: string;
    october_budget: string;
    october_actual: string;
    november_budget: string;
    november_actual: string;
    december_budget: string;
    december_actual: string;
}

type MonthKeys = 
    | 'january' | 'february' | 'march' | 'april' | 'may' 
    | 'june' | 'july' | 'august' | 'september' | 'october' 
    | 'november' | 'december';


const FrmOfficerBudgetActual = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const [fiscalYear, setFiscalYear] = useState<number>(2023);
    const [localBudgetData, setLocalBudgetData] = useState<MonthlyBudgetData[]>([]);
    const [selectedOfficer, setSelectedOfficer] = useState<string>('');
    
    const officersData = useAppSelector((state) => state.officer.officers);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchOfficers());
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedOfficer && fiscalYear) {
                try {
                    const data = await dispatch(fetchOfficerBudget({ officer_no: selectedOfficer, fiscal_year: fiscalYear })).unwrap();
                    setLocalBudgetData(data.data);
                } catch (error) {
                    console.error('Failed to fetch budget data: ', error);
                }
            }
        };
        fetchData();
    }, [selectedOfficer, fiscalYear, dispatch]);

    const handleFetchData = async () => {
        if (selectedOfficer && fiscalYear) {
            await dispatch(fetchOfficerBudget({ officer_no: selectedOfficer, fiscal_year: fiscalYear }));
        } else {
            alert('Please select an officer and enter a fiscal year.');
        }
    };

    const handleExitClick = () => {
        navigate('/main');
    };

    const getChartData = (data: MonthlyBudgetData[]): ChartData<'bar', number[], string> => {
        if (!data || data.length === 0) return { labels: [], datasets: [] };

        const monthlyLabels: string[] = [
            'January', 'February', 'March', 'April', 'May', 
            'June', 'July', 'August', 'September', 'October', 
            'November', 'December'
        ];

        const budgetData = data[0];

        const budgets = monthlyLabels.map((month) => 
            parseFloat(budgetData[`${month.toLowerCase()}_budget` as keyof MonthlyBudgetData]) || 0
        );

        const actuals = monthlyLabels.map((month) => 
            parseFloat(budgetData[`${month.toLowerCase()}_actual` as keyof MonthlyBudgetData]) || 0
        )
        
        return {
            labels: monthlyLabels,
            datasets: [
                {
                    label: 'Monthly Budget',
                    data: budgets,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Monthly Actual',
                    data: actuals,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
            ],
        };
    };
    
    const chartData = getChartData(localBudgetData);

    return (
        <div className="container mt-4">
            <div>
                <p className="mb-4">Fetch Collector Budget</p>
                <div className="mb-3">
                    <label htmlFor="fiscalYear" className="form-label">Fiscal Year:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="fiscalYear"
                        value={fiscalYear}
                        onChange={(e) => setFiscalYear(parseInt(e.target.value, 10))}
                        min={2025}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="officerSelect" className="form-label">Select Officer:</label>
                    <select
                        id="officerSelect"
                        className="form-select"
                        value={selectedOfficer}
                        onChange={(e) => setSelectedOfficer(e.target.value)}
                    >
                        <option value="">Select an officer</option>
                        {officersData.map(officer => (
                            <option key={officer.officer_no} value={officer.officer_no}>
                                {officer.officer_no} {officer.officer_name}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary" onClick={handleFetchData}>
                    Fetch Data
                </button>
                <Button variant="secondary" onClick={handleExitClick}>
                    Exit
                </Button>
                <div className="chart-container mt-4">
                    {localBudgetData.length > 0 && (
                        <>
                            <h2>Monthly Budget vs Actuals</h2>
                            <div style={{ height: '400px', width: '100%' }}>
                                <Bar 
                                    data={chartData} 
                                    options={{ 
                                        responsive: true, 
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }} 
                                />
                            </div>
                            <table className="table mt-4">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>Budget</th>
                                        <th>Actual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(localBudgetData[0]).filter(key => key.endsWith('_budget')).map((key, index) => {
                                        const month = key.split('_')[0] as MonthKeys; // Extract month name and assert type
                                        return (
                                            <tr key={index}>
                                                <td>{month.charAt(0).toUpperCase() + month.slice(1)}</td>
                                                <td>{localBudgetData[0][key as keyof MonthlyBudgetData]}</td>
                                                <td>{localBudgetData[0][`${month}_actual` as keyof MonthlyBudgetData]}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FrmOfficerBudgetActual;

// import { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { ChartData } from 'chart.js';
// import { useAppDispatch, useAppSelector } from '../../app/store';
// import { fetchOfficerBudget, OfficerBudgetState } from '../officerBudget/officerBudgetSlice';
// import { fetchOfficers } from '../officer/officerSlice'; 
// import { Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// interface MonthlyBudgetData {
//     january_budget: string;
//     january_actual: string;
//     february_budget: string;
//     february_actual: string;
//     march_budget: string;
//     march_actual: string;
//     april_budget: string;
//     april_actual: string;
//     may_budget: string;
//     may_actual: string;
//     june_budget: string;
//     june_actual: string;
//     july_budget: string;
//     july_actual: string;
//     august_budget: string;
//     august_actual: string;
//     september_budget: string;
//     september_actual: string;
//     october_budget: string;
//     october_actual: string;
//     november_budget: string;
//     november_actual: string;
//     december_budget: string;
//     december_actual: string;
// }

// // type MonthKeys = 
// //     | 'january'
// //     | 'february'
// //     | 'march'
// //     | 'april'
// //     | 'may'
// //     | 'june'
// //     | 'july'
// //     | 'august'
// //     | 'september'
// //     | 'october'
// //     | 'november'
// //     | 'december';


// const FrmOfficerBudgetActual = () => {
//     const dispatch = useAppDispatch();
//     const navigate = useNavigate();
    
//     useEffect(() => {
//         const fetchData = async () => {
//           await dispatch(fetchOfficers());
//         };
    
//         fetchData();
//     }, [dispatch]);

//     // Local state for fiscal year
//     const [fiscalYear, setFiscalYear] = useState<number>(2023); // Default fiscal year
//     const [localBudgetData, setLocalBudgetData] = useState<MonthlyBudgetData[]>([]);

//     const budgetData = useAppSelector((state: { officerBudget: OfficerBudgetState }) => state.officerBudget.data); // Adjust according to your state structure 
//     console.log('budgetData: ', budgetData)

//     let officersData = useAppSelector((state) => state.officer.officers);
//    // const officers = useAppSelector((state: { officerBudget: { officers: Officer[] } }) => state.officerBudget.officers);

//     const [selectedOfficer, setSelectedOfficer] = useState<string>('');

//     useEffect(() => {
//         const fetchData = async () => {
//             if (selectedOfficer && fiscalYear) {
//                 try {
//                     const data = await dispatch(fetchOfficerBudget({ officer_no: selectedOfficer, fiscal_year: fiscalYear })).unwrap();
//                     console.log('Data fetched successfully: ', data.data);

//                     setLocalBudgetData(data.data); // Set the local state with the fetched data
//                 } catch (error) {
//                     console.error('Failed to fetch budget data: ', error);
//                 }
//             }
//         };
    
//         fetchData();
//     }, [selectedOfficer, fiscalYear, dispatch]);

//     const handleFetchData = async () => {
//         if (selectedOfficer && fiscalYear) {
//             await dispatch(fetchOfficerBudget({ officer_no: selectedOfficer, fiscal_year: fiscalYear }));
           
            
//         } else {
//             alert('Please select an officer and enter a fiscal year.');
//         }
//     };

//     useEffect(() => {
//         if (localBudgetData && localBudgetData.length > 0) {

//             console.log('localBudgetData: ', localBudgetData)
//         }
//     }, [localBudgetData]);

//     const handleExitClick = () => {
//         navigate('/main');
//     };
    
//     type MonthKeys = 
//     | 'january_budget' | 'february_budget' | 'march_budget'
//     | 'april_budget' | 'may_budget' | 'june_budget'
//     | 'july_budget' | 'august_budget' | 'september_budget'
//     | 'october_budget' | 'november_budget' | 'december_budget'
//     | 'january_actual' | 'february_actual' | 'march_actual'
//     | 'april_actual' | 'may_actual' | 'june_actual'
//     | 'july_actual' | 'august_actual' | 'september_actual'
//     | 'october_actual' | 'november_actual' | 'december_actual';

// const getChartData = (data: MonthlyBudgetData[]): ChartData<'bar', number[], string> => {
//     if (!data || data.length === 0) return { labels: [], datasets: [] };

//     const monthlyLabels: string[] = [
//         'January', 'February', 'March', 'April', 'May', 
//         'June', 'July', 'August', 'September', 'October', 
//         'November', 'December'
//     ];

//     const budgetData = data[0]; // Access the first item in the array

//     const budgets = monthlyLabels.map((month) => 
//         parseFloat(budgetData[`${month.toLowerCase()}_budget` as MonthKeys]) || 0
//     );

//     const actuals = monthlyLabels.map((month) => 
//         parseFloat(budgetData[`${month.toLowerCase()}_actual` as MonthKeys]) || 0
//     );

//     return {
//         labels: monthlyLabels,
//         datasets: [
//             {
//                 label: 'Monthly Budget',
//                 data: budgets,
//                 backgroundColor: 'rgba(75, 192, 192, 0.6)',
//             },
//             {
//                 label: 'Monthly Actual',
//                 data: actuals,
//                 backgroundColor: 'rgba(255, 99, 132, 0.6)',
//             },
//         ],
//     };
// };
    
//     const chartData = getChartData(localBudgetData);
    
//     return (
//         <div className="container mt-4">
//             <div>
//                     <p className="mb-4">Fetch Collector Budget</p>
//                     <div className="mb-3">
//                         <label htmlFor="fiscalYear" className="form-label">Fiscal Year:</label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             id="fiscalYear"
//                             value={fiscalYear}
//                             onChange={(e) => setFiscalYear(parseInt(e.target.value, 10))}
//                             min={2025} // Example minimum year
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="officerSelect" className="form-label">Select Officer:</label>
//                         <select
//                             id="officerSelect"
//                             className="form-select"
//                             value={selectedOfficer}
//                             onChange={(e) => setSelectedOfficer(e.target.value)}
//                         >
//                             <option value="">Select an officer</option>
//                             {officersData.map(officer => (
//                                 <option key={officer.officer_no} value={`${officer.officer_no} ${officer.officer_name}`}>
//                                 {officer.officer_no}  {officer.officer_name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <button className="btn btn-primary" onClick={() => handleFetchData()}>
//                         Fetch Data
//                     </button>
//                     <Button variant="secondary" onClick={handleExitClick}>
//                         Exit
//                     </Button>
//                      <div>
//                         {localBudgetData.length > 0 && (
//                            <div className="chart-container mt-4">
//                                 <h2>Monthly Budget vs Actuals</h2>
//                                 <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
//                            </div>
//                         )}
//                           <table className="table mt-4">
//                                 <thead>
//                                     <tr>
//                                         <th>Month</th>
//                                         <th>Budget</th>
//                                         <th>Actual</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {Object.keys(localBudgetData[0]).filter(key => key.endsWith('_budget')).map((key, index) => {
//                                         const month = key.split('_')[0]; // Extract month name
//                                         return (
//                                             <tr key={index}>
//                                                 <td>{month.charAt(0).toUpperCase() + month.slice(1)}</td>
//                                                 <td>{localBudgetData[0][key]}</td>
//                                                 <td>{localBudgetData[0][`${month}_actual`]}</td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                     </div>
//             </div>
           
//         </div>
//     );
// };

// export default FrmOfficerBudgetActual ;