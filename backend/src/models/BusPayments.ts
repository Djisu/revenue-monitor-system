export interface BusPayments {
    buss_no: number;
    officer_no: number;
    amount: number;
    monthpaid: string;
    transdate: Date;
    userid: number;
    fiscal_year: number;
    ReceiptNo: string;
    electroral_area?: string;
    buss_type?: string;
    email?: string;
}
