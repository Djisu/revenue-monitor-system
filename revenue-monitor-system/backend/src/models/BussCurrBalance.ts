export interface BussCurrBalance {
    buss_no: number;
    fiscalyear: number;
    balancebf: number;
    current_balance: number;
    totalAmountDue: number;
    transdate: Date;
    electoralarea: string;
    assessmentby: string;
    buss_type?: string;
}
