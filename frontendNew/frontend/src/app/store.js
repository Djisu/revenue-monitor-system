// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
//import thunk from 'redux-thunk';
//import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import businessReducer from '../features/business/businessSlice';
import businessTypeReducer from '../features/businessType/businessTypeSlice';
import accReceiptReducer from '../features/accReceipt/accReceiptSlice';
import budgetAssessReducer from '../features/budgetAssess/budgetAssessSlice';
import bussCurrBalanceReducer from '../features/bussCurrBalance/bussCurrBalanceSlice';
import electoralAreaReducer from '../features/electoralArea/electoralAreaSlice';
import gradeFeesReducer from '../features/gradeFees/gradeFeesSlice';
import gradeRateReducer from '../features/gradeRate/gradeRateSlice';
import offBudgetAssessmentReducer from '../features/offBudgetAssessment/offBudgetAssessmentSlice';
import officerAssessmentReducer from '../features/officerAssessment/officerAssessmentSlice';
import officerBudgetWeeklyReducer from '../features/officerBudgetWeekly/officerBudgetWeeklySlice';
import officerReducer from '../features/officer/officerSlice';
import operatorDefinitionReducer from '../features/operatorDefinition/operatorDefinitionSlice';
import operatorPermissionReducer from '../features/operatorPermission/operatorPermissionSlice';
import paymentReportReducer from '../features/paymentReport/paymentReportSlice';
import propertyBalanceReducer from '../features/propertyBalance/propertyBalanceSlice';
import propertyClassReducer from '../features/propertyClass/propertyClassSlice';
import propertyCollectorElectoralarealReducer from '../features/propertyCollectorElectoralArea/propertyCollectorElectoralAreaSlice';
import propertyOfficerAssessmentReducer from '../features/propertyOfficerAssessment/propertyOfficerAssessmentSlice';
import propertyOfficerBudgetReducer from '../features/propertyOfficerBudget/propertyOfficerBudgetSlice';
import propertyOfficerReducer from '../features/propertyOfficer/propertyOfficerSlice';
import propertyRateReducer from '../features/propertyRate/propertyRateSlice';
import propertyTypeReducer from '../features/propertyType/propertyTypeSlice';
import propertyUseReducer from '../features/propertyUse/propertyUseSlice';
import receiptReducer from '../features/receipt/receiptSlice';
import transSavingsReducer from '../features/transSavings/transSavingsSlice';
import photosReducer from '../features/photos/photosSlice';
var store = configureStore({
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
        officerBudgetWeekly: officerBudgetWeeklyReducer,
        officer: officerReducer,
        operatorDefinition: operatorDefinitionReducer,
        operatorPermission: operatorPermissionReducer,
        paymentReport: paymentReportReducer,
        propertyBalance: propertyBalanceReducer,
        propertyClass: propertyClassReducer,
        propertyCollectorElectoralarea: propertyCollectorElectoralarealReducer,
        propertyOfficerAssessment: propertyOfficerAssessmentReducer,
        propertyOfficerBudget: propertyOfficerBudgetReducer,
        propertyOfficer: propertyOfficerReducer,
        propertyRate: propertyRateReducer,
        propertyType: propertyTypeReducer,
        propertyUse: propertyUseReducer,
        receipt: receiptReducer,
        transSavings: transSavingsReducer,
        photos: photosReducer,
    },
});
// Create typed hooks
export var useAppDispatch = function () { return useDispatch(); };
export var useAppSelector = useSelector;
export default store;
