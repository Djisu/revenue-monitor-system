export interface BudgetAssessData {
    month: string;
    budget: number;
    amount: number;
    variance: number;
    fiscalyear: string;
    assessmentby: string;
}
export interface BudgetAssessState {
    budgetAssessRecords: BudgetAssessData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: BudgetAssessState;
export declare const fetchBudgetAssessRecords: import("@reduxjs/toolkit").AsyncThunk<BudgetAssessData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createBudgetAssessRecord: import("@reduxjs/toolkit").AsyncThunk<BudgetAssessData, BudgetAssessData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBudgetAssessRecordById: import("@reduxjs/toolkit").AsyncThunk<BudgetAssessData, {
    month: string;
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
export declare const updateBudgetAssessRecord: import("@reduxjs/toolkit").AsyncThunk<BudgetAssessData, {
    month: string;
    fiscalyear: string;
    data: BudgetAssessData;
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
export declare const deleteBudgetAssessRecord: import("@reduxjs/toolkit").AsyncThunk<BudgetAssessData, {
    month: string;
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
declare const _default: import("redux").Reducer<BudgetAssessState>;
export default _default;
