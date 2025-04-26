export interface OfficerBudgetState {
    data: any[] | null;
    loading: boolean;
    error: string | null;
    exists: boolean;
}
export declare const initialState: OfficerBudgetState;
export interface AddBudgetPayload {
    officer_no: string;
    fiscal_year: number;
}
export declare const fetchOfficerBudget: import("@reduxjs/toolkit").AsyncThunk<{
    exists: any;
    data: any;
    status: number;
    statusText: string;
}, {
    officer_no: string;
    fiscal_year: number;
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
export declare const fetchOfficerBudgetAll: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const addBudget: import("@reduxjs/toolkit").AsyncThunk<any, AddBudgetPayload, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const resetError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"budget/resetError">, resetBudgetState: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"budget/resetBudgetState">;
declare const _default: import("redux").Reducer<OfficerBudgetState>;
export default _default;
