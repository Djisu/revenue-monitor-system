//import { get } from 'http';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// interface PropertyBillPaymentsProps {
//   uid: string;
//   MDImain: React.RefObject<any>; // Adjust the type based on your actual MDImain component
// }

const FrmPropertyBillPayments: React.FC = () => {
  // { uid, MDImain } will be sourced from localStorage. They will be stored in localStorage when the user logs in
  //const [uid, setUid] = useState(''); // This will be sourced from localStorage
  const uid: (string | null) = localStorage.getItem('uid'); // This will be sourced from localStorage
  const [MDImain, setMDImain] = useState<any>(null); // This will be sourced from localStorage

  //const [cboPropertyClass, setCboPropertyClass] = useState('');
 // const [listflag, setListflag] = useState(false);
  //const [varStatusFlag, setVarStatusFlag] = useState('');
  let [cboOfficerNo, setCboOfficerNo] = useState('');
  let [cboBusNo, setCboBusNo] = useState('');
  let [txtAmount, setTxtAmount] = useState(0);
  let [cboPaymentMonth, setCboPaymentMonth] = useState('');
  let [txtReceiptNo, setTxtReceiptNo] = useState('0');
  let [lblBusname, setLblBusname] = useState('');
  let [lblBusinessType, setLblBusinessType] = useState('');
  let [lblRate, setLblRate] = useState(0);
  let [lblBalanceBF, setLblBalanceBF] = useState(0);
  // @ts-ignore
  let [lblPropertyClass, setLblPropertyClass] = useState('');
  // @ts-ignore
  let [lblPropertyRent, setLblPropertyRent] = useState('0');
  // @ts-ignore
  let [LBLfiscalYear, setLBLfiscalYear] = useState(new Date().getFullYear());
  // @ts-ignore
  let [txtTotalPayable, setTxtTotalPayable] = useState(0);

   // @ts-ignore
  let [txtTotalPayment, setTxtTotalPayment] = useState(0);

   // @ts-ignore
  let [txtCurrentBalance, setTxtCurrentBalance] = useState(0);
  let [lstView1Items, setListView1Items] = useState<any[]>([]);
  let [lstView3Items, setListView3Items] = useState<any[]>([]);

   // @ts-ignore
  let [dtTransDate, setDtTransDate] = useState(new Date());

  let [txtOwner, setTxtOwner] = useState('');
  setMDImain(null)

  useEffect(() => {
    setLblRate(0)
    setLblBusinessType('')
    setLblBalanceBF(0)
    lblPropertyClass = ''
    setLblPropertyClass('')
    lblPropertyRent = '0'
    setLblPropertyRent('0')
    LBLfiscalYear = new Date().getFullYear()
    setLBLfiscalYear(new Date().getFullYear())
    txtTotalPayable = 0
    setTxtTotalPayable(0)
    txtTotalPayment = 0
    setTxtTotalPayment(0)

    txtCurrentBalance = 0
    setTxtCurrentBalance(0)
    setListView1Items([])
    setListView3Items([])
    setTxtOwner('')
    dtTransDate = new Date()
    setDtTransDate(new Date())
    setCboOfficerNo('')
    setCboBusNo('')
    setTxtAmount(0)
    setCboPaymentMonth('')
    setTxtReceiptNo('0')
    setLblBusname('')

    if (uid && uid.toUpperCase() === 'SUPERVISOR') {
      cmdPostVisible(true);
      cmdAddVisible(false);
      cmdPrintReceiptVisible(false);
      Frame2Caption('SELECT THE TRANSACTION WHICH YOU WANT TO POST. AFTER THE ASSESSMENT, CLICK ON THE POST BUTTON TO POST');
      DisableTextBoxes();
    } else {
      cmdPostVisible(false);
      Frame2Caption('TEMPORAL PAYMENTS PENDING SUPERVISOR POSTING');
      EnableTextBoxes();
    }

    if (uid && uid.toUpperCase() === 'SUPERVISOR') {
      cmdDeleteVisible(true);
    } else {
      cmdDeleteVisible(false);
    }
  }, [uid]);

  const cmdExitClick = () => {
    MDImain.current.show();
  };

  const cmdAddClick = () => {
    // Your logic here
  };

  const cmdPrintReceiptClick = () => {
    // Your logic here
  };

  const cmdPostClick = () => {
    // Your logic here
  };

  const cmdLoadClick = () => {
    listViewPopulate();
  };

  const cmdDeleteClick = () => {
    // Your logic here
  };

  // const cmdDefaultersClick = () => {
  //   // Your logic here
  // };

  // const cmdPrepaymentsClick = () => {
  //   // Your logic here
  // };

  const cboOfficerNoDropDown = () => {
    // Your logic here
  };

  // const cboOfficerNoValidate = () => {
  //   // Your logic here
  // };

  const cboBusNoDropDown = () => {
    // Your logic here
  };

  const cboBusNoValidate = () => {
    // Your logic here
  };

  const listViewPopulate = () => {
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

  const txtAmountValidate = () => {
    // Your logic here
  };

  // const txtOwnerChange = () => {
  //   // Your logic here
  // };

  const txtOwnerValidate = () => {
    // Your logic here
  };

  // const txtReceiptNoValidate = () => {
  //   // Your logic here
  // };

  // @ts-ignore
  const ListView1ItemClick = (item: any) => {
    // Your logic here
  };

// @ts-ignore
  const ListView2ItemClick = (item: any) => {
    // Your logic here
  };

  // @ts-ignore
  const cmdPostVisible = (visible: boolean) => {
    // Your logic here
  };

  // @ts-ignore
  const cmdAddVisible = (visible: boolean) => {
    // Your logic here
  };

  // @ts-ignore
  const cmdPrintReceiptVisible = (visible: boolean) => {
    // Your logic here
  };

  // @ts-ignore
  const Frame2Caption = (caption: string) => {
    // Your logic here
  };

  // @ts-ignore
  const cmdDeleteVisible = (visible: boolean) => {
    // Your logic here
  };

  const DisableTextBoxes = () => {
    // Your logic here
  };

  const EnableTextBoxes = () => {
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

  return (
    <div style={{ backgroundColor: '#FFC0C0', height: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: '#800000', color: '#FFFFFF', padding: '10px', marginBottom: '10px' }}>
        <button onClick={cmdExitClick}>Exit</button>
        <button onClick={cmdAddClick}>Add New Record</button>
        <button onClick={cmdPrintReceiptClick} style={{ display: 'none' }}>Print Receipt</button>
        <button onClick={cmdPostClick}>Post</button>
        <button onClick={cmdDeleteClick} style={{ display: 'none' }}>Delete A Faulty Entry</button>
      </div>
      <select value={cboOfficerNo} onChange={(e) => setCboOfficerNo(e.target.value)} onMouseDown={cboOfficerNoDropDown}>
        {/* Options will be populated dynamically */}
      </select>
      <input type="number" value={txtAmount} onChange={(e) => setTxtAmount(parseFloat(e.target.value))} onBlur={txtAmountValidate} />
      <select value={cboBusNo} onChange={(e) => setCboBusNo(e.target.value)} onMouseDown={cboBusNoDropDown} onBlur={cboBusNoValidate}>
        {/* Options will be populated dynamically */}
      </select>
      <select value={cboPaymentMonth} onChange={(e) => setCboPaymentMonth(e.target.value)} style={{ display: 'none' }}>
        {/* Options will be populated dynamically */}
      </select>
      <input type="text" value={txtReceiptNo} onChange={(e) => setTxtReceiptNo(e.target.value)} />
      <div style={{ backgroundColor: '#FFC0C0', padding: '10px', marginBottom: '10px' }}>
        <table>
          <thead>
            <tr>
              <th>OFFICER NO</th>
              <th>BUSS NO</th>
              <th>BUSS NAME</th>
              <th>AMOUNT</th>
              <th>RECEIPT NO</th>
              <th>MONTH PAID</th>
              <th>FISCAL YEAR</th>
            </tr>
          </thead>
          <tbody>
            {lstView1Items.map((item, index) => (
              <tr key={index} onClick={() => ListView1ItemClick(item)}>
                <td>{item.officer_no}</td>
                <td>{item.house_no}</td>
                <td>{item.house_no}</td>
                <td>{item.amount}</td>
                <td>{item.receiptno}</td>
                <td>{item.monthpaid}</td>
                <td>{item.fiscal_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ backgroundColor: '#FFC0C0', padding: '10px', marginBottom: '10px' }}>
        <div>Balance BF: {lblBalanceBF}</div>
        <div>Current Rate: {lblRate}</div>
        <div>GHC</div>
        <div>GHC</div>
        <div>GHC</div>
      </div>
      <div style={{ backgroundColor: '#FFC0C0', padding: '10px', marginBottom: '10px' }}>
        <div>=     Current Balance</div>
        <div>LESS Cumulative Payment Made</div>
        <div>Cumulative Billed Amount</div>
        <div>GHC</div>
        <div>GHC</div>
        <div>GHC</div>
      </div>
      <div style={{ backgroundColor: '#FFC0C0', padding: '10px', marginBottom: '10px' }}>
        <input type="text" value={txtOwner} onChange={(e) => setTxtOwner(e.target.value)} onBlur={txtOwnerValidate} />
        <div>Property Class</div>
        <div></div>
        <div>Electoral Area</div>
        <div>{lblBusinessType}</div>
        <div>Use of Property</div>
        <div>Business Type:</div>
        <div>Owner's Name</div>
      </div>
      <button onClick={cmdLoadClick} style={{ display: 'none' }}>Load</button>
      <select value={lblBusname} onChange={(e) => setLblBusname(e.target.value)}>
        {/* Options will be populated dynamically */}
      </select>
      <table style={{ display: 'none' }}>
        <thead>
          <tr>
            <th>Buss No</th>
            <th>Receipt no</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {lstView3Items.map((item, index) => (
            <tr key={index} onClick={() => ListView2ItemClick(item)}>
              <td>{item.house_no}</td>
              <td>{item.receiptno}</td>
              <td>{item.amount}</td>
              <td>{item.transdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>Collector's Payment Entry</div>
      <div>House No:</div>
      <div></div>
      <div>Payment Date</div>
      <div>Amount to be posted:</div>
      <div>Payment Month</div>
      <div>Collector Code:</div>
      <div>Officer name:</div>
      <div>User Id</div>
      <div>Fiscal Year</div>
      <div>Receipt No</div>
      <div>Collector:</div>
      <div>MARCORY MUNICIPAL ASSEMBLY</div>
           
      <Link to="/main" className="primary m-3">
          Go Back
      </Link>
            
    </div>
  );
};

export default FrmPropertyBillPayments;
