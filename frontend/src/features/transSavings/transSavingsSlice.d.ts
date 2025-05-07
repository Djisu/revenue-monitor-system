export interface TransSavingsData {
    buss_no: string;
    transdate: string;
    details: string;
    debit: number;
    credit: number;
    balance: number;
    userid: string;
    yearx: number;
    term: string;
}
export interface TransSavingsState {
    transactions: TransSavingsData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: TransSavingsState;
export declare const fetchTransSavings: import("@reduxjs/toolkit").AsyncThunk<TransSavingsData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchTransSavingsById: import("@reduxjs/toolkit").AsyncThunk<TransSavingsData, {
    buss_no: string;
    transdate: string;
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
export declare const createTransSavings: import("@reduxjs/toolkit").AsyncThunk<TransSavingsData, TransSavingsData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateTransSavings: import("@reduxjs/toolkit").AsyncThunk<TransSavingsData, {
    buss_no: string;
    transdate: string;
    transSavingsData: TransSavingsData;
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
export declare const deleteTransSavings: import("@reduxjs/toolkit").AsyncThunk<TransSavingsData, {
    buss_no: string;
    transdate: string;
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
declare const _default: import("redux").Reducer<TransSavingsState>;
export default _default;
