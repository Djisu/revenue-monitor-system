import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
    fetchCollectorElectoralAreas,
    createCollectorElectoralArea,
    updateCollectorElectoralArea,
    deleteCollectorElectoralArea,
    CollectorElectoralArea
} from './collectorElectoralAreaSlice'; // Adjust the import path as necessary
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice'; // Adjust the import path as necessary
import { fetchOfficers } from '../officer/officerSlice'; // Adjust the import path as necessary
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const CollectorElectoralAreaForm = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const { areas, loading, error } = useAppSelector(state => state.collectorElectoralArea);

    console.log('areas: ', areas);

    const electoralAreas = useAppSelector(state => state.electoralArea.electoralAreas); //  areas); // Assuming this is where electoral areas are stored
    const officers = useAppSelector(state => state.officer.officers); // Assuming this is where officers are stored

    console.log('electoralAreas: ', electoralAreas);
    console.log('officers: ', officers);

    const [selectedOfficerNo, setSelectedOfficerNo] = useState('');
    const [selectedElectoralArea, setSelectedElectoralArea] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        dispatch(fetchElectoralAreas());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchOfficers());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCollectorElectoralAreas());
    }, [dispatch]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('in handlesubmitting');
        console.log('selectedOfficerNo: ', selectedOfficerNo);
        console.log('selectedElectoralArea: ', selectedElectoralArea);

        e.preventDefault();
        if (isUpdating) {
            dispatch(updateCollectorElectoralArea({ officer_no: selectedOfficerNo, electoralarea: selectedElectoralArea }));
        } else {
            dispatch(createCollectorElectoralArea({ officer_no: selectedOfficerNo, electoralarea: selectedElectoralArea }));
        }
        setSelectedOfficerNo('');
        setSelectedElectoralArea('');
        setIsUpdating(false);
    };

    const handleEdit = (area: CollectorElectoralArea) => {
        setSelectedOfficerNo(area.officer_no);
        setSelectedElectoralArea(area.electoralarea);
        setIsUpdating(true);
    };

    const handleDelete = (officer_no: string) => {
        dispatch(deleteCollectorElectoralArea(officer_no));
    };

    return (
        <div className="container mt-4">
            {/* <p className="text-center mb-4">Collector Electoral Areas</p> */}
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-danger text-center">{error}</p>}
            
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-group">
                    <label htmlFor="officerSelect">Officer No</label>
                    <select
                        id="officerSelect"
                        className="form-control"
                        value={selectedOfficerNo}
                        onChange={(e) => {
                            setSelectedOfficerNo(e.target.value);
                        }}
                        onBlur={(e) => {
                            const selectedOfficerNo = e.target.value;
                            setSelectedOfficerNo(selectedOfficerNo);
                        }}
                        required
                    >
                        <option value="">Select Officer No</option>
                        {officers.map((officer, index) => (
                            <option key={index} value={officer.officer_no}>
                                {officer.officer_no}    {officer.officer_name}
                            </option>
                        ))}
                    </select>
                </div>
    
                <div className="form-group">
                    <label htmlFor="electoralAreaSelect">Electoral Area</label>
                    <select
                        id="electoralAreaSelect"
                        className="form-control"
                        value={selectedElectoralArea}
                        onChange={(e) => setSelectedElectoralArea(e.target.value)}
                        required
                    >
                        <option value="">Select Electoral Area</option>
                        {electoralAreas.map((electoralArea, index) => (
                            <option key={index} value={electoralArea.electroral_area}>
                                {electoralArea.electroral_area}
                            </option>
                        ))}
                    </select>
                </div>
    
                <div className="d-flex justify-content-between mt-4">
                    <button type="submit" className="btn btn-success">
                        {isUpdating ? 'Update' : 'Add'}
                    </button>
                    
                    <button type="button" className="btn btn-primary" onClick={() => navigate('/main')}>
                        Go Back
                    </button>
                </div>
            </form>
    
            <p className="mb-3">Existing Areas</p>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Officer No</th>
                        <th>Electoral Area</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {areas.map((area, index) => (
                        <tr key={index}>
                            <td>{area.officer_no}</td>
                            <td>{area.electoralarea}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(area)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(area.officer_no)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CollectorElectoralAreaForm;
