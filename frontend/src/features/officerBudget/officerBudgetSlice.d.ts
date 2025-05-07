export interface OfficerBudget {
    officer_no: string;
    officer_name: string;
    fiscal_year: number;
    annual_budget: number;
    monthly_budget: number;
    January_budget: number;
    January_Actual: number;
    February_budget: number;
    February_Actual: number;
    March_budget: number;
    March_Actual: number;
    April_budget: number;
    April_Actual: number;
    May_budget: number;
    May_Actual: number;
    June_budget: number;
    June_Actual: number;
    July_budget: number;
    July_Actual: number;
    August_budget: number;
    August_Actual: number;
    September_budget: number;
    September_Actual: number;
    October_budget: number;
    October_Actual: number;
    November_budget: number;
    November_Actual: number;
    December_budget: number;
    December_Actual: number;
    Actual_total: number;
    outstanding: number;
 }

export interface OfficerBudgetState {
    data: OfficerBudget[] | null;
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
    exists: boolean;
    data: OfficerBudget[];
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
export declare const fetchOfficerBudgetAll: import("@reduxjs/toolkit").AsyncThunk<OfficerBudget, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const addBudget: import("@reduxjs/toolkit").AsyncThunk<OfficerBudget, AddBudgetPayload, {
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
