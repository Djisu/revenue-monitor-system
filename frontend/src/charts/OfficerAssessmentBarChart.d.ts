import React from 'react';
interface OfficerData {
    officer_name: string;
    januaryamount: number;
    februaryamount: number;
    marchamount: number;
    aprilamount: number;
    mayamount: number;
    juneamount: number;
    julyamount: number;
    augustamount: number;
    septemberamount: number;
    octoberamount: number;
    novemberamount: number;
    decemberamount: number;
}
interface MyBarChartProps {
    data: OfficerData[];
}
declare const OfficerAssessmentBarChart: React.FC<MyBarChartProps>;
export default OfficerAssessmentBarChart;
