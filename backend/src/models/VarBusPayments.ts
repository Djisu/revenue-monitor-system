export interface VarBusPayments {
    buss_no: number;
    officer_no: string;
    paidAmount: number;
    monthpaid: string;
    transdate: Date;
    fiscal_year: number;
    ReceiptNo: string;
    electroral_area?: string;
    buss_type?: string;
    email?: string;
}