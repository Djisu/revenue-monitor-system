

const DummyBalanceTable = () => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Business No</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Business Name</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Bill Amount</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Paid Amount</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Balance</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Electoral Area</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Street Name</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '8px', border: '1px solid #ccc' }}>
                        No balance data available for the selected electoral area.
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default DummyBalanceTable;