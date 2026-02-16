// import { Link } from 'react-router-dom';
// import React, { useRef, useState } from 'react';
// import banner from '../assets/image/banner.png';
// import html2pdf from 'html2pdf.js';
// import { HT_LOAD_CHANGE_BASE } from "../api/api.js";

// export default function ApplicantBasicDetails({ htConsumers, register, errors }) {
//   const printRef = useRef();
//   // console.log(htConsumers, "htConsumers")
//   const required = htConsumers?.survey?.is_estimate_required?.split(',') || [];
//   const HIGH_VOLT = htConsumers?.new_supply_voltage === "132 KV" || htConsumers?.new_supply_voltage === "132 KV";
//   const approval_from_edcra = HIGH_VOLT && htConsumers?.transco_approval;

//   //  console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE inside Applicant basic details')
//   const handlePrint = () => {
//     const element = printRef.current;
//     const opt = {
//       margin: 0.5,
//       filename: `${htConsumers?.application_no}.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2, logging: true, useCORS: true },
//       jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
//     };
//     html2pdf().set(opt).from(element).save();
//   };

//   /* ---------- Small presentational helpers ---------- */
//   function DocumentTrBloack({ Lable, docLink }) {
//     return (
//       <tr>
//         <th colSpan={2} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//           {Lable}
//         </th>
//         <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//           <Link to={`https://htsanyojan.mpcz.in:8089${docLink}`} target="_blank" rel="noopener noreferrer"
//             className="rounded-lg mt-2 px-3 py-2 text-center text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300">
//             {docLink ? 'View PDF File' : 'No File View'}
//           </Link>
//         </th>
//       </tr>
//     );
//   }

//   function GeneratePDF({ baseUrl, url, id, Lable }) {
//     const [docLink, setDocLink] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const handleDownload = async (baseUrl, url, id) => {
//       console.log(baseUrl, 'baseUrllll')
//       console.log(url, 'url')
//       console.log(id, 'idddddd')
//       setLoading(true);
//       try {
//         const response = await fetch(`${baseUrl}${url}${id}`);
//         const result = await response.json();
//         console.log('PDF Generation Result:', result);
//         if (result?.pdf_url) setDocLink(result.pdf_url);
//         else alert('File link not found!');
//       } catch (error) {
//         console.error('Error generating PDF:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     return (
//       <tr>
//         <th colSpan={2} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//           {Lable}
//         </th>
//         <th className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
//           <div className="text-center">
//             {docLink ? (
//               <Link to={`https://htsanyojan.mpcz.in:8089${docLink}`} target="_blank" rel="noopener noreferrer"
//                 className="rounded-lg mt-2 px-3 py-2 text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300">
//                 View PDF File
//               </Link>
//             ) : (
//               <button onClick={() => handleDownload(baseUrl, url, id)} disabled={loading}
//                 className={`rounded-lg mt-2 px-3 py-2 text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300 ${loading && 'opacity-70 cursor-not-allowed'}`}>
//                 {loading ? 'Generating...' : 'Download PDF'}
//               </button>
//             )}
//           </div>
//         </th>
//       </tr>
//     );
//   }

//   function TableTrBloack({ Lable, Value, colSpan = 1 }) {
//     return (
//       <>
//         <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{Lable}</th>
//         <td colSpan={colSpan} style={{ border: '1px solid #ccc', padding: '8px' }}>
//           {Value ?? 'N/A'}
//         </td>
//       </>
//     );
//   }

//   /* ---------- Generic step summary renderer ---------- */
//   // stepObj: object containing the step (e.g., load_sanction, survey, demand_note_generation...)
//   // name: display name, sourceLabel: label to show source (like 'From'), nextLabel: label for next action
//   function renderStepSummary(stepObj, { name, statusKey = 'response', acceptKeys = ['accept_remark', 'accept_remark'], revertKeys = ['revert_remark', 'revert_reason'], nextKey = 'is_required', sourceLabel = 'Source', nextLabel = 'Next Action' } = {}) {
//     if (!stepObj) return null;

//     // Normalize status detection: check common keys for Accepted/Reverted etc.
//     const statusCandidates = [
//       stepObj?.[`${statusKey}`],
//       stepObj?.[`${statusKey}_response`],
//       stepObj?.status,
//       stepObj?.load_sanction_response,
//       stepObj?.survey_response,
//       stepObj?.demand_note_response,
//       stepObj?.load_sanction_response,
//       stepObj?.commissioning_permission_response, // ✅ ADD
//       stepObj?.bicell_response
//     ];

//     // const status = (statusCandidates.find(Boolean) ?? '').toString();
//     const status = (statusCandidates.find(v => v !== null && v !== undefined && v !== '') ?? '').toString();

//     // find accept / revert remark robustly
//     // const acceptRemark = acceptKeys.map(k => stepObj?.[k]).find(Boolean);
//     // const revertRemark = revertKeys.map(k => stepObj?.[k]).find(Boolean);

//     // robust remark pick
//     const acceptRemark =
//       stepObj?.accept_remark ||
//       stepObj?.remark ||
//       stepObj?.approval_remark ||
//       null;

//     const revertRemark =
//       stepObj?.revert_remark ||
//       stepObj?.revert_reason ||
//       stepObj?.reason ||
//       null;

//     const nextAction = stepObj?.[nextKey] ?? stepObj?.next_action ?? 'N/A';

//     return (
//       <>
//         <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//           <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//             <h2>{name}</h2>
//           </th>
//         </tr>
//         <tr>
//           <TableTrBloack Lable={`${name} Status`} Value={status || 'N/A'} />
//           <TableTrBloack Lable={nextLabel} Value={nextAction || 'N/A'} />
//         </tr>

//         {/* show remark based on status */}
//         {revertRemark ? (
//           <tr>
//             <TableTrBloack Lable={'Revert Remark'} Value={revertRemark || stepObj?.revert_remark || 'N/A'} colSpan={3} />
//           </tr>
//         ) : (
//           <tr>
//             <TableTrBloack Lable={'Accept Remark'} Value={approval_from_edcra && name.toLowerCase().includes('load') ? (htConsumers?.transco_approval?.remark || acceptRemark) : (acceptRemark || stepObj?.accept_remark || 'N/A')} colSpan={3} />
//           </tr>
//         )}
//       </>
//     );
//   }

//   /* ---------- Main render ---------- */
//   return (
//     <>
//       <div className="">
//         <div
//           ref={printRef}
//           style={{
//             maxWidth: '100%',
//             margin: 'auto',
//             border: '1px solid #ddd',
//             padding: '20px',
//             backgroundColor: '#ffffff',
//           }}
//         >
//           <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//             <img src={banner} alt="logo" style={{ width: '100%', height: 'auto' }} />
//           </div>

//           <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
//             <tbody>
//               {/* Consumer Basic */}
//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                   Consumer Basic Details..
//                 </th>
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Application No'} Value={htConsumers?.application_no} />
//                 <TableTrBloack Lable={'Consumer Id'} Value={htConsumers?.consumer_id} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Mobile'} Value={htConsumers?.mobile} />
//                 <TableTrBloack Lable={'Consumer Name'} Value={htConsumers?.consumer_name} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Email'} Value={htConsumers?.email} />
//                 <TableTrBloack Lable={'Application Date'} Value={htConsumers?.registration_date || 'N/A'} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Pan Card No'} Value={htConsumers?.pan_card_no} />
//                 <TableTrBloack Lable={'Connection Date'} Value={htConsumers?.connection_date} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Load Effective Date'} Value={htConsumers?.existing_load_effective_date || 'N/A'} />
//                 <TableTrBloack Lable={'Last Reduction Date'} Value={htConsumers?.last_reduction_date || 'N/A'} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Region'} Value={htConsumers?.region} />
//                 <TableTrBloack Lable={'Circle'} Value={htConsumers?.circle} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Division'} Value={htConsumers?.division} />
//                 <TableTrBloack Lable={'Substation Name'} Value={htConsumers?.substation_name || 'N/A'} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Feeder Name'} Value={htConsumers?.feeder_name || 'N/A'} />
//                 <TableTrBloack Lable={'Address'} Value={htConsumers?.address} />
//               </tr>

//               {/* Connection Details */}
//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                   <h2>Connection Details..</h2>
//                 </th>
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Connection Type'} Value={htConsumers?.connection_type} />
//                 <TableTrBloack Lable={'Connection Category'} Value={htConsumers?.connection_category} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Connection Sub Category'} Value={htConsumers?.connection_sub_category} />
//                 <TableTrBloack Lable={'Connection Purpose'} Value={htConsumers?.connection_purpose} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Existing Supply Voltage'} Value={htConsumers?.existing_supply_voltage} />
//                 <TableTrBloack Lable={'Existing Contract Demand'} Value={htConsumers?.existing_contract_demand} />
//               </tr>

//               {/* Meter & ME */}
//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                   <h2>METER & ME Details...</h2>
//                 </th>
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Meter No'} Value={htConsumers?.meter_no} />
//                 <TableTrBloack Lable={'Meter Make'} Value={htConsumers?.meter_make} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Meter Ct Ratio'} Value={htConsumers?.meter_ct_ratio} />
//                 <TableTrBloack Lable={'Meter Pt Ratio'} Value={htConsumers?.meter_pt_ratio} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Meter Accuracy'} Value={htConsumers?.meter_accuracy} />
//                 <TableTrBloack Lable={'Meter Type'} Value={htConsumers?.meter_type} colSpan={2} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Net Meter Install Date'} Value={htConsumers?.net_meter_install_date || 'N/A'} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'ME Serial'} Value={htConsumers?.me_serial_no} />
//                 <TableTrBloack Lable={'ME Make'} Value={htConsumers?.me_make} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'ME Ct Ratio'} Value={htConsumers?.me_ct_ratio} />
//                 <TableTrBloack Lable={'ME Pt Ratio'} Value={htConsumers?.me_pt_ratio} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Solar Installation Capacity'} Value={htConsumers?.solar_installation_capacity || 'N/A'} />
//                 <TableTrBloack Lable={'Dial Factor'} Value={htConsumers?.dial_factor} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'MF (Multiply)'} Value={htConsumers?.mf || 'N/A'} />
//               </tr>

//               {/* Bill Details */}
//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                   <h2>Bill Details...</h2>
//                 </th>
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Current Bill Id'} Value={htConsumers?.current_bill_id} />
//                 <TableTrBloack Lable={'Current Bill Month'} Value={htConsumers?.current_bill_month} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Current Bill Units'} Value={htConsumers?.current_bill_units} />
//                 <TableTrBloack Lable={'Current Net Bill'} Value={htConsumers?.current_net_bill_amt} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Current Paid Amount'} Value={htConsumers?.outstanding_amt || 'N/A'} />
//                 <TableTrBloack Lable={'Current Month Outstanding Amount'} Value={htConsumers?.current_month_outstanding_amt || 'N/A'} />
//               </tr>

//               {/* Load Change Details */}
//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                   <h2>Load Change Required Details...</h2>
//                 </th>
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Type of Change'} Value={htConsumers?.type_of_change} />
//                 <TableTrBloack Lable={'Types of Change'} Value={htConsumers?.lc_type} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'New Supply Voltage'} Value={htConsumers?.new_supply_voltage} />
//                 <TableTrBloack Lable={'Total Required Contract Demand(in KVA)'} Value={htConsumers?.new_contact_demand} />
//               </tr>

//               <tr>
//                 <TableTrBloack Lable={'Change in Contract Demand (in KVA)'} Value={htConsumers?.contract_demand_difference} />
//                 <TableTrBloack Lable={'Purpose Of Installation Details'} Value={htConsumers?.purpose_of_installation_details} />
//               </tr>

//               {/* Bank Details */}
//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                   <h2>Bank Details...</h2>
//                 </th>
//               </tr>
//               <tr>
//                 <TableTrBloack Lable={'Account Holder Name'} Value={htConsumers?.ac_holder_name} />
//                 <TableTrBloack Lable={'Bank Name'} Value={htConsumers?.bank_name} />
//               </tr>
//               <tr>
//                 <TableTrBloack Lable={'Bank IFSC Code'} Value={htConsumers?.bank_ifsc_code} />
//                 <TableTrBloack Lable={'Bank Account Number'} Value={htConsumers?.bank_ac_no} />
//               </tr>

//               {/* ---------- Step-based conditional summaries (Load sanction, survey, demand note, agreement, etc.) ---------- */}

//               {/* Load Sanction / Load Acceptance */}
//               {htConsumers?.load_sanction && renderStepSummary(htConsumers?.load_sanction, {
//                 name: 'Load Acceptance Details',
//                 statusKey: 'load_sanction_response',
//                 acceptKeys: ['accept_remark', 'accept_remark'],
//                 revertKeys: ['revert_remark', 'revert_reason'],
//                 nextKey: 'is_required',
//                 nextLabel: 'Next Action'
//               })}

//               {/* Bi-Cell Approval */}
//               {htConsumers?.bicell_response && renderStepSummary(
//                 htConsumers?.bicell_response,
//                 {
//                   name: 'Bi-Cell Approval Details',
//                   statusKey: 'status',
//                   acceptKeys: ['accept_remark', 'remark'],
//                   revertKeys: ['revert_remark', 'revert_reason'],
//                   nextKey: 'next_action',
//                   nextLabel: 'Next Action'
//                 }
//               )}

//               {/* Commissioning Permission */}
//               {htConsumers?.commissioning_permission && renderStepSummary(
//                 htConsumers?.commissioning_permission,
//                 {
//                   name: 'Commissioning Permission Details',
//                   statusKey: 'commissioning_permission_response',
//                   acceptKeys: ['accept_remark', 'remark'],
//                   revertKeys: ['revert_remark', 'revert_reason'],
//                   nextKey: 'next_action',
//                   nextLabel: 'Next Action'
//                 }
//               )}



//               {/* If edcra / transco approval exists and is different, show it */}
//               {htConsumers?.transco_approval && (
//                 <>
//                   {renderStepSummary(htConsumers?.transco_approval, {
//                     name: 'Transco Approval',
//                     statusKey: 'status',
//                     acceptKeys: ['remark', 'accept_remark'],
//                     revertKeys: ['revert_remark', 'revert_reason'],
//                     nextKey: 'next_action',
//                     nextLabel: 'Next Action'
//                   })}
//                 </>
//               )}

//               {htConsumers?.edcra_approval && renderStepSummary(htConsumers?.edcra_approval, {
//                 name: 'EDC/RA Approval',
//                 statusKey: 'status',
//                 acceptKeys: ['remark'],
//                 revertKeys: ['revert_remark'],
//                 nextKey: 'next_action',
//                 nextLabel: 'Next Action'
//               })}

//               {/* Survey */}
//               {htConsumers?.survey && renderStepSummary(htConsumers?.survey, {
//                 name: 'Survey Details',
//                 statusKey: 'survey_response',
//                 acceptKeys: ['accept_remark', 'ndf_status'],
//                 revertKeys: ['revert_remark', 'is_survey_reverted'],
//                 nextKey: 'is_required',
//                 nextLabel: 'Next Action'
//               })}

//               {/* When survey accepted, show location & estimate details */}
//               {htConsumers?.survey?.survey_response === "Accepted" && (
//                 <>
//                   <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                     <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                       <h2>Latitude & Longitude (ME Installation)</h2>
//                     </th>
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={'Latitude of ME Installation Location'} Value={htConsumers?.survey?.latitude} />
//                     <TableTrBloack Lable={'Longitude of ME Installation Location'} Value={htConsumers?.survey?.longitude} />
//                   </tr>
//                 </>
//               )}

//               {/* show NDF / ME estimate details when required */}
//               {required.includes('is_me_meter_required') && (
//                 <>
//                   <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                     <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                       <h2>ERP Details Of NDF (ME Meter Estimate)..</h2>
//                     </th>
//                   </tr>

//                   <tr>
//                     <TableTrBloack Lable={"ME METER Approved By"} Value={htConsumers?.survey?.ndf_approved_by_name} />
//                     <TableTrBloack Lable={"ME METER Circle Name"} Value={htConsumers?.survey?.ndf_circle_name} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"ME METER Division Name"} Value={htConsumers?.survey?.ndf_division_name} />
//                     <TableTrBloack Lable={"ME METER Estimate Date"} Value={htConsumers?.survey?.ndf_estimate_date} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"ME METER Long Name"} Value={htConsumers?.survey?.ndf_long_name} />
//                     <TableTrBloack Lable={"ME METER Sanction Amount"} Value={htConsumers?.survey?.ndf_sanction_amt} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"ME METER Sanction Date"} Value={htConsumers?.survey?.ndf_sanction_date || "N/A"} />
//                     <TableTrBloack Lable={"ME METER Scheme Name"} Value={htConsumers?.survey?.ndf_scheme_name} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"ME METER Status"} Value={htConsumers?.survey?.ndf_status} />
//                     <TableTrBloack Lable={"ME METER Total Amount"} Value={htConsumers?.survey?.ndf_total_amt} />
//                   </tr>
//                 </>
//               )}

//               {/* Extension work estimate */}
//               {required.includes('is_extension_work_required') && (
//                 <>
//                   <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                     <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
//                       <h2>ERP Details Of Extension Work..</h2>
//                     </th>
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"ERP No"} Value={htConsumers?.survey?.erp_no} />
//                     <TableTrBloack Lable={"Estimate Date"} Value={htConsumers?.survey?.estimate_date} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"Long Name"} Value={htConsumers?.survey?.long_name} />
//                     <TableTrBloack Lable={"Status"} Value={htConsumers?.survey?.status} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"Scheme Name"} Value={htConsumers?.survey?.scheme_name} />
//                     <TableTrBloack Lable={"Supervision Amount"} Value={htConsumers?.survey?.supervision_amt} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"Supervision CGST Cost"} Value={htConsumers?.survey?.supervision_cgst} />
//                     <TableTrBloack Lable={"Supervision SGST Cost"} Value={htConsumers?.survey?.supervision_sgst} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable={"Total Amount"} Value={htConsumers?.survey?.total_estimated_amt} colSpan={4} />
//                   </tr>
//                 </>
//               )}

//               {/* Demand Note */}
//               {htConsumers?.demand_note_generation && renderStepSummary(htConsumers?.demand_note_generation, {
//                 name: 'Demand Note Details',
//                 statusKey: 'demand_note_response',
//                 acceptKeys: ['demand_note_response', 'demand_note_response'],
//                 revertKeys: ['revert_remark', 'demand_note_response'],
//                 nextKey: null,
//                 nextLabel: 'Next Action'
//               })}

//               {htConsumers?.demand_note_generation && (
//                 <tr>
//                   <TableTrBloack Lable={'Next Action'} Value={'Pay Demand Note Amount'} />
//                   <TableTrBloack Lable={'Total Demand Note Amount'} Value={htConsumers?.demand_note_generation?.total_demand_note_amt} colSpan={3} />
//                 </tr>
//               )}

//               {htConsumers?.is_demandnote_fee_submitted_bypg || htConsumers?.is_demandnote_fee_submitted && (
//                 <tr>
//                   <TableTrBloack Lable={'Next Action'} Value={'Agreement Finalization'} />
//                   <TableTrBloack Lable={'Demand Note Payment Status'} Value={htConsumers?.is_demandnote_fee_submitted_bypg || htConsumers?.is_demandnote_fee_submitted ? "Done" : "Pending"} colSpan={3} />
//                 </tr>
//               )}

//               {/* Agreement Finalization */}
//               {htConsumers?.agreement_details && renderStepSummary(htConsumers?.agreement_details, {
//                 name: 'Agreement Finalization Details',
//                 statusKey: 'agreement_status',
//                 acceptKeys: ['agreement_no'],
//                 revertKeys: ['revert_remark'],
//                 nextKey: null,
//                 nextLabel: 'Next Action'
//               })}

//               {/* Agreement specific fields */}
//               {htConsumers?.agreement_details && (
//                 <>
//                   <tr>
//                     <TableTrBloack Lable={'Agreement No'} Value={htConsumers?.agreement_details?.agreement_no} />
//                     <TableTrBloack Lable={'Agreement Execution Date'} Value={htConsumers?.agreement_details?.agreement_effective_date} />
//                   </tr>
//                   <tr>
//                     {htConsumers?.agreement_details?.me_meter_work_order_no && <TableTrBloack Lable={'ME Meter Work Order No'} Value={htConsumers?.agreement_details?.me_meter_work_order_no} />}
//                     {htConsumers?.agreement_details?.me_meter_work_order_date && <TableTrBloack Lable={'ME Meter Work Order Date'} Value={htConsumers?.agreement_details?.me_meter_work_order_date} />}
//                   </tr>
//                   <tr>
//                     {htConsumers?.agreement_details?.ex_work_order_no && <TableTrBloack Lable={'Extension Work Order No'} Value={htConsumers?.agreement_details?.ex_work_order_no} />}
//                     {htConsumers?.agreement_details?.ex_work_order_date && <TableTrBloack Lable={'Extension Work Order Date'} Value={htConsumers?.agreement_details?.ex_work_order_date} />}
//                   </tr>
//                 </>
//               )}

//               {/* ---------------- BICELL RESPONSE ---------------- */}
//               {htConsumers?.bicell_response &&
//                 renderStepSummary(htConsumers?.bicell_response, {
//                   name: "Bi-Cell Commissioning",
//                   statusKey: "bi_cell_response",
//                   acceptKeys: [
//                     "import_meter_reading_kva",
//                     "import_meter_reading_kvah",
//                     "import_meter_reading_kwh",
//                   ],
//                   revertKeys: ["revert_remark", "revert_reason"],
//                   nextKey: null,
//                   nextLabel: "Next Action",
//                 })}

//               {htConsumers?.bicell_response?.bi_cell_response === "Accepted" && (
//                 <>
//                   <tr style={{ backgroundColor: "#f9f9f9" }}>
//                     <th colSpan={4} style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
//                       <h2>Bi-Cell Meter Readings</h2>
//                     </th>
//                   </tr>

//                   {/* Import readings */}
//                   <tr>
//                     <TableTrBloack Lable="Import KVA" Value={htConsumers?.bicell_response?.import_meter_reading_kva} />
//                     <TableTrBloack Lable="Import KVAH" Value={htConsumers?.bicell_response?.import_meter_reading_kvah} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable="Import KWH" Value={htConsumers?.bicell_response?.import_meter_reading_kwh} />
//                     <TableTrBloack Lable="Import TOD1" Value={htConsumers?.bicell_response?.import_meter_reading_tod1} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable="Import TOD2" Value={htConsumers?.bicell_response?.import_meter_reading_tod2} />
//                     <TableTrBloack Lable="Import TOD3" Value={htConsumers?.bicell_response?.import_meter_reading_tod3} />
//                   </tr>
//                   <tr>
//                     <TableTrBloack Lable="Import TOD4" Value={htConsumers?.bicell_response?.import_meter_reading_tod4} />
//                     <TableTrBloack Lable="MD Reset Date" Value={htConsumers?.bicell_response?.md_reset_date || "N/A"} />
//                   </tr>

//                   {/* Export readings if exist */}
//                   {htConsumers?.bicell_response?.export_meter_reading_kva && (
//                     <>
//                       <tr style={{ backgroundColor: "#f9f9f9" }}>
//                         <th colSpan={4} style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
//                           <h2>Export Meter Readings</h2>
//                         </th>
//                       </tr>

//                       <tr>
//                         <TableTrBloack Lable="Export KVA" Value={htConsumers?.bicell_response?.export_meter_reading_kva} />
//                         <TableTrBloack Lable="Export KVAH" Value={htConsumers?.bicell_response?.export_meter_reading_kvah} />
//                       </tr>
//                       <tr>
//                         <TableTrBloack Lable="Export KWH" Value={htConsumers?.bicell_response?.export_meter_reading_kwh} />
//                         <TableTrBloack Lable="Export TOD1" Value={htConsumers?.bicell_response?.export_meter_reading_tod1} />
//                       </tr>
//                       <tr>
//                         <TableTrBloack Lable="Export TOD2" Value={htConsumers?.bicell_response?.export_meter_reading_tod2} />
//                         <TableTrBloack Lable="Export TOD3" Value={htConsumers?.bicell_response?.export_meter_reading_tod3} />
//                       </tr>
//                       <tr>
//                         <TableTrBloack Lable="Export TOD4" Value={htConsumers?.bicell_response?.export_meter_reading_tod4} colSpan={4} />
//                       </tr>
//                     </>
//                   )}
//                 </>
//               )}




//               {/* Documents area */}
//             </tbody>
//           </table>

//           <div style={{ textAlign: 'center', marginTop: '16px' }}>
//             <button type="button" onClick={handlePrint} className="bg-[#3b82f6] text-white text-base p-4 mt-2 mb-2 rounded">
//               Download Application Details
//             </button>
//           </div>
//         </div>

//         {/* Documents card (unchanged) */}
//         <div className="card mt-2 mb-2 bg-white rounded shadow-md ">
//           <div className="card-header px-4 py-2 border-b border-gray-300">
//             <h2 className="text-lg font-bold capitalize ">Documents For this Application</h2>
//           </div>
//           <div className="card-body px-4 pb-4">
//             <div className="tableinfo overflow-x-auto mt-5">
//               <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2">
//                 <thead className="bg-[#0c0d52] text-white">
//                   <tr>
//                     <th colSpan={2} className="p-2 text-white text-sm">Document Details</th>
//                     <th className="p-2 text-white text-sm">Download Files</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {htConsumers?.bank_docs && <DocumentTrBloack Lable={'Bank Details'} docLink={htConsumers?.bank_docs} />}
//                   {htConsumers?.registration_pdf && <DocumentTrBloack Lable={'Applicant Registration Details PDF'} docLink={htConsumers?.registration_pdf} />}
//                   {htConsumers?.regfee_receipt_pdf && <DocumentTrBloack Lable={'Registration Fee Receipt'} docLink={htConsumers?.regfee_receipt_pdf} />}
//                   {/* {htConsumers?.sdsac_challan && <DocumentTrBloack Lable={'Registration && Sdsac Demand Note'} docLink={htConsumers?.sdsac_challan} />} */}
//                   {htConsumers?.reg_invoice_pdf && <DocumentTrBloack Lable={'Registration Payment Invoice'} docLink={htConsumers?.reg_invoice_pdf} />}
//                   {htConsumers?.estimate_invoice_pdf && <DocumentTrBloack Lable={'Estimate Payment Invoice'} docLink={htConsumers?.estimate_invoice_pdf} />}
//                   {htConsumers?.load_sanction?.draft_agreement_pdf && <DocumentTrBloack Lable={'Draft Agreement Letter'} docLink={htConsumers?.load_sanction?.draft_agreement_pdf} />}
//                   {htConsumers?.survey?.survey_checklist_docs && <DocumentTrBloack Lable={'Survey Checklist Docs'} docLink={htConsumers?.survey?.survey_checklist_docs} />}
//                   {htConsumers?.survey?.upload_single_line_docs && <DocumentTrBloack Lable={'Single Line Diagram Including VR Calculation'} docLink={htConsumers?.survey?.upload_single_line_docs} />}
//                   {htConsumers?.survey?.ndf_upload_estimate_docs && <DocumentTrBloack Lable={'View ME Estimate'} docLink={htConsumers?.survey?.ndf_upload_estimate_docs} />}
//                   {htConsumers?.survey?.extension_work_estimate_docs && <DocumentTrBloack Lable={'View Extension Work Estimate'} docLink={htConsumers?.survey?.extension_work_estimate_docs} />}
//                   {htConsumers?.demand_note_fee_receipt_pdf && <DocumentTrBloack Lable={'Demand Note Fee'} docLink={htConsumers?.demandnote_fee_receipt_pdf} />}
//                   {htConsumers?.agreement_details?.agreement_doc && <DocumentTrBloack Lable={'View Final Agreement Letter'} docLink={htConsumers?.agreement_details?.agreement_doc} />}
//                   {htConsumers?.agreement_details?.commissioning_permission_doc && <DocumentTrBloack Lable={'View Commissioning Permission Letter'} docLink={htConsumers?.agreement_details?.commissioning_permission_doc} />}
//                   {htConsumers?.agreement_details?.me_meter_work_order_docs && <DocumentTrBloack Lable={'View ME Meter Work Order'} docLink={htConsumers?.agreement_details?.me_meter_work_order_docs} />}
//                   {htConsumers?.agreement_details?.ex_work_order_docs && <DocumentTrBloack Lable={'View Extension Work'} docLink={htConsumers?.agreement_details?.ex_work_order_docs} />}
//                   {htConsumers?.commissioning_permission?.commissioning_permission_letter && <DocumentTrBloack Lable={'View Commissioning Permission Letter'} docLink={htConsumers?.commissioning_permission?.commissioning_permission_letter} />}
//                   {htConsumers?.demand_note_generation?.supplement_draft_agreement && <DocumentTrBloack Lable={'View supplement Draft Pdf'} docLink={htConsumers?.demand_note_generation?.supplement_draft_agreement} />}

//                   {htConsumers?.bicell_response?.agreement_doc && <DocumentTrBloack Lable={'View Commissioning  Pdf'} docLink={htConsumers?.bicell_response?.agreement_doc} />}

//                   <GeneratePDF
//                     baseUrl={HT_LOAD_CHANGE_BASE}
//                     url={"/GenerateDemandNote_Sdsac/"}
//                     id={htConsumers?.id}
//                     Lable={"Generate Demand Note / SD SAC "}
//                   />

//                   {/* Generate PDF buttons - conditions kept as before */}
//                   {htConsumers?.application_status == "4" && <GeneratePDF baseUrl={HT_LOAD_CHANGE_BASE} url={"/GenerateChecklistPdf/"} id={htConsumers?.id} Lable={'Generate Sign Check List '} />}
//                   {/* {(htConsumers?.survey?.is_required == "is_estimate_required" && htConsumers?.application_status == "8" || htConsumers?.application_status == "9" ) && <GeneratePDF baseUrl={HT_LOAD_CHANGE_BASE} url={"/GenerateDemandNote_Estimate/"} id={htConsumers?.id} Lable={'Generate Demand Note Estimate '} />} */}
//                   {(
//                     htConsumers?.survey?.is_required === "is_estimate_required" &&
//                     ["8", "9", "11"].includes(String(htConsumers?.application_status))
//                   ) && (
//                       <GeneratePDF
//                         baseUrl={HT_LOAD_CHANGE_BASE}
//                         url="/GenerateDemandNote_Estimate/"
//                         id={htConsumers?.id}
//                         Lable="Generated Demand Note Estimate"
//                       />
//                     )}

//                   {(
//                     htConsumers?.survey?.is_required === "is_estimate_required" &&
//                     ["9", "11","31","29","16","19"].includes(String(htConsumers?.application_status))
//                   ) && (
//                       <GeneratePDF
//                         baseUrl={HT_LOAD_CHANGE_BASE}
//                         url="/GenerateChallan_EstimatePdf/"
//                         id={htConsumers?.id}
//                         Lable="Generated Challan Estimate"
//                       />
//                   )}
//                   {/* {htConsumers?.survey?.is_required === "is_estimate_required" &&
//                     ["8", "9", "11","31","29","16","19"].includes(String(htConsumers?.application_status)) && (
//                       String(htConsumers?.application_status) === "8" ? (

//                         // ❌ Status 8 → show message only
//                         <tr>
//                           <th colSpan={3} className="px-6 py-4 text-center text-red-600 font-semibold">
//                             Please generate the Demand Note first, then generate the Challan.
//                           </th>
//                         </tr>

//                       ) : (

//                         // ✅ Status 9, 11 → allow challan
//                         <GeneratePDF
//                           baseUrl={HT_LOAD_CHANGE_BASE}
//                           url="/GenerateChallan_EstimatePdf/"
//                           id={htConsumers?.id}
//                           Lable="Generated Estimate Challan"
//                         />

//                       )
//                     )} */}


//                   {htConsumers?.transco_approval?.status === "accepted_from_cgm" && <DocumentTrBloack Lable={'View Transco Approval Letter'} docLink={htConsumers?.transco_approval?.document} />}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


//new code with date sheet
import { Link } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import banner from '../assets/image/banner.png';
import html2pdf from 'html2pdf.js';
import { HT_LOAD_CHANGE_BASE } from "../api/api.js";

export default function ApplicantBasicDetails({ htConsumers, register, errors }) {
  const printRef = useRef();
  // console.log(htConsumers, "htConsumers")
  const required = htConsumers?.survey?.is_estimate_required?.split(',') || [];
  const HIGH_VOLT = htConsumers?.new_supply_voltage === "132 KV" || htConsumers?.new_supply_voltage === "132 KV";
  const approval_from_edcra = HIGH_VOLT && htConsumers?.transco_approval;

  //  console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE inside Applicant basic details')
  const handlePrint = () => {
    const element = printRef.current;
    const opt = {
      margin: 0.5,
      filename: `${htConsumers?.application_no}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: true, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  /* ---------- Helper function to extract dates for timeline (DATE ONLY) ---------- */
  const getApplicationTimeline = () => {
    if (!htConsumers) return [];

    const timeline = [];

    // Helper function to format date as DD/MM/YYYY only
    const formatDateOnly = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    // 1. Application Creation Date (first event)
    if (htConsumers?.created_at) {
      timeline.push({
        step: 'Application Submitted',
        date: formatDateOnly(htConsumers.created_at),
        rawDate: htConsumers.created_at,
        status: 'Completed',
        details: `Application No: ${htConsumers.application_no}`
      });
    }

    // 2. Registration Fee Payment Date
    if (htConsumers?.bank_response?.transaction_date) {
      timeline.push({
        step: 'Registration Fee Payment',
        date: formatDateOnly(htConsumers.bank_response.transaction_date),
        rawDate: htConsumers.bank_response.transaction_date,
        status: 'Completed',
        details: `Amount: ₹${htConsumers.bank_response.amount}`
      });
    }

    // 3. Load Sanction/Acceptance Date
    if (htConsumers?.load_sanction?.sanction_letter_date) {
      timeline.push({
        step: 'Load Sanctioned',
        date: formatDateOnly(htConsumers.load_sanction.sanction_letter_date),
        rawDate: htConsumers.load_sanction.sanction_letter_date,
        status: htConsumers.load_sanction.load_sanction_response || 'Completed',
        details: htConsumers.load_sanction.accept_remark || 'Load sanctioned'
      });
    }

    // 4. Survey Date (if survey exists)
    if (htConsumers?.survey?.created_at) {
      timeline.push({
        step: 'Survey Conducted',
        date: formatDateOnly(htConsumers.survey.accepted_date),
        rawDate: htConsumers.survey.created_at,
        status: htConsumers.survey.survey_response || 'Completed',
        details: htConsumers.survey.accept_remark || 'Survey completed'
      });
    }

    // 5. Demand Note Generation Date
    if (htConsumers?.demand_note_generation?.created_at) {
      timeline.push({
        step: 'Demand Note Generated',
        date: formatDateOnly(htConsumers.demand_note_generation.created_at),
        rawDate: htConsumers.demand_note_generation.created_at,
        status: htConsumers.demand_note_generation.demand_note_response || 'Generated',
        details: `Amount: ₹${htConsumers.demand_note_generation.total_demand_note_amt || 'N/A'}`
      });
    }

    // 6. Demand Note Payment Date (if paid)
    if (htConsumers?.demand_note_payment?.transaction_date) {
      timeline.push({
        step: 'Demand Note Payment',
        date: formatDateOnly(htConsumers.demand_note_payment.transaction_date),
        rawDate: htConsumers.demand_note_payment.transaction_date,
        status: 'Paid',
        details: `Amount: ₹${htConsumers.demand_note_payment.amount || 'N/A'}`
      });
    }

    // 7. Agreement Execution Date
    if (htConsumers?.agreement_details?.agreement_effective_date) {
      timeline.push({
        step: 'Agreement Executed',
        date: formatDateOnly(htConsumers.agreement_details.agreement_effective_date),
        rawDate: htConsumers.agreement_details.agreement_effective_date,
        status: htConsumers.agreement_details.agreement_response || 'Executed',
        details: `Agreement No: ${htConsumers.agreement_details.agreement_no || 'N/A'}`
      });
    }

    // 8. ME Meter Work Order Date
    if (htConsumers?.agreement_details?.me_meter_work_order_date) {
      timeline.push({
        step: 'ME Meter Work Order Issued',
        date: formatDateOnly(htConsumers.agreement_details.me_meter_work_order_date),
        rawDate: htConsumers.agreement_details.me_meter_work_order_date,
        status: 'Issued',
        details: `Order No: ${htConsumers.agreement_details.me_meter_work_order_no || 'N/A'}`
      });
    }

    // 9. Extension Work Order Date
    if (htConsumers?.agreement_details?.ex_work_order_date) {
      timeline.push({
        step: 'Extension Work Order Issued',
        date: formatDateOnly(htConsumers.agreement_details.ex_work_order_date),
        rawDate: htConsumers.agreement_details.ex_work_order_date,
        status: 'Issued',
        details: `Order No: ${htConsumers.agreement_details.ex_work_order_no || 'N/A'}`
      });
    }

    // 10. Bi-Cell Response Date
    if (htConsumers?.bicell_response?.created_at) {
      timeline.push({
        step: 'Bi-Cell Commissioning',
        date: formatDateOnly(htConsumers.bicell_response.created_at),
        rawDate: htConsumers.bicell_response.created_at,
        status: htConsumers.bicell_response.bi_cell_response || 'Completed',
        details: 'Commissioning readings recorded'
      });
    }

    // 11. Commissioning Permission Date
    if (htConsumers?.commissioning_permission?.created_at) {
      timeline.push({
        step: 'Commissioning Permission',
        date: formatDateOnly(htConsumers.commissioning_permission.created_at),
        rawDate: htConsumers.commissioning_permission.created_at,
        status: htConsumers.commissioning_permission.commissioning_permission_response || 'Granted',
        details: 'Commissioning permission granted'
      });
    }

    // 12. Application Status Update (current status)
    if (htConsumers?.application_status_text) {
      timeline.push({
        step: 'Current Status',
        // date: htConsumers?.updated_at ? formatDateOnly(htConsumers.updated_at) : 'N/A',
        rawDate: htConsumers?.updated_at,
        status: htConsumers.application_status_text,
        details: `Application is ${htConsumers.application_status_text}`
      });
    }

    // Sort timeline by date (oldest to newest)
    return timeline.sort((a, b) => {
      if (a.rawDate === 'N/A') return 1;
      if (b.rawDate === 'N/A') return -1;
      return new Date(a.rawDate) - new Date(b.rawDate);
    });
  };

  /* ---------- Small presentational helpers ---------- */
  function DocumentTrBloack({ Lable, docLink }) {
    return (
      <tr>
        <th colSpan={2} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {Lable}
        </th>
        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          <Link to={`https://htsanyojan.mpcz.in:8089${docLink}`} target="_blank" rel="noopener noreferrer"
            className="rounded-lg mt-2 px-3 py-2 text-center text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300">
            {docLink ? 'View PDF File' : 'No File View'}
          </Link>
        </th>
      </tr>
    );
  }

  function GeneratePDF({ baseUrl, url, id, Lable }) {
    const [docLink, setDocLink] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDownload = async (baseUrl, url, id) => {
      console.log(baseUrl, 'baseUrllll');
      console.log(url, 'url');
      console.log(id, 'idddddd');
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}${url}${id}`);
        const result = await response.json();
        console.log('PDF Generation Result:', result);
        if (result?.pdf_url) setDocLink(result.pdf_url);
        else alert('File link not found!');
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setLoading(false);
      }
    };
    return (
      <tr>
        <th colSpan={2} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {Lable}
        </th>
        <th className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
          <div className="text-center">
            {docLink ? (
              <Link to={`https://htsanyojan.mpcz.in:8089${docLink}`} target="_blank" rel="noopener noreferrer"
                className="rounded-lg mt-2 px-3 py-2 text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300">
                View PDF File
              </Link>
            ) : (
              <button onClick={() => handleDownload(baseUrl, url, id)} disabled={loading}
                className={`rounded-lg mt-2 px-3 py-2 text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300 ${loading && 'opacity-70 cursor-not-allowed'}`}>
                {loading ? 'Generating...' : 'Download PDF'}
              </button>
            )}
          </div>
        </th>
      </tr>
    );
  }

  function TableTrBloack({ Lable, Value, colSpan = 1 }) {
    return (
      <>
        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>{Lable}</th>
        <td colSpan={colSpan} style={{ border: '1px solid #ccc', padding: '8px' }}>
          {Value ?? 'N/A'}
        </td>
      </>
    );
  }

  /* ---------- Generic step summary renderer ---------- */
  // stepObj: object containing the step (e.g., load_sanction, survey, demand_note_generation...)
  // name: display name, sourceLabel: label to show source (like 'From'), nextLabel: label for next action
  function renderStepSummary(stepObj, { name, statusKey = 'response', acceptKeys = ['accept_remark', 'accept_remark'], revertKeys = ['revert_remark', 'revert_reason'], nextKey = 'is_required', sourceLabel = 'Source', nextLabel = 'Next Action' } = {}) {
    if (!stepObj) return null;

    // Normalize status detection: check common keys for Accepted/Reverted etc.
    const statusCandidates = [
      stepObj?.[`${statusKey}`],
      stepObj?.[`${statusKey}_response`],
      stepObj?.status,
      stepObj?.load_sanction_response,
      stepObj?.survey_response,
      stepObj?.demand_note_response,
      stepObj?.load_sanction_response,
      stepObj?.commissioning_permission_response, // ✅ ADD
      stepObj?.bicell_response
    ];

    // const status = (statusCandidates.find(Boolean) ?? '').toString();
    const status = (statusCandidates.find(v => v !== null && v !== undefined && v !== '') ?? '').toString();

    // find accept / revert remark robustly
    // const acceptRemark = acceptKeys.map(k => stepObj?.[k]).find(Boolean);
    // const revertRemark = revertKeys.map(k => stepObj?.[k]).find(Boolean);

    // robust remark pick
    const acceptRemark =
      stepObj?.accept_remark ||
      stepObj?.remark ||
      stepObj?.approval_remark ||
      null;

    const revertRemark =
      stepObj?.revert_remark ||
      stepObj?.revert_reason ||
      stepObj?.reason ||
      null;

    const nextAction = stepObj?.[nextKey] ?? stepObj?.next_action ?? 'N/A';

    return (
      <>
        <tr style={{ backgroundColor: '#f9f9f9ff' }}>
          <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
            <h2>{name}</h2>
          </th>
        </tr>
        <tr>
          <TableTrBloack Lable={`${name} Status`} Value={status || 'N/A'} />
          <TableTrBloack Lable={nextLabel} Value={nextAction || 'N/A'} />
        </tr>

        {/* show remark based on status */}
        {revertRemark ? (
          <tr>
            <TableTrBloack Lable={'Revert Remark'} Value={revertRemark || stepObj?.revert_remark || 'N/A'} colSpan={3} />
          </tr>
        ) : (
          <tr>
            <TableTrBloack Lable={'Accept Remark'} Value={approval_from_edcra && name.toLowerCase().includes('load') ? (htConsumers?.transco_approval?.remark || acceptRemark) : (acceptRemark || stepObj?.accept_remark || 'N/A')} colSpan={3} />
          </tr>
        )}
      </>
    );
  }

  const timelineData = getApplicationTimeline();

  /* ---------- Main render ---------- */
  return (
    <>
      <div className="">
        <div
          ref={printRef}
          style={{
            maxWidth: '100%',
            margin: 'auto',
            border: '1px solid #ddd',
            padding: '20px',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={banner} alt="logo" style={{ width: '100%', height: 'auto' }} />
          </div>

          {/* Application Timeline/Date Chart Section - DATE ONLY */}
          {timelineData.length > 0 && (
            <>
              <div style={{ marginBottom: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#0c0d52', padding: '12px 16px' }}>
                  <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                    Application Timeline & Status Tracker
                  </h2>
                  {/* <p style={{ color: '#e0e7ff', margin: '4px 0 0 0', fontSize: '14px' }}>
                    Application Date: {htConsumers?.created_at ? new Date(htConsumers.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : 'N/A'}
                  </p> */}
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>S.No.</th>
                        <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Process Step</th>
                        <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Date</th>
                        <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Status</th>
                        {/* <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Details / Remarks</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {timelineData.map((item, index) => (
                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', fontSize: '14px' }}>{index + 1}</td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', fontSize: '14px', fontWeight: '500' }}>{item.step}</td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', fontSize: '14px' }}>{item.date}</td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', fontSize: '14px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: item.status?.toLowerCase().includes('accept') || item.status?.toLowerCase().includes('complete') || item.status?.toLowerCase().includes('paid') || item.status?.toLowerCase().includes('success') 
                                ? '#d1fae5' 
                                : item.status?.toLowerCase().includes('revert') || item.status?.toLowerCase().includes('pending') 
                                  ? '#fee2e2' 
                                  : '#e5e7eb',
                              color: item.status?.toLowerCase().includes('accept') || item.status?.toLowerCase().includes('complete') || item.status?.toLowerCase().includes('paid') || item.status?.toLowerCase().includes('success')
                                ? '#065f46'
                                : item.status?.toLowerCase().includes('revert') || item.status?.toLowerCase().includes('pending')
                                  ? '#991b1b'
                                  : '#1f2937'
                            }}>
                              {item.status}
                            </span>
                          </td>
                          {/* <td style={{ border: '1px solid #d1d5db', padding: '10px', fontSize: '14px' }}>{item.details}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div style={{ padding: '12px 16px', backgroundColor: '#f3f4f6', borderTop: '1px solid #d1d5db', fontSize: '13px', color: '#4b5563' }}>
                  <strong>Note:</strong> Timeline shows all completed steps in the application process. Current status: <span style={{ fontWeight: '600', color: '#0c0d52' }}>{htConsumers?.application_status_text || 'N/A'}</span>
                </div>
              </div>
              <hr style={{ margin: '30px 0', border: '0', borderTop: '2px solid #e5e7eb' }} />
            </>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <tbody>
              {/* Consumer Basic */}
              <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  Consumer Basic Details..
                </th>
              </tr>

              <tr>
                <TableTrBloack Lable={'Application No'} Value={htConsumers?.application_no} />
                <TableTrBloack Lable={'Consumer Id'} Value={htConsumers?.consumer_id} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Mobile'} Value={htConsumers?.mobile} />
                <TableTrBloack Lable={'Consumer Name'} Value={htConsumers?.consumer_name} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Email'} Value={htConsumers?.email} />
                <TableTrBloack Lable={'Application Date'} Value={htConsumers?.created_at ? new Date(htConsumers.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : (htConsumers?.registration_date || 'N/A')} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Pan Card No'} Value={htConsumers?.pan_card_no} />
                <TableTrBloack Lable={'Connection Date'} Value={htConsumers?.connection_date} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Load Effective Date'} Value={htConsumers?.existing_load_effective_date || 'N/A'} />
                <TableTrBloack Lable={'Last Reduction Date'} Value={htConsumers?.last_reduction_date || 'N/A'} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Region'} Value={htConsumers?.region} />
                <TableTrBloack Lable={'Circle'} Value={htConsumers?.circle} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Division'} Value={htConsumers?.division} />
                <TableTrBloack Lable={'Substation Name'} Value={htConsumers?.substation_name || 'N/A'} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Feeder Name'} Value={htConsumers?.feeder_name || 'N/A'} />
                <TableTrBloack Lable={'Address'} Value={htConsumers?.address} />
              </tr>

              {/* Connection Details */}
              <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <h2>Connection Details..</h2>
                </th>
              </tr>

              <tr>
                <TableTrBloack Lable={'Connection Type'} Value={htConsumers?.connection_type} />
                <TableTrBloack Lable={'Connection Category'} Value={htConsumers?.connection_category} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Connection Sub Category'} Value={htConsumers?.connection_sub_category} />
                <TableTrBloack Lable={'Connection Purpose'} Value={htConsumers?.connection_purpose} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Existing Supply Voltage'} Value={htConsumers?.existing_supply_voltage} />
                <TableTrBloack Lable={'Existing Contract Demand'} Value={htConsumers?.existing_contract_demand} />
              </tr>

              {/* Meter & ME */}
              <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <h2>METER & ME Details...</h2>
                </th>
              </tr>

              <tr>
                <TableTrBloack Lable={'Meter No'} Value={htConsumers?.meter_no} />
                <TableTrBloack Lable={'Meter Make'} Value={htConsumers?.meter_make} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Meter Ct Ratio'} Value={htConsumers?.meter_ct_ratio} />
                <TableTrBloack Lable={'Meter Pt Ratio'} Value={htConsumers?.meter_pt_ratio} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Meter Accuracy'} Value={htConsumers?.meter_accuracy} />
                <TableTrBloack Lable={'Meter Type'} Value={htConsumers?.meter_type} colSpan={2} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Net Meter Install Date'} Value={htConsumers?.net_meter_install_date || 'N/A'} />
              </tr>

              <tr>
                <TableTrBloack Lable={'ME Serial'} Value={htConsumers?.me_serial_no} />
                <TableTrBloack Lable={'ME Make'} Value={htConsumers?.me_make} />
              </tr>

              <tr>
                <TableTrBloack Lable={'ME Ct Ratio'} Value={htConsumers?.me_ct_ratio} />
                <TableTrBloack Lable={'ME Pt Ratio'} Value={htConsumers?.me_pt_ratio} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Solar Installation Capacity'} Value={htConsumers?.solar_installation_capacity || 'N/A'} />
                <TableTrBloack Lable={'Dial Factor'} Value={htConsumers?.dial_factor} />
              </tr>

              <tr>
                <TableTrBloack Lable={'MF (Multiply)'} Value={htConsumers?.mf || 'N/A'} />
              </tr>

              {/* Bill Details */}
              <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <h2>Bill Details...</h2>
                </th>
              </tr>

              <tr>
                <TableTrBloack Lable={'Current Bill Id'} Value={htConsumers?.current_bill_id} />
                <TableTrBloack Lable={'Current Bill Month'} Value={htConsumers?.current_bill_month} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Current Bill Units'} Value={htConsumers?.current_bill_units} />
                <TableTrBloack Lable={'Current Net Bill'} Value={htConsumers?.current_net_bill_amt} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Current Paid Amount'} Value={htConsumers?.outstanding_amt || 'N/A'} />
                <TableTrBloack Lable={'Current Month Outstanding Amount'} Value={htConsumers?.current_month_outstanding_amt || 'N/A'} />
              </tr>

              {/* Load Change Details */}
              <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <h2>Load Change Required Details...</h2>
                </th>
              </tr>

              <tr>
                <TableTrBloack Lable={'Type of Change'} Value={htConsumers?.type_of_change} />
                <TableTrBloack Lable={'Types of Change'} Value={htConsumers?.lc_type} />
              </tr>

              <tr>
                <TableTrBloack Lable={'New Supply Voltage'} Value={htConsumers?.new_supply_voltage} />
                <TableTrBloack Lable={'Total Required Contract Demand(in KVA)'} Value={htConsumers?.new_contact_demand} />
              </tr>

              <tr>
                <TableTrBloack Lable={'Change in Contract Demand (in KVA)'} Value={htConsumers?.contract_demand_difference} />
                <TableTrBloack Lable={'Purpose Of Installation Details'} Value={htConsumers?.purpose_of_installation_details} />
              </tr>

              {/* Bank Details */}
              <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <h2>Bank Details...</h2>
                </th>
              </tr>
              <tr>
                <TableTrBloack Lable={'Account Holder Name'} Value={htConsumers?.ac_holder_name} />
                <TableTrBloack Lable={'Bank Name'} Value={htConsumers?.bank_name} />
              </tr>
              <tr>
                <TableTrBloack Lable={'Bank IFSC Code'} Value={htConsumers?.bank_ifsc_code} />
                <TableTrBloack Lable={'Bank Account Number'} Value={htConsumers?.bank_ac_no} />
              </tr>

              {/* ---------- Step-based conditional summaries (Load sanction, survey, demand note, agreement, etc.) ---------- */}

              {/* Load Sanction / Load Acceptance */}
              {htConsumers?.load_sanction && renderStepSummary(htConsumers?.load_sanction, {
                name: 'Load Acceptance Details',
                statusKey: 'load_sanction_response',
                acceptKeys: ['accept_remark', 'accept_remark'],
                revertKeys: ['revert_remark', 'revert_reason'],
                nextKey: 'is_required',
                nextLabel: 'Next Action'
              })}

              {/* Bi-Cell Approval */}
              {htConsumers?.bicell_response && renderStepSummary(
                htConsumers?.bicell_response,
                {
                  name: 'Bi-Cell Approval Details',
                  statusKey: 'status',
                  acceptKeys: ['accept_remark', 'remark'],
                  revertKeys: ['revert_remark', 'revert_reason'],
                  nextKey: 'next_action',
                  nextLabel: 'Next Action'
                }
              )}

              {/* Commissioning Permission */}
              {htConsumers?.commissioning_permission && renderStepSummary(
                htConsumers?.commissioning_permission,
                {
                  name: 'Commissioning Permission Details',
                  statusKey: 'commissioning_permission_response',
                  acceptKeys: ['accept_remark', 'remark'],
                  revertKeys: ['revert_remark', 'revert_reason'],
                  nextKey: 'next_action',
                  nextLabel: 'Next Action'
                }
              )}

              {/* If edcra / transco approval exists and is different, show it */}
              {htConsumers?.transco_approval && (
                <>
                  {renderStepSummary(htConsumers?.transco_approval, {
                    name: 'Transco Approval',
                    statusKey: 'status',
                    acceptKeys: ['remark', 'accept_remark'],
                    revertKeys: ['revert_remark', 'revert_reason'],
                    nextKey: 'next_action',
                    nextLabel: 'Next Action'
                  })}
                </>
              )}

              {htConsumers?.edcra_approval && renderStepSummary(htConsumers?.edcra_approval, {
                name: 'EDC/RA Approval',
                statusKey: 'status',
                acceptKeys: ['remark'],
                revertKeys: ['revert_remark'],
                nextKey: 'next_action',
                nextLabel: 'Next Action'
              })}

              {/* Survey */}
              {htConsumers?.survey && renderStepSummary(htConsumers?.survey, {
                name: 'Survey Details',
                statusKey: 'survey_response',
                acceptKeys: ['accept_remark', 'ndf_status'],
                revertKeys: ['revert_remark', 'is_survey_reverted'],
                nextKey: 'is_required',
                nextLabel: 'Next Action'
              })}

              {/* When survey accepted, show location & estimate details */}
              {htConsumers?.survey?.survey_response === "Accepted" && (
                <>
                  <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                    <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      <h2>Latitude & Longitude (ME Installation)</h2>
                    </th>
                  </tr>
                  <tr>
                    <TableTrBloack Lable={'Latitude of ME Installation Location'} Value={htConsumers?.survey?.latitude} />
                    <TableTrBloack Lable={'Longitude of ME Installation Location'} Value={htConsumers?.survey?.longitude} />
                  </tr>
                </>
              )}

              {/* show NDF / ME estimate details when required */}
              {required.includes('is_me_meter_required') && (
                <>
                  <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                    <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      <h2>ERP Details Of NDF (ME Meter Estimate)..</h2>
                    </th>
                  </tr>

                  <tr>
                    <TableTrBloack Lable={"ME METER Approved By"} Value={htConsumers?.survey?.ndf_approved_by_name} />
                    <TableTrBloack Lable={"ME METER Circle Name"} Value={htConsumers?.survey?.ndf_circle_name} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"ME METER Division Name"} Value={htConsumers?.survey?.ndf_division_name} />
                    <TableTrBloack Lable={"ME METER Estimate Date"} Value={htConsumers?.survey?.ndf_estimate_date} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"ME METER Long Name"} Value={htConsumers?.survey?.ndf_long_name} />
                    <TableTrBloack Lable={"ME METER Sanction Amount"} Value={htConsumers?.survey?.ndf_sanction_amt} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"ME METER Sanction Date"} Value={htConsumers?.survey?.ndf_sanction_date || "N/A"} />
                    <TableTrBloack Lable={"ME METER Scheme Name"} Value={htConsumers?.survey?.ndf_scheme_name} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"ME METER Status"} Value={htConsumers?.survey?.ndf_status} />
                    <TableTrBloack Lable={"ME METER Total Amount"} Value={htConsumers?.survey?.ndf_total_amt} />
                  </tr>
                </>
              )}

              {/* Extension work estimate */}
              {required.includes('is_extension_work_required') && (
                <>
                  <tr style={{ backgroundColor: '#f9f9f9ff' }}>
                    <th colSpan={4} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      <h2>ERP Details Of Extension Work..</h2>
                    </th>
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"ERP No"} Value={htConsumers?.survey?.erp_no} />
                    <TableTrBloack Lable={"Estimate Date"} Value={htConsumers?.survey?.estimate_date} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"Long Name"} Value={htConsumers?.survey?.long_name} />
                    <TableTrBloack Lable={"Status"} Value={htConsumers?.survey?.status} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"Scheme Name"} Value={htConsumers?.survey?.scheme_name} />
                    <TableTrBloack Lable={"Supervision Amount"} Value={htConsumers?.survey?.supervision_amt} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"Supervision CGST Cost"} Value={htConsumers?.survey?.supervision_cgst} />
                    <TableTrBloack Lable={"Supervision SGST Cost"} Value={htConsumers?.survey?.supervision_sgst} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable={"Total Amount"} Value={htConsumers?.survey?.total_estimated_amt} colSpan={4} />
                  </tr>
                </>
              )}

              {/* Demand Note */}
              {htConsumers?.demand_note_generation && renderStepSummary(htConsumers?.demand_note_generation, {
                name: 'Demand Note Details',
                statusKey: 'demand_note_response',
                acceptKeys: ['demand_note_response', 'demand_note_response'],
                revertKeys: ['revert_remark', 'demand_note_response'],
                nextKey: null,
                nextLabel: 'Next Action'
              })}

              {htConsumers?.demand_note_generation && (
                <tr>
                  <TableTrBloack Lable={'Next Action'} Value={'Pay Demand Note Amount'} />
                  <TableTrBloack Lable={'Total Demand Note Amount'} Value={htConsumers?.demand_note_generation?.total_demand_note_amt} colSpan={3} />
                </tr>
              )}

              {htConsumers?.is_demandnote_fee_submitted_bypg || htConsumers?.is_demandnote_fee_submitted && (
                <tr>
                  <TableTrBloack Lable={'Next Action'} Value={'Agreement Finalization'} />
                  <TableTrBloack Lable={'Demand Note Payment Status'} Value={htConsumers?.is_demandnote_fee_submitted_bypg || htConsumers?.is_demandnote_fee_submitted ? "Done" : "Pending"} colSpan={3} />
                </tr>
              )}

              {/* Agreement Finalization */}
              {htConsumers?.agreement_details && renderStepSummary(htConsumers?.agreement_details, {
                name: 'Agreement Finalization Details',
                statusKey: 'agreement_status',
                acceptKeys: ['agreement_no'],
                revertKeys: ['revert_remark'],
                nextKey: null,
                nextLabel: 'Next Action'
              })}

              {/* Agreement specific fields */}
              {htConsumers?.agreement_details && (
                <>
                  <tr>
                    <TableTrBloack Lable={'Agreement No'} Value={htConsumers?.agreement_details?.agreement_no} />
                    <TableTrBloack Lable={'Agreement Execution Date'} Value={htConsumers?.agreement_details?.agreement_effective_date} />
                  </tr>
                  <tr>
                    {htConsumers?.agreement_details?.me_meter_work_order_no && <TableTrBloack Lable={'ME Meter Work Order No'} Value={htConsumers?.agreement_details?.me_meter_work_order_no} />}
                    {htConsumers?.agreement_details?.me_meter_work_order_date && <TableTrBloack Lable={'ME Meter Work Order Date'} Value={htConsumers?.agreement_details?.me_meter_work_order_date} />}
                  </tr>
                  <tr>
                    {htConsumers?.agreement_details?.ex_work_order_no && <TableTrBloack Lable={'Extension Work Order No'} Value={htConsumers?.agreement_details?.ex_work_order_no} />}
                    {htConsumers?.agreement_details?.ex_work_order_date && <TableTrBloack Lable={'Extension Work Order Date'} Value={htConsumers?.agreement_details?.ex_work_order_date} />}
                  </tr>
                </>
              )}

              {/* ---------------- BICELL RESPONSE ---------------- */}
              {htConsumers?.bicell_response &&
                renderStepSummary(htConsumers?.bicell_response, {
                  name: "Bi-Cell Commissioning",
                  statusKey: "bi_cell_response",
                  acceptKeys: [
                    "import_meter_reading_kva",
                    "import_meter_reading_kvah",
                    "import_meter_reading_kwh",
                  ],
                  revertKeys: ["revert_remark", "revert_reason"],
                  nextKey: null,
                  nextLabel: "Next Action",
                })}

              {htConsumers?.bicell_response?.bi_cell_response === "Accepted" && (
                <>
                  <tr style={{ backgroundColor: "#f9f9f9" }}>
                    <th colSpan={4} style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                      <h2>Bi-Cell Meter Readings</h2>
                    </th>
                  </tr>

                  {/* Import readings */}
                  <tr>
                    <TableTrBloack Lable="Import KVA" Value={htConsumers?.bicell_response?.import_meter_reading_kva} />
                    <TableTrBloack Lable="Import KVAH" Value={htConsumers?.bicell_response?.import_meter_reading_kvah} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable="Import KWH" Value={htConsumers?.bicell_response?.import_meter_reading_kwh} />
                    <TableTrBloack Lable="Import TOD1" Value={htConsumers?.bicell_response?.import_meter_reading_tod1} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable="Import TOD2" Value={htConsumers?.bicell_response?.import_meter_reading_tod2} />
                    <TableTrBloack Lable="Import TOD3" Value={htConsumers?.bicell_response?.import_meter_reading_tod3} />
                  </tr>
                  <tr>
                    <TableTrBloack Lable="Import TOD4" Value={htConsumers?.bicell_response?.import_meter_reading_tod4} />
                    <TableTrBloack Lable="MD Reset Date" Value={htConsumers?.bicell_response?.md_reset_date || "N/A"} />
                  </tr>

                  {/* Export readings if exist */}
                  {htConsumers?.bicell_response?.export_meter_reading_kva && (
                    <>
                      <tr style={{ backgroundColor: "#f9f9f9" }}>
                        <th colSpan={4} style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                          <h2>Export Meter Readings</h2>
                        </th>
                      </tr>

                      <tr>
                        <TableTrBloack Lable="Export KVA" Value={htConsumers?.bicell_response?.export_meter_reading_kva} />
                        <TableTrBloack Lable="Export KVAH" Value={htConsumers?.bicell_response?.export_meter_reading_kvah} />
                      </tr>
                      <tr>
                        <TableTrBloack Lable="Export KWH" Value={htConsumers?.bicell_response?.export_meter_reading_kwh} />
                        <TableTrBloack Lable="Export TOD1" Value={htConsumers?.bicell_response?.export_meter_reading_tod1} />
                      </tr>
                      <tr>
                        <TableTrBloack Lable="Export TOD2" Value={htConsumers?.bicell_response?.export_meter_reading_tod2} />
                        <TableTrBloack Lable="Export TOD3" Value={htConsumers?.bicell_response?.export_meter_reading_tod3} />
                      </tr>
                      <tr>
                        <TableTrBloack Lable="Export TOD4" Value={htConsumers?.bicell_response?.export_meter_reading_tod4} colSpan={4} />
                      </tr>
                    </>
                  )}
                </>
              )}

              {/* Documents area */}
            </tbody>
          </table>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button type="button" onClick={handlePrint} className="bg-[#3b82f6] text-white text-base p-4 mt-2 mb-2 rounded">
              Download Application Details
            </button>
          </div>
        </div>

        {/* Documents card (unchanged) */}
        <div className="card mt-2 mb-2 bg-white rounded shadow-md ">
          <div className="card-header px-4 py-2 border-b border-gray-300">
            <h2 className="text-lg font-bold capitalize ">Documents For this Application</h2>
          </div>
          <div className="card-body px-4 pb-4">
            <div className="tableinfo overflow-x-auto mt-5">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2">
                <thead className="bg-[#0c0d52] text-white">
                  <tr>
                    <th colSpan={2} className="p-2 text-white text-sm">Document Details</th>
                    <th className="p-2 text-white text-sm">Download Files</th>
                  </tr>
                </thead>
                <tbody>
                  {htConsumers?.bank_docs && <DocumentTrBloack Lable={'Bank Details'} docLink={htConsumers?.bank_docs} />}
                  {htConsumers?.registration_pdf && <DocumentTrBloack Lable={'Applicant Registration Details PDF'} docLink={htConsumers?.registration_pdf} />}
                  {htConsumers?.regfee_receipt_pdf && <DocumentTrBloack Lable={'Registration Fee Receipt'} docLink={htConsumers?.regfee_receipt_pdf} />}
                  {/* {htConsumers?.sdsac_challan && <DocumentTrBloack Lable={'Registration && Sdsac Demand Note'} docLink={htConsumers?.sdsac_challan} />} */}
                  {htConsumers?.reg_invoice_pdf && <DocumentTrBloack Lable={'Registration Payment Invoice'} docLink={htConsumers?.reg_invoice_pdf} />}
                  {htConsumers?.estimate_invoice_pdf && <DocumentTrBloack Lable={'Estimate Payment Invoice'} docLink={htConsumers?.estimate_invoice_pdf} />}
                  {htConsumers?.load_sanction?.draft_agreement_pdf && <DocumentTrBloack Lable={'Draft Agreement Letter'} docLink={htConsumers?.load_sanction?.draft_agreement_pdf} />}
                  {htConsumers?.survey?.survey_checklist_docs && <DocumentTrBloack Lable={'Survey Checklist Docs'} docLink={htConsumers?.survey?.survey_checklist_docs} />}
                  {htConsumers?.survey?.upload_single_line_docs && <DocumentTrBloack Lable={'Single Line Diagram Including VR Calculation'} docLink={htConsumers?.survey?.upload_single_line_docs} />}
                  {htConsumers?.survey?.ndf_upload_estimate_docs && <DocumentTrBloack Lable={'View ME Estimate'} docLink={htConsumers?.survey?.ndf_upload_estimate_docs} />}
                  {htConsumers?.survey?.extension_work_estimate_docs && <DocumentTrBloack Lable={'View Extension Work Estimate'} docLink={htConsumers?.survey?.extension_work_estimate_docs} />}
                  {htConsumers?.demand_note_fee_receipt_pdf && <DocumentTrBloack Lable={'Demand Note Fee'} docLink={htConsumers?.demandnote_fee_receipt_pdf} />}
                  {htConsumers?.agreement_details?.agreement_doc && <DocumentTrBloack Lable={'View Final Agreement Letter'} docLink={htConsumers?.agreement_details?.agreement_doc} />}
                  {htConsumers?.agreement_details?.commissioning_permission_doc && <DocumentTrBloack Lable={'View Commissioning Permission Letter'} docLink={htConsumers?.agreement_details?.commissioning_permission_doc} />}
                  {htConsumers?.agreement_details?.me_meter_work_order_docs && <DocumentTrBloack Lable={'View ME Meter Work Order'} docLink={htConsumers?.agreement_details?.me_meter_work_order_docs} />}
                  {htConsumers?.agreement_details?.ex_work_order_docs && <DocumentTrBloack Lable={'View Extension Work'} docLink={htConsumers?.agreement_details?.ex_work_order_docs} />}
                  {htConsumers?.commissioning_permission?.commissioning_permission_letter && <DocumentTrBloack Lable={'View Commissioning Permission Letter'} docLink={htConsumers?.commissioning_permission?.commissioning_permission_letter} />}
                  {htConsumers?.demand_note_generation?.supplement_draft_agreement && <DocumentTrBloack Lable={'View supplement Draft Pdf'} docLink={htConsumers?.demand_note_generation?.supplement_draft_agreement} />}

                  {htConsumers?.bicell_response?.agreement_doc && <DocumentTrBloack Lable={'View Commissioning  Pdf'} docLink={htConsumers?.bicell_response?.agreement_doc} />}

                  <GeneratePDF
                    baseUrl={HT_LOAD_CHANGE_BASE}
                    url={"/GenerateDemandNote_Sdsac/"}
                    id={htConsumers?.id}
                    Lable={"Generate Demand Note / SD SAC "}
                  />

                  {/* Generate PDF buttons - conditions kept as before */}
                  {htConsumers?.application_status == "4" && <GeneratePDF baseUrl={HT_LOAD_CHANGE_BASE} url={"/GenerateChecklistPdf/"} id={htConsumers?.id} Lable={'Generate Sign Check List '} />}
                  {/* {(htConsumers?.survey?.is_required == "is_estimate_required" && htConsumers?.application_status == "8" || htConsumers?.application_status == "9" ) && <GeneratePDF baseUrl={HT_LOAD_CHANGE_BASE} url={"/GenerateDemandNote_Estimate/"} id={htConsumers?.id} Lable={'Generate Demand Note Estimate '} />} */}
                  {(
                    htConsumers?.survey?.is_required === "is_estimate_required" &&
                    ["8", "9", "11"].includes(String(htConsumers?.application_status))
                  ) && (
                      <GeneratePDF
                        baseUrl={HT_LOAD_CHANGE_BASE}
                        url="/GenerateDemandNote_Estimate/"
                        id={htConsumers?.id}
                        Lable="Generated Demand Note Estimate"
                      />
                    )}

                  {(
                    htConsumers?.survey?.is_required === "is_estimate_required" &&
                    ["9", "11","31","29","16","19"].includes(String(htConsumers?.application_status))
                  ) && (
                      <GeneratePDF
                        baseUrl={HT_LOAD_CHANGE_BASE}
                        url="/GenerateChallan_EstimatePdf/"
                        id={htConsumers?.id}
                        Lable="Generated Challan Estimate"
                      />
                  )}
                  {/* {htConsumers?.survey?.is_required === "is_estimate_required" &&
                    ["8", "9", "11","31","29","16","19"].includes(String(htConsumers?.application_status)) && (
                      String(htConsumers?.application_status) === "8" ? (

                        // ❌ Status 8 → show message only
                        <tr>
                          <th colSpan={3} className="px-6 py-4 text-center text-red-600 font-semibold">
                            Please generate the Demand Note first, then generate the Challan.
                          </th>
                        </tr>

                      ) : (

                        // ✅ Status 9, 11 → allow challan
                        <GeneratePDF
                          baseUrl={HT_LOAD_CHANGE_BASE}
                          url="/GenerateChallan_EstimatePdf/"
                          id={htConsumers?.id}
                          Lable="Generated Estimate Challan"
                        />

                      )
                    )} */}


                  {htConsumers?.transco_approval?.status === "accepted_from_cgm" && <DocumentTrBloack Lable={'View Transco Approval Letter'} docLink={htConsumers?.transco_approval?.document} />}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}