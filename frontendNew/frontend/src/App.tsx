// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your form components
//import MainMenu from './components/layout/MainMenu';
import FrmLogin from './features/auth/FrmLogin';
import {FrmBusiness} from './features/business/FrmBusiness'
import FrmUpdateClient from './features/business/FrmUpdateClient';
import FrmElectoralArea from './features/electoralArea/FrmElectoralArea';
import FrmGradeRate from './features/gradeRate/FrmGradeRate';
import FrmGradeFees from './features/gradeFees/FrmGradeFees';
import FrmEmployee from './features/officer/FrmEmployee';
import FrmBusinessReferences from './features/business/FrmBusinessReferences'

import FrmCollectorElectoralarea from './features/collectorElectoralarea/frmCollectorElectoralarea';

import FrmOperatorDef from './features/operatorDefinition/FrmOperatorDef';
import FrmOperatorPermissions from './features/operatorPermission/FrmOperatorPermissions';
import FrmBusinessType from './features/businessType/FrmBusinessType';
import FrmChangeBussType from './features/businessType/FrmChangeBussType'
//import FrmOfficerBudget from './features/officerBudget/FrmOfficerBudget';
import FrmOfficerBudget from './features/officerBudget/FrmOfficerBudget';
import FrmClientPayments from './features/busPayments/FrmClientPayments';
import FrmClientBalances from './features/busPayments/FrmClientBalances';
import {FrmReceipts} from './features/accReceipt/FrmReceipts';
import {FrmBillClient} from './features/business/FrmBillClient';
import FrmChangeRevRate from './features/gradeRate/FrmChangeRevRate';
import FrmChangePrevBillAmount from './features/busPayments/FrmChangePrevBillAmount'; 
import FrmBussOpeNos from './features/busPayments/FrmBussOpeNos';
import FrmBusinessOperatingPermit from './features/busPayments/FrmBusinessOperationPermit';
import FrmSavingsStatementX from './features/busPayments/FrmSavingsStatementX';
import FrmDefaulterPrepayment from './features/busPayments/FrmDefaulterPrepayment';
import FrmDailyPayments from './features/busPayments/FrmDailyPayments';
import FrmOfficerAssessment from './features/officerAssessment/FrmOfficerAssessment';
import FrmMidlevelDetailedReport from './features/busTypeDetailedReport/FrmMidlevelDetailedReport';
import FrmManagementSummariseReport from './features/managementSummariseReport.ts/FrmManagementSummariseReport';
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
//import OfficerAssessmentBarChart from './charts/OfficerAssessmentBarChart';




//import AuditTrail from './features/AuditTrail';

const App: React.FC = () => {
    let [isMainMenuVisible, setMainMenuVisible] = useState(true);

    const handleSubmenuClick = () => {
        isMainMenuVisible = true
        setMainMenuVisible(isMainMenuVisible); // Show the main menu when a submenu item is clicked
        console.log('Submenu clicked!');
    };

    return (
        <AuthProvider>
            <Router>
                
                <Routes>
                    <Route path="/" element={<FrmLogin />} />  
                    {/* Define the /main route */}
                    <Route path="/main" element={<MainMenuWrapper handleSubmenuClick={handleSubmenuClick} checkAccess={checkAccess} />} />                   
                    <Route path="/SetupBusiness" element={<ProtectedRoute element={<FrmBusiness />} />} />
                    <Route path="/UpdateBusinessClient" element={<ProtectedRoute element={<FrmUpdateClient />} />} />
                    <Route path="/SetupElectoralArea" element={<ProtectedRoute element={<FrmElectoralArea />} />} />
                    <Route path="/SetupGradeRates" element={<ProtectedRoute element={<FrmGradeRate />} />} />
                    <Route path="/SetupGradeFees" element={<ProtectedRoute element={<FrmGradeFees />} />} />
                    <Route path="/SetupOfficer" element={<ProtectedRoute element={<FrmEmployee />} />} />
                    <Route path="/AssignCollectorToElectoralArea" element={<ProtectedRoute element={<FrmCollectorElectoralarea />} />} />
                    <Route path="/OperatorDefinition" element={<ProtectedRoute element={<FrmOperatorDef />} />} />
                    <Route path="/OperatorPermission" element={<ProtectedRoute element={<FrmOperatorPermissions />} />} />
                    <Route path="/SetupBusinessType" element={<ProtectedRoute element={<FrmBusinessType />} />} />
                    <Route path="/ChangeBusinessType" element={<ProtectedRoute element={<FrmChangeBussType />} />} />
                    <Route path="/OfficerBudget" element={<ProtectedRoute element={<FrmOfficerBudget />} />} />
                    <Route path="/CollectorPayment" element={<ProtectedRoute element={<FrmClientPayments />} />} />
                    <Route path="/ProcessClientNewBalances" element={<ProtectedRoute element={<FrmClientBalances />} />} />
                    <Route path="/EnterReceiptNumbers" element={<ProtectedRoute element={<FrmReceipts />} />} />
                    <Route path="/BillClient" element={<ProtectedRoute element={<FrmBillClient />} />} />
                    <Route path="/ChangeLastYearRate" element={<ProtectedRoute element={<FrmChangeRevRate />} />} />
                    <Route path="/ChangePrevBillAmount" element={<ProtectedRoute element={<FrmChangePrevBillAmount />} />} />
                    <Route path="/BusinessOperatingPermitBusinessNumbers" element={<ProtectedRoute element={<FrmBussOpeNos />} />} />
                    <Route path="/BusinessOperatingPermit" element={<ProtectedRoute element={<FrmBusinessOperatingPermit />} />} />
                    <Route path="/RevenueMobilisationRegister" element={<ProtectedRoute element={<FrmSavingsStatementX />} />} />
                    <Route path="/ListOfPaymentDefaulters" element={<ProtectedRoute element={<FrmDefaulterPrepayment />} />} />
                    <Route path="/DailyPayments" element={<ProtectedRoute element={<FrmDailyPayments />} />} />
                    <Route path="/MonitoringAndEvaluationReport" element={<ProtectedRoute element={<FrmOfficerAssessment />} />} />
                    <Route path="/MiddleLevelManagementReport" element={<ProtectedRoute element={<FrmMidlevelDetailedReport />} />} />
                    <Route path="/ExecutiveSummaryReport" element={<ProtectedRoute element={<FrmManagementSummariseReport />} />} />
                    <Route path="/ProduceVarianceAnalysisReport" element={<ProtectedRoute element={<FrmVariance />} />} />
                    <Route path="/CollectorPerformanceGraph" element={<ProtectedRoute element={<FrmOfficerBudgetAssessment />} />} />
                    <Route path="/OneMonthPerformanceGraph" element={<ProtectedRoute element={<FrmMonthlyPerformance />} />} />
                    <Route path="/OneMonthPerformanceGraphPercentage" element={<ProtectedRoute element={<FrmMonthlyPercent />} />} />
                    <Route path="/CompareTwoYearsPaymentPeriods" element={<ProtectedRoute element={<FrmCompareTwoYears />} />} />
                    <Route path="/BusinessTypesReport" element={<ProtectedRoute element={<FrmBusinessTypesReport />} />} />
                   
                    <Route path="/CollectorsBusinessesReport" element={<ProtectedRoute element={<FrmCollectorsBusinessesReport />} />} />
                
{/*                     
                    <Route 
                        path="/OfficerAssessmentBarChart" 
                        element={<OfficerAssessmentBarChart data={chartData} />} 
                    />
                    */}
                    {/* Routes for property forms */}
                    <Route path="/PropertyClass" element={<ProtectedRoute element={<FrmPropertyClass />} />} />
                    <Route path="/PropertyUse" element={<ProtectedRoute element={<FrmPropertyUse />} />} />
                    <Route path="/PropertyType" element={<ProtectedRoute element={<FrmPropertyType />} />} />
                    <Route path="/PropertyEmployee" element={<ProtectedRoute element={<FrmPropertyEmployee />} />} />
                    <Route path="/PropertyCollectorElectoralArea" element={<ProtectedRoute element={<FrmPropertyCollectorElectoralArea />} />} />
                    <Route path="/Property" element={<ProtectedRoute element={<FrmProperty />} />} />
                    <Route path="/PropertyOfficerBudget" element={<ProtectedRoute element={<FrmPropertyOfficerBudget />} />} />
                    <Route path="/ProducePropertyRates" element={<ProtectedRoute element={<FrmProducePropertyRates />} />} />
                    <Route path="/PropertyUpdate" element={<ProtectedRoute element={<FrmPropertyUpdate />} />} />
                    <Route path="/PropertyRate" element={<ProtectedRoute element={<FrmPropertyRate />} />} />
                    <Route path="/PropertyBillPayments" element={<ProtectedRoute element={<FrmPropertyBillPayments />} />} />
                    <Route path="/PropertySavingsStatementX" element={<ProtectedRoute element={<FrmPropertySavingsStatementX />} />} />
                    <Route path="/DailyPropertyPayments" element={<ProtectedRoute element={<FrmDailyPropertyPayments />} />} />
                    <Route path="/ListOfBusinesses" element={<ProtectedRoute element={<FrmBusinessReferences />} />} />
                    <Route path="*" element={<NotFound />} />

                    {/* <Route path="/AuditTrail" element={<AuditTrail />} /> FrmBusinessReferences*/} 
                    {/* Add other routes for forms */}  OfficerAssessmentBarChart
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
