export interface PropertyOfficerBudgetData {
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
    electoral_area: string;
}
export interface PropertyOfficerBudgetState {
    records: PropertyOfficerBudgetData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: PropertyOfficerBudgetState;
export declare const fetchPropertyOfficerBudgets: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchPropertyOfficerBudgetById: import("@reduxjs/toolkit").AsyncThunk<any, {
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
export declare const createPropertyOfficerBudget: import("@reduxjs/toolkit").AsyncThunk<any, PropertyOfficerBudgetData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updatePropertyOfficerBudget: import("@reduxjs/toolkit").AsyncThunk<any, {
    officer_no: string;
    fiscal_year: number;
    propertyOfficerBudgetData: PropertyOfficerBudgetData;
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
export declare const deletePropertyOfficerBudget: import("@reduxjs/toolkit").AsyncThunk<any, {
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
declare const _default: import("redux").Reducer<PropertyOfficerBudgetState>;
export default _default;
