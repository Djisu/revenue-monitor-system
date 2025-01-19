import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
// Import your form components
//import MainMenu from './components/layout/MainMenu';
import FrmLogin from './features/auth/FrmLogin';
import { FrmBusiness } from './features/business/FrmBusiness';
import FrmUpdateClient from './features/business/FrmUpdateClient';
import FrmElectoralArea from './features/electoralArea/FrmElectoralArea';
import FrmGradeRate from './features/gradeRate/FrmGradeRate';
import FrmGradeFees from './features/gradeFees/FrmGradeFees';
import FrmEmployee from './features/officer/FrmEmployee';
import FrmCollectorElectoralArea from './features/officer/FrmCollectorElectoralArea';
import FrmOperatorDef from './features/operatorDefinition/FrmOperatorDef';
import FrmOperatorPermissions from './features/operatorPermission/FrmOperatorPermissions';
import FrmBusinessType from './features/businessType/FrmBusinessType';
import FrmChangeBussType from './features/businessType/FrmChangeBussType';
import FrmOfficerBudget from './features/officerAssessment/FrmOfficerBudget';
import FrmClientPayments from './features/busPayments/FrmClientPayments';
import FrmClientBalances from './features/busPayments/FrmClientBalances';
import { FrmReceipts } from './features/accReceipt/FrmReceipts';
import { FrmBillClient } from './features/business/FrmBillClient';
import FrmChangeRevRate from './features/gradeRate/FrmChangeRevRate';
import FrmChangePrevBillAmount from './features/busPayments/FrmChangePrevBillAmount';
import FrmBussOpeNos from './features/busPayments/FrmBussOpeNos';
import FrmBusinessOperatingPermit from './features/busPayments/FrmBusinessOperationPermit';
import FrmSavingsStatementX from './features/busPayments/FrmSavingsStatementX';
import FrmDefaulterPrepayment from './features/busPayments/FrmDefaulterPrepayment';
import FrmDailyPayments from './features/busPayments/FrmDailyPayments';
import FrmOfficerAssessment from './features/officerAssessment/FrmOfficerAssessment';
import FrmMidlevelDetailedReport from './features/busPayments/FrmMidlevelDetailedReport';
import FrmManagementSummariseReport from './features/paymentReport/FrmManagementSummariseReport';
import FrmVariance from './features/busPayments/FrmVariance';
import FrmOfficerBudgetAssessment from './features/officerAssessment/FrmOfficerBudgetAssessment';
import FrmMonthlyPerformance from './features/offBudgetAssessment/FrmMonthlyPerformance';
import FrmMonthlyPercent from './features/offBudgetAssessment/FrmMonthlyPercent';
import FrmCompareTwoYears from './features/busPayments/FrmCompareTwoYears';
import FrmBusinessTypesReport from './features/businessType/FrmBusinessTypesReport';
import FrmCollectorsBusinessesReport from './features/officer/FrmCollectorsBusinessesReport';
import FrmPropertyClass from './features/propertyClass/FrmPropertyClass';
import FrmPropertyUse from './features/propertyUse/FrmPropertyUse';
import FrmPropertyType from './features/propertyType/FrmPropertyType';
import FrmPropertyEmployee from './features/propertyOfficer/FrmPropertyEmployee';
import FrmPropertyCollectorElectoralArea from './features/propertyCollectorElectoralArea/FrmPropertyCollectorElectoralArea';
import FrmProperty from './features/property/FrmProperty';
import FrmPropertyOfficerBudget from './features/propertyOfficerBudget/FrmPropertyOfficerBudget';
import FrmProducePropertyRates from './features/propertyRate/FrmProducePropertyRates';
import FrmPropertyUpdate from './features/property/FrmPropertyUpdate';
import FrmPropertyRate from './features/propertyRate/FrmPropertyRate';
import FrmPropertyBillPayments from './features/propertyBalance/FrmPropertyBillPayments';
import FrmDailyPropertyPayments from './features/propertyBalance/FrmDailyPropertyPayments';
import FrmPropertySavingsStatementX from './features/propertyBalance/FrmPropertySavingsStatementX';
import checkAccess from './utilities/checkAccess';
import NotFound from './components/layout/NotFound';
import MainMenuWrapper from './components/MainMenuWrapper';
//import AuditTrail from './features/AuditTrail';
var App = function () {
    var _a = useState(true), isMainMenuVisible = _a[0], setMainMenuVisible = _a[1];
    var handleSubmenuClick = function () {
        isMainMenuVisible = true;
        setMainMenuVisible(isMainMenuVisible); // Show the main menu when a submenu item is clicked
        console.log('Submenu clicked!');
    };
    // const checkAccess = () => {
    //     // Your access check logic here
    //     return true; // or false based on the check
    // };
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(FrmLogin, {}) }), _jsx(Route, { path: "/main", element: _jsx(MainMenuWrapper, { handleSubmenuClick: handleSubmenuClick, checkAccess: checkAccess }) }), _jsx(Route, { path: "/SetupBusiness", element: _jsx(ProtectedRoute, { element: _jsx(FrmBusiness, {}) }) }), _jsx(Route, { path: "/UpdateBusinessClient", element: _jsx(ProtectedRoute, { element: _jsx(FrmUpdateClient, {}) }) }), _jsx(Route, { path: "/SetupElectoralArea", element: _jsx(ProtectedRoute, { element: _jsx(FrmElectoralArea, {}) }) }), _jsx(Route, { path: "/SetupGradeRates", element: _jsx(ProtectedRoute, { element: _jsx(FrmGradeRate, {}) }) }), _jsx(Route, { path: "/SetupGradeFees", element: _jsx(ProtectedRoute, { element: _jsx(FrmGradeFees, {}) }) }), _jsx(Route, { path: "/SetupOfficer", element: _jsx(ProtectedRoute, { element: _jsx(FrmEmployee, {}) }) }), _jsx(Route, { path: "/AssignCollectorToElectoralArea", element: _jsx(ProtectedRoute, { element: _jsx(FrmCollectorElectoralArea, {}) }) }), _jsx(Route, { path: "/OperatorDefinition", element: _jsx(ProtectedRoute, { element: _jsx(FrmOperatorDef, {}) }) }), _jsx(Route, { path: "/OperatorPermission", element: _jsx(ProtectedRoute, { element: _jsx(FrmOperatorPermissions, {}) }) }), _jsx(Route, { path: "/SetupBusinessType", element: _jsx(ProtectedRoute, { element: _jsx(FrmBusinessType, {}) }) }), _jsx(Route, { path: "/ChangeBusinessType", element: _jsx(ProtectedRoute, { element: _jsx(FrmChangeBussType, {}) }) }), _jsx(Route, { path: "/OfficerBudget", element: _jsx(ProtectedRoute, { element: _jsx(FrmOfficerBudget, {}) }) }), _jsx(Route, { path: "/CollectorPayment", element: _jsx(ProtectedRoute, { element: _jsx(FrmClientPayments, {}) }) }), _jsx(Route, { path: "/ProcessClientNewBalances", element: _jsx(ProtectedRoute, { element: _jsx(FrmClientBalances, {}) }) }), _jsx(Route, { path: "/EnterReceiptNumbers", element: _jsx(ProtectedRoute, { element: _jsx(FrmReceipts, {}) }) }), _jsx(Route, { path: "/BillClient", element: _jsx(ProtectedRoute, { element: _jsx(FrmBillClient, {}) }) }), _jsx(Route, { path: "/ChangeLastYearRate", element: _jsx(ProtectedRoute, { element: _jsx(FrmChangeRevRate, {}) }) }), _jsx(Route, { path: "/ChangePrevBillAmount", element: _jsx(ProtectedRoute, { element: _jsx(FrmChangePrevBillAmount, {}) }) }), _jsx(Route, { path: "/BusinessOperatingPermitBusinessNumbers", element: _jsx(ProtectedRoute, { element: _jsx(FrmBussOpeNos, {}) }) }), _jsx(Route, { path: "/BusinessOperatingPermit", element: _jsx(ProtectedRoute, { element: _jsx(FrmBusinessOperatingPermit, {}) }) }), _jsx(Route, { path: "/RevenueMobilisationRegister", element: _jsx(ProtectedRoute, { element: _jsx(FrmSavingsStatementX, {}) }) }), _jsx(Route, { path: "/ListOfPaymentDefaulters", element: _jsx(ProtectedRoute, { element: _jsx(FrmDefaulterPrepayment, {}) }) }), _jsx(Route, { path: "/DailyPayments", element: _jsx(ProtectedRoute, { element: _jsx(FrmDailyPayments, {}) }) }), _jsx(Route, { path: "/MonitoringAndEvaluationReport", element: _jsx(ProtectedRoute, { element: _jsx(FrmOfficerAssessment, {}) }) }), _jsx(Route, { path: "/MiddleLevelManagementReport", element: _jsx(ProtectedRoute, { element: _jsx(FrmMidlevelDetailedReport, {}) }) }), _jsx(Route, { path: "/ExecutiveSummaryReport", element: _jsx(ProtectedRoute, { element: _jsx(FrmManagementSummariseReport, {}) }) }), _jsx(Route, { path: "/ProduceVarianceAnalysisReport", element: _jsx(ProtectedRoute, { element: _jsx(FrmVariance, {}) }) }), _jsx(Route, { path: "/CollectorPerformanceGraph", element: _jsx(ProtectedRoute, { element: _jsx(FrmOfficerBudgetAssessment, {}) }) }), _jsx(Route, { path: "/OneMonthPerformanceGraph", element: _jsx(ProtectedRoute, { element: _jsx(FrmMonthlyPerformance, {}) }) }), _jsx(Route, { path: "/OneMonthPerformanceGraphPercentage", element: _jsx(ProtectedRoute, { element: _jsx(FrmMonthlyPercent, {}) }) }), _jsx(Route, { path: "/CompareTwoYearsPaymentPeriods", element: _jsx(ProtectedRoute, { element: _jsx(FrmCompareTwoYears, {}) }) }), _jsx(Route, { path: "/BusinessTypesReport", element: _jsx(ProtectedRoute, { element: _jsx(FrmBusinessTypesReport, {}) }) }), _jsx(Route, { path: "/CollectorsBusinessesReport", element: _jsx(ProtectedRoute, { element: _jsx(FrmCollectorsBusinessesReport, {}) }) }), _jsx(Route, { path: "/PropertyClass", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyClass, {}) }) }), _jsx(Route, { path: "/PropertyUse", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyUse, {}) }) }), _jsx(Route, { path: "/PropertyType", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyType, {}) }) }), _jsx(Route, { path: "/PropertyEmployee", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyEmployee, {}) }) }), _jsx(Route, { path: "/PropertyCollectorElectoralArea", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyCollectorElectoralArea, {}) }) }), _jsx(Route, { path: "/Property", element: _jsx(ProtectedRoute, { element: _jsx(FrmProperty, {}) }) }), _jsx(Route, { path: "/PropertyOfficerBudget", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyOfficerBudget, {}) }) }), _jsx(Route, { path: "/ProducePropertyRates", element: _jsx(ProtectedRoute, { element: _jsx(FrmProducePropertyRates, {}) }) }), _jsx(Route, { path: "/PropertyUpdate", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyUpdate, {}) }) }), _jsx(Route, { path: "/PropertyRate", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyRate, {}) }) }), _jsx(Route, { path: "/PropertyBillPayments", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertyBillPayments, {}) }) }), _jsx(Route, { path: "/PropertySavingsStatementX", element: _jsx(ProtectedRoute, { element: _jsx(FrmPropertySavingsStatementX, {}) }) }), _jsx(Route, { path: "/DailyPropertyPayments", element: _jsx(ProtectedRoute, { element: _jsx(FrmDailyPropertyPayments, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }));
};
export default App;
