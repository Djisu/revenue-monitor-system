import React from 'react';
export interface OfficerAssessment {
    officer_no: string;
    officer_name: string;
    Noofclientsserved: number;
    valueofbillsdistributed: number;
    bus_year: number;
    januaryamount?: number;
    februaryamount?: number;
    marchamount?: number;
    aprilamount?: number;
    mayamount?: number;
    juneamount?: number;
    julyamount?: number;
    augustamount?: number;
    septemberamount?: number;
    octoberamount?: number;
    novemberamount?: number;
    decemberamount?: number;
    totalreceiptstodate?: number;
    balance?: number;
    remarks?: string;
    totalValue: number;
}
declare const OfficerBudgetAssessment: React.FC;
export default OfficerBudgetAssessment;
