export interface BussCurrBalanceData {
    buss_no: string;
    fiscalyear: string;
    balancebf: number;
    current_balance: number;
    totalAmountDue: number;
    transdate: string;
    electoralarea: string;
}
export interface BussCurrBalanceState {
    bussCurrBalances: BussCurrBalanceData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: BussCurrBalanceState;
export declare const fetchBussCurrBalances: import("@reduxjs/toolkit").AsyncThunk<BussCurrBalanceData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createBussCurrBalance: import("@reduxjs/toolkit").AsyncThunk<BussCurrBalanceData, BussCurrBalanceData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBussCurrBalanceById: import("@reduxjs/toolkit").AsyncThunk<BussCurrBalanceData, {
    buss_no: string;
    fiscalyear: string;
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
export declare const updateBussCurrBalance: import("@reduxjs/toolkit").AsyncThunk<BussCurrBalanceData, {
    buss_no: string;
    fiscalyear: string;
    data: BussCurrBalanceData;
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
export declare const deleteBussCurrBalance: import("@reduxjs/toolkit").AsyncThunk<BussCurrBalanceData, {
    buss_no: string;
    fiscalyear: string;
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
declare const _default: import("redux").Reducer<BussCurrBalanceState>;
export default _default;
