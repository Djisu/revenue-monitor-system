import { AxiosResponse } from 'axios';
export interface OperatorData {
    operatorid: string;
    operatorname: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
}
export interface OperatorState {
    operators: OperatorData[];
    loading: boolean;
    error: string | null;
}
export interface ApiResponse {
    message: string;
}
export declare const initialState: OperatorState;
export declare const fetchOperators: import("@reduxjs/toolkit").AsyncThunk<OperatorData[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchOperatorById: import("@reduxjs/toolkit").AsyncThunk<OperatorData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createOperator: import("@reduxjs/toolkit").AsyncThunk<string, OperatorData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateOperator: import("@reduxjs/toolkit").AsyncThunk<AxiosResponse<OperatorData, OperatorData>, {
    OperatorID: string;
    operatorData: OperatorData;
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
export declare const deleteOperator: import("@reduxjs/toolkit").AsyncThunk<AxiosResponse<OperatorData, OperatorData>, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<OperatorState>;
export default _default;
