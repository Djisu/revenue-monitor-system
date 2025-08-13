// export interface PropertyOfficerAssessmentData {
//     officer_no: string;
//     officer_name: string;
//     Noofclientsserved: number;
//     valueofbillsdistributed: number;
//     bus_year: number;
//     JanuaryAmount: number;
//     FebruaryAmount: number;
//     MarchAmount: number;
//     AprilAmount: number;
//     MayAmount: number;
//     JuneAmount: number;
//     JulyAmount: number;
//     AugustAmount: number;
//     SeptemberAmount: number;
//     OctoberAmount: number;
//     NovemberAmount: number;
//     DecemberAmount: number;
//     totalReceiptTodate: number;
//     balance: number;
//     remarks: string;
// }
// export interface PropertyOfficerAssessmentState {
//     records: PropertyOfficerAssessmentData[];
//     loading: boolean;
//     error: string | null;
// }
// export declare const initialState: PropertyOfficerAssessmentState;
// export declare const fetchPropertyOfficerAssessments: import("@reduxjs/toolkit").AsyncThunk<any, void, {
//     state?: unknown;
//     dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
//     extra?: unknown;
//     rejectValue?: unknown;
//     serializedErrorType?: unknown;
//     pendingMeta?: unknown;
//     fulfilledMeta?: unknown;
//     rejectedMeta?: unknown;
// }>;
// export declare const fetchPropertyOfficerAssessmentById: import("@reduxjs/toolkit").AsyncThunk<any, {
//     officer_no: string;
//     bus_year: number;
// }, {
//     state?: unknown;
//     dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
//     extra?: unknown;
//     rejectValue?: unknown;
//     serializedErrorType?: unknown;
//     pendingMeta?: unknown;
//     fulfilledMeta?: unknown;
//     rejectedMeta?: unknown;
// }>;
// export declare const createPropertyOfficerAssessment: import("@reduxjs/toolkit").AsyncThunk<any, PropertyOfficerAssessmentData, {
//     state?: unknown;
//     dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
//     extra?: unknown;
//     rejectValue?: unknown;
//     serializedErrorType?: unknown;
//     pendingMeta?: unknown;
//     fulfilledMeta?: unknown;
//     rejectedMeta?: unknown;
// }>;
// export declare const updatePropertyOfficerAssessment: import("@reduxjs/toolkit").AsyncThunk<any, {
//     officer_no: string;
//     bus_year: number;
//     propertyOfficerAssessmentData: PropertyOfficerAssessmentData;
// }, {
//     state?: unknown;
//     dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
//     extra?: unknown;
//     rejectValue?: unknown;
//     serializedErrorType?: unknown;
//     pendingMeta?: unknown;
//     fulfilledMeta?: unknown;
//     rejectedMeta?: unknown;
// }>;
// export declare const deletePropertyOfficerAssessment: import("@reduxjs/toolkit").AsyncThunk<any, {
//     officer_no: string;
//     bus_year: number;
// }, {
//     state?: unknown;
//     dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
//     extra?: unknown;
//     rejectValue?: unknown;
//     serializedErrorType?: unknown;
//     pendingMeta?: unknown;
//     fulfilledMeta?: unknown;
//     rejectedMeta?: unknown;
// }>;
// declare const _default: import("redux").Reducer<PropertyOfficerAssessmentState>;
// export default _default;
