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
declare const BalanceTable: React.FC<BalanceTableProps>;
export default BalanceTable;
