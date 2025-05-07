export interface OperatorDefinition {
    OperatorID: string;
    OperatorName: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    resetToken?: string;
    resetTokenExpiration?: Date;
}
export interface AuthState {
    user: {
        firstname: string;
        lastname: string;
    } | null;
    loading: boolean;
    error: string | null;
    message: string | null;
}
export declare const initialState: AuthState;
export interface LoginResponse {
    token: string;
    user: OperatorDefinition;
}
export interface LoginError {
    message: string;
}
export declare const loginUser: import("@reduxjs/toolkit").AsyncThunk<LoginResponse, {
    username: string;
    password: string;
}, {
    rejectValue: LoginError;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const requestPasswordReset: import("@reduxjs/toolkit").AsyncThunk<OperatorDefinition, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const resetPassword: import("@reduxjs/toolkit").AsyncThunk<OperatorDefinition, {
    token: string;
    newPassword: string;
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
export declare const logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/logout">;
declare const _default: import("redux").Reducer<AuthState>;
export default _default;
