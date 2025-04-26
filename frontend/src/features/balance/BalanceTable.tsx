import React from 'react';

export interface Balance {
    buss_no: number;
    buss_name: string;
    billamount: number;
    paidamount: number;
    balance: number;
    electroral_area: string;
    street_name: string;
}

interface BalanceTableProps {
    balanceData: Balance[];
}

const BalanceTable: React.FC<BalanceTableProps> = ({ balanceData }) => {
    console.log('balanceData: ', balanceData)

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
                {balanceData.length > 0 ? (
                    balanceData.map((balance) => (
                        <tr key={balance.buss_no}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.buss_no}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.buss_name}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.billamount}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.paidamount}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.balance}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.electroral_area}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.street_name}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Business No</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Business Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Bill Amount</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Paid Amount</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Balance</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Electoral Area</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Street Name</th>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default BalanceTable;




// import React from 'react';

// export interface Balance {
//     buss_no: number;
//     buss_name: string;
//     billamount: number;
//     paidamount: number;
//     balance: number;
//     electroral_area: string;
//     street_name: string;
// }

// interface BalanceTableProps {
//     balanceData: Balance[];
// }

// const BalanceTable: React.FC<BalanceTableProps> = ({ balanceData }) => {
//     return (
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//                 <tr>
//                     <th style={{ border: '1px solid #ccc', padding: '8px' }}>Business No</th>
//                     <th style={{ border: '1px solid #ccc', padding: '8px' }}>Business Name</th>
//                     <th style={{ border: '1px solid #ccc', padding: '8px' }}>Bill Amount</th>
//                     <th style={{ border: '1px solid #ccc', padding: '8px' }}>Paid Amount</th>
//                     <th style={{ border: '1px solid #ccc', padding: '8px' }}>Balance</th>
//                     <th style={{ border: '1px solid #ccc', padding: '8px' }}>Electoral Area</th>
//                     <th style={{ border: '1px solid #ccc', padding: '8px' }}>Street Name</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {balanceData.map((balance) => (
//                     <tr key={balance.buss_no}>
//                         <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.buss_no}</td>
//                         <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.buss_name}</td>
//                         <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.billamount}</td>
//                         <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.paidamount}</td>
//                         <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.balance}</td>
//                         <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.electroral_area}</td>
//                         <td style={{ border: '1px solid #ccc', padding: '8px' }}>{balance.street_name}</td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     );
// };

// export default BalanceTable;