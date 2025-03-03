import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addBudget, updateBudget, resetError, fetchOfficerBudget, resetBudgetState } from './officerBudgetSlice'; // Adjust the path as necessary


const BudgetForm = () => {
    const dispatch = useAppDispatch();
    // You may also want to retrieve the loading and error state from the Redux store
    const { error } = useAppSelector((state) => state.officerBudget);

   const officers = useAppSelector((state) => state.officer.officers);
   const electoralAreas = useAppSelector((state) => state.electoralArea.electoralAreas);
   

    const [officerNo, setOfficerNo] = useState('');
    const [fiscalYear, setFiscalYear] = useState('');
    const [electoralArea, setElectoralArea] = useState('');
    

    // const [annualBudget, setAnnualBudget] = useState(0);
    // const [monthlyBudget, setMonthlyBudget] = useState(0);
    let [success, setSuccess] = useState('');
    let [errorData, setErrorData] = useState('');

    // Optionally reset state on unmount
    useEffect(() => {
        return () => {
            dispatch(resetBudgetState());
        };
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!officerNo || !fiscalYear) {
            errorData = 'Please select both officer and fiscal year.'
            setErrorData(errorData);
            return;
        }
 
        try {
            const budgetData = {
                officer_no: officerNo,
                fiscal_year: fiscalYear,
                electoral_area: electoralArea,
            };

            let response
            // Dispatch the thunk with the required parameters
            const result = await dispatch(fetchOfficerBudget({ officer_no: officerNo, fiscal_year: Number(fiscalYear), electoral_area: electoralArea })).unwrap();
            
            if (!fetchOfficerBudget.fulfilled.match(result)){
                response = await dispatch(addBudget(budgetData));

                if (response.payload.status === 'error'){
                    setErrorData(response.payload.message); 
                }else{
                    alert('Budget record added successfully.');
                    success = 'Budget record added successfully.'
                    setSuccess(success);           
                }   
            } else {
                response = await dispatch(updateBudget(budgetData));
                
                if (response.payload.status === 'error'){
                    setErrorData(response.payload.message); 
                }else{
                    alert('Budget record updated successfully.');
                    setSuccess(response.payload.message);           
                }   
            }
            setOfficerNo('');
            setFiscalYear('');
            setErrorData('');
        } catch (error) {
            console.error(error);
            setErrorData('An error occurred. Please try again later.');
        }
    };

    const handleExit = () => {
        // Logic to exit the form, e.g., reset state or navigate away
        setOfficerNo('');
        setFiscalYear('');
        // setAnnualBudget(0);
        // setMonthlyBudget(0);
        setErrorData('');
    };

    useEffect(() => {
        // Reset error state on component mount
        dispatch(resetError());
    }, [dispatch]);

    return (
        <div>
            <h2>Add Budget Record</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="officer">Officer:</label>
                    <select id="officer" value={officerNo} onChange={(e) => setOfficerNo(e.target.value)}>
                        <option value="">Select Officer</option>
                        {officers.map((officer, index) => (
                            <option key={index} value={officer.officer_no}>
                                {officer.officer_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="officer">Electoral Area:</label>
                    <select id="officer" value={electoralArea} onChange={(e) => setElectoralArea(e.target.value)}>
                        <option value="">Select Electoral Area</option>
                        {electoralAreas.map((electoralArea, index) => (
                            <option key={index} value={electoralArea.electoral_area}>
                                {electoralArea.electoral_area}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="fiscalYear">Fiscal Year:</label>
                    <input 
                        id="fiscalYear" 
                        type="number" 
                        value={fiscalYear} 
                        onChange={(e) => setFiscalYear(e.target.value)} 
                        placeholder="Enter Fiscal Year" 
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Submit</button>
                <button type="button" onClick={handleExit}>Exit</button>
            </form>
        </div>
    );
};

export default BudgetForm;
