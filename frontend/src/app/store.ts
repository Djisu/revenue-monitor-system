// src/app/store.ts
import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
//import thunk from 'redux-thunk';
//import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import businessReducer from '../features/business/businessSlice';
import businessTypeReducer from '../features/businessType/businessTypeSlice';
import accReceiptReducer from '../features/accReceipt/accReceiptSlice';
import  budgetAssessReducer from '../features/budgetAssess/budgetAssessSlice';
import  bussCurrBalanceReducer from '../features/bussCurrBalance/bussCurrBalanceSlice';
import  electoralAreaReducer from '../features/electoralArea/electoralAreaSlice';
import  gradeFeesReducer from '../features/gradeFees/gradeFeesSlice';
import  gradeRateReducer from '../features/gradeRate/gradeRateSlice';
import  offBudgetAssessmentReducer from '../features/offBudgetAssessment/offBudgetAssessmentSlice';
import  officerAssessmentReducer from '../features/officerAssessment/officerAssessmentSlice';
//import  officerBudgetWeeklyReducer from '../features/officerBudgetWeekly/officerBudgetWeeklySlice';
import  officerReducer from '../features/officer/officerSlice';
import  operatorDefinitionReducer from '../features/operatorDefinition/operatorDefinitionSlice';
import  operatorPermissionReducer from '../features/operatorPermission/operatorPermissionSlice';
import  paymentReportReducer from '../features/paymentReport/paymentReportSlice';
//import  propertyBalanceReducer from '../features/propertyBalance/propertyBalanceSlice';
import  propertyClassReducer from '../features/propertyClass/propertyClassSlice';
// import  propertyCollectorElectoralarealReducer from '../features/propertyCollectorElectoralArea/propertyCollectorElectoralAreaSlice';
// import  propertyOfficerAssessmentReducer from '../features/propertyOfficerAssessment/propertyOfficerAssessmentSlice';
// import  propertyOfficerBudgetReducer from '../features/propertyOfficerBudget/propertyOfficerBudgetSlice';
// import  propertyOfficerReducer from '../features/propertyOfficer/propertyOfficerSlice';
import  propertyRateReducer from '../features/propertyRate/propertyRateSlice';
// import  propertyTypeReducer from '../features/propertyType/propertyTypeSlice';
// import  propertyUseReducer from '../features/propertyUse/propertyUseSlice';
import  receiptReducer from '../features/receipt/receiptSlice';
import  transSavingsReducer from '../features/transSavings/transSavingsSlice';
import photosReducer from '../features/photos/photosSlice'; 
import busPaymentsReducer from '../features/busPayments/busPaymentsSlice'

import officerBudgetReducer from '../features/officerBudget/officerBudgetSlice';

import { collectorElectoralAreaReducer } from '../features/collectorElectoralarea/collectorElectoralAreaSlice';
import balanceReducer from '../features/balance/balanceSlice';
import busTypedetailedReportReducer from '../features/busTypeDetailedReport/busTypeDetailedReportSlice'
import reportsReducer from '../features/managementSummariseReport.ts/BusTypeSummaryReportSlice';


const store = configureStore({
    reducer: {       
        accReceipt: accReceiptReducer,
        auth: authReducer,       
        business: businessReducer,
        businessType: businessTypeReducer,       
        budgetAssess: budgetAssessReducer,
        bussCurrBalance: bussCurrBalanceReducer,
        electoralArea: electoralAreaReducer,
        gradeFees: gradeFeesReducer,
        gradeRate: gradeRateReducer,
        offBudgetAssessment: offBudgetAssessmentReducer,
        officerAssessment: officerAssessmentReducer,
        //officerBudgetWeekly: officerBudgetWeeklyReducer,
        officer: officerReducer,
        operatorDefinition: operatorDefinitionReducer,
        operatorPermission: operatorPermissionReducer,
        paymentReport: paymentReportReducer,
        //propertyBalance: propertyBalanceReducer,
        propertyClass: propertyClassReducer,
        // propertyCollectorElectoralarea: propertyCollectorElectoralarealReducer,
        // propertyOfficerAssessment: propertyOfficerAssessmentReducer,
        // propertyOfficerBudget: propertyOfficerBudgetReducer,
        // propertyOfficer: propertyOfficerReducer,
         propertyRate: propertyRateReducer,
        // propertyType: propertyTypeReducer,
        // propertyUse: propertyUseReducer,
        receipt: receiptReducer,
        transSavings: transSavingsReducer,
        photos: photosReducer,
        busPayments: busPaymentsReducer,

        officerBudget: officerBudgetReducer,
        
        collectorElectoralArea: collectorElectoralAreaReducer,
        balance: balanceReducer,
        busTypedetailedReport: busTypedetailedReportReducer,
        reports: reportsReducer,
    },
});

// Infer the type of `store`
export type AppStore = typeof store;

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;

// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>;

// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

// Create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;