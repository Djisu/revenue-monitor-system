import { OperatorPermissionData } from './OperatorPermissionData';
export interface OperatorPermissionState {
    operatorPermissions: OperatorPermissionData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: OperatorPermissionState;
export declare const fetchOperatorPermissionsThunk: import("@reduxjs/toolkit").AsyncThunk<OperatorPermissionData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchOperatorPermissionById: import("@reduxjs/toolkit").AsyncThunk<OperatorPermissionData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createOperatorPermission: import("@reduxjs/toolkit").AsyncThunk<OperatorPermissionData, OperatorPermissionData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateOperatorPermission: import("@reduxjs/toolkit").AsyncThunk<OperatorPermissionData, {
    OperatorID: string;
    operatorPermissionData: OperatorPermissionData;
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
export declare const deleteOperatorPermission: import("@reduxjs/toolkit").AsyncThunk<OperatorPermissionData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<OperatorPermissionState>;
export default _default;
