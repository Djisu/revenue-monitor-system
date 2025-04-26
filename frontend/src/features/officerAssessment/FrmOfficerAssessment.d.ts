export interface FetchClientsServedParams {
    officerNo: string;
    fiscalYear: FiscalYear;
}
interface FiscalYear {
    fiscal_year: number;
}
export interface Officer {
    officer_no: number;
    officer_name: string;
    photo: Buffer;
}
declare const FrmOfficerAssessment: () => import("react/jsx-runtime").JSX.Element;
export default FrmOfficerAssessment;
