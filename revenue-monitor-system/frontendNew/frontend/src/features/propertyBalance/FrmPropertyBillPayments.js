import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//import { get } from 'http';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// interface PropertyBillPaymentsProps {
//   uid: string;
//   MDImain: React.RefObject<any>; // Adjust the type based on your actual MDImain component
// }
var FrmPropertyBillPayments = function () {
    // { uid, MDImain } will be sourced from localStorage. They will be stored in localStorage when the user logs in
    //const [uid, setUid] = useState(''); // This will be sourced from localStorage
    var uid = localStorage.getItem('uid'); // This will be sourced from localStorage
    var _a = useState(null), MDImain = _a[0], setMDImain = _a[1]; // This will be sourced from localStorage
    //const [cboPropertyClass, setCboPropertyClass] = useState('');
    // const [listflag, setListflag] = useState(false);
    //const [varStatusFlag, setVarStatusFlag] = useState('');
    var _b = useState(''), cboOfficerNo = _b[0], setCboOfficerNo = _b[1];
    var _c = useState(''), cboBusNo = _c[0], setCboBusNo = _c[1];
    var _d = useState(0), txtAmount = _d[0], setTxtAmount = _d[1];
    var _e = useState(''), cboPaymentMonth = _e[0], setCboPaymentMonth = _e[1];
    var _f = useState('0'), txtReceiptNo = _f[0], setTxtReceiptNo = _f[1];
    var _g = useState(''), lblBusname = _g[0], setLblBusname = _g[1];
    var _h = useState(''), lblBusinessType = _h[0], setLblBusinessType = _h[1];
    var _j = useState(0), lblRate = _j[0], setLblRate = _j[1];
    var _k = useState(0), lblBalanceBF = _k[0], setLblBalanceBF = _k[1];
    // @ts-ignore
    var _l = useState(''), lblPropertyClass = _l[0], setLblPropertyClass = _l[1];
    // @ts-ignore
    var _m = useState('0'), lblPropertyRent = _m[0], setLblPropertyRent = _m[1];
    // @ts-ignore
    var _o = useState(new Date().getFullYear()), LBLfiscalYear = _o[0], setLBLfiscalYear = _o[1];
    // @ts-ignore
    var _p = useState(0), txtTotalPayable = _p[0], setTxtTotalPayable = _p[1];
    // @ts-ignore
    var _q = useState(0), txtTotalPayment = _q[0], setTxtTotalPayment = _q[1];
    // @ts-ignore
    var _r = useState(0), txtCurrentBalance = _r[0], setTxtCurrentBalance = _r[1];
    var _s = useState([]), lstView1Items = _s[0], setListView1Items = _s[1];
    var _t = useState([]), lstView3Items = _t[0], setListView3Items = _t[1];
    // @ts-ignore
    var _u = useState(new Date()), dtTransDate = _u[0], setDtTransDate = _u[1];
    var _v = useState(''), txtOwner = _v[0], setTxtOwner = _v[1];
    setMDImain(null);
    useEffect(function () {
        setLblRate(0);
        setLblBusinessType('');
        setLblBalanceBF(0);
        lblPropertyClass = '';
        setLblPropertyClass('');
        lblPropertyRent = '0';
        setLblPropertyRent('0');
        LBLfiscalYear = new Date().getFullYear();
        setLBLfiscalYear(new Date().getFullYear());
        txtTotalPayable = 0;
        setTxtTotalPayable(0);
        txtTotalPayment = 0;
        setTxtTotalPayment(0);
        txtCurrentBalance = 0;
        setTxtCurrentBalance(0);
        setListView1Items([]);
        setListView3Items([]);
        setTxtOwner('');
        dtTransDate = new Date();
        setDtTransDate(new Date());
        setCboOfficerNo('');
        setCboBusNo('');
        setTxtAmount(0);
        setCboPaymentMonth('');
        setTxtReceiptNo('0');
        setLblBusname('');
        if (uid && uid.toUpperCase() === 'SUPERVISOR') {
            cmdPostVisible(true);
            cmdAddVisible(false);
            cmdPrintReceiptVisible(false);
            Frame2Caption('SELECT THE TRANSACTION WHICH YOU WANT TO POST. AFTER THE ASSESSMENT, CLICK ON THE POST BUTTON TO POST');
            DisableTextBoxes();
        }
        else {
            cmdPostVisible(false);
            Frame2Caption('TEMPORAL PAYMENTS PENDING SUPERVISOR POSTING');
            EnableTextBoxes();
        }
        if (uid && uid.toUpperCase() === 'SUPERVISOR') {
            cmdDeleteVisible(true);
        }
        else {
            cmdDeleteVisible(false);
        }
    }, [uid]);
    var cmdExitClick = function () {
        MDImain.current.show();
    };
    var cmdAddClick = function () {
        // Your logic here
    };
    var cmdPrintReceiptClick = function () {
        // Your logic here
    };
    var cmdPostClick = function () {
        // Your logic here
    };
    var cmdLoadClick = function () {
        listViewPopulate();
    };
    var cmdDeleteClick = function () {
        // Your logic here
    };
    // const cmdDefaultersClick = () => {
    //   // Your logic here
    // };
    // const cmdPrepaymentsClick = () => {
    //   // Your logic here
    // };
    var cboOfficerNoDropDown = function () {
        // Your logic here
    };
    // const cboOfficerNoValidate = () => {
    //   // Your logic here
    // };
    var cboBusNoDropDown = function () {
        // Your logic here
    };
    var cboBusNoValidate = function () {
        // Your logic here
    };
    var listViewPopulate = function () {
        // Your logic here
    };
    // const listViewPopulateReceiptNos = () => {
    //   // Your logic here
    // };
    // const populateListView = () => {
    //   // Your logic here
    // };
    // const populateListViewSupervisor = () => {
    //   // Your logic here
    // };
    // const populateListViewReceiptno = () => {
    //   // Your logic here
    // };
    var txtAmountValidate = function () {
        // Your logic here
    };
    // const txtOwnerChange = () => {
    //   // Your logic here
    // };
    var txtOwnerValidate = function () {
        // Your logic here
    };
    // const txtReceiptNoValidate = () => {
    //   // Your logic here
    // };
    // @ts-ignore
    var ListView1ItemClick = function (item) {
        // Your logic here
    };
    // @ts-ignore
    var ListView2ItemClick = function (item) {
        // Your logic here
    };
    // @ts-ignore
    var cmdPostVisible = function (visible) {
        // Your logic here
    };
    // @ts-ignore
    var cmdAddVisible = function (visible) {
        // Your logic here
    };
    // @ts-ignore
    var cmdPrintReceiptVisible = function (visible) {
        // Your logic here
    };
    // @ts-ignore
    var Frame2Caption = function (caption) {
        // Your logic here
    };
    // @ts-ignore
    var cmdDeleteVisible = function (visible) {
        // Your logic here
    };
    var DisableTextBoxes = function () {
        // Your logic here
    };
    var EnableTextBoxes = function () {
        // Your logic here
    };
    // const FindBalanceBF = (txtBussNo: string): number => {
    //   // Your logic here
    //   return 0; // Replace with actual logic
    // };
    // const FindCurrentRate = (txtBussNo: string): number => {
    //   // Your logic here
    //   return 0; // Replace with actual logic
    // };
    // const FindTotalPayable = (txtBussNo: string): number => {
    //   // Your logic here
    //   return 0; // Replace with actual logic
    // };
    // const AddRec = (cboBusNo: string, cboOfficerNo: string, txtAmount: string, cboPaymentMonth: string, dtTransDate: Date, uid: string, LBLfiscalYear: number, txtReceiptNo: string, lblBussName: string): string => {
    //   // Your logic here
    //   return "Collection Payment temporally entered. It must eventually be posted by your supervisor"; // Replace with actual logic
    // };
    // const FindOfficerName = (cboOfficerNo: string): string => {
    //   // Your logic here
    //   return "No officer name"; // Replace with actual logic
    // };
    // const FindOfficerNo = (lblElectoralArea: string): string => {
    //   // Your logic here
    //   return "No officer name"; // Replace with actual logic
    // };
    return (_jsxs("div", { style: { backgroundColor: '#FFC0C0', height: '100vh', padding: '20px' }, children: [_jsxs("div", { style: { backgroundColor: '#800000', color: '#FFFFFF', padding: '10px', marginBottom: '10px' }, children: [_jsx("button", { onClick: cmdExitClick, children: "Exit" }), _jsx("button", { onClick: cmdAddClick, children: "Add New Record" }), _jsx("button", { onClick: cmdPrintReceiptClick, style: { display: 'none' }, children: "Print Receipt" }), _jsx("button", { onClick: cmdPostClick, children: "Post" }), _jsx("button", { onClick: cmdDeleteClick, style: { display: 'none' }, children: "Delete A Faulty Entry" })] }), _jsx("select", { value: cboOfficerNo, onChange: function (e) { return setCboOfficerNo(e.target.value); }, onMouseDown: cboOfficerNoDropDown }), _jsx("input", { type: "number", value: txtAmount, onChange: function (e) { return setTxtAmount(parseFloat(e.target.value)); }, onBlur: txtAmountValidate }), _jsx("select", { value: cboBusNo, onChange: function (e) { return setCboBusNo(e.target.value); }, onMouseDown: cboBusNoDropDown, onBlur: cboBusNoValidate }), _jsx("select", { value: cboPaymentMonth, onChange: function (e) { return setCboPaymentMonth(e.target.value); }, style: { display: 'none' } }), _jsx("input", { type: "text", value: txtReceiptNo, onChange: function (e) { return setTxtReceiptNo(e.target.value); } }), _jsx("div", { style: { backgroundColor: '#FFC0C0', padding: '10px', marginBottom: '10px' }, children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "BUSS NO" }), _jsx("th", { children: "BUSS NAME" }), _jsx("th", { children: "AMOUNT" }), _jsx("th", { children: "RECEIPT NO" }), _jsx("th", { children: "MONTH PAID" }), _jsx("th", { children: "FISCAL YEAR" })] }) }), _jsx("tbody", { children: lstView1Items.map(function (item, index) { return (_jsxs("tr", { onClick: function () { return ListView1ItemClick(item); }, children: [_jsx("td", { children: item.officer_no }), _jsx("td", { children: item.house_no }), _jsx("td", { children: item.house_no }), _jsx("td", { children: item.amount }), _jsx("td", { children: item.receiptno }), _jsx("td", { children: item.monthpaid }), _jsx("td", { children: item.fiscal_year })] }, index)); }) })] }) }), _jsxs("div", { style: { backgroundColor: '#FFC0C0', padding: '10px', marginBottom: '10px' }, children: [_jsxs("div", { children: ["Balance BF: ", lblBalanceBF] }), _jsxs("div", { children: ["Current Rate: ", lblRate] }), _jsx("div", { children: "GHC" }), _jsx("div", { children: "GHC" }), _jsx("div", { children: "GHC" })] }), _jsxs("div", { style: { backgroundColor: '#FFC0C0', padding: '10px', marginBottom: '10px' }, children: [_jsx("div", { children: "=     Current Balance" }), _jsx("div", { children: "LESS Cumulative Payment Made" }), _jsx("div", { children: "Cumulative Billed Amount" }), _jsx("div", { children: "GHC" }), _jsx("div", { children: "GHC" }), _jsx("div", { children: "GHC" })] }), _jsxs("div", { style: { backgroundColor: '#FFC0C0', padding: '10px', marginBottom: '10px' }, children: [_jsx("input", { type: "text", value: txtOwner, onChange: function (e) { return setTxtOwner(e.target.value); }, onBlur: txtOwnerValidate }), _jsx("div", { children: "Property Class" }), _jsx("div", {}), _jsx("div", { children: "Electoral Area" }), _jsx("div", { children: lblBusinessType }), _jsx("div", { children: "Use of Property" }), _jsx("div", { children: "Business Type:" }), _jsx("div", { children: "Owner's Name" })] }), _jsx("button", { onClick: cmdLoadClick, style: { display: 'none' }, children: "Load" }), _jsx("select", { value: lblBusname, onChange: function (e) { return setLblBusname(e.target.value); } }), _jsxs("table", { style: { display: 'none' }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Buss No" }), _jsx("th", { children: "Receipt no" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "Date" })] }) }), _jsx("tbody", { children: lstView3Items.map(function (item, index) { return (_jsxs("tr", { onClick: function () { return ListView2ItemClick(item); }, children: [_jsx("td", { children: item.house_no }), _jsx("td", { children: item.receiptno }), _jsx("td", { children: item.amount }), _jsx("td", { children: item.transdate })] }, index)); }) })] }), _jsx("div", { children: "Collector's Payment Entry" }), _jsx("div", { children: "House No:" }), _jsx("div", {}), _jsx("div", { children: "Payment Date" }), _jsx("div", { children: "Amount to be posted:" }), _jsx("div", { children: "Payment Month" }), _jsx("div", { children: "Collector Code:" }), _jsx("div", { children: "Officer name:" }), _jsx("div", { children: "User Id" }), _jsx("div", { children: "Fiscal Year" }), _jsx("div", { children: "Receipt No" }), _jsx("div", { children: "Collector:" }), _jsx("div", { children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }));
};
export default FrmPropertyBillPayments;
