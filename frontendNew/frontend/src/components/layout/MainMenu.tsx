// src/components/MainMenu.tsx
import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface MainMenuProps {
   // username: string | undefined;
    checkAccess: (menuOption: string) => Promise<boolean>;
    handleSubmenuClick?: () => void; // Make it optional or required based on your needs
}

const MainMenu: React.FC<MainMenuProps> = ({  checkAccess  }) => {
    const navigate = useNavigate();

    const handleMenuClick = (menuOption: string, formName: string) => {
        const resp = checkAccess(menuOption);

        console.log('resp===', resp)

        //resp.then(isAllowed => {
            if (!resp) {
                alert('Access denied. Your Operator id has no access to this option');
                return;
            }

            console.log(`Menu option ${menuOption} clicked`);
            console.log(`Form name ${formName} selected`);

            // Navigate to the appropriate route
            navigate(`/${formName}`);
        //});
    };


    return (
        <Container fluid className="p-0">
            <Navbar bg="primary" variant="dark" expand="lg">
                <Navbar.Brand>Main Menu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto justify-content-center w-100">
                        <NavDropdown title="BOP Setup" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => handleMenuClick('ST', 'SetupBusiness')}>
                                ST_Setup Business Client
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('UC', 'UpdateBusinessClient')}>
                                UC_Update Business Client
                            </NavDropdown.Item>
                            {/*Hidden menu items are commented out for now */}
                            {/* <NavDropdown.Item onClick={() => handleMenuClick('PP', 'UpdateBusinessClientsBarometers')}>
                                PP_Update Business Client's Barometers
                            </NavDropdown.Item> */}
                            <NavDropdown.Item onClick={() => handleMenuClick('BY', 'BusinessReferences')}>
                                BY_List of Business 
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('SB', 'SetupBusinessType')}>
                                SB_Setup Business Type
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('SE', 'SetupElectoralArea')}>
                                SE_Setup Electoral Area
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('ZO', 'PropertyClass')}>
                                SE_Setup Property Class
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('ZO', 'PropertyRate')}>
                                ZO_Setup Container/Kiosk Fees
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('SG', 'SetupGradeRates')}>
                                SG_Setup Grade Rates
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('GF', 'SetupGradeFees')}>
                                GF_Setup Grade Fees
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('EM', 'SetupOfficer')}>
                                EM_Setup Collector
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('AE', 'AssignCollectorToElectoralArea')}>
                                AE_Assign Collector To Electoral Area
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('DD', 'OperatorDefinition')}>
                                DD_User Definition
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('VZ', 'OperatorPermission')}>
                                VZ_User Permission
                            </NavDropdown.Item>
                            {/* <NavDropdown.Item onClick={() => handleMenuClick('LS', 'LoadSpreadsheet')}>
                                LS_Load Spreadsheet
                            </NavDropdown.Item> */}
                            <NavDropdown.Item onClick={() => handleMenuClick('SB', 'ChangeBusinessType')}>
                                SB_Change Old Business Type to a New Business Type
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => handleMenuClick('mnuExit', 'Exit')}>
                                Exit
                            </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="BOP Finances" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => handleMenuClick('OB', 'OfficerBudget')}>
                                OB_Collector Budget
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('CP', 'CollectorPayment')}>
                                CP_Collector Payment
                            </NavDropdown.Item>
                            {/* Hidden menu items are commented out for now */}
                             <NavDropdown.Item onClick={() => handleMenuClick('CP', 'TemporalCollectorPayment')}>
                                CP_Temporal Collector Payment
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('PB', 'ProcessClientNewBalances')}>
                                PB_Use this option to bill all businesses for the new fiscal year
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('RR', 'EnterReceiptNumbers')}>
                                RR_Enter Receipt Numbers From Accountant General
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('CP', 'BillClient')}>
                                CP_Bill a Business
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('CP', 'ChangeLastYearRate')}>
                                CP_Change Last Year Rate For a Business
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('CP', 'ChangePrevBillAmount')}>
                                CP_CHANGE PREVIOUSLY BILLED AMOUNT
                            </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="BOP Reports" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'BusinessOperatingPermitBusinessNumbers')}>
                                BN_Produce Business Operating Permits (Business Numbers)
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BO', 'BusinessOperatingPermit')}>
                                BO_Produce Business Operating Permits (Electoral Areas)
                            </NavDropdown.Item>
                            {/* Hidden menu items are commented out for now */}
                            <NavDropdown.Item onClick={() => handleMenuClick('MJ', 'BusinessOperatingPermitBusstypes')}>
                                MJ_Produce Business Operating Permits (Buss types)
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('MJ', 'BusinessOperationgPermitPrintDifferentNumbers')}>
                                MJ_Produce Business Operationg Permits (Print Different Numbers at the Same)
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('RM', 'RevenueMobilisationRegister')}>
                                RM_Produce Business Client Statement
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('LK', 'ListOfPaymentDefaulters')}>
                                LK_List Of Payment Defaulters
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BO', 'DailyPayments')}>
                                BO_Produce Daily Payments Report
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('ME', 'MonitoringAndEvaluationReport')}>
                                ME_Produce Collector Monitoring And Evaluation Report
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('FZ', 'MiddleLevelManagementReport')}>
                                FZ_Produce Middle Level Management Report
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BO', 'ExecutiveSummaryReport')}>
                                BO_ProduceExecutive Summary Report
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'ProduceClientAnnualBalancesReport')}>
                                BN_Produce Client Annual Balances Report
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('GV', 'DisplayClientsCurrentBalances')}>
                                GV_Display Clients Current Balances
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'ProduceVarianceAnalysisReport')}>
                                BN_Produce a Balance Brought Forward Report
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'DefaultersPrepaymentsReport')}>
                                BN_Produce Defaulters Report
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('AT', 'AuditTrail')}>
                                AT_Produce Audit Trail
                            </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="BOP Collector Reports" id="basic-nav-dropdown">
                            {/* Hidden menu items are commented out for now */}
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'CollectorPerformanceGraph')}>
                                BN_Produce Collector Performance Graph
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'OneMonthPerformanceGraph')}>
                                BN_Produce Collector One Month Performance Graph-Financial
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'OneMonthPerformanceGraphPercentage')}>
                                BN_Produce Collector One Month Performance Graph-Percentage
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BO', 'CompareTwoYearsPaymentPeriods')}>
                                BO_Produce Compare Two Years Payment Periods-Graph
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BT', 'BusinessTypesReport')}>
                                BT_Produce Business Types Report-Graph
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('OB', 'CollectorsBusinessesReport')}>
                                ZB_Produce Businesses for a  Collector Report-Graph
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('Login', 'Login')}>
                                Login
                            </NavDropdown.Item>
                        </NavDropdown>

                        {/* Hidden menu items are commented out for now */}
                        <NavDropdown title="Property Setup" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => handleMenuClick('SP', 'SetupPropertyClass')}>
                                SP_Fee Fixing Setup Property Class
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('SE', 'SetupTheUseofProperty')}>
                                SE_Fee Fixing Setup The Use of Property
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('SE', 'FeeFixingSetupTypeofProperty')}>
                                SE_Fee Fixing Setup Type of Property
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('SE', 'SetupPropertyRateOfficer')}>
                                SE_Fee Fixing Setup Property Rate Officer
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('AE', 'AssignPropertyRateCollectorToElectoralArea')}>
                                AE_Fee Fixing Assign Property Rate Collector To Electoral Area
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('SE', 'SetupProperty')}>
                                SE_Fee Fixing Setup Property
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'UpdateProperty')}>
                                BN_Fee Fixing Update Property
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'PropertyRateOfficerBudget')}>
                                BN_Setup Property Rate Officer Budget
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'PayPropertyBill')}>
                                BN_Pay Property Bill
                            </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Property Rate Reports" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'ProducePropertyRateBills')}>
                                BN_Produce Property Rate Bills
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'ProducePropertyClientStatement')}>
                                BN_Produce Property Client Statement
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('ME', 'PropertyRateMonitoringAndEvaluationReport')}>
                                ME_ProduceProperty Rate Monitoring And Evaluation Report
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'ProduceDailyPropertyRatePaymentsReport')}>
                                BN_Produce Daily Property Rate PaymentsReport
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleMenuClick('BN', 'ProducePropertyRateVarianceAnalysisReport')}>
                                BN_Produce a Snapshot of the Property Rate Financial Standing of the Assembly
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );
};

export default MainMenu;

































// import React, { useState } from 'react';

// interface User {
//   username: string;
//   password: string;
// }

// const MDIMain: React.FC = () => {
//   const [user, setUser] = useState<User>({ username: '', password: '' });
//   const [accessDenied, setAccessDenied] = useState<boolean>(false);

//   const checkAccess = (menuOption: string): boolean => {
//     // Implement your access logic here
//     return true; // Placeholder
//   };

//   const handleMenuClick = (menuOption: string, formName: string): void => {
//     if (!checkAccess(menuOption)) {
//       setAccessDenied(true);
//       return;
//     }
//     // Logic to show the corresponding form
//     console.log(`Showing form: ${formName}`);
//   };

//   return (
//     <div style={{ backgroundColor: '#FFC0C0', height: '100vh', padding: '20px' }}>
//       <h1>Main Menu</h1>
//       {accessDenied && <div style={{ color: 'red' }}>Access denied. Your Operator ID has no access to this option.</div>}
      
//       <nav>
//         <div>
//           <h2>BOP Setup</h2>
//           <ul>
//             <li onClick={() => handleMenuClick('ST', 'SetupBusiness')}>ST_Setup Business</li>
//             <li onClick={() => handleMenuClick('UC', 'UpdateBusinessClient')}>UC_Update Business Client</li>
//             <li onClick={() => handleMenuClick('PP', 'UpdateBusinessClientBarometers')}>PP_Update Business Client's Barometers</li>
//             <li onClick={() => handleMenuClick('BY', 'BusinessReferences')}>BY_Business References</li>
//             <li onClick={() => handleMenuClick('SB', 'SetupBusinessTypes')}>SB_Setup Business Types</li>            
//             <li onClick={() => handleMenuClick('SE', 'SetupElectoralArea')}>SE_Setup Electoral Area</li>
//             <li onClick={() => handleMenuClick('ZO', 'SetupContainerKioskFees')}>ZO_Setup Container Kiosk Fees</li>
//             <li onClick={() => handleMenuClick('SG', 'SetupGradeRates')}>SG_Setup Grade Rates</li>
//             <li onClick={() => handleMenuClick('GF', 'SetupGradeFees')}>GF_Setup Grade Fees-Use this option to update all businesses current rate before bills productions</li>          
//             <li onClick={() => handleMenuClick('EM', 'SetupOfficer')}>SG_Setup Officer</li>
//             <li onClick={() => handleMenuClick('AE', 'AssignCollectorToElectoralArea')}>AE_Assign Collector To ElectoralArea</li>
//             <li onClick={() => handleMenuClick('DD', 'OperatorDefinition')}>DD_Operator Definition</li>
//             <li onClick={() => handleMenuClick('VZ', 'OperatorPermission')}>DD_Operator Permission</li>
//             <li onClick={() => handleMenuClick('LS', 'LoadSpreadSheet')}>LS_LoadSpreadSheet</li>
//             <li onClick={() => handleMenuClick('SB', 'ChangeanOldBusinessTypetoaNewBusinessType')}>SB_Change an Old Business Type to a New Business Type</li>
//           </ul>
//         </div>

//         <div>
//           <h2>BOP Finances</h2>
//           <ul>
//             <li onClick={() => handleMenuClick('OB', 'OfficerBudget')}>OB_Officer Budget</li>
//             <li onClick={() => handleMenuClick('CP', 'CollectorPayment')}>CP_Collector Payment</li>
//             <li onClick={() => handleMenuClick('CP', 'TemporalCollectorPayment')}>CP_Temporal Collector Payment</li>
//             <li onClick={() => handleMenuClick('PB', 'BillAllBusinesses')}>PB_Bill All  Businesses-Use this option to bill all businesses for the new fiscal year</li>
//             <li onClick={() => handleMenuClick('RR', 'EnterReceiptNumbersFromAccountantGeneral')}>RR_Enter Receipt Numbers From Accountant General</li>
//             <li onClick={() => handleMenuClick('CP', 'BillaClient')}>CP_Bill a Client-the balance brought forward from a previous year</li>
//             <li onClick={() => handleMenuClick('CP', 'ChangeARateForAClient')}>CP_Change Last Year Rate For a Client</li>
//             <li onClick={() => handleMenuClick('CP', 'ChangePreviouslyBilledAmount')}>CP_Change Previously Billed Amount</li>
//           </ul>
//         </div>

//         <div>
//           <h2>BOP Reports</h2>
//           <ul>
//             <li onClick={() => handleMenuClick('BN', 'BusinessOperatingPermitBusinessNumbers')}>BN_Business Operating Permit (Business Numbers)</li>
//             <li onClick={() => handleMenuClick('BO', 'BusinessOperatingPermitElectoralAreas')}>BO_Business Operating Permit (Electoral Areas)</li>
//             <li onClick={() => handleMenuClick('MJ', 'BusinessOperatingPermitBussTypes')}>MJ_Business Operating Permit (Buss Types)</li>
//             <li onClick={() => handleMenuClick('MJ', 'BusinessOperatingPermitPrintDifferentNumbersAtTheSameTime')}>MJ_Business Operating Permit (Print Different Numbers At The Same Time)</li>
//             <li onClick={() => handleMenuClick('RM', 'ProduceBusinessClientStatement')}>RM_Produce Business Client Statement</li> 
//             <li onClick={() => handleMenuClick('LK', 'ListOfPaymentDefaulters')}>LK_List of Payment Defaulters</li>
//             <li onClick={() => handleMenuClick('BO', 'ProduceDailyPaymentsReport')}>BO_Produce Daily Payments Report</li>
//             <li onClick={() => handleMenuClick('ME', 'CollectorMonitoringAndEvaluationReport')}>ME_Collector Monitoring And Evaluation Report</li>
//             <li onClick={() => handleMenuClick('FZ', 'MiddleLevelManagementReport')}>FZ_Middle Level Management Report</li>
//             <li onClick={() => handleMenuClick('BO', 'ExecutiveSummaryReport')}>BO_Executive Summary Report</li>
//             <li onClick={() => handleMenuClick('BN', 'ProduceClientAnnualBalancesReport')}>BN_Produce Client Annual Balances Report</li>
//             <li onClick={() => handleMenuClick('GV', 'DisplayClientsCurrentBalances')}>GV_Display Clients Current Balances</li>
//             <li onClick={() => handleMenuClick('BN', 'ProduceBalanceBroughtForwardReport')}>BN_Produce Balance Brought Forward Report</li>
//             <li onClick={() => handleMenuClick('BN', 'DefaultersReport')}>BN_Defaulters Report</li>
//             <li onClick={() => handleMenuClick('AT', 'ProduceAuditTrail')}>AT_Produce Audit Trail</li>
//           </ul>
//         </div>
//         <div>
//             <h2>BOP Collector Reports</h2>
//             <li onClick={() => handleMenuClick('BN', 'CollectorPerformanceGraph')}>BN_Collector Performance Graph</li>
//             <li onClick={() => handleMenuClick('BN', 'OneMonthPerformanceGraph')}>BN_Collector One Month Performance Graph-Financial</li>
//             <li onClick={() => handleMenuClick('BN', 'OneMonthPerformanceGraphPercentage')}>BN_Collector One Month Performance Graph-Percentage</li>
//             <li onClick={() => handleMenuClick('BN', 'CompareTwoYearsPaymentPeriods')}>BO_Compare Two Years Payment Periods-Graph</li>
//             <li onClick={() => handleMenuClick('BT', 'BusinessTypesReport')}>BT_Business Types Report-Graph</li>
//             <li onClick={() => handleMenuClick('ZB', 'BusinessTypesReport')}>ZB_Businesses for a  Collector Report-Graph</li>
//         </div>
//         <div>
//             <h2>Property Rates Setup</h2>
//             <li onClick={() => handleMenuClick('SP', 'SetupPropertyClass')}>SP_Fee Fixing Setup Property Class</li>
//             <li onClick={() => handleMenuClick('SE', 'SetupTheUseofProperty')}>SE_Fee Fixing Setup The Use of Property</li>
//             <li onClick={() => handleMenuClick('SE', 'FeeFixingSetupTypeofProperty')}>SE_Fee Fixing Setup Type of Property</li>
//             <li onClick={() => handleMenuClick('SE', 'SetupPropertyRateOfficer')}>SE_Setup Property Rate Officer</li>
//             <li onClick={() => handleMenuClick('AE', 'AssignPropertyRateCollectorToElectoralArea')}>AE_Assign Property Rate Collector To Electoral Area</li>
//             <li onClick={() => handleMenuClick('SE', 'SetupProperty')}>SE_Setup Property</li>
//             <li onClick={() => handleMenuClick('BN', 'SetupProperty')}>BN_Update Property</li>
//             <li onClick={() => handleMenuClick('BN', 'PropertyRateOfficerBudget')}>BN_Property Rate Officer Budget</li>
//             <li onClick={() => handleMenuClick('BN', 'PayPropertyBill')}>BN_Pay Property Bill</li>
//         </div>
//         <div>
//             <h2>Property Rates Reports</h2>
//             <li onClick={() => handleMenuClick('BN', 'ProducePropertyRateBills')}>BN_Produce Property Rate Bills</li>
//             <li onClick={() => handleMenuClick('BN', 'ProducePropertyClientStatement')}>BN_Produce Property Client Statement</li>
//             <li onClick={() => handleMenuClick('ME', 'PropertyRateMonitoringAndEvaluationReport')}>ME_Property Rate Monitoring And Evaluation Report</li>
//             <li onClick={() => handleMenuClick('BN', 'ProduceDailyPropertyRatePaymentsReport')}>BN_Produce Daily Property Rate PaymentsReport</li>
//             <li onClick={() => handleMenuClick('BN', 'ProducePropertyRateVarianceAnalysisReport')}>BN_Produce a Snapshot of the Property Rate Financial Standing of the Assembly</li>
//         </div>

//         <div>
//           <h2>Exit</h2>
//           <ul>
//             <li onClick={() => handleMenuClick('mnuExit', 'Exit')}>Exit</li>
//           </ul>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default MDIMain;