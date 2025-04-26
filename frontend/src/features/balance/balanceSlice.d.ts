export interface Balance {
    buss_no: number;
    buss_name: string;
    billamount: number;
    paidamount: number;
    balance: number;
    electroral_area: string;
    street_name: string;
}
export interface BalanceState {
    balances: Balance[];
    loading: boolean;
    error: string | null;
    data: Balance[] | null;
}
export declare const initialState: BalanceState;
export declare const fetchBalances: import("@reduxjs/toolkit").AsyncThunk<Balance[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const addBalance: import("@reduxjs/toolkit").ActionCreatorWithPayload<Balance, "balance/addBalance">, updateBalance: import("@reduxjs/toolkit").ActionCreatorWithPayload<Balance, "balance/updateBalance">, removeBalance: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "balance/removeBalance">;
declare const _default: import("redux").Reducer<BalanceState>;
export default _default;
