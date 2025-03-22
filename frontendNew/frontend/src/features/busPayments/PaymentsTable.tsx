import { BusPaymentsData } from "./busPaymentsSlice";

const PaymentsTable: React.FC<{ busPaymentsData: BusPaymentsData[] }> = ({ busPaymentsData }) => {
   
    let totalPaid: number = busPaymentsData.reduce((accumulator, payment) => {
        // Check if payment.paidamount is a number, if not, default to 0
        return accumulator + (typeof payment.paidAmount === 'number' ? payment.paidAmount : 0);
    }, 0);
    
    return (
        <div className="table-responsive">
            <table className="table table-bordered" style={{ fontSize: '0.8em' }}> {/* Adjust the font size here */}
                <thead>
                    <tr>
                        <th colSpan={8} className="text-center" style={{ color: 'red', fontWeight: 'bold', fontSize: '1em' }}>
                            Total Paid: {totalPaid}
                        </th>
                    </tr>
                    <tr>
                        <th style={{ fontSize: '0.8em' }}>Business Number</th>
                        <th style={{ fontSize: '0.8em' }}>Officer Name</th>
                        <th style={{ fontSize: '0.8em' }}>Paid Amount</th>
                        <th style={{ fontSize: '0.8em' }}>Month Paid</th>
                        <th style={{ fontSize: '0.8em' }}>Transaction Date</th>
                        <th style={{ fontSize: '0.8em' }}>Fiscal Year</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {busPaymentsData.length > 0 ? (
                        busPaymentsData.map((payment, index: number) => (
                            <tr key={index}>
                                <td style={{ fontSize: '0.8em' }}>{payment.buss_no}</td>
                                <td style={{ fontSize: '0.8em' }}>{payment.officer_no}</td>
                                <td style={{ fontSize: '0.8em' }}>{payment.paidAmount}</td>
                                <td style={{ fontSize: '0.8em' }}>{payment.monthpaid}</td>
                                <td style={{ fontSize: '0.8em' }}>{new Date(payment.transdate).toLocaleDateString()}</td>
                                <td style={{ fontSize: '0.8em' }}>{payment.fiscal_year}</td>
                                <td style={{ fontSize: '0.8em' }}>{payment.electoral_area}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="text-center" style={{ fontSize: '0.8em' }}>No payments found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsTable;