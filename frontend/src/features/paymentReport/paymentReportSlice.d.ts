export interface PaymentReportData {
    transdate: string;
    buss_name: string;
    amount: number;
    receiptno: string;
    fiscalyear: number;
    officer_no: string;
    buss_no: string;
}
export interface PaymentReportState {
    paymentReports: PaymentReportData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: PaymentReportState;
export declare const fetchPaymentReports: import("@reduxjs/toolkit").AsyncThunk<PaymentReportData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchPaymentReportById: import("@reduxjs/toolkit").AsyncThunk<PaymentReportData, {
    buss_no: string;
    fiscalyear: number;
}, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createPaymentReport: import("@reduxjs/toolkit").AsyncThunk<PaymentReportData, PaymentReportData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updatePaymentReport: import("@reduxjs/toolkit").AsyncThunk<PaymentReportData, {
    buss_no: string;
    fiscalyear: number;
    paymentReportData: PaymentReportData;
}, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const deletePaymentReport: import("@reduxjs/toolkit").AsyncThunk<PaymentReportData, {
    buss_no: string;
    fiscalyear: number;
}, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<PaymentReportState>;
export default _default;
