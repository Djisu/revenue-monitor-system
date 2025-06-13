import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchBusPaymentByElectoralArea } from './busPaymentsSlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';

import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import aggregatePaymentsByElectoralArea from '../../utilities/aggregatePaymentsByElectoralArea';



interface BusPaymentsData {
    electroral_area: string;
    paidamount: string; // Example property for the payment amount
}

const FrmElectoralAreasPaymentsGraph = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    //const [fiscalYear, setFiscalYear] = useState<number>(2023); // Default fiscal year
    const [localBudgetData, setLocalBudgetData] = useState<BusPaymentsData[]>([]);
    const [electoralAreas, setElectoralAreas] = useState<string[]>([]);

    const [electoralArea, setElectoralArea] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Loading state

   // const BusPaymentsData = useAppSelector((state) => state.busPayments.busPayments);

    useEffect(() => {
        dispatch(fetchElectoralAreas());
    }, [dispatch]);


    // useEffect(() => {
    //     console.log('localBudgetData: ', localBudgetData);
    // },[localBudgetData, dispatch])

    const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);
    console.log('electoralAreaData: ', electoralAreaData)

    useEffect(() => {
        if (!electoralAreaData){
            console.log('electoral areas not fetched!!!')
        }
        
        if (Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map((area) => area.electroral_area));
        } else {
            console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
        }
    }, [electoralAreaData]);

    const handleFetchData = async () => {
        if (electoralArea) {
            setLoading(true); // Set loading to true
            const action = await dispatch(fetchBusPaymentByElectoralArea(electoralArea));
            console.log('action.payload: ', action.payload);
    
            // Check if the payload is an array
            if (Array.isArray(action.payload)) {
                setLocalBudgetData(action.payload as BusPaymentsData[]);
            } else {
                console.error('Payload is not an array:', action.payload);
            }
             setLoading(false); // Set loading to true
        } else {
            alert('Please select the electoral area.');
        }
    };

    // Aggregate the payments data
    const aggregatedData = aggregatePaymentsByElectoralArea(localBudgetData);
    console.log('localBudgetData:', JSON.stringify(localBudgetData, null, 2));

    const chartData: ChartData<'bar'> = {
        labels: Object.keys(aggregatedData),
        datasets: [{
            label: 'Total Paid Amount',
            data: Object.values(aggregatedData),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
        }],
    };

    return (
        <div className="container mt-4">
            {loading && (
                <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                </div>
            )}
            <div>
                <p className="mb-4">Electoral Areas Payments Graph</p>
                {/* <div className="mb-3">
                    <label htmlFor="fiscalYear" className="form-label">Fiscal Year:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="fiscalYear"
                        value={fiscalYear}
                        onChange={(e) => setFiscalYear(parseInt(e.target.value, 10))}
                        min={2025} // Example minimum year
                    />
                </div> */}
                <div className="mb-3">
                    <label htmlFor="electoral_area">Electoral Area:</label>
                    <select 
                        name="electoralArea" 
                        id="electoralArea" 
                        value={electoralArea} 
                        onChange={(e) => setElectoralArea(e.target.value)}
                    >
                        <option value="All electoral areas">All electoral areas</option> {/* Default option */}
                        {electoralAreas.map((area, index) => (
                            <option key={index} value={area}>
                                {area}
                            </option>
                        ))}
                        {/* {electoralAreas.map((area, index) => (
                            <option key={index} value={area}>{area}</option>
                        ))} */}

                    </select>
                </div>
                <button className="btn btn-primary" onClick={handleFetchData}>
                    Fetch Data
                </button>
                <Button variant="secondary" onClick={() => navigate('/main')}>
                    Exit
                </Button>
                   {/* Render the graph */}
                    {Object.keys(aggregatedData).length > 0 && (
                        <div className="mt-4">
                            <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }}  height={400} />
                            <table className="mt-4" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid #000', padding: '8px' }}>Electoral Area</th>
                                        <th style={{ border: '1px solid #000', padding: '8px' }}>Total Paid Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(aggregatedData).map(([area, total], index) => (
                                        <tr key={index}>
                                            <td style={{ border: '1px solid #000', padding: '8px' }}>{area}</td>
                                            <td style={{ border: '1px solid #000', padding: '8px' }}>
                                                {typeof total === 'number' && !isNaN(total) ? total : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>        
    );
};

export default FrmElectoralAreasPaymentsGraph;




