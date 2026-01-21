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
//   const transcoCharges =   new_supply_voltage === "11 KV" && lc_type === "Load_Enhancement_without_Voltage_Change" ? 0 : 1100 
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
//         const supplyVoltageLabel = supplyVoltageMap[new_supply_voltage] || '';
//         let new_connection_category = connection_category.slice(0, -1) + supplyVoltageLabel;

//         try {
//           // console.log(HT_NSC_BASE,"HT_NSC_BASE")
//           // console.log(NGB_UAT_BASE,"HT_NSC_BASE")
//           // console.log(HT_LOAD_CHANGE_BASE,"HT_LOAD_CHANGE_BASE")
//           // console.log(HT_LOAD_CHANGE_BASE,"HT_LOAD_CHANGE_BASE")
//           const dutyRes = await handleGetApi(
//             `${HT_NSC_BASE}/get_duty_percentage_by_purpose_id_ngb/${connection_purpose_id}`
//           );
//           const chargeRes = await handleGetApi(
//             `${NGB_UAT_BASE}/api/masters/getHtSdCalculationDetail/${new_connection_category}`
//           );

//           const monthlyFixedCharge = chargeRes?.list?.[0]?.monthlyFixedCharge || 0;
//           const energyRate = (chargeRes?.list?.[0]?.energyChargeUptoFiftyPer || 0) / 100;
//           const dutyPercentage = dutyRes?.duty_percentages?.[0] || 0;

//           const fixedAmount = contract_demand_difference * monthlyFixedCharge;
//           const energyAmount = Math.round(contract_demand_difference * unitPerKva * energyRate);
//           const fppasAmount = Math.round(energyAmount * fppasRateNew);
//           const dutyAmount = Math.round(((energyAmount + fppasAmount) * dutyPercentage) / 100);
//           const totalChargesAmount = Math.round(fixedAmount + energyAmount + fppasAmount + dutyAmount);

//           const sdDays = [48, 24, 189, 190, 1059, 1060, 1061, 1062, 3, 4, 5, 16, 37, 52, 1063, 1064].includes(Number(connection_purpose_id)) ? 90 : 45;
//           const totalSdDayAmount = Math.ceil((totalChargesAmount * sdDays) / 30);
//           const totalSdRequired = roundUpToNearest100(totalSdDayAmount);

//           const totalPayAbleAmount = totalSdRequired + totalSupplyAffording + registrationFeeCharges; // Same block me calculate

//           setCharges({
//             totalTranscoCharges,
//             totalDiscomCharges,
//             totalSupplyAffording,
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
//           });
//         } catch (error) {
//           console.error('Charge Calculation Error', error);
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
//   ]);

//   console.log(charges, 'chargessssssss')
//   const submitHandler = async () => {
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

//                     <tr>
//                       <th colSpan={6} className=" bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center text-gray-500 uppercase text-white">
//                         Security Deposit Charges (SD)
//                       </th>
//                     </tr>
//                     <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                       <td className="px-6 py-4">Type of Fee</td>
//                       <td className="px-6 py-4">Security Deposit (SD)</td>
//                       <td className="px-6 py-4">Account Head</td>
//                       <td className="px-6 py-4">{connection_type === "Permanent" ? 48.151 : 48.400}</td>
//                       <td className="px-6 py-4">Security Deposit Amount</td>
//                       <td className="px-6 py-4">
//                         {charges.totalSdRequired}
//                       </td>
//                     </tr>
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
  const [isDisabled, setIsDisabled] = useState(false);
  const printRef = useRef(null); // ✅ Add print ref
  const locationData = location.state || location.state.data;



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
    type_of_change, connection_type,
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
  // console.log(registration_pdf, 'registration_pdf');

  // ✅ Function to round up to nearest 100
  const roundUpToNearest100 = (amount) => {
    if (!amount || amount <= 0) return 0;
    return Math.ceil(amount / 100) * 100;
  };

  // ✅ Add Print Handler for Browser Print
  const handleBrowserPrint = () => {
    window.print();
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
        // 🔥 POORA AMOUNT DISCOM ME JAYEGA
        totalTranscoCharges = 0;
        totalDiscomCharges = demand * 1260;
        totalSupplyAffording = totalDiscomCharges;
      } else {
        // ✅ EXISTING LOGIC (UNCHANGED)
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
        // 🔥 POORA AMOUNT DISCOM ME JAYEGA
        totalTranscoCharges = 0;
        totalDiscomCharges = demand * 1260;
        totalSupplyAffording = totalDiscomCharges;
      } else {
        // ✅ EXISTING LOGIC (UNCHANGED)
        totalTranscoCharges = demand * transcoCharges;
        totalDiscomCharges = demand * discomCharges;
        totalSupplyAffording = totalTranscoCharges + totalDiscomCharges;
      }

      // Fetch duty and charges in the same block
      const fetchCharges = async () => {
        const supplyVoltageLabel = supplyVoltageMap[new_supply_voltage] || '';
        let new_connection_category = connection_category.slice(0, -1) + supplyVoltageLabel;

        try {
          // console.log(HT_NSC_BASE,"HT_NSC_BASE")
          // console.log(NGB_UAT_BASE,"HT_NSC_BASE")
          // console.log(HT_LOAD_CHANGE_BASE,"HT_LOAD_CHANGE_BASE")
          // console.log(HT_LOAD_CHANGE_BASE,"HT_LOAD_CHANGE_BASE")
          const dutyRes = await handleGetApi(
            `${HT_NSC_BASE}/get_duty_percentage_by_purpose_id_ngb/${connection_purpose_id}`
          );
          const chargeRes = await handleGetApi(
            `${NGB_UAT_BASE}/api/masters/getHtSdCalculationDetail/${new_connection_category}`
          );

          const monthlyFixedCharge = chargeRes?.list?.[0]?.monthlyFixedCharge || 0;
          const energyRate = (chargeRes?.list?.[0]?.energyChargeUptoFiftyPer || 0) / 100;
          const dutyPercentage = dutyRes?.duty_percentages?.[0] || 0;
          // console.log(dutyPercentage,'%%%%%%%%%%%%%')
          const fixedAmount = contract_demand_difference * monthlyFixedCharge;
          const energyAmount = Math.round(contract_demand_difference * unitPerKva * energyRate);
          const fppasAmount = Math.round(energyAmount * fppasRateNew);
          const dutyAmount = Math.round(((energyAmount + fppasAmount) * dutyPercentage) / 100);
          const totalChargesAmount = Math.round(fixedAmount + energyAmount + fppasAmount + dutyAmount);

          const sdDays = [48, 24, 189, 190, 1059, 1060, 1061, 1062, 3, 4, 5, 16, 37, 52, 1063, 1064].includes(Number(connection_purpose_id)) ? 90 : 45;
          const totalSdDayAmount = Math.ceil((totalChargesAmount * sdDays) / 30);
          const totalSdRequired = roundUpToNearest100(totalSdDayAmount);

          const totalPayAbleAmount = totalSdRequired + totalSupplyAffording + registrationFeeCharges; // Same block me calculate

          setCharges({
            totalTranscoCharges,
            totalDiscomCharges,
            totalSupplyAffording,
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
          });
        } catch (error) {
          console.error('Charge Calculation Error', error);
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
  ]);

  console.log(charges, 'chargessssssss')
  const submitHandler = async () => {

    // 🚫 SD Mandatory Validation
    if (
      type_of_change === 'Load_Enhancement' &&
      charges.totalSdRequired === 0 &&
      (
        lc_type === 'Load_Enhancement_without_Voltage_Change' ||
        lc_type === 'Load_Enhancement_with_Downgrade_Voltage_Level'
      )
    ) {
      alert('SD Required is mandatory. Please ensure Security Deposit is calculated.');
      return; // ❌ STOP API CALL
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
      setIsDisabled(true);
      const response = await fetch(`${HT_LOAD_CHANGE_BASE}/tariff-charges/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      console.log(result, 'result in payment')
      // console.log('API Response:', result);
      navigate(`/ht-load-change/payment/${id}`, { state: { result, locationData } });
    } catch (error) {
      setIsDisabled(false);
      console.error('API Error:', error);
    }

    console.log(postData, 'postData');
  };

  console.log(locationData, 'locationData')
  return (
    <div>
      <div
        ref={printRef}
        className="card mt-2 mb-2 bg-white rounded shadow-md mt-6 ml-30 mr-30 print-container"
      >
        {/* <div className="card-header px-4 py-2 border-b border-gray-300">
          <h2 className="text-lg font-bold capitalize ">Required ME Details..</h2>
        </div> */}
        <div className="card-body px-4 pb-4">
          <div className="table-resposnive overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2 print-table">
              <thead className="bg-[#0c0d52] text-white">
                <tr>
                  <th colSpan={6} className="px-6 py-3 text-sm font-medium text-center text-gray-500 uppercase text-white">
                    Baisc Detials
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 ">Application No</td>
                  <td colSpan={2} className="px-6 py-4">{application_no}</td>
                  <td className="px-6 py-4">Consumer No.</td>
                  <td colSpan={2} className="px-6 py-4">
                    {consumer_id}
                  </td>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 ">Firm Name</td>
                  <td colSpan={2} className="px-6 py-4">{consumer_name}</td>
                  <td className="px-6 py-4">Existing Supply Voltage.</td>
                  <td colSpan={2} className="px-6 py-4">
                    {existing_supply_voltage}
                  </td>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 ">Existing Contract Demand</td>
                  <td colSpan={2} className="px-6 py-4">{existing_contract_demand}</td>
                  <td className="px-6 py-4">Supply Voltage.</td>
                  <td colSpan={2} className="px-6 py-4">
                    {new_supply_voltage}
                  </td>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 ">Contract Demand</td>
                  <td colSpan={2} className="px-6 py-4">{new_contact_demand}</td>
                  <td className="px-6 py-4">Contract Demand Difference.</td>
                  <td colSpan={2} className="px-6 py-4">
                    {contract_demand_difference}
                  </td>
                </tr>

                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 ">Type Of Change</td>
                  <td colSpan={2} className="px-6 py-4">{type_of_change}</td>
                  <td className="px-6 py-4">SubType Of Change.</td>
                  <td colSpan={2} className="px-6 py-4">
                    {lc_type}
                  </td>
                </tr>
                <tr>
                  <th colSpan={6} className=" bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center text-gray-500 uppercase text-white">
                    Registration Fee
                  </th>
                </tr>
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4">Type of Fee</td>
                  <td className="px-6 py-4">Registration Fee</td>
                  <td className="px-6 py-4">Account Head</td>
                  <td className="px-6 py-4">62.936</td>
                  <td className="px-6 py-4"> Registration Fee Amount</td>
                  <td className="px-6 py-4">
                    {registrationFeeCharges}
                  </td>
                </tr>
                {type_of_change === 'Load_Enhancement' && (
                  <>
                    <tr>
                      <th colSpan={6} className=" bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center text-gray-500 uppercase text-white">
                        Supply Affording Charges
                      </th>
                    </tr>
                    {/* <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4">Type of Fee</td>
                  <td className="px-6 py-4"> Transmission Charge Rs. @{transcoCharges} per KVA</td>
                  <td className="px-6 py-4">Account Head</td>
                  <td className="px-6 py-4">48.48/50.89</td>
                  <td className="px-6 py-4">Transmission Charge Amount</td>
                  <td className="px-6 py-4">
                     {charges.totalTranscoCharges}
                  </td>
                </tr> */}
                    <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                      <td className="px-6 py-4">Type of Fee</td>
                      <td className="px-6 py-4"> Supply Affording Charges Rs. @{1260} per KVA</td>
                      <td className="px-6 py-4">Account Head</td>
                      <td className="px-6 py-4">46.616/55.150</td>
                      <td className="px-6 py-4">Supply Affording Charges Amount</td>
                      <td className="px-6 py-4">
                        {charges.totalSupplyAffording}
                      </td>
                    </tr>
                    {/* <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <th colSpan={5} className="px-6 py-4 text-right text-gray-500">Total Supply Affording Charges</th>
                  <td className="px-6 py-4"> {charges.totalSupplyAffording}</td>
                </tr> */}

                    <tr>
                      <th colSpan={6} className=" bg-[#0c0d52] text-white px-6 py-3 text-sm font-medium text-center text-gray-500 uppercase text-white">
                        Security Deposit Charges (SD)
                      </th>
                    </tr>
                    <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                      <td className="px-6 py-4">Type of Fee</td>
                      <td className="px-6 py-4">Security Deposit (SD)</td>
                      <td className="px-6 py-4">Account Head</td>
                      <td className="px-6 py-4">{connection_type === "Permanent" ? 48.151 : 48.400}</td>
                      <td className="px-6 py-4">Security Deposit Amount</td>
                      <td className="px-6 py-4">
                        {charges.totalSdRequired}
                      </td>
                    </tr>
                  </>
                )}
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <th colSpan={5} className="px-6 py-4 text-right text-gray-500">Total Payable Amount</th>
                  <td className="px-6 py-4"> {type_of_change === 'Load_Reduction' ? 25 : charges.totalPayAbleAmount}</td>
                </tr>
                <tr className="no-print">
                  <td colSpan={6}>
                    <div className="border-b border-gray-900/10 pb-12 ">
                      <div className="mt-10 flex flex-col justify-center items-center">
                        <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                          <button
                            onClick={handleBrowserPrint}
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 print-button"
                          >
                            Print
                          </button>
                          <button
                            type="submit"
                            onClick={submitHandler}
                            className={`  text-white px-4 py-2 mt-4 rounded 
                      ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-purple-800 text-white'}`}
                            disabled={isDisabled}
                          >
                            {isDisabled ? 'Please wait...' : 'Submit'}
                          </button>
                        </div>
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







