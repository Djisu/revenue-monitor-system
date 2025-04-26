import { RootState } from '../../app/store';
export interface BusPaymentsData {
    buss_no: string;
    officer_no: string;
    paidAmount: number;
    paidamount?: number;
    monthpaid: string;
    transdate: string;
    fiscal_year: string;
    ReceiptNo: string;
    email: string;
    electroral_area: string;
}
export interface BusPaymentsState {
    busPayments: BusPaymentsData[];
    loading: boolean;
    error: string | null;
    billedAmount: number;
}
export interface BillData {
    bussNo: number;
    amount: number;
}
export declare const initialState: BusPaymentsState;
export interface FetchDailyPaymentsArgs {
    firstDate: Date;
    lastDate: Date;
    electoralarea: string;
    bussType: string;
}
interface FetchParams {
    fiscalyear: string;
    receiptno: string;
}
export declare const selectBusPayments: (state: RootState) => BusPaymentsData[];
export declare const fetchPaymentDefaulters: import("@reduxjs/toolkit").AsyncThunk<any, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBusPayments: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchTransSavings: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createBusPayment: import("@reduxjs/toolkit").AsyncThunk<any, BusPaymentsData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBilledAmount: import("@reduxjs/toolkit").AsyncThunk<any, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBusPaymentByBussNo: import("@reduxjs/toolkit").AsyncThunk<any[], string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBusPaymentByElectoralArea: import("@reduxjs/toolkit").AsyncThunk<any, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBusPaymentByPaymentDate: import("@reduxjs/toolkit").AsyncThunk<any, Date, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBusPaymentByTwoDates: import("@reduxjs/toolkit").AsyncThunk<any, {
    bussNo: string;
    startDate: Date;
    endDate: Date;
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
export declare const updateBusPayment: import("@reduxjs/toolkit").AsyncThunk<any, {
    buss_no: string;
    data: BusPaymentsData;
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
export declare const deleteBusPayment: import("@reduxjs/toolkit").AsyncThunk<any, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const billAllBusinesses: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const billOneBusiness: import("@reduxjs/toolkit").AsyncThunk<any, number, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchDailyPayments: import("@reduxjs/toolkit").AsyncThunk<any, FetchDailyPaymentsArgs, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchFiscalyearReceiptno: import("@reduxjs/toolkit").AsyncThunk<any, FetchParams, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const setBusPayments: import("@reduxjs/toolkit").ActionCreatorWithPayload<BusPaymentsData[], "busPayments/setBusPayments">, addBusPayment: import("@reduxjs/toolkit").ActionCreatorWithPayload<BusPaymentsData, "busPayments/addBusPayment">, setLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "busPayments/setLoading">, setError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "busPayments/setError">;
declare const _default: import("redux").Reducer<BusPaymentsState>;
export default _default;
