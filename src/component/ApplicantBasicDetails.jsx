// import { Link } from 'react-router-dom';
// import React, { useRef, useState } from 'react';
// import banner from '../assets/image/banner.png';
// import html2pdf from 'html2pdf.js';
// import { HT_LOAD_CHANGE_BASE, DSP_PRO_BASE, HT_NSC_BASE } from "../api/api.js"


// export default function ApplicantBasicDetails({ htConsumers, register, errors }) {
//   const printRef = useRef();
//   console.log(htConsumers, "htConsumers")
//   const required = htConsumers?.survey?.is_estimate_required?.split(',') || [];
//   const HIGH_VOLT = htConsumers?.new_supply_voltage === "132 KV" || htConsumers?.new_supply_voltage === "132 KV"
//   const approval_from_edcra = HIGH_VOLT && htConsumers?.transco_approval
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




//   function DocumentTrBloack({ Lable, docLink }) {
//     return (
//       <>
//         <tr>
//           <th
//             scope="row"
//             colSpan={2}
//             className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
//           >
//             {Lable}
//           </th>

//           <th
//             scope="row"
//             className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
//           >
//             <Link
//               to={docLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="rounded-lg  mt-8 px-3 py-2 text-center text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300"
//             >
//               {docLink ? 'View PDF File' : 'No File View'}
//             </Link>
//           </th>
//         </tr>
//       </>
//     );
//   }
//   function GeneratePDF({ baseUrl, url, id, Lable }) {
//     const [docLink, setDocLink] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const handleDownload = async (baseUrl, url, id) => {
//       setLoading(true);
//       try {
//         // 👇 yahan aapki API call hogi
//         const response = await fetch(`${baseUrl}${url}${id}`);
//         const result = await response.json();
//         console.log('PDF Generation Result:', result);

//         // agar API successful hai aur file URL milta hai:  
//         if (result?.pdf_url) {
//           setDocLink(result.pdf_url);
//         } else {
//           alert('File link not found!');
//         }
//       } catch (error) {
//         console.error('Error generating PDF:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     return (
//       <>
//         <tr>

//           <th
//             scope="row"
//             colSpan={2}
//             className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
//           >
//             {Lable}
//           </th>

//           <th
//             scope="row"
//             className="font-medium text-gray-900 whitespace-nowrap dark:text-white"
//           >
//             <div className="text-center">
//               {docLink ? (
//                 <Link
//                   to={docLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="rounded-lg mt-8 px-3 py-2 text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300"
//                 >
//                   View PDF File
//                 </Link>
//               ) : (
//                 <button
//                   onClick={() => handleDownload(baseUrl, url, id)}
//                   disabled={loading}
//                   className={`rounded-lg mt-8 px-3 py-2 text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300 ${loading && 'opacity-70 cursor-not-allowed'
//                     }`}
//                 >
//                   {loading ? 'Generating...' : 'Download PDF'}
//                 </button>
//               )}
//             </div>


//           </th>
//         </tr>
//       </>
//     );
//   }


//   function TableTrBloack1({ Lable, Value, colSpan }) {
//     return (
//       <>
//         <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}> {Lable}</th>
//         <td colSpan={colSpan} style={{ border: '1px solid #ccc', padding: '8px' }}>
//           {Value}
//         </td>
//       </>
//     );

//   }



//   return (
//     <>
//       <div className="">
//         {/* <div className="mt-10"ref={printRef} id="pdf-content">
//           <div className="relative w-[100%] overflow-x-auto shadow-md sm:rounded-lg p-4">
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" > */}
//         {/* <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
//                 HT Load Change Application Details
//                 <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
//               </caption> */}
//         <div
//           ref={printRef}
//           style={{
//             maxWidth: '100%',
//             margin: 'auto',
//             border: '1px solid #ddd',
//             padding: '20px',
//             backgroundColor: '#fFFFFF',
//           }}
//         >
//           <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//             <img src={banner} alt="logo" style={{ width: '100%', height: 'auto' }}></img>
//           </div>

//           <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
//             <tbody>
//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th
//                   colSpan={4}
//                   style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                 >
//                   {' '}
//                   Consumer Basic Details..
//                 </th>
//               </tr>

//               <tr>
//                 <TableTrBloack1
//                   Lable={'Application No'}
//                   Value={htConsumers?.application_no}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Consumer Id'}
//                   Value={htConsumers?.consumer_id}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1 Lable={'mobile'} Value={htConsumers?.mobile} colSpan={0} />
//                 <TableTrBloack1
//                   Lable={'Consumer Name'}
//                   Value={htConsumers?.consumer_name}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1 Lable={'Email'} Value={htConsumers?.email} colSpan={0} />
//                 <TableTrBloack1 Lable={'Address'} Value={htConsumers?.address} colSpan={0} />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Pan Card No'}
//                   Value={htConsumers?.pan_card_no}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Connection Date'}
//                   Value={htConsumers?.connection_date}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Load Effective Date'}
//                   Value={
//                     htConsumers?.existing_load_effective_date ? (
//                       htConsumers?.existing_load_effective_date
//                     ) : (
//                       <>N/A</>
//                     )
//                   }
//                   colSpan={0}
//                 />

//                 <TableTrBloack1
//                   Lable={'Last Reduction Date'}
//                   Value={
//                     htConsumers?.last_reduction_date ? htConsumers?.last_reduction_date : <>N/A</>
//                   }
//                   colSpan={0}
//                 />
//               </tr>

//               <tr>
//                 <TableTrBloack1 Lable={'Region'} Value={htConsumers?.region} colSpan={0} />
//                 <TableTrBloack1 Lable={'Circle'} Value={htConsumers?.circle} colSpan={0} />
//               </tr>
//               <tr>
//                 <TableTrBloack1 Lable={'Division'} Value={htConsumers?.division} colSpan={0} />

//                 <TableTrBloack1
//                   Lable={'Substation Name'}
//                   Value={htConsumers?.substation_name ? htConsumers?.substation_name : <>N/A</>}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Feeder Name'}
//                   Value={htConsumers?.feeder_name ? htConsumers?.feeder_name : <>N/A</>}
//                   colSpan={0}
//                 />
//               </tr>

//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th
//                   colSpan={4}
//                   style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                 >
//                   <h2>Connection Details..</h2>
//                 </th>
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Connection Type'}
//                   Value={htConsumers?.connection_type}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Connection Category'}
//                   Value={htConsumers?.connection_category}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Connection Sub Category'}
//                   Value={htConsumers?.connection_sub_category}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Connection Purpose'}
//                   Value={htConsumers?.connection_purpose}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Existing Supply Voltage'}
//                   Value={htConsumers?.existing_supply_voltage}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Existing Contract Demand'}
//                   Value={htConsumers?.existing_contract_demand}
//                   colSpan={0}
//                 />
//               </tr>

//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th
//                   colSpan={4}
//                   style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                 >
//                   METER Details...
//                 </th>
//               </tr>

//               <tr>
//                 <TableTrBloack1 Lable={'Meter No'} Value={htConsumers?.meter_no} colSpan={0} />
//                 <TableTrBloack1 Lable={'Meter Make'} Value={htConsumers?.meter_make} colSpan={0} />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Meter Ct Ratio'}
//                   Value={htConsumers?.meter_ct_ratio}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Meter Pt Ratio'}
//                   Value={htConsumers?.meter_pt_ratio}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Meter Accuracy ClassName'}
//                   Value={htConsumers?.meter_accuracy}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1 Lable={'Meter Type'} Value={htConsumers?.meter_type} colSpan={2} />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Net Meter Install Date'}
//                   Value={
//                     htConsumers?.net_meter_install_date
//                       ? htConsumers?.net_meter_install_date
//                       : 'N/A'
//                   }
//                   colSpan={0}
//                 />
//               </tr>

//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th
//                   colSpan={4}
//                   style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                 >
//                   <h2>ME Details...</h2>
//                 </th>
//               </tr>
//               <tr>
//                 <TableTrBloack1 Lable={'ME Serial'} Value={htConsumers?.me_serial_no} colSpan={0} />
//                 <TableTrBloack1 Lable={'ME Make'} Value={htConsumers?.me_make} colSpan={0} />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'ME Ct Ratio'}
//                   Value={htConsumers?.me_ct_ratio}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Me Pt Ratio'}
//                   Value={htConsumers?.me_pt_ratio}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Solar Installation Capacity'}
//                   Value={
//                     htConsumers?.solar_installation_capacity
//                       ? htConsumers?.solar_installation_capacity
//                       : 'N/A'
//                   }
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Dial Factor'}
//                   Value={htConsumers?.dial_factor}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'MF (Multiply)'}
//                   Value={htConsumers?.mf ? htConsumers?.mf : 'N/A'}
//                   colSpan={0}
//                 />
//               </tr>

//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th
//                   colSpan={4}
//                   style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                 >
//                   <h2>Bill Details...</h2>
//                 </th>
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Current Bill Id'}
//                   Value={htConsumers?.current_bill_id}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Current Bill Month'}
//                   Value={htConsumers?.current_bill_month}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Current Bill Units'}
//                   Value={htConsumers?.current_bill_units}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Current Net Bill'}
//                   Value={htConsumers?.current_net_bill_amt}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Current Paid Amount'}
//                   Value={htConsumers?.outstanding_amt ? htConsumers?.outstanding_amt : 'N/A'}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Current Month Outstanding Amount'}
//                   Value={
//                     htConsumers?.current_month_outstandin_amt
//                       ? htConsumers?.current_month_outstandin_amt
//                       : 'N/A'
//                   }
//                   colSpan={0}
//                 />
//               </tr>

//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th
//                   colSpan={4}
//                   style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                 >
//                   <h2>Load Change Required Details...</h2>
//                 </th>
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Type of Change'}
//                   Value={htConsumers?.type_of_change}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Types of Change'}
//                   Value={htConsumers?.lc_type}
//                   colSpan={0}
//                 />
//               </tr>

//               <tr>
//                 <TableTrBloack1
//                   Lable={'New Supply Voltage'}
//                   Value={htConsumers?.new_supply_voltage}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Total Required Contract Demand(in KVA)'}
//                   Value={htConsumers?.new_contact_demand}
//                   colSpan={0}
//                 />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Change in Contract Demand (in KVA)'}
//                   Value={htConsumers?.contract_demand_difference}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Purpose Of Installation Details'}
//                   Value={htConsumers?.purpose_of_installation_details}
//                   colSpan={0}
//                 />
//               </tr>

//               <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                 <th
//                   colSpan={4}
//                   style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                 >
//                   <h2>Bank Details...</h2>
//                 </th>
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Account Holder Name'}
//                   Value={htConsumers?.ac_holder_name}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1 Lable={'Bank Name'} Value={htConsumers?.bank_name} colSpan={0} />
//               </tr>
//               <tr>
//                 <TableTrBloack1
//                   Lable={'Bank IFCS Code'}
//                   Value={htConsumers?.bank_ifsc_code}
//                   colSpan={0}
//                 />
//                 <TableTrBloack1
//                   Lable={'Bank Account Number'}
//                   Value={htConsumers?.bank_ac_no}
//                   colSpan={0}
//                 />
//               </tr>

//               {/* {htConsumers?.bank_response && (
//                 <>

//                     <tr>
//                       <th colSpan={4} scope="col">
//                         <h2 >
//                           Payment Details...
//                         </h2>
//                       </th>
//                     </tr>

//                     <tr >
//                       <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                         Regisration Fee
//                       </th>
//                       <td className="px-6 py-4">
//                         {htConsumers?.bank_response?.bank_response}
//                       </td>
//                       <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                         Required ME CT Ratio
//                       </th>
//                       <td className="px-6 py-4">
//                         {htConsumers?.load_sanction?.new_ct_ratio}
//                       </td>
//                       <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                         Required ME PT Ratio
//                       </th>
//                       <td className="px-6 py-4">
//                         {htConsumers?.load_sanction?.new_pt_ratio}
//                       </td>
//                       <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                         Accept Remark
//                       </th>
//                       <td className="px-6 py-4">
//                         {htConsumers?.load_sanction?.accept_remark}
//                       </td>

//                     </tr>
//                     <tr >
//                       <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                         option is required
//                       </th>
//                       <td className="px-6 py-4">
//                         {htConsumers?.load_sanction?.is_required}
//                       </td>
//                       <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                         Draft Agreement Letter
//                       </th>
//                       <td className="px-6 py-4 text-left" colSpan={2}>


//                         <Link
//                           to={htConsumers?.bank_docs}
//                           target="_blank"
//                           rel="noopener noreferrer" className="rounded-lg  mt-8 px-3 py-2 text-center text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300">
//                           {htConsumers?.bank_docs ? 'View Back Details' : 'No File View'}

//                         </Link>
//                       </td>

//                     </tr>


//                 </>)} */}
//               {htConsumers?.load_sanction && (
//                 <>
//                   <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                     <th
//                       colSpan={4}
//                       style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                     >
//                       {' '}
//                       <h2>Load Acceptance Details...</h2>
//                     </th>
//                   </tr>
//                   <tr>
//                     <TableTrBloack1
//                       Lable={'Load Acceptance'}
//                       Value={htConsumers?.load_sanction?.load_sanction_response}
//                       colSpan={0}
//                     />
//                     <TableTrBloack1
//                       Lable={'Required ME CT Ratio'}
//                       Value={htConsumers?.load_sanction?.new_ct_ratio || "NA"}
//                       colSpan={0}
//                     />
//                   </tr>
//                   <tr>
//                     <TableTrBloack1
//                       Lable={'Required ME PT Ratio'}
//                       Value={htConsumers?.load_sanction?.new_pt_ratio || "NA"}
//                       colSpan={0}
//                     />
//                     <TableTrBloack1
//                       Lable={'Next Action'}
//                       Value={htConsumers?.load_sanction?.is_required || "NA"}
//                       colSpan={0}
//                     />
//                   </tr>

//                   {htConsumers?.load_sanction?.load_sanction_response === "Reverted" ? (
//                     <tr>
//                       <TableTrBloack1
//                         Lable={'Revert Remark'}
//                         Value={htConsumers?.load_sanction?.revert_remark}
//                         colSpan={3}
//                       />
//                     </tr>
//                   ) : (
//                     <tr>
//                       <TableTrBloack1
//                         Lable={'Accept Remark'}
//                         Value={approval_from_edcra ? htConsumers?.transco_approval.remark : htConsumers?.load_sanction?.accept_remark}
//                         colSpan={3}
//                       />
//                     </tr>
//                   )}
//                   {htConsumers?.edcra_approval && (
//                      <tr>
//                       <TableTrBloack1
//                         Lable={'Accept Remark'}
//                         Value={htConsumers?.edcra_approval.remark}
//                         colSpan={3}
//                       />
//                     </tr>
//                   )}

//                 </>
//               )}

//               {htConsumers?.survey && (
//                 <>
//                   <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                     <th
//                       colSpan={4}
//                       style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                     >
//                       <h2>Survey Details..</h2>
//                     </th>
//                   </tr>
//                   <tr>
//                      <TableTrBloack1
//                     Lable={'Survey Acceptance'}
//                     Value={htConsumers?.survey?.survey_response}
//                     colSpan={0}
//                   />
//                    <TableTrBloack1
//                     Lable={htConsumers?.survey?.survey_response === "Accepted" ? "Accept Remark" : "Revert Remark"}
//                     Value={htConsumers?.survey?.survey_response === "Accepted" ? htConsumers?.survey?.accept_remark : htConsumers?.survey?.revert_remark || "NA"}
//                     colSpan={0}
//                   />
//                   </tr>
//                   <TableTrBloack1
//                     Lable={'Next Action'}
//                     Value={htConsumers?.survey?.is_required}
//                     colSpan={0}
//                   />
//                     <TableTrBloack1
//                       Lable={'Is Estimate Required'}
//                       Value={htConsumers?.survey?.is_estimate_required}
//                       colSpan={2}
//                     />

//                   <tr>

//                   </tr>

//                   {(htConsumers?.survey?.region && htConsumers?.survey?.circle && htConsumers?.survey?.division) && (
//                     <>
//                       <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                         <th
//                           colSpan={4}
//                           style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                         >
//                           <h2>Choose the Orign Substation and Feeder Details (Supply Feeding to Consumer)..</h2>
//                         </th>
//                       </tr>

//                       <tr>

//                         <TableTrBloack1
//                           Lable={'Region'}
//                           Value={htConsumers?.survey?.region}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={'Circle'}
//                           Value={htConsumers?.survey?.circle}
//                           colSpan={0}
//                         />

//                       </tr>
//                       {(htConsumers?.survey?.division && htConsumers?.survey?.ehv_sub_station) && (
//                         <tr>
//                           <TableTrBloack1
//                             Lable={'Division'}
//                             Value={htConsumers?.survey?.division}
//                             colSpan={0}
//                           />
//                           <TableTrBloack1
//                             Lable={'EHV SubStation Name'}
//                             Value={htConsumers?.survey?.ehv_sub_station}
//                             colSpan={0}
//                           />
//                         </tr>
//                       )}
//                       {htConsumers?.survey?.thirty_three_feeder && (
//                         <tr>
//                           <TableTrBloack1
//                             Lable={'33 KV Feeder Name'}
//                             Value={htConsumers?.survey?.thirty_three_feeder}
//                             colSpan={0}
//                           />
//                           {htConsumers?.survey?.thirty_three_sub_station && (
//                             <TableTrBloack1
//                               Lable={'33 KV SubStation Name'}
//                               Value={htConsumers?.survey?.thirty_three_sub_station}
//                               colSpan={0}
//                             />
//                           )}
//                         </tr>
//                       )}
//                       {htConsumers?.survey?.eleven_feeder && (
//                         <tr>
//                           <TableTrBloack1
//                             Lable={'11 KV Feeder Name'}
//                             Value={htConsumers?.survey?.eleven_feeder}
//                             colSpan={3}
//                           />

//                         </tr>
//                       )}
//                     </>)}


//                   <tr>
//                     <TableTrBloack1
//                       Lable={'Maximum load on Feeder(in Amp)'}
//                       Value={htConsumers?.survey?.lr_values}
//                       colSpan={0}
//                     />

//                     <TableTrBloack1
//                       Lable={'Percentage Voltage Regulation(VR Value)'}
//                       Value={htConsumers?.survey?.vr_values}
//                       colSpan={0}
//                     />
//                   </tr>
//                  {
//                   htConsumers?.survey?.survey_response === "Accepted" &&
//                    <>
//                     <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                     <th
//                       colSpan={4}
//                       style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                     >
//                       <h2>Latitude and Longitude of Location where ME is to be installed..</h2>
//                     </th>
//                   </tr>


//                   <tr>
//                     <TableTrBloack1
//                       Lable={'Latitude of ME Installation Location'}
//                       Value={htConsumers?.survey?.latitude}
//                       colSpan={0}
//                     />

//                     <TableTrBloack1
//                       Lable={'Longitude of ME Installation Location'}
//                       Value={htConsumers?.survey?.longitude}
//                       colSpan={0}
//                     />
//                     </tr>
//                    </>
//                 }


//                   {required.includes('is_me_meter_required') && (
//                     <>
//                       <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                         <th
//                           colSpan={4}
//                           style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                         >
//                           <h2>ERP Details Of NDF(Me Meter Estimate)Estimate..</h2>
//                         </th>
//                       </tr>

//                       <tr>
//                         <TableTrBloack1
//                           Lable={"ME METER Approved By"}
//                           Value={htConsumers?.survey?.ndf_approved_by_name}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"ME METER Circle Name"}
//                           Value={htConsumers?.survey?.ndf_circle_name}
//                           colSpan={0}
//                         />
//                       </tr>
//                       <tr>
//                         <TableTrBloack1
//                           Lable={"ME METER Division Name"}
//                           Value={htConsumers?.survey?.ndf_division_name}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"ME METER Estimate Date"}
//                           Value={htConsumers?.survey?.ndf_estimate_date}
//                           colSpan={0}
//                         />
//                       </tr>
//                       <tr>
//                         <TableTrBloack1
//                           Lable={"ME METER Long Name"}
//                           Value={htConsumers?.survey?.ndf_long_name}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"ME METER Sanction Amount"}
//                           Value={htConsumers?.survey?.ndf_sanction_amt}
//                           colSpan={0}
//                         />
//                       </tr>
//                       <tr>
//                         <TableTrBloack1
//                           Lable={"ME METER Sanction Date"}
//                           Value={htConsumers?.survey?.ndf_sanction_date || "N/A"}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"ME METER Scheme Name"}
//                           Value={htConsumers?.survey?.ndf_scheme_name}
//                           colSpan={0}
//                         />
//                       </tr>
//                       <tr>

//                         <TableTrBloack1
//                           Lable={"ME METER Status"}
//                           Value={htConsumers?.survey?.ndf_status}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"ME METER Total Amount"}
//                           Value={htConsumers?.survey?.ndf_total_amt}
//                           colSpan={0}
//                         />
//                       </tr>
//                     </>
//                   )}
//                   {required.includes('is_extension_work_required') && (
//                     <>
//                       <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                         <th
//                           colSpan={4}
//                           style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                         >
//                           <h2>ERP Details Of Extension Work..</h2>
//                         </th>
//                       </tr>
//                       <tr>

//                         <TableTrBloack1
//                           Lable={"ERP No"}
//                           Value={htConsumers?.survey?.erp_no}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"Estimate Date"}
//                           Value={htConsumers?.survey?.estimate_date}
//                           colSpan={0}
//                         />
//                       </tr>
//                       <tr>
//                         <TableTrBloack1
//                           Lable={"Long Name"}
//                           Value={htConsumers?.survey?.long_name}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"Status"}
//                           Value={htConsumers?.survey?.status}
//                           colSpan={0}
//                         />

//                       </tr>
//                       <tr>
//                         <TableTrBloack1
//                           Lable={"Scheme Name"}
//                           Value={htConsumers?.survey?.scheme_name}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"Supervision Amount"}
//                           Value={htConsumers?.survey?.supervision_amt}
//                           colSpan={0}
//                         />

//                       </tr>
//                       <tr>
//                         <TableTrBloack1
//                           Lable={"Supervision CGST Cost"}
//                           Value={htConsumers?.survey?.supervision_cgst}
//                           colSpan={0}
//                         />
//                         <TableTrBloack1
//                           Lable={"Supervision SGST Cost"}
//                           Value={htConsumers?.survey?.supervision_sgst}
//                           colSpan={0}
//                         />

//                       </tr>
//                       <tr>


//                         <TableTrBloack1
//                           Lable={"Total Amount"}
//                           Value={htConsumers?.survey?.total_estimated_amt}
//                           colSpan={4}
//                         />
//                       </tr>
//                     </>
//                   )}


//                 </>
//               )}
//               {htConsumers?.demand_note_generation && (
//                 <>
//                   <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                     <th
//                       colSpan={4}
//                       style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                     >
//                       {' '}
//                       <h2>Demand Note Details...</h2>
//                     </th>
//                   </tr>
//                    {
//                      htConsumers?.demand_note_generation?.demand_note_response === "Reverted" ? (
//                        <tr>
//                     <TableTrBloack1
//                       Lable={'Demand Note Reverted'}
//                       Value={htConsumers?.demand_note_generation?.demand_note_response}
//                       colSpan={0}
//                     />
//                      <TableTrBloack1
//                       Lable={' Revert Remark'}
//                       Value={htConsumers?.demand_note_generation?.demand_note_response}
//                       colSpan={0}
//                     />

//                   </tr>
//                      ):(
//                      <>
//                         <TableTrBloack1
//                       Lable={'Demand Note Acceptance'}
//                       Value={htConsumers?.demand_note_generation?.demand_note_response}
//                       colSpan={0}
//                     />
//                        <TableTrBloack1
//                       Lable={'Accept Remark'}
//                       Value={htConsumers?.demand_note_generation?.demand_note_response}
//                       colSpan={0}
//                     />
//                      </>
//                      )
//                    }

//                   <tr>
//                       <TableTrBloack1
//                       Lable={'Next Action'}
//                       Value={"Pay Demand Note Amount"}
//                       colSpan={0}
//                     />
//                     <TableTrBloack1
//                       Lable={' Total Demand Note Amount'}
//                       Value={htConsumers?.demand_note_generation?.total_demand_note_amt}
//                       colSpan={3}
//                     />

//                   </tr>
//                 </>
//               )}
//               {htConsumers?.agreement_details && (
//                 <>
//                   <tr style={{ backgroundColor: '#f9f9f9ff' }}>
//                     <th
//                       colSpan={4}
//                       style={{ border: '1px solid #ccc', padding: '8px', textalign: 'center' }}
//                     >
//                       {' '}
//                       <h2>Agreement Finalization Details...</h2>
//                     </th>
//                   </tr>
//                   <tr>
//                     <TableTrBloack1
//                       Lable={'Agreement No'}
//                       Value={htConsumers?.agreement_details?.agreement_no}
//                       colSpan={0}
//                     />

//                     <TableTrBloack1
//                       Lable={'Agreement Effective Date'}
//                       Value={htConsumers?.agreement_details?.agreement_effective_date}
//                       colSpan={0}
//                     />
//                   </tr>
//                   <tr>
//                     {htConsumers?.agreement_details?.me_meter_work_order_no && (
//                       <>
//                         <TableTrBloack1
//                           Lable={'ME Meter Work Order No'}
//                           Value={htConsumers?.agreement_details?.me_meter_work_order_no}
//                           colSpan={0}
//                         />
//                       </>
//                     )}
//                     {htConsumers?.agreement_details?.me_meter_work_order_date && (
//                       <>
//                         <TableTrBloack1
//                           Lable={'ME Meter Work Order Date'}
//                           Value={htConsumers?.agreement_details?.me_meter_work_order_date}
//                           colSpan={0}
//                         />
//                       </>
//                     )}
//                   </tr>
//                   <tr>
//                     {htConsumers?.agreement_details?.ex_work_order_no && (
//                       <>
//                         <TableTrBloack1
//                           Lable={'Extantion Work Order Date'}
//                           Value={htConsumers?.agreement_details?.ex_work_order_no}
//                           colSpan={0}
//                         />
//                       </>
//                     )}
//                     {htConsumers?.agreement_details?.ex_work_order_date && (
//                       <>
//                         <TableTrBloack1
//                           Lable={'Extantion Work Order Date'}
//                           Value={htConsumers?.agreement_details?.ex_work_order_date}
//                           colSpan={0}
//                         />
//                       </>
//                     )}
//                   </tr>
//                 </>
//               )}
//             </tbody>
//           </table>

//           <div style={{ textAlign: 'center', marginTop: '16px' }}>
//             <button
//               type="button"
//               onClick={handlePrint}
//               className="bg-[#3b82f6] text-white text-base p-4 mt-2 mb-2 rounded"
//             >
//               Download Application Details
//             </button>
//           </div>
//         </div>

//         <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//           <div className="card-header px-4 py-2 border-b border-gray-300">
//             <h2 className="text-lg font-bold capitalize ">Documents For this Application</h2>
//           </div>
//           <div className="card-body px-4 pb-4">
//             <div className="tableinfo overflow-x-auto mt-5">
//               <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2">
//                 <thead className="bg-[#0c0d52] text-white">
//                   <tr>

//                     <th colSpan={2} className="p-2 text-white text-sm">
//                       Document Details
//                     </th>
//                     <th className="p-2 text-white text-sm">Download Fils</th>
//                   </tr>
//                 </thead>
//                 <tbody>

//                   {htConsumers?.bank_docs && (
//                     <DocumentTrBloack
//                       Lable={'Bank Details'}
//                       docLink={htConsumers?.bank_docs}
//                     />
//                   )}
//                   {htConsumers?.registration_pdf && (
//                     <DocumentTrBloack
//                       Lable={'Applicant Ragistration Details PDF'}
//                       docLink={htConsumers?.registration_pdf}
//                     />
//                   )}
//                   {htConsumers?.regfee_receipt_pdf && (
//                     <DocumentTrBloack
//                       Lable={'Ragistration Fee Invoice '}
//                       docLink={htConsumers?.regfee_receipt_pdf}
//                     />
//                   )}
//                   {htConsumers?.reg_invoice_pdf && (
//                     <DocumentTrBloack
//                       Lable={'Intial Payment Invoice '}
//                       docLink={htConsumers?.reg_invoice_pdf}
//                     />
//                   )}
//                   {htConsumers?.load_sanction?.draft_agreement_pdf && (
//                     <DocumentTrBloack
//                       Lable={' Draft Agreement Letter'}
//                       docLink={htConsumers?.load_sanction?.draft_agreement_pdf}
//                     />
//                   )}
//                   {htConsumers?.survey?.survey_checklist_docs && (
//                     <DocumentTrBloack
//                       Lable={'Survey Checklist Docs'}
//                       docLink={htConsumers?.survey?.survey_checklist_docs}
//                     />
//                   )}
//                   {htConsumers?.survey?.upload_single_line_docs && (
//                     <DocumentTrBloack
//                       Lable={'Single Line Diagram Including VR Calculation'}
//                       docLink={htConsumers?.survey?.upload_single_line_docs}
//                     />
//                   )}


//                   {htConsumers?.survey?.ndf_upload_estimate_docs && (
//                     <DocumentTrBloack
//                       Lable={'View ME Estimate'}
//                       docLink={htConsumers?.survey?.ndf_upload_estimate_docs}
//                     />
//                   )}
//                   {htConsumers?.survey?.extension_work_estimate_docs && (
//                     <DocumentTrBloack
//                       Lable={'View Extension Work Estimate'}
//                       docLink={htConsumers?.survey?.extension_work_estimate_docs}
//                     />
//                   )}
//                   {htConsumers?.demand_note_fee_receipt_pdf && (
//                     <DocumentTrBloack
//                       Lable={'Demand Note Fee '}
//                       docLink={htConsumers?.demandnote_fee_receipt_pdf}
//                     />
//                   )}
//                   {htConsumers?.agreement_details?.agreement_doc && (
//                     <DocumentTrBloack
//                       Lable={'View Final Agreement Letter'}
//                       docLink={htConsumers?.agreement_details?.agreement_doc}
//                     />
//                   )}
//                   {htConsumers?.agreement_details?.commissioning_permission_doc && (
//                     <DocumentTrBloack

//                       Lable={'View Commissioning Permission Letter'}
//                       docLink={htConsumers?.agreement_details?.commissioning_permission_doc}
//                     />
//                   )}
//                   {htConsumers?.agreement_details?.me_meter_work_order_docs && (
//                     <DocumentTrBloack

//                       Lable={'View ME Meter Work Order'}
//                       docLink={htConsumers?.agreement_details?.me_meter_work_order_docs}
//                     />
//                   )}
//                   {htConsumers?.agreement_details?.ex_work_order_docs && (
//                     <DocumentTrBloack

//                       Lable={'View Extantion Work'}
//                       docLink={htConsumers?.agreement_details?.ex_work_order_docs}
//                     />
//                   )}
//                   {htConsumers?.agreement_details?.commissioning_permission_doc && (
//                     <DocumentTrBloack

//                       Lable={'View Commissioning Permission Letter'}
//                       docLink={htConsumers?.agreement_details?.commissioning_permission_doc}
//                     />
//                   )}
//                   {htConsumers?.commissioning_permission?.commissioning_permission_letter && (
//                     <DocumentTrBloack

//                       Lable={'View Commissioning Permission Letter'}
//                       docLink={
//                         htConsumers?.commissioning_permission?.commissioning_permission_letter
//                       }
//                     />
//                   )}

//                   {htConsumers?.application_status == "1" && (
//                     <GeneratePDF
//                       baseUrl={HT_LOAD_CHANGE_BASE}
//                       url={"/GenerateChallanPdf/"}
//                       id={htConsumers?.id}
//                       Lable={'Generate Demand Note Challan '}

//                     />
//                   )}
//                   {(htConsumers?.survey?.is_required == "is_estimate_required" && htConsumers?.application_status == "8") && (
//                     <GeneratePDF
//                       baseUrl={HT_LOAD_CHANGE_BASE}
//                       url={"/GenerateChallan_EstimatePdf/"}
//                       id={htConsumers?.id}
//                       Lable={'Generate Demand Note Challan '}

//                     />
//                   )}
//                   {/* {htConsumers?.transco_approval?.status == "accepted_from_cgm" && (
//                     <GeneratePDF
//                       baseUrl={HT_LOAD_CHANGE_BASE}
//                       url={"/GenerateChallan_EstimatePdf/"}
//                       id={htConsumers?.id}
//                       Lable={'Generate Demand Note Challan '}

//                     />
//                   )} */}
//                   {htConsumers?.transco_approval?.status === "accepted_from_cgm" && (
//                     <DocumentTrBloack

//                       Lable={'View Transco Approval Letter'}
//                       docLink={
//                         htConsumers?.transco_approval?.document
//                       }
//                     />
//                   )}


//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

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
      console.log(baseUrl, 'baseUrllll')
      console.log(url, 'url')
      console.log(id, 'idddddd')
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
                <TableTrBloack Lable={'Application Date'} Value={htConsumers?.registration_date || 'N/A'} />
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
                    <TableTrBloack Lable={'Agreement Effective Date'} Value={htConsumers?.agreement_details?.agreement_effective_date} />
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
                  {htConsumers?.regfee_receipt_pdf && <DocumentTrBloack Lable={'Registration Fee Invoice'} docLink={htConsumers?.regfee_receipt_pdf} />}
                  {htConsumers?.reg_invoice_pdf && <DocumentTrBloack Lable={'Initial Payment Invoice'} docLink={htConsumers?.reg_invoice_pdf} />}
                  {htConsumers?.estimate_invoice_pdf && <DocumentTrBloack Lable={'Estimate Invoice'} docLink={htConsumers?.estimate_invoice_pdf} />}
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
