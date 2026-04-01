// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { handleGetApi } from '../../utils/handleGetApi';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { HT_NSC_BASE, NGB_UAT_BASE, HT_LOAD_CHANGE_BASE } from '../../api/api.js';
// import "./LoadChangePay.css"

// const LoadChangePay = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isDisabled, setIsDisabled] = useState(false);

//   const [sdError, setSdError] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);
//   const [sdLoading, setSdLoading] = useState(false);
//   const MAX_RETRY = 2;

//   const printRef = useRef(null); // ✅ Add print ref
//   const locationData = location.state || location.state.data;



//   const {
//     new_supply_voltage,
//     connection_category,
//     lc_type,
//     new_contact_demand,
//     contract_demand_difference,
//     connection_purpose_id,
//     consumer_id,
//     consumer_name,
//     application_no,
//     existing_supply_voltage,
//     existing_contract_demand,
//     id,
//     type_of_change, connection_type,
//     registration_pdf,
//   } = useSelector(state => state.user.userData);

//   const fppasRateNew = 0.0841;
//   const unitPerKva = 190;
//   let registrationFeeCharges = 16800;
//   const transcoCharges = new_supply_voltage === "11 KV" && lc_type === "Load_Enhancement_without_Voltage_Change" ? 0 : 1100
//   const discomCharges = new_supply_voltage === "11 KV" && lc_type === "Load_Enhancement_without_Voltage_Change" ? 1260 : 160

//   if (type_of_change === 'Load_Reduction') {
//     registrationFeeCharges = 25;
//   }


//   const [charges, setCharges] = useState({
//     totalTranscoCharges: 0,
//     totalDiscomCharges: 0,
//     totalSupplyAffording: 0,
//     fixedCharge: 0,
//     fixedChargeAmount: 0,
//     energyCharge: 0,
//     energyChargeAmount: 0,
//     fppasChargeAmount: 0,
//     eDutyCharge: 0,
//     eDutyChargeAmount: 0,
//     totalChargesAmount: 0,
//     sdDays: 0,
//     totalSdRequired: 0,
//     totalSdDayAmount: 0,
//     totalPayAbleAmount: 0,
//   });
//   const supplyVoltageMap = {
//     '11 KV': 'A',
//     '33 KV': 'B',
//     '132 KV': 'C',
//     '220 KV': 'D',
//   };
//   // console.log(registration_pdf, 'registration_pdf');

//   // ✅ Function to round up to nearest 100
//   const roundUpToNearest100 = (amount) => {
//     if (!amount || amount <= 0) return 0;
//     return Math.ceil(amount / 100) * 100;
//   };

//   // ✅ Add Print Handler for Browser Print
//   const handleBrowserPrint = () => {
//     window.print();
//   };

//   useEffect(() => {
//     if (type_of_change !== 'Load_Reduction') {
//       const demand = [
//         'Load_Enhancement_without_Voltage_Change',
//         'Load_Enhancement_with_Downgrade_Voltage_Level',
//       ].includes(lc_type)
//         ? contract_demand_difference
//         : new_contact_demand;

//       let totalTranscoCharges = 0;
//       let totalDiscomCharges = 0;
//       let totalSupplyAffording = 0;
//       if (
//         new_supply_voltage === "11 KV" &&
//         lc_type === "Load_Enhancement_without_Voltage_Change"
//       ) {
//         // 🔥 POORA AMOUNT DISCOM ME JAYEGA
//         totalTranscoCharges = 0;
//         totalDiscomCharges = demand * 1260;
//         totalSupplyAffording = totalDiscomCharges;
//       } else {
//         // ✅ EXISTING LOGIC (UNCHANGED)
//         totalTranscoCharges = demand * transcoCharges;
//         totalDiscomCharges = demand * discomCharges;
//         totalSupplyAffording = totalTranscoCharges + totalDiscomCharges;
//       }
//       setCharges(prev => ({
//         ...prev,
//         totalTranscoCharges,
//         totalDiscomCharges,
//         totalSupplyAffording,
//       }));
//     } else {
//       setCharges(prev => ({ ...prev, totalPayAbleAmount: 25 }));
//     }
//   }, [lc_type, contract_demand_difference, new_contact_demand]);

//   useEffect(() => {
//     if (type_of_change !== 'Load_Reduction') {
//       const demand = [
//         'Load_Enhancement_without_Voltage_Change',
//         'Load_Enhancement_with_Downgrade_Voltage_Level',
//       ].includes(lc_type)
//         ? contract_demand_difference
//         : new_contact_demand;

//       let totalTranscoCharges = 0;
//       let totalDiscomCharges = 0;
//       let totalSupplyAffording = 0;
//       if (
//         new_supply_voltage === "11 KV" &&
//         lc_type === "Load_Enhancement_without_Voltage_Change"
//       ) {
//         // 🔥 POORA AMOUNT DISCOM ME JAYEGA
//         totalTranscoCharges = 0;
//         totalDiscomCharges = demand * 1260;
//         totalSupplyAffording = totalDiscomCharges;
//       } else {
//         // ✅ EXISTING LOGIC (UNCHANGED)
//         totalTranscoCharges = demand * transcoCharges;
//         totalDiscomCharges = demand * discomCharges;
//         totalSupplyAffording = totalTranscoCharges + totalDiscomCharges;
//       }

//       // Fetch duty and charges in the same block
//       const fetchCharges = async () => {
//         setSdLoading(true);
//         setSdError(false);

//         const supplyVoltageLabel = supplyVoltageMap[new_supply_voltage] || '';
//         let new_connection_category =
//           connection_category.slice(0, -1) + supplyVoltageLabel;

//         try {

//           const dutyRes = await handleGetApi(
//             `${HT_NSC_BASE}/get_duty_percentage_by_purpose_id_ngb/${connection_purpose_id}`
//           );

//           // const chargeRes = await handleGetApi(
//           //   `${NGB_UAT_BASE}/api/masters/getHtSdCalculationDetail/${new_connection_category}`
//           // );
//            const chargeRes = await handleGetApi(
//             `https://services.mpcz.in/HT-NIC/api/htPublicApis/getHtSdCalculationDetail/${new_connection_category}`
//           );



//           if (!dutyRes || !chargeRes) {
//             throw new Error("SD Calculation API Failed");
//           }

//           const monthlyFixedCharge =
//             chargeRes?.list?.[0]?.monthlyFixedCharge || 0;

//           const energyRate =
//             (chargeRes?.list?.[0]?.energyChargeUptoFiftyPer || 0) / 100;

//           const dutyPercentage =
//             dutyRes?.duty_percentages?.[0] || 0;

//           const fixedAmount =
//             contract_demand_difference * monthlyFixedCharge;

//           const energyAmount =
//             Math.round(contract_demand_difference * unitPerKva * energyRate);

//           const fppasAmount =
//             Math.round(energyAmount * fppasRateNew);

//           const dutyAmount =
//             Math.round(((energyAmount + fppasAmount) * dutyPercentage) / 100);

//           const totalChargesAmount =
//             Math.round(fixedAmount + energyAmount + fppasAmount + dutyAmount);

//           const sdDays =
//             [48, 24, 189, 190, 1059, 1060, 1061, 1062, 3, 4, 5, 16, 37, 52, 1063, 1064]
//               .includes(Number(connection_purpose_id))
//               ? 90
//               : 45;

//           const totalSdDayAmount =
//             Math.ceil((totalChargesAmount * sdDays) / 30);

//           const totalSdRequired =
//             roundUpToNearest100(totalSdDayAmount);


//           const totalPayAbleAmount =
//             totalSdRequired +
//             totalSupplyAffording +
//             registrationFeeCharges;


//           setCharges(prev => ({
//             ...prev,
//             fixedCharge: monthlyFixedCharge,
//             fixedChargeAmount: fixedAmount,
//             energyCharge: energyRate,
//             energyChargeAmount: energyAmount,
//             fppasChargeAmount: fppasAmount,
//             eDutyCharge: dutyPercentage,
//             eDutyChargeAmount: dutyAmount,
//             totalChargesAmount,
//             sdDays,
//             totalSdDayAmount,
//             totalSdRequired,
//             totalPayAbleAmount,
//           }));

//         } catch (error) {

//           console.error("SD Calculation Failed:", error);

//           if (retryCount < MAX_RETRY) {

//             setTimeout(() => {
//               setRetryCount(prev => prev + 1);
//             }, 2000);

//           } else {

//             setSdError(true);

//             setCharges(prev => ({
//               ...prev,
//               totalSdRequired: 0,
//               totalPayAbleAmount: prev.totalSupplyAffording + registrationFeeCharges
//             }));

//           }
//         } finally {
//           setSdLoading(false);   // ⭐ loader stop
//         }
//       };

//       fetchCharges();
//     }
//   }, [
//     lc_type,
//     contract_demand_difference,
//     new_contact_demand,
//     connection_purpose_id,
//     connection_category,
//     retryCount
//   ]);

//   console.log(charges, 'chargessssssss')
//   const submitHandler = async () => {

//     // 🚫 SD Mandatory Validation
//     if (
//       type_of_change === 'Load_Enhancement' &&
//       charges.totalSdRequired === 0 &&
//       (
//         lc_type === 'Load_Enhancement_without_Voltage_Change' ||
//         lc_type === 'Load_Enhancement_with_Downgrade_Voltage_Level'
//       )
//     ) {
//    alert('Unable to fetch Security Deposit charges. again login  Applicant(Consumer) Portal and regenerate the  charges.');
//       return; // ❌ STOP API CALL
//     }

//     const postData = {
//       application: id || '',
//       supply_voltage: new_supply_voltage,
//       connection_category,
//       connection_purpose_id,
//       new_contact_demand,
//       contract_demand_difference,
//       discom_charges: discomCharges,
//       total_discom_charges: charges.totalDiscomCharges || 0,
//       transco_charges: transcoCharges,
//       total_transco_charges: charges.totalTranscoCharges,
//       total_sac_amount: charges.totalSupplyAffording,
//       e_duty_charges: charges.eDutyCharge,
//       e_duty_charges_amount: charges.eDutyChargeAmount,
//       energy_charges: charges.energyCharge,
//       energy_charges_amount: charges.energyChargeAmount,
//       fppas_charges: fppasRateNew,
//       fppas_charges_amount: charges.fppasChargeAmount,
//       monthly_fixed_charges: charges.fixedCharge,
//       monthly_fixed_charges_amount: charges.fixedChargeAmount,
//       sd_days: charges.sdDays,
//       units_per_kva: unitPerKva,
//       total_charges_amount: charges.totalChargesAmount,
//       registration_fee_charges: registrationFeeCharges,
//       total_sd_days_amount: charges.totalSdDayAmount,
//       total_sd_required: charges.totalSdRequired,
//       total_pay_amount: charges.totalPayAbleAmount,
//     };

//     try {
//       setIsDisabled(true);
//       const response = await fetch(`${HT_LOAD_CHANGE_BASE}/tariff-charges/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(postData),
//       });

//       const result = await response.json();
//       console.log(result, 'result in payment')
//       // console.log('API Response:', result);
//       navigate(`/ht-load-change/payment/${id}`, { state: { result, locationData } });
//     } catch (error) {
//       setIsDisabled(false);
//       console.error('API Error:', error);
//     }

//     console.log(postData, 'postData');
//   };

//   console.log(locationData, 'locationData')
//   return (
//     <div>
//       <div
//         ref={printRef}
//         className="card mt-2 mb-2 bg-white rounded shadow-md mt-6 ml-30 mr-30 print-container"
//       >
//         {/* <div className="card-header px-4 py-2 border-b border-gray-300">
//           <h2 className="text-lg font-bold capitalize ">Required ME Details..</h2>
//         </div> */}
//         <div className="card-body px-4 pb-4">
//           <div className="table-resposnive overflow-auto">
//             <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2 print-table">
//               <thead className="bg-[#0c0d52] text-white">
//                 <tr>
//                   <th colSpan={6} className="px-6 py-3 text-sm font-medium text-center text-gray-500 uppercase text-white">
//                     Baisc Detials
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <td className="px-6 py-4 ">Application No</td>
//                   <td colSpan={2} className="px-6 py-4">{application_no}</td>
//                   <td className="px-6 py-4">Consumer No.</td>
//                   <td colSpan={2} className="px-6 py-4">
//                     {consumer_id}
//                   </td>
//                 </tr>
//                 <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <td className="px-6 py-4 ">Firm Name</td>
//                   <td colSpan={2} className="px-6 py-4">{consumer_name}</td>
//                   <td className="px-6 py-4">Existing Supply Voltage.</td>
//                   <td colSpan={2} className="px-6 py-4">
//                     {existing_supply_voltage}
//                   </td>
//                 </tr>
//                 <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <td className="px-6 py-4 ">Existing Contract Demand</td>
//                   <td colSpan={2} className="px-6 py-4">{existing_contract_demand}</td>
//                   <td className="px-6 py-4">Supply Voltage.</td>
//                   <td colSpan={2} className="px-6 py-4">
//                     {new_supply_voltage}
//                   </td>
//                 </tr>
//                 <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <td className="px-6 py-4 ">Contract Demand</td>
//                   <td colSpan={2} className="px-6 py-4">{new_contact_demand}</td>
//                   <td className="px-6 py-4">Contract Demand Difference.</td>
//                   <td colSpan={2} className="px-6 py-4">
//                     {contract_demand_difference}
//                   </td>
//                 </tr>

//                 <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <td className="px-6 py-4 ">Type Of Change</td>
//                   <td colSpan={2} className="px-6 py-4">{type_of_change}</td>
//                   <td className="px-6 py-4">SubType Of Change.</td>
//                   <td colSpan={2} className="px-6 py-4">
//                     {lc_type}
//                   </td>
//                 </tr>
//                 <tr>
//                   <th colSpan={6} className=" bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center text-gray-500 uppercase text-white">
//                     Registration Fee
//                   </th>
//                 </tr>
//                 <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <td className="px-6 py-4">Type of Fee</td>
//                   <td className="px-6 py-4">Registration Fee</td>
//                   <td className="px-6 py-4">Account Head</td>
//                   <td className="px-6 py-4">62.936</td>
//                   <td className="px-6 py-4"> Registration Fee Amount</td>
//                   <td className="px-6 py-4">
//                     {registrationFeeCharges}
//                   </td>
//                 </tr>
//                 {type_of_change === 'Load_Enhancement' && (
//                   <>
//                     <tr>
//                       <th colSpan={6} className=" bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center text-gray-500 uppercase text-white">
//                         Supply Affording Charges
//                       </th>
//                     </tr>
//                     {/* <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <td className="px-6 py-4">Type of Fee</td>
//                   <td className="px-6 py-4"> Transmission Charge Rs. @{transcoCharges} per KVA</td>
//                   <td className="px-6 py-4">Account Head</td>
//                   <td className="px-6 py-4">48.48/50.89</td>
//                   <td className="px-6 py-4">Transmission Charge Amount</td>
//                   <td className="px-6 py-4">
//                      {charges.totalTranscoCharges}
//                   </td>
//                 </tr> */}
//                     <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                       <td className="px-6 py-4">Type of Fee</td>
//                       <td className="px-6 py-4"> Supply Affording Charges Rs. @{1260} per KVA</td>
//                       <td className="px-6 py-4">Account Head</td>
//                       <td className="px-6 py-4">46.616/55.150</td>
//                       <td className="px-6 py-4">Supply Affording Charges Amount</td>
//                       <td className="px-6 py-4">
//                         {charges.totalSupplyAffording}
//                       </td>
//                     </tr>
//                     {/* <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <th colSpan={5} className="px-6 py-4 text-right text-gray-500">Total Supply Affording Charges</th>
//                   <td className="px-6 py-4"> {charges.totalSupplyAffording}</td>
//                 </tr> */}

//                     <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                       <td className="px-6 py-4">Type of Fee</td>
//                       <td className="px-6 py-4">Security Deposit (SD)</td>
//                       <td className="px-6 py-4">Account Head</td>
//                       <td className="px-6 py-4">
//                         {connection_type === "Permanent" ? 48.151 : 48.400}
//                       </td>
//                       <td className="px-6 py-4">Security Deposit Amount</td>

//                       <td className="px-6 py-4">

//                         {sdLoading ? (

//                           <div className="flex items-center gap-2 text-blue-600 justify-center">

//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>

//                             <span>Calculating SD...</span>

//                           </div>

//                         ) : (

//                           charges.totalSdRequired

//                         )}

//                       </td>

//                     </tr>


//                     {/* SD Error Row */}
//                     {sdError && (

//                       <tr>

//                         <td colSpan={6} className="text-center p-4 bg-red-50 border">

//                           <p className="text-red-600 font-semibold mb-2">

//                             Security Deposit calculation failed. Please regenerate Security Deposit.

//                           </p>

//                           <button
//                             disabled={sdLoading}
//                             onClick={() => {
//                               setRetryCount(0);
//                               setSdError(false);
//                               setRetryCount(prev => prev + 1);
//                             }}
//                             className={`px-4 py-2 text-white rounded
//                               ${sdLoading ? "bg-gray-400" : "bg-blue-600"}
//                                     `}
//                           >

//                             {sdLoading ? "Calculating..." : "Fetch SD"}

//                           </button>

//                         </td>

//                       </tr>

//                     )}
//                   </>
//                 )}
//                 <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <th colSpan={5} className="px-6 py-4 text-right text-gray-500">Total Payable Amount</th>
//                   <td className="px-6 py-4"> {type_of_change === 'Load_Reduction' ? 25 : charges.totalPayAbleAmount}</td>
//                 </tr>
//                 <tr className="no-print">
//                   <td colSpan={6}>
//                     <div className="border-b border-gray-900/10 pb-12 ">
//                       <div className="mt-10 flex flex-col justify-center items-center">
//                         <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
//                           <button
//                             onClick={handleBrowserPrint}
//                             className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 print-button"
//                           >
//                             Print
//                           </button>
//                           <button
//                             type="submit"
//                             onClick={submitHandler}
//                             className={`  text-white px-4 py-2 mt-4 rounded 
//                       ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-purple-800 text-white'}`}
//                             disabled={isDisabled}
//                           >
//                             {isDisabled ? 'Please wait...' : 'Submit'}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoadChangePay;


import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { handleGetApi } from '../../utils/handleGetApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { HT_NSC_BASE, NGB_UAT_BASE, HT_LOAD_CHANGE_BASE } from '../../api/api.js';
import "./LoadChangePay.css"

const LoadChangePay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sdError, setSdError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [sdLoading, setSdLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessages, setValidationMessages] = useState({
    energyChargeError: false,
    sdCalculationError: false,
    apiError: false,
    generalError: false
  });

  const MAX_RETRY = 2;
  const printRef = useRef(null);
  const locationData = location.state || location.state?.data;

  const {
    new_supply_voltage,
    connection_category,
    lc_type,
    new_contact_demand,
    contract_demand_difference,
    connection_purpose_id,
    consumer_id,
    consumer_name,
    application_no,
    existing_supply_voltage,
    existing_contract_demand,
    id,
    type_of_change,
    connection_type,
    registration_pdf,
  } = useSelector(state => state.user.userData);

  const fppasRateNew = 0.0841;
  const unitPerKva = 190;
  let registrationFeeCharges = 16800;
  const transcoCharges = new_supply_voltage === "11 KV" && lc_type === "Load_Enhancement_without_Voltage_Change" ? 0 : 1100
  const discomCharges = new_supply_voltage === "11 KV" && lc_type === "Load_Enhancement_without_Voltage_Change" ? 1260 : 160

  if (type_of_change === 'Load_Reduction') {
    registrationFeeCharges = 25;
  }

  const [charges, setCharges] = useState({
    totalTranscoCharges: 0,
    totalDiscomCharges: 0,
    totalSupplyAffording: 0,
    fixedCharge: 0,
    fixedChargeAmount: 0,
    energyCharge: 0,
    energyChargeAmount: 0,
    fppasChargeAmount: 0,
    eDutyCharge: 0,
    eDutyChargeAmount: 0,
    totalChargesAmount: 0,
    sdDays: 0,
    totalSdRequired: 0,
    totalSdDayAmount: 0,
    totalPayAbleAmount: 0,
  });

  const supplyVoltageMap = {
    '11 KV': 'A',
    '33 KV': 'B',
    '132 KV': 'C',
    '220 KV': 'D',
  };

  const roundUpToNearest100 = (amount) => {
    if (!amount || amount <= 0) return 0;
    return Math.ceil(amount / 100) * 100;
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  // Clear validation messages helper
  const clearValidationMessages = () => {
    setValidationMessages({
      energyChargeError: false,
      sdCalculationError: false,
      apiError: false,
      generalError: false
    });
    setErrorMessage("");
    setSdError(false);
  };

  // Set specific error message
  const setSpecificError = (type, message) => {
    setValidationMessages(prev => ({ ...prev, [type]: true }));
    setErrorMessage(message);
    setSdError(true);
  };

  useEffect(() => {
    if (type_of_change !== 'Load_Reduction') {
      const demand = [
        'Load_Enhancement_without_Voltage_Change',
        'Load_Enhancement_with_Downgrade_Voltage_Level',
      ].includes(lc_type)
        ? contract_demand_difference
        : new_contact_demand;

      let totalTranscoCharges = 0;
      let totalDiscomCharges = 0;
      let totalSupplyAffording = 0;

      if (
        new_supply_voltage === "11 KV" &&
        lc_type === "Load_Enhancement_without_Voltage_Change"
      ) {
        totalTranscoCharges = 0;
        totalDiscomCharges = demand * 1260;
        totalSupplyAffording = totalDiscomCharges;
      } else {
        totalTranscoCharges = demand * transcoCharges;
        totalDiscomCharges = demand * discomCharges;
        totalSupplyAffording = totalTranscoCharges + totalDiscomCharges;
      }
      setCharges(prev => ({
        ...prev,
        totalTranscoCharges,
        totalDiscomCharges,
        totalSupplyAffording,
      }));
    } else {
      setCharges(prev => ({ ...prev, totalPayAbleAmount: 25 }));
    }
  }, [lc_type, contract_demand_difference, new_contact_demand]);

  const normalizePurposeId = (id) => {
    const numId = Number(id);

    // Mapping rules
    if ([40,42, 43].includes(numId)) return 41;
    if ([82, 83].includes(numId)) return 82;
    if ([84, 85].includes(numId)) return 84;
    if ([17, 18].includes(numId)) return 17;
    if ([74, 77, 78].includes(numId)) return 78;

    return numId; // default same id
  };



  useEffect(() => {
    if (type_of_change !== 'Load_Reduction') {
      const demand = [
        'Load_Enhancement_without_Voltage_Change',
        'Load_Enhancement_with_Downgrade_Voltage_Level',
      ].includes(lc_type)
        ? contract_demand_difference
        : new_contact_demand;

      let totalTranscoCharges = 0;
      let totalDiscomCharges = 0;
      let totalSupplyAffording = 0;

      if (
        new_supply_voltage === "11 KV" &&
        lc_type === "Load_Enhancement_without_Voltage_Change"
      ) {
        totalTranscoCharges = 0;
        totalDiscomCharges = demand * 1260;
        totalSupplyAffording = totalDiscomCharges;
      } else {
        totalTranscoCharges = demand * transcoCharges;
        totalDiscomCharges = demand * discomCharges;
        totalSupplyAffording = totalTranscoCharges + totalDiscomCharges;
      }

      const fetchCharges = async () => {
        clearValidationMessages();
        setSdLoading(true);
        setSdError(false);

        const supplyVoltageLabel = supplyVoltageMap[new_supply_voltage] || '';
        let new_connection_category = connection_category.slice(0, -1) + supplyVoltageLabel;

        try {
          // Fetch duty percentage
          // const dutyRes = await handleGetApi(
          //   `${HT_NSC_BASE}/get_duty_percentage_by_purpose_id_ngb/${connection_purpose_id}`
          // );
          const normalizedPurposeId = normalizePurposeId(connection_purpose_id);

          const dutyRes = await handleGetApi(
            `${HT_NSC_BASE}/get_duty_percentage_by_purpose_id_ngb/${normalizedPurposeId}`
          );

          // Fetch SD calculation details
          const chargeRes = await handleGetApi(
            `https://services.mpcz.in/HT-NIC/api/htPublicApis/getHtSdCalculationDetail/${new_connection_category}`
          );

          // Check if API responses are valid
          if (!chargeRes || !chargeRes.list || chargeRes.list.length === 0) {
            throw new Error("Unable to fetch Security Deposit calculation data. Please try again later.");
          }

          const monthlyFixedCharge = chargeRes?.list?.[0]?.monthlyFixedCharge || 0;
          const energyRate = (chargeRes?.list?.[0]?.energyChargeUptoFiftyPer || 0) / 100;
          const dutyPercentage = dutyRes?.duty_percentages?.[0] || 0;

          // Calculate amounts
          const fixedAmount = contract_demand_difference * monthlyFixedCharge;
          const energyAmount = Math.round(contract_demand_difference * unitPerKva * energyRate);
          const fppasAmount = Math.round(energyAmount * fppasRateNew);
          const dutyAmount = Math.round(((energyAmount + fppasAmount) * dutyPercentage) / 100);
          const totalChargesAmount = Math.round(fixedAmount + energyAmount + fppasAmount + dutyAmount);

          // Validate energy amount
          if (energyAmount <= 0) {
            setSpecificError(
              "energyChargeError",
              "Security Deposit cannot be calculated because the Energy Charges amount is zero. This may be due to invalid demand value or rate. Please verify your input or contact support."
            );
            setCharges(prev => ({
              ...prev,
              totalSdRequired: 0,
              totalPayAbleAmount: 0,
              energyChargeAmount: 0
            }));
            setSdLoading(false);
            return;
          }

          const sdDays = [48, 24, 189, 190, 1059, 1060, 1061, 1062, 3, 4, 5, 16, 37, 52, 1063, 1064]
            .includes(Number(connection_purpose_id)) ? 90 : 45;

          const totalSdDayAmount = Math.ceil((totalChargesAmount * sdDays) / 30);
          const totalSdRequired = roundUpToNearest100(totalSdDayAmount);
          //  const totalSdRequired = 0; // 🔥 TEST CASE
          // Validate SD amount
          if (totalSdRequired <= 0) {
            setSpecificError(
              "sdCalculationError",
              "Security Deposit charges could not be fetch, resulting in a 0 amount. Please try again after some time."
            );
            setCharges(prev => ({
              ...prev,
              totalSdRequired: 0,
              totalPayAbleAmount: 0
            }));
            setSdLoading(false);
            return;
          }

          const totalPayAbleAmount = totalSdRequired + totalSupplyAffording + registrationFeeCharges;

          // Update charges with successful calculation
          setCharges(prev => ({
            ...prev,
            fixedCharge: monthlyFixedCharge,
            fixedChargeAmount: fixedAmount,
            energyCharge: energyRate,
            energyChargeAmount: energyAmount,
            fppasChargeAmount: fppasAmount,
            eDutyCharge: dutyPercentage,
            eDutyChargeAmount: dutyAmount,
            totalChargesAmount,
            sdDays,
            totalSdDayAmount,
            totalSdRequired,
            totalPayAbleAmount,
          }));

        } catch (error) {
          console.error("SD Calculation Failed:", error);

          if (retryCount < MAX_RETRY) {
            // Auto retry logic
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000);
            setErrorMessage("Retrying calculation... Please wait.");
          } else {
            const apiMessage = error?.response?.data?.message || error?.message ||
              "Unable to calculate Security Deposit due to a server error. Please check your internet connection and try again. If the problem persists, contact support.";

            setSpecificError("apiError", apiMessage);
            setCharges(prev => ({
              ...prev,
              totalSdRequired: 0,
              energyChargeAmount: 0,
              totalPayAbleAmount: 0
            }));
          }
        } finally {
          if (!validationMessages.energyChargeError && !validationMessages.sdCalculationError && !validationMessages.apiError) {
            setSdLoading(false);
          }
        }
      };

      fetchCharges();
    }
  }, [
    lc_type,
    contract_demand_difference,
    new_contact_demand,
    connection_purpose_id,
    connection_category,
    retryCount
  ]);

  const submitHandler = async () => {
    // Comprehensive validation before submission
    if (type_of_change === 'Load_Reduction') {
      // For load reduction, only check if not submitting
      if (isSubmitting) {
        setErrorMessage("Please wait, your request is being processed.");
        return;
      }
    } else {
      // For load enhancement, perform all validationsi
      if (sdLoading) {
        setErrorMessage("Please wait while we calculate the Security Deposit. This may take a few seconds.");
        return;
      }

      if (sdError) {
        setErrorMessage(errorMessage || "Unable to proceed due to calculation error. Please resolve the issues shown above.");
        return;
      }

      if (charges.energyChargeAmount <= 0) {
        setErrorMessage("Cannot proceed: Energy Charges are zero. This is required for Security Deposit calculation. Please verify your demand details or contact support.");
        return;
      }

      if (charges.totalSdRequired <= 0) {
        setErrorMessage("Cannot proceed: Security Deposit amount is invalid or zero. Please refresh the page and try again.");
        return;
      }

      if (!charges.totalSdRequired || charges.totalSdRequired === 0) {
        setErrorMessage("Security Deposit calculation is incomplete. Please wait for calculation to complete or refresh the page.");
        return;
      }
    }

    const postData = {
      application: id || '',
      supply_voltage: new_supply_voltage,
      connection_category,
      connection_purpose_id,
      new_contact_demand,
      contract_demand_difference,
      discom_charges: discomCharges,
      total_discom_charges: charges.totalDiscomCharges || 0,
      transco_charges: transcoCharges,
      total_transco_charges: charges.totalTranscoCharges,
      total_sac_amount: charges.totalSupplyAffording,
      e_duty_charges: charges.eDutyCharge,
      e_duty_charges_amount: charges.eDutyChargeAmount,
      energy_charges: charges.energyCharge,
      energy_charges_amount: charges.energyChargeAmount,
      fppas_charges: fppasRateNew,
      fppas_charges_amount: charges.fppasChargeAmount,
      monthly_fixed_charges: charges.fixedCharge,
      monthly_fixed_charges_amount: charges.fixedChargeAmount,
      sd_days: charges.sdDays,
      units_per_kva: unitPerKva,
      total_charges_amount: charges.totalChargesAmount,
      registration_fee_charges: registrationFeeCharges,
      total_sd_days_amount: charges.totalSdDayAmount,
      total_sd_required: charges.totalSdRequired,
      total_pay_amount: charges.totalPayAbleAmount,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(`${HT_LOAD_CHANGE_BASE}/tariff-charges/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      console.log(result, 'result in payment');
      navigate(`/ht-load-change/payment/${id}`, { state: { result, locationData } });
    } catch (error) {
      setIsSubmitting(false);
      console.error('API Error:', error);
      setErrorMessage("Failed to submit. Please check your connection and try again.");
    }
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = () => {
    if (type_of_change === 'Load_Reduction') {
      return isSubmitting;
    }
    return (
      isSubmitting ||
      sdLoading ||
      sdError ||
      charges.totalSdRequired <= 0 ||
      charges.energyChargeAmount <= 0 ||
      validationMessages.energyChargeError ||
      validationMessages.sdCalculationError ||
      validationMessages.apiError
    );
  };

  // Render error messages in user-friendly format
  const renderErrorMessage = () => {
    if (!sdError && !errorMessage) return null;

    let errorTitle = "";
    let errorDetails = "";
    let actionRequired = "";

    if (validationMessages.energyChargeError) {
      errorTitle = "⚠️ Energy Charge Calculation Issue";
      errorDetails = "The Energy Charges required for Security Deposit (calculation are zero).";
      // actionRequired = "Please verify your contract demand details. If the issue persists, contact support at support@mpcz.in";
    } else if (validationMessages.sdCalculationError) {
      errorTitle = "⚠️ Security Deposit Calculation Error";
      errorDetails = "The calculated Security Deposit amount is invalid or zero. Please try again after some time.";
      // actionRequired = "Please refresh the page and try again.";
    } else if (validationMessages.apiError) {
      errorTitle = "⚠️ Service Unavailable";
      errorDetails = "The service is currently unavailable due to a server issue. Please try again after some time.";
      // actionRequired = "Please check your internet connection and try again.";
    } else {
      errorTitle = "⚠️ Unable to Process";
      errorDetails = errorMessage || "An unexpected error occurred.";
      // actionRequired = "Please try again or contact support if the problem continues.";
    }

    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{errorTitle}</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{errorDetails}</p>
              {actionRequired && <p className="mt-1 font-medium">{actionRequired}</p>}
            </div>
            {validationMessages.apiError && (
              <button
                onClick={() => {
                  setRetryCount(0);
                  setSdError(false);
                  setValidationMessages(prev => ({ ...prev, apiError: false }));
                  setRetryCount(prev => prev + 1);
                }}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={sdLoading}
              >
                {sdLoading ? "Retrying..." : "Retry Calculation"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render loading state for SD calculation
  const renderSDCalculationStatus = () => {
    if (!sdLoading && !validationMessages.energyChargeError && !validationMessages.sdCalculationError) return null;

    if (sdLoading) {
      return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Calculating Security Deposit... Please wait while we process your request.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div
        ref={printRef}
        className="card mt-2 mb-2 bg-white rounded shadow-md mt-6 ml-30 mr-30 print-container"
      >
        <div className="card-body px-4 pb-4">
          <div className="table-resposnive overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2 print-table">
              <thead className="bg-[#0c0d52] text-white">
                <tr>
                  <th colSpan={6} className="px-6 py-3 text-sm font-medium text-center text-white uppercase">
                    Basic Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 font-medium">Application No</td>
                  <td colSpan={2} className="px-6 py-4">{application_no}</td>
                  <td className="px-6 py-4 font-medium">Consumer No.</td>
                  <td colSpan={2} className="px-6 py-4">{consumer_id}</td>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 font-medium">Firm Name</td>
                  <td colSpan={2} className="px-6 py-4">{consumer_name}</td>
                  <td className="px-6 py-4 font-medium">Existing Supply Voltage</td>
                  <td colSpan={2} className="px-6 py-4">{existing_supply_voltage}</td>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 font-medium">Existing Contract Demand</td>
                  <td colSpan={2} className="px-6 py-4">{existing_contract_demand}</td>
                  <td className="px-6 py-4 font-medium">New Supply Voltage</td>
                  <td colSpan={2} className="px-6 py-4">{new_supply_voltage}</td>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 font-medium">New Contract Demand</td>
                  <td colSpan={2} className="px-6 py-4">{new_contact_demand}</td>
                  <td className="px-6 py-4 font-medium">Contract Demand Difference</td>
                  <td colSpan={2} className="px-6 py-4">{contract_demand_difference}</td>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 font-medium">Type Of Change</td>
                  <td colSpan={2} className="px-6 py-4">{type_of_change}</td>
                  <td className="px-6 py-4 font-medium">SubType Of Change</td>
                  <td colSpan={2} className="px-6 py-4">{lc_type}</td>
                </tr>
                <tr>
                  <th colSpan={6} className="bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center uppercase">
                    Registration Fee
                  </th>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 font-medium">Type of Fee</td>
                  <td className="px-6 py-4">Registration Fee</td>
                  <td className="px-6 py-4 font-medium">Account Head</td>
                  <td className="px-6 py-4">62.936</td>
                  <td className="px-6 py-4 font-medium">Registration Fee Amount</td>
                  <td className="px-6 py-4 font-bold">₹ {registrationFeeCharges}</td>
                </tr>
                {type_of_change === 'Load_Enhancement' && (
                  <>
                    <tr>
                      <th colSpan={6} className="bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center uppercase">
                        Supply Affording Charges
                      </th>
                    </tr>
                    <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                      <td className="px-6 py-4 font-medium">Type of Fee</td>
                      <td className="px-6 py-4">Supply Affording Charges @ ₹{1260}/KVA</td>
                      <td className="px-6 py-4 font-medium">Account Head</td>
                      <td className="px-6 py-4">46.616/55.150</td>
                      <td className="px-6 py-4 font-medium">Supply Affording Charges Amount</td>
                      <td className="px-6 py-4 font-bold">₹ {charges.totalSupplyAffording}</td>
                    </tr>
                    <tr>
                      <th colSpan={6} className="bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center uppercase">
                        Security Deposit Charges
                      </th>
                    </tr>
                    <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                      <td className="px-6 py-4 font-medium">Type of Fee</td>
                      <td className="px-6 py-4">Security Deposit (SD)</td>
                      <td className="px-6 py-4 font-medium">Account Head</td>
                      <td className="px-6 py-4">{connection_type === "Permanent" ? "48.151" : "48.400"}</td>
                      <td className="px-6 py-4 font-medium">Security Deposit Amount</td>
                      <td className="px-6 py-4 font-bold">
                        {sdLoading ? (
                          <div className="flex items-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Calculating...</span>
                          </div>
                        ) : (
                          `₹ ${charges.totalSdRequired}`
                        )}
                      </td>
                    </tr>
                  </>
                )}
                <tr className="bg-gray-50 font-bold">
                  <th colSpan={5} className="px-6 py-4 text-right text-gray-700">Total Payable Amount</th>
                  <td className="px-6 py-4 text-xl font-bold text-green-600">
                    ₹ {type_of_change === 'Load_Reduction' ? 25 : charges.totalPayAbleAmount}
                  </td>
                </tr>
                <tr className="no-print">
                  <td colSpan={6}>
                    <div className="border-t border-gray-200 mt-6 pt-6">
                      {/* Error and Status Messages */}
                      {renderSDCalculationStatus()}
                      {renderErrorMessage()}

                      {/* Action Buttons */}
                      <div className="flex flex-col justify-center items-center space-y-4">
                        <div className="flex space-x-4">
                          <button
                            onClick={handleBrowserPrint}
                            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors print-button font-medium"
                          >
                            🖨️ Print
                          </button>
                          <button
                            type="submit"
                            onClick={submitHandler}
                            className={`px-6 py-2 rounded font-medium transition-colors ${isSubmitDisabled()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                              }`}
                            disabled={isSubmitDisabled()}
                          >
                            {sdLoading
                              ? '⏳ Calculating Security Deposit...'
                              : isSubmitting
                                ? '⏳ Processing...'
                                : '✅ Submit'}
                          </button>
                        </div>
                        {isSubmitDisabled() && !sdLoading && !isSubmitting && (
                          <p className="text-sm text-red-600 text-center">
                            ⚠️ Please resolve the issues above before proceeding to payment.
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadChangePay;