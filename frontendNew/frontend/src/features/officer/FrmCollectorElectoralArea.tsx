import React, { useState, useEffect } from 'react';

const CollectorElectoralArea: React.FC = () => {
  const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  const [officerNumbers, setOfficerNumbers] = useState<string[]>([]);
  const [selectedElectoralArea, setSelectedElectoralArea] = useState<string>('');
  const [selectedOfficerNo, setSelectedOfficerNo] = useState<string>('');
  const [collectors, setCollectors] = useState<any[]>([]);

  useEffect(() => {
    fetchElectoralAreas();
    fetchOfficerNumbers();
    populateListView();
  }, []);

  const fetchElectoralAreas = async () => {
    // Replace with your actual API call
    const areas = ['Area 1', 'Area 2', 'Area 3']; // Placeholder
    setElectoralAreas(areas);
  };

  const fetchOfficerNumbers = async () => {
    // Replace with your actual API call
    const officers = ['Officer 1', 'Officer 2', 'Officer 3']; // Placeholder
    setOfficerNumbers(officers);
  };

  const populateListView = async () => {
    // Replace with your actual API call
    const data = [
      { officerNo: '001', officerName: 'John Doe', electoralArea: 'Area 1' },
      { officerNo: '002', officerName: 'Jane Smith', electoralArea: 'Area 2' },
      // Add more records as needed
    ];
    setCollectors(data);
  };

  const addRecord = async () => {
    if (!selectedOfficerNo || !selectedElectoralArea) {
      alert('Please select both Officer No and Electoral Area.');
      return;
    }

    // Logic to add the record (API call)
    alert(`Record added: Officer No ${selectedOfficerNo}, Electoral Area ${selectedElectoralArea}`);
    populateListView(); // Refresh the list
  };

  const deleteRecord = async () => {
    // Logic to delete the record (API call)
    alert(`Record deleted: Officer No ${selectedOfficerNo}, Electoral Area ${selectedElectoralArea}`);
    populateListView(); // Refresh the list
  };

  return (
    <div style={{ backgroundColor: '#FFC0C0', padding: '20px', height: '100vh' }}>
      <h1>Assign Collector To A Layout</h1>
      <label>
        Collector:
        <select value={selectedOfficerNo} onChange={(e) => setSelectedOfficerNo(e.target.value)}>
          <option value="">Select Officer No</option>
          {officerNumbers.map((officer) => (
            <option key={officer} value={officer}>{officer}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Electoral Area:
        <select value={selectedElectoralArea} onChange={(e) => setSelectedElectoralArea(e.target.value)}>
          <option value="">Select Electoral Area</option>
          {electoralAreas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </label>
      <br />
      <button onClick={addRecord}>Add New Record</button>
      <button onClick={deleteRecord}>Delete</button>
      <button onClick={() => alert('Exiting...')}>Exit</button>
      <div>
        <h2>List of Collectors And Their Layouts</h2>
        <table>
          <thead>
            <tr>
              <th>Officer No</th>
              <th>Officer Name</th>
              <th>Electoral Area</th>
            </tr>
          </thead>
          <tbody>
            {collectors.map((collector) => (
              <tr key={collector.officerNo}>
                <td>{collector.officerNo}</td>
                <td>{collector.officerName}</td>
                <td>{collector.electoralArea}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectorElectoralArea;