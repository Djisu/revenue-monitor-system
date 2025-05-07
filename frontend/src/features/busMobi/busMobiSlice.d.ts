export interface BusMobiData {
    buss_no: string;
    fiscal_year: string;
    dateofbilling: string;
    buss_type: string;
    balancebf: number;
    currentPayable: number;
    totalAmount: number;
    firstD: string;
    secondE: string;
    outstanding: number;
    firstPaymentDate: string;
    secondPaymentDate: string;
    firstreceiptno: string;
    secondreceiptno: string;
    remarks: string;
    officer_no: string;
}
export interface BusMobiState {
    busMobis: BusMobiData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: BusMobiState;
export declare const fetchBusMobis: import("@reduxjs/toolkit").AsyncThunk<BusMobiData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createBusMobi: import("@reduxjs/toolkit").AsyncThunk<BusMobiData, BusMobiData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBusMobiById: import("@reduxjs/toolkit").AsyncThunk<BusMobiData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateBusMobi: import("@reduxjs/toolkit").AsyncThunk<BusMobiData, {
    buss_no: string;
    data: BusMobiData;
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
export declare const deleteBusMobi: import("@reduxjs/toolkit").AsyncThunk<BusMobiData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<BusMobiState>;
export default _default;
