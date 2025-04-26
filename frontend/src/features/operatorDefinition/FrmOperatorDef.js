var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { fetchOperators, createOperator, updateOperator, deleteOperator } from './operatorDefinitionSlice';
// interface OperatorData {
//   OperatorID: string;
//   OperatorName: string;
//   password: string;
//   firstname: string;
//   lastname: string;
//   email: string;
// }
// interface AddRecResponse {
//   message: string;
// }
// interface EditRecResponse {
//   message: string;
// }
// interface DeleteRecResponse {clear
//   message: string;
// }
var OperatorDefForm = function () {
    var _a = useState(''), operatorid = _a[0], setOperatorid = _a[1];
    var _b = useState(''), operatorname = _b[0], setOperatorname = _b[1];
    var _c = useState(''), password = _c[0], setPassword = _c[1];
    var _d = useState(''), firstname = _d[0], setFirstname = _d[1];
    var _e = useState(''), lastname = _e[0], setLastname = _e[1];
    var _f = useState(''), email = _f[0], setEmail = _f[1];
    var _g = useState([]), operatorList = _g[0], setOperatorList = _g[1];
    var _h = useState(''), error = _h[0], setError = _h[1];
    var _j = useState(''), successMessage = _j[0], setSuccessMessage = _j[1];
    var dispatch = useAppDispatch();
    var navigate = useNavigate();
    var operatorListFromStore = useAppSelector(function (state) { return state.operatorDefinition.operators; });
    useEffect(function () {
        fetchOperatorList();
    }, []);
    var fetchOperatorList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var operatorListData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in fetchOperatorList');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(fetchOperators()).unwrap()];
                case 2:
                    operatorListData = _a.sent();
                    console.log(operatorListData); // This is now the array of operators
                    operatorList = operatorListData;
                    setOperatorList(operatorList); // Set the operator list directly
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('Error fetching operators');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleOperatorIDChange = function (e) {
        setOperatorid(e.target.value);
    };
    var handleOperatorNameChange = function (e) {
        setOperatorname(e.target.value);
    };
    var handlePasswordChange = function (e) {
        setPassword(e.target.value);
    };
    var handleFirstNameChange = function (e) {
        setFirstname(e.target.value);
    };
    var handleLastNameChange = function (e) {
        setLastname(e.target.value);
    };
    var handleEmailChange = function (e) {
        setEmail(e.target.value);
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var resultAction, responseMessage, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in handleAddClick');
                    if (!operatorid || !operatorname || !password || !firstname || !lastname || !email) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(createOperator({
                            operatorid: operatorid, // Change 'operatorid' to 'OperatorID'
                            operatorname: operatorname, // Change 'operatorname' to 'OperatorName'
                            password: password,
                            firstname: firstname,
                            lastname: lastname,
                            email: email
                        }))];
                case 2:
                    resultAction = _a.sent();
                    // Now you can check if the action was fulfilled or rejected
                    if (createOperator.fulfilled.match(resultAction)) {
                        responseMessage = resultAction.payload;
                        console.log(responseMessage); // Log the success message
                        setSuccessMessage(responseMessage);
                        setError('');
                        clearForm();
                        fetchOperatorList();
                    }
                    else {
                        // Handle the error case
                        console.error('Failed to create operator:', resultAction.error);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('Error adding record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEditClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formData, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!operatorid || !operatorname || !password || !firstname || !lastname || !email) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    formData = {
                        operatorid: operatorid,
                        operatorname: operatorname,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        email: email
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(updateOperator({ OperatorID: operatorid, operatorData: formData })).unwrap()];
                case 2:
                    response = _a.sent();
                    console.log(response.data);
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchOperatorList();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error(error_3);
                    setError('Error editing record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var delResponse, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!operatorid || !password) {
                        setError('Operator ID and Password cannot be empty');
                        return [2 /*return*/];
                    }
                    delResponse = prompt("Enter Y to Delete, N to Not to Delete");
                    if ((delResponse === null || delResponse === void 0 ? void 0 : delResponse.toUpperCase()) !== 'Y') {
                        setError('Deletion aborted');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(deleteOperator(operatorid)).unwrap()];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchOperatorList();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error(error_4);
                    setError('Error deleting record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleItemClick = function (operator) {
        setOperatorid(operator.operatorid || ''); // Default to an empty string if undefined
        setOperatorname(operator.operatorname || ''); // Default to an empty string if undefined
        setPassword(operator.password || ''); // Default to an empty string if undefined
        setFirstname(operator.firstname || ''); // Default to an empty string if undefined
        setLastname(operator.lastname || ''); // Default to an empty string if undefined
        setEmail(operator.email || ''); // Default to an empty string if undefined
    };
    var clearForm = function () {
        setOperatorid('');
        setOperatorname('');
        setPassword('');
        setFirstname('');
        setLastname('');
        setEmail('');
    };
    // const validateOperatorID = async (operatorID: string) => {
    //   try {
    //     const response = await axios.get<Operator>(`http://your-api-url/find_rec?operatorID=${operatorID}&password=${password}`);
    //     setOperatorName(response.data.operatorName);
    //     setFirstName(response.data.firstname);
    //     setLastName(response.data.lastname);
    //   } catch (error) {
    //     console.error(error);
    //     setError('Record not found');
    //   }
    // };
    return (_jsxs(Container, { children: [error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs(Form, { children: [_jsxs(Row, { className: "mb-3", children: [_jsx(Col, { md: 6, children: _jsxs(Form.Group, { controlId: "formOperatorID", children: [_jsx(Form.Label, { children: "Operator ID:" }), _jsx(Form.Control, { type: "text", value: operatorid, onChange: handleOperatorIDChange, maxLength: 10 })] }) }), _jsx(Col, { md: 6, children: _jsxs(Form.Group, { controlId: "formOperatorName", children: [_jsx(Form.Label, { children: "Operator Name:" }), _jsx(Form.Control, { type: "text", value: operatorname, onChange: handleOperatorNameChange, maxLength: 10 })] }) })] }), _jsxs(Row, { className: "mb-3", children: [_jsx(Col, { md: 6, children: _jsxs(Form.Group, { controlId: "formPassword", children: [_jsx(Form.Label, { children: "Password:" }), _jsx(Form.Control, { type: "password", value: password, onChange: handlePasswordChange, maxLength: 10 })] }) }), _jsx(Col, { md: 6, children: _jsxs(Form.Group, { controlId: "formFirstName", children: [_jsx(Form.Label, { children: "First Name:" }), _jsx(Form.Control, { type: "text", value: firstname, onChange: handleFirstNameChange, maxLength: 5 })] }) })] }), _jsx(Row, { className: "mb-3", children: _jsx(Col, { md: 6, children: _jsxs(Form.Group, { controlId: "formLastName", children: [_jsx(Form.Label, { children: "Last Name:" }), _jsx(Form.Control, { type: "text", value: lastname, onChange: handleLastNameChange, maxLength: 10 })] }) }) }), _jsx(Row, { className: "mb-3", children: _jsx(Col, { md: 6, children: _jsxs(Form.Group, { controlId: "formEmail", children: [_jsx(Form.Label, { children: "Email:" }), _jsx(Form.Control, { type: "email", value: email, onChange: handleEmailChange, maxLength: 50 })] }) }) }), _jsxs("div", { className: "d-flex justify-content-between mb-3", children: [_jsx(Button, { variant: "primary", className: "flex-fill me-2", onClick: handleAddClick, children: "Add" }), _jsx(Button, { variant: "success", className: "flex-fill me-2", onClick: handleEditClick, children: "Edit" }), _jsx(Button, { variant: "danger", className: "flex-fill me-2", onClick: handleDeleteClick, children: "Delete" }), _jsx(Button, { className: "primary flex-fill", onClick: function () { return navigate('/main'); }, children: "Go Back" })] })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Operator ID" }), _jsx("th", { children: "First Name" }), _jsx("th", { children: "Last Name" })] }) }), _jsx("tbody", { children: operatorListFromStore.map(function (operator, index) { return (_jsxs("tr", { onClick: function () { return handleItemClick(operator); }, children: [_jsx("td", { children: operator.operatorid }), _jsx("td", { children: operator.firstname }), _jsx("td", { children: operator.lastname })] }, index)); }) })] }), _jsx(Button, { className: "primary m-3", onClick: function () { return navigate('/main'); }, children: "Go Back" })] }));
};
export default OperatorDefForm;
