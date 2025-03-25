interface BusTypeDetailedReport {
    electoral_area: string;  // Corresponds to VARCHAR(255)
    buss_no: number;         // Corresponds to INTEGER
    buss_name: string;       // Corresponds to VARCHAR(255)
    buss_type: string;       // Corresponds to VARCHAR(100)
    amountdue: number;       // Corresponds to DECIMAL(10, 2)
    amountpaid: number;      // Corresponds to DECIMAL(10, 2)
    balance: number;         // Corresponds to DECIMAL(10, 2)
    tot_grade: string;       // Corresponds to VARCHAR(50)
}