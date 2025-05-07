export interface OffBudgetAssessmentData {
    officer_name: string;
    JanuaryAmount: number;
    JanuaryBudget: number;
    FebruaryAmount: number;
    FebruaryBudget: number;
    MarchAmount: number;
    MarchBudget: number;
    AprilAmount: number;
    AprilBudget: number;
    MayAmount: number;
    MayBudget: number;
    JuneAmount: number;
    JuneBudget: number;
    JulyAmount: number;
    JulyBudget: number;
    AugustAmount: number;
    AugustBudget: number;
    SeptemberAmount: number;
    SeptemberBudget: number;
    OctoberAmount: number;
    OctoberBudget: number;
    NovemberAmount: number;
    NovemberBudget: number;
    DecemberAmount: number;
    DecemberBudget: number;
}
export interface AmountByOfficerAndMonthResponse {
    totsum: number | null;
}
export interface OffBudgetAssessmentState {
    assessments: OffBudgetAssessmentData[];
    loading: boolean;
    error: string | null;
    amountByOfficerAndMonth: AmountByOfficerAndMonthResponse | null;
}
export declare const initialState: OffBudgetAssessmentState;
export declare const fetchOffBudgetAssessments: import("@reduxjs/toolkit").AsyncThunk<OffBudgetAssessmentData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createOffBudgetAssessment: import("@reduxjs/toolkit").AsyncThunk<OffBudgetAssessmentData, OffBudgetAssessmentData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchOffBudgetAssessmentByOfficer: import("@reduxjs/toolkit").AsyncThunk<OffBudgetAssessmentData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateOffBudgetAssessment: import("@reduxjs/toolkit").AsyncThunk<OffBudgetAssessmentData, {
    officer_name: string;
    data: OffBudgetAssessmentData;
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
export declare const deleteOffBudgetAssessment: import("@reduxjs/toolkit").AsyncThunk<OffBudgetAssessmentData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchAmountByOfficerAndMonth: import("@reduxjs/toolkit").AsyncThunk<{
    totsum: number | null;
}, {
    officerNo: string;
    fiscalYear: string;
    monthPaid: string;
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
export declare const fetchDataByOfficerAndFiscalYear: import("@reduxjs/toolkit").AsyncThunk<OffBudgetAssessmentData[], {
    officerNo: string;
    fiscalYear: number;
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
declare const _default: import("redux").Reducer<OffBudgetAssessmentState>;
export default _default;
