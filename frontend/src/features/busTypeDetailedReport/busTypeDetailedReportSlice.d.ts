export interface FetchReportsParams {
    zone: string;
    businessType: string;
    fiscalYear: string;
}
export interface BusTypeDetailedReport {
    electoral_area: string;
    buss_no: number;
    buss_name: string;
    buss_type: string;
    amountdue: number;
    amountpaid: number;
    balance: number;
    tot_grade: string;
}
export interface ReportsState {
    reports: BusTypeDetailedReport[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: ReportsState;
export declare const fetchReports: import("@reduxjs/toolkit").AsyncThunk<BusTypeDetailedReport, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createReport: import("@reduxjs/toolkit").AsyncThunk<BusTypeDetailedReport, BusTypeDetailedReport, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateReport: import("@reduxjs/toolkit").AsyncThunk<BusTypeDetailedReport, {
    buss_no: number;
    report: BusTypeDetailedReport;
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
export declare const deleteReport: import("@reduxjs/toolkit").AsyncThunk<number, number, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchReportsByCriteria: import("@reduxjs/toolkit").AsyncThunk<BusTypeDetailedReport, {
    zone: string;
    businessType: string;
    fiscalYear: string;
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
export declare const fetchAllRecords: import("@reduxjs/toolkit").AsyncThunk<BusTypeDetailedReport[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchDetailedReports: import("@reduxjs/toolkit").AsyncThunk<BusTypeDetailedReport[], FetchReportsParams, {
    rejectValue: string;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"reports/clearError">;
declare const _default: import("redux").Reducer<ReportsState>;
export default _default;
