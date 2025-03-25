interface BusTypeSummaryReport {
    buss_type: string;        // VARCHAR(50)
    amountdue: number;       // DECIMAL(13,2)
    amountpaid: number;      // DECIMAL(13,2)
    balance: number;         // DECIMAL(13,2)
    electoral_area: string;  // VARCHAR(50)
}