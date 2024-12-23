// src/features/gradeFees/ExampleComponent.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchGradeFees } from './gradeFeesSlice';
import { RootState } from '../../app/store'; // Import RootState

const ExampleComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    
    // Specify the type of the state
    const { gradeFees, loading, error } = useAppSelector((state: RootState) => state.gradeFees);

    useEffect(() => {
        dispatch(fetchGradeFees());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Grade Fees</h2>
            <ul>
                {gradeFees.map((fee) => (
                    <li key={`${fee.buss_type}-${fee.grade}`}>
                        {fee.buss_type} - {fee.grade}: ${fee.fees}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExampleComponent;