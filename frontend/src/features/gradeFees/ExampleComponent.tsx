// src/features/gradeFees/ExampleComponent.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchGradeFees } from './gradeFeesSlice';

const ExampleComponent = () => {
    const dispatch = useAppDispatch();
    const { gradeFees, loading, error } = useAppSelector((state) => state.gradeFees);

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