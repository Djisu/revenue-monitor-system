import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addBudget, resetError, resetBudgetState } from './officerBudgetSlice'; // Adjust the path as necessary
import { fetchOfficers } from '../officer/officerSlice'; 


const FrmOfficerBudget = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // You may also want to retrieve the loading and error state from the Redux store
    const { error } = useAppSelector((state) => state.officerBudget);

   const officers = useAppSelector((state) => state.officer.officers);
   console.log('officers', officers)

    const [officerNo, setOfficerNo] = useState('');
    const [fiscalYear, setFiscalYear] = useState<number>(0);
 
    // Optionally reset state on unmount
    useEffect(() => {
        return () => {
            dispatch(resetBudgetState());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchOfficers());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('handleSubmit');

        e.preventDefault();

        if (!officerNo || !fiscalYear) {
            //errorData = 'Please select both officer and fiscal year.'
            alert('Please select both officer and fiscal year.');
            return;
        }
 
        try {
            const budgetData = {
                officer_no: officerNo,
                fiscal_year: fiscalYear
            };       
            await dispatch(addBudget(budgetData)).unwrap(); // Using unwrap to get the resolved value directly;

            // Assuming successful response structure from addBudget
            alert('Budget record added successfully.');
              
        } catch (error) {
            console.error(error);
            //errorData = 'Error in create budget record.';
            alert('Error in create budget record.');
        } finally {
            // Clear the form fields regardless of success or failure
            setOfficerNo('');
            setFiscalYear(0);         
        }
    };

    const handleExit = () => {
        // Logic to exit the form, e.g., reset state or navigate away
        setOfficerNo('');
        setFiscalYear(0);
        navigate('/main');
    };

    useEffect(() => {
        // Reset error state on component mount
        dispatch(resetError());
    }, [dispatch]);

   return (
    <div className="container mt-4">
       
        <form onSubmit={handleSubmit}>
             <p className="mb-4">Create Annual Budget Record</p>
            <div className="mb-3">
                <label htmlFor="officer" className="form-label">Officer:</label>
                <select 
                    id="officer" 
                    className="form-select" 
                    value={officerNo} 
                    onChange={(e) => setOfficerNo(e.target.value)}
                >
                    <option value="">Select Officer</option>
                    {officers.map((officer, index) => (
                        <option key={index} value={officer.officer_no}>
                            {officer.officer_name}
                        </option>
                    ))}
                </select>
            </div>
          
            <div className="mb-3">
                <label htmlFor="fiscalYear" className="form-label">Fiscal Year:</label>
                <input 
                    id="fiscalYear" 
                    type="number" 
                    className="form-control" 
                    value={fiscalYear} 
                    onChange={(e) => setFiscalYear(parseInt(e.target.value))} 
                    placeholder="Enter Fiscal Year" 
                />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary me-2">Submit</button>
            <button className="primary m-3" onClick={handleExit}>
                Go Back
            </button>
        </form>
    </div>
);
};

export default FrmOfficerBudget;
