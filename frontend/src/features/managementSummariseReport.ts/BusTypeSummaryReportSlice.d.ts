export interface BusTypeSummaryReport {
    buss_type: string;
    amountdue: number;
    amountpaid: number;
    balance: number;
    electoral_area: string;
}
export interface ReportsState {
    reports: BusTypeSummaryReport[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: ReportsState;
export declare const fetchBusTypeSummaryReports: import("@reduxjs/toolkit").AsyncThunk<any, {
    firstDate: string;
    lastDate: string;
    zone?: string;
    bussType?: string;
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
export declare const clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"reports/clearError">;
declare const _default: import("redux").Reducer<ReportsState>;
export default _default;
