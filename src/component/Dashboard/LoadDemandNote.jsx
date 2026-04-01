// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
// import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
// import { setOfficerData } from "../../redux/slices/userSlice.js";
// import { handleTokenExpiry } from '../../utils/handleTokenExpiry';

// import {
//   InputTag,
//   SelectTag,
//   RadioTag,
//   ApplicantBasicDetails,
//   sendOtpNew,
//   verifyOtpNew,
// } from '../importComponents.js';
// import {
//   region,
//   lineType,
//   conductorType,
//   poleType,
//   setSurveyOptions,
//   responseOption,
//   revertOption,
// } from '../newComponents/commonOption.js';
// import ViewTag from '../newComponents/ViewTag.jsx';

// const LoadDemandNote = () => {
//   const officerData = useSelector(state => state.user.officerData);
//   // const [mobileNo, setMobileNo] = useState(officerData?.employee_detail.cug_mobile);

//   const [mobileNo, setMobileNo] = useState('');
//   const [showOtpBtn, setShowOtpBtn] = useState(false);
//   const [fromDataValue, setFromDataValue] = useState(null);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [isBtnDisabled, setBtnIsDisabled] = useState(false);
//   const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);

//   const [timer, setTimer] = useState(0);
//   const [isOtpExpired, setIsOtpExpired] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false)

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { items } = location.state || {};
//   console.log(items, 'items');
//   const token = Cookies.get('accessToken');
//   const dispatch = useDispatch()



//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     getValues,
//     setError,
//     clearErrors,
//     formState: { errors },
//   } = useForm({
//     defaultValues: items || {},
//   });
//   const required = items?.survey?.is_estimate_required?.split(',') || [];
//   let total_estimate_amt =
//     (Number(items?.survey?.ndf_total_amt) || 0) + (Number(items?.survey?.total_estimated_amt) || 0);

//   setValue('total_demand_note_amt', total_estimate_amt);
//   setValue('total_me_estimate_amt', items?.survey?.ndf_total_amt);
//   setValue('total_ext_estimate_amt', items?.survey?.total_estimated_amt);
//   setValue('total_estimate_amt', total_estimate_amt);
//   setValue('application', items.id);
//   const demand_note_response = watch('demand_note_response');

//   const loadDemandNoteRevertOption = [
//     ...revertOption,
//     {
//       label: "Due to Incorrect Estimate Details",
//       value: "due to Incorrect Estimate Details",
//     },
//   ];

//   //timer 
//   useEffect(() => {
//     let interval;

//     if (timer > 0 && !isProcessing) {
//       interval = setInterval(() => {
//         setTimer(prev => prev - 1);
//       }, 1000);
//     }

//     if (timer === 0 && showOtpBtn && !isProcessing) {
//       setIsOtpExpired(true);
//     }

//     return () => clearInterval(interval);
//   }, [timer, showOtpBtn, isProcessing]);

//   // ---------- FORMAT TIME ----------
//   const formatTime = sec => {
//     const m = String(Math.floor(sec / 60)).padStart(2, "0");
//     const s = String(sec % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   };


//   useEffect(() => {
//     if (officerData?.employee_detail?.cug_mobile) {
//       setMobileNo(officerData.employee_detail.cug_mobile);
//     }
//   }, [officerData]);

//   // ---------- SEND OTP ----------
//   // const handleSendOtp = async formData => {
//   //   if (isSendOtpLoading) return;

//   //   setIsSendOtpLoading(true);
//   //   setFromDataValue(formData);
//   //   clearErrors();

//   //   try {
//   //     const res = await sendOtpNew(mobileNo);

//   //     if (res.success) {
//   //       setShowOtpBtn(true);
//   //       setIsDisabled(true);

//   //       setTimer(120);          // ⬅ start 2-min timer
//   //       setIsOtpExpired(false);

//   //       setError("otpSuccess", {
//   //         type: "manual",
//   //         message: res.message,
//   //       });
//   //     } else {
//   //       setError("otpStatus", {
//   //         type: "manual",
//   //         message: res.message,
//   //       });
//   //     }
//   //   } catch {
//   //     setError("otpStatus", {
//   //       type: "manual",
//   //       message: "Failed to send OTP. Please try again.",
//   //     });
//   //   } finally {
//   //     setIsSendOtpLoading(false);
//   //   }
//   // };
//   const handleSendOtp = async formData => {

//   // 🔴 VALIDATION: Demand note amount must be > 0
//   const totalAmount = Number(formData.total_demand_note_amt || 0);

//   if (totalAmount <= 0) {
//     alert("Demand note cannot be generated with zero amount");
//     return; // ⛔ stop further execution
//   }

//   if (isSendOtpLoading) return;

//   setIsSendOtpLoading(true);
//   setFromDataValue(formData);
//   clearErrors();

//   try {
//     const res = await sendOtpNew(mobileNo);

//     if (res.success) {
//       setShowOtpBtn(true);
//       setIsDisabled(true);
//       setTimer(120);
//       setIsOtpExpired(false);

//       setError("otpSuccess", {
//         type: "manual",
//         message: res.message,
//       });
//     } else {
//       setError("otpStatus", {
//         type: "manual",
//         message: res.message,
//       });
//     }
//   } catch {
//     setError("otpStatus", {
//       type: "manual",
//       message: "Failed to send OTP. Please try again.",
//     });
//   } finally {
//     setIsSendOtpLoading(false);
//   }
// };



//   // const handleVerifyOtp = async () => {
//   //   const otpValue = getValues('otp');
//   //   setBtnIsDisabled(true);
//   //   const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);
//   //   if (verifyOtpResponse.success) {
//   //     handleFinalSubmit();
//   //   } else {
//   //     setError('otp', {
//   //       type: 'manual',
//   //       message: verifyOtpResponse.error,
//   //     });
//   //     setBtnIsDisabled(false);
//   //   }
//   // };
//   const handleVerifyOtp = async () => {
//     if (isOtpExpired) {
//       setError("otp", {
//         type: "manual",
//         message: "OTP expired. Please resend OTP.",
//       });
//       return;
//     }

//     const otpValue = getValues("otp");
//     // setBtnIsDisabled(true);
//     setBtnIsDisabled(true);

//     const res = await verifyOtpNew(mobileNo, otpValue);

//     if (res.success) {
//       // 🔥 SUCCESS FLOW
//       setIsProcessing(true);   // show processing text
//       setTimer(0);             // stop timer
//       setShowOtpBtn(false);    // hide OTP UI

//       await handleFinalSubmit();  // call final API
//     } else {
//       setError("otp", {
//         type: "manual",
//         message: res.error,
//       });
//       // setBtnIsDisabled(false);
//       setBtnIsDisabled(false);
//     }
//   };

//   // const handleReSendOtp = async () => {
//   //   clearErrors('otpSuccess');
//   //   const sentOtp = await sendOtpNew(mobileNo);
//   //   setShowOtpBtn(true);
//   //   if (sentOtp) {
//   //     setError('otpSuccess', {
//   //       type: 'manual',
//   //       message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
//   //     });
//   //   } else {
//   //     setError('otp', {
//   //       type: 'manual',
//   //       message: `Failed to send OTP on ****${mobileNo.slice(-4)}`,
//   //     });
//   //   }
//   // };
//   const handleReSendOtp = async () => {
//     clearErrors();

//     const res = await sendOtpNew(mobileNo);

//     if (res.success) {
//       setTimer(120);          // restart timer
//       setIsOtpExpired(false);

//       setError("otpSuccess", {
//         type: "manual",
//         message: `OTP resent to ****${mobileNo.slice(-4)}`,
//       });
//     } else {
//       setError("otp", {
//         type: "manual",
//         message: res.message,
//       });
//     }
//   };

//   const handleFinalSubmit = async () => {
//     try {
//       const formValue = fromDataValue;
//       const formData = new FormData();

//       Object.keys(formValue).forEach(key => {
//         if (formValue[key] instanceof FileList) {
//           if (formValue[key].length > 0) {
//             formData.append(key, formValue[key][0]);
//           }
//         } else {
//           formData.append(key, formValue[key]);
//         }
//       });
//       const { data } = await axios.post(`${HT_LOAD_CHANGE_BASE}/demand-note/`, formData, {
//         headers: {
//           // 'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const { data: apiData, ...rest } = data;
//       alert(apiData?.demand_note_response === "Reverted" ? "Application Reverted successfully" : "Demand Note submitted successfully ✅");
//       navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
//       const updatedFlags = await handleOfficerFlagCount();
//       dispatch(setOfficerData(updatedFlags));
//     } catch (error) {
//       if (handleTokenExpiry(error, navigate)) return;

//       // normal error handling
//       console.log(error, 'error from api');
//       alert('Something went wrong ❌');
//     } finally {
//       setBtnIsDisabled(false);
//     }
//   };
//   let total_Amount_convert = Math.round(items?.survey?.ndf_total_amt)
//   // console.log(total_Amount_convert,'amounttttttttttt')
//   return (
//     <>
//       <div>
//         <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//           <div className="card-header px-4 py-2 border-b border-gray-300">
//             <h2 className="text-lg font-bold capitalize ">HT Load Change Demand Note generation</h2>
//           </div>
//           <div className="card-body px-4 pb-4">
//             <div className="mt-6 overflow-x-auto">{officerData?.employee_detail.role}</div>
//           </div>
//         </div>
//         <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
//         {/* <ApplicantFillDetails htConsumers={items} /> */}
//         {officerData?.employee_detail.role == 3 && (
//           <>
//             {required.includes('is_extension_work_required') && (
//               <>
//                 <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                   <div className="card-header px-4 py-2 border-b border-gray-300">
//                     <h2 className="text-lg font-bold capitalize ">
//                       ERP Details Of Extension Work Demand Amounts
//                     </h2>
//                   </div>
//                   <div className="card-body px-4 pb-4">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             ERP No:-{items?.survey?.erp_no}
//                           </th>
//                           <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
//                             Scheme Name:-{items?.survey?.scheme_name}
//                           </th>
//                           <th
//                             colSpan={2}
//                             className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase"
//                           >
//                             Estimate Date:-{items?.survey?.estimate_date}
//                           </th>
//                         </tr>
//                         <tr>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             S No.
//                           </th>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             Particular
//                           </th>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             Account Head
//                           </th>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             Amount
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">1</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
//                               Supervision Amount
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                             62.925
//                           </td>
//                           <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
//                             {items?.survey?.supervision_amt}
//                           </td>
//                         </tr>
//                         <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">2</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
//                               Supervision CGST Cost
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                             46.948
//                           </td>
//                           <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
//                             {items?.survey?.supervision_cgst}
//                           </td>
//                         </tr>
//                         <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">3</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
//                               Supervision SGST Cost
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                             46.948
//                           </td>
//                           <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
//                             {items?.survey?.supervision_sgst}
//                           </td>
//                         </tr>
//                         <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                           <td
//                             colspan="3"
//                             className="px-6 py-4 text-sm text-center text-gray-500 font-medium  whitespace-nowrap"
//                           >
//                             Total Costs
//                           </td>
//                           <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
//                             {items?.survey?.total_estimated_amt}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </>
//             )}
//             {required.includes('is_me_meter_required') && (
//               <>
//                 <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                   <div className="card-header px-4 py-2 border-b border-gray-300">
//                     <h2 className="text-lg font-bold capitalize ">
//                       ERP Details Of Deposit ME Meter Estimates Amounts
//                     </h2>
//                   </div>
//                   <div className="card-body px-4 pb-4">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             ERP No:-
//                             <span className="font-medium"> {items?.survey?.ndf_erp_no}</span>
//                           </th>
//                           <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
//                             Scheme Name:-{' '}
//                             <span className="font-medium">{items?.survey?.ndf_scheme_name}</span>
//                           </th>
//                           <th
//                             colSpan={2}
//                             className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase"
//                           >
//                             Estimate Date :-
//                             <span className="font-medium">{items?.survey?.ndf_estimate_date}</span>
//                           </th>
//                         </tr>
//                         <tr>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             S No.
//                           </th>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             Particular
//                           </th>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             Account Head
//                           </th>
//                           <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
//                             Amount
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">1</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
//                               Total Cost of Estimate in Rs.
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                             47.320
//                           </td>
//                           <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
//                             {/* {items?.survey?.ndf_total_amt} */}
//                             {total_Amount_convert}
//                           </td>
//                         </tr>
//                         {/* <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                           <td
//                             colSpan={3}
//                             className="px-6 py-4 text-sm text-center text-gray-500 font-medium whitespace-nowrap"
//                           >
//                             Total ME Costs
//                           </td>
//                           <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
//                             {items?.survey?.ndf_total_amt}
//                           </td>
//                         </tr> */}
//                         <tr>
//                           <td
//                             colSpan={3}
//                             className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase"
//                           >
//                             Total Demand Note Amount
//                           </td>
//                           <td className="px-6 py-3 text-xs text-left  font-medium text-gray-500 uppercase">
//                             {total_estimate_amt}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </>
//             )}

//             <form onSubmit={handleSubmit(handleSendOtp)}>
//               <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                 <div className="card-header px-4 py-2 ">
//                   <h2 className="text-lg font-bold capitalize "></h2>
//                 </div>
//                 <div className="card-body px-4 pb-4">
//                   <input type="hidden" {...register('application')}></input>
//                   <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//                     <SelectTag
//                       LName="Acceptance"
//                       options={responseOption}
//                       {...register('demand_note_response', {
//                         required: 'Please Select  Acceptance is required',
//                       })}
//                       errorMsg={errors.demand_note_response?.message}
//                       labelKey="label"
//                       valueKey="value"
//                       disabled={isDisabled}
//                     />
//                     {demand_note_response === 'Accepted' && (
//                       <>
//                         <input type="hidden" {...register('total_demand_note_amt')}></input>
//                         <input type="hidden" {...register('total_me_estimate_amt')}></input>
//                         <input type="hidden" {...register('total_ext_estimate_amt')}></input>
//                         <input type="hidden" {...register('total_estimate_amt')}></input>

//                         {/* NEW FIELD */}
//                         <InputTag
//                           LName="Supplement Draft Agreement (PDF)"
//                           type="file"
//                           acceptPdfOnly={true}
//                           accept="application/pdf"
//                           {...register('supplement_draft_agreement', {
//                             required: 'Supplement Draft Agreement is required',
//                           })}
//                           errorMsg={errors.supplement_draft_agreement?.message}
//                           disabled={isDisabled}
//                         />
//                       </>
//                     )}
//                     {demand_note_response === 'Reverted' && (
//                       <>
//                         {/* <SelectTag
//                             options={revertOption}
//                             LName="Revert Reason"
//                             {...register('revert_reason', {
//                               required: 'Please Select Revert Reason is required',
//                             })}
//                             errorMsg={errors.revert_reason?.message}
//                             labelKey="label"
//                             valueKey="value"
//                             disabled={isDisabled}
//                           /> */}
//                         <SelectTag
//                           options={loadDemandNoteRevertOption}
//                           LName="Revert Reason"
//                           {...register('revert_reason', {
//                             required: 'Please Select Revert Reason is required',
//                           })}
//                           errorMsg={errors.revert_reason?.message}
//                           labelKey="label"
//                           valueKey="value"
//                           disabled={isDisabled}
//                         />

//                         <InputTag
//                           LName="Revert Reason Remark"
//                           placeholder="Please Enter Revert Reason Remark"
//                           {...register('revert_reason_remark', {
//                             required: 'Revert Reason Remark is required',
//                           })}
//                           errorMsg={errors.revert_reason_remark?.message}
//                           disabled={isDisabled}
//                         />
//                         <InputTag
//                           LName="Upload Revert Docs"
//                           type="file"
//                           acceptPdfOnly={true}
//                           {...register('upload_revert_docs', {
//                             required: 'Upload Upload Revert Docs is required',
//                           })}
//                           errorMsg={errors.upload_revert_docs?.message}
//                           disabled={isDisabled}
//                         />
//                       </>
//                     )}
//                   </div>
//                 </div>
//                 <div className="border-b border-gray-900/10 pb-12">
//                   <div className="mt-10 flex flex-col justify-center items-center">
//                     <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
//                       {!showOtpBtn && (
//                         <>
//                           <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-red-600 duration-300">
//                             Reset
//                           </button>
//                           {demand_note_response === 'Reverted' ? (
//                             <button
//                               type="submit"
//                               className={`  text-white px-4 py-2 mt-4 rounded 
//                                             ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-purple-800 text-white'}`}
//                               disabled={isDisabled || isBtnDisabled}
//                             >
//                               {isSendOtpLoading ? 'Please wait...' : 'Revet For Survey'}
//                             </button>
//                           ) : (
//                             <button
//                               type="submit"
//                               className={`  text-white px-4 py-2 mt-4 rounded 
//                                             ${isSendOtpLoading || isBtnDisabled? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-purple-800 text-white'}`}
//                               disabled={isSendOtpLoading || isBtnDisabled || isProcessing}
//                             >
//                               {isSendOtpLoading ? 'Please wait...' : 'Send for Applicant'}
//                             </button>
//                           )}
//                         </>
//                       )}
//                       {/* {showOtpBtn && (
//                         <>
//                           <InputTag
//                             LName=""
//                             placeholder="Please Enter Otp."
//                             {...register('otp', {
//                               required: 'Otp is required',
//                             })}
//                             errorMsg={errors.otp?.message}
//                           />
//                           <button
//                             type="button"
//                             onClick={handleVerifyOtp}
//                             className={`bg-green-600 text-white px-4 py-2 mt-4 rounded"
//                                                                       ${isBtnDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-purple-800 text-white'}`}
//                             disabled={isBtnDisabled}
//                           >
//                             {isBtnDisabled ? 'Please wait...' : ' Verify Otp'}
//                           </button>

//                           <button
//                             type="button"
//                             onClick={handleReSendOtp}
//                             className="bg-emerald-600 text-white px-4 py-2 mt-4 rounded"
//                           >
//                             Resend Otp
//                           </button>
//                         </>
//                       )} */}
//                       {showOtpBtn && !isProcessing && (
//                         <>
//                           <InputTag
//                             placeholder="Enter OTP"
//                             {...register("otp", { required: "OTP is required" })}
//                             errorMsg={errors.otp?.message}
//                           />

//                           {/* RED TIMER */}
//                           <p className="text-red-600 font-semibold text-sm mt-1">
//                             {timer > 0
//                               ? `OTP expires in ${formatTime(timer)}`
//                               : "OTP expired. Please resend OTP."}
//                           </p>

//                           {/* VERIFY BUTTON */}
//                           <button
//                             type="button"
//                             onClick={handleVerifyOtp}
//                             disabled={isBtnDisabled || isOtpExpired}
//                             className={`px-4 py-2 mt-3 rounded text-white
//                                                ${isBtnDisabled || isOtpExpired
//                                 ? "bg-gray-400 cursor-not-allowed"
//                                 : "bg-green-600 hover:bg-green-800"}`}
//                           >
//                             {isBtnDisabled ? "Verifying..." : "Verify OTP"}
//                           </button>

//                           {/* RESEND BUTTON */}
//                           <button
//                             type="button"
//                             onClick={handleReSendOtp}
//                             className="px-4 py-2 mt-3 rounded bg-emerald-600 text-white hover:bg-emerald-800"
//                           >
//                             Resend OTP
//                           </button>
//                         </>
//                       )}

//                       {/* PROCESSING MESSAGE */}
//                       {isProcessing && (
//                         <p className="text-blue-700 font-semibold mt-2 animate-pulse">
//                           Processing... Please wait
//                         </p>
//                       )}

//                     </div>
//                     {errors?.otpSuccess && (
//                       <p className="text-green-500 text-sm mt-1">{errors?.otpSuccess?.message}</p>
//                     )}
//                     {errors?.otpStatus && (
//                       <p className="text-red-500 text-sm mt-1">{errors?.otpStatus?.message}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </>
//   );
// };
// export default LoadDemandNote;


import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
import { setOfficerData } from "../../redux/slices/userSlice.js";
import { handleTokenExpiry } from '../../utils/handleTokenExpiry';

import {
  InputTag,
  SelectTag,
  RadioTag,
  ApplicantBasicDetails,
  sendOtpNew,
  verifyOtpNew,
} from '../importComponents.js';
import {
  region,
  lineType,
  conductorType,
  poleType,
  setSurveyOptions,
  responseOption,
  revertOption,
} from '../newComponents/commonOption.js';
import ViewTag from '../newComponents/ViewTag.jsx';

const LoadDemandNote = () => {
  const officerData = useSelector(state => state.user.officerData);
  // const [mobileNo, setMobileNo] = useState(officerData?.employee_detail.cug_mobile);

  const [mobileNo, setMobileNo] = useState('');
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [fromDataValue, setFromDataValue] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false)

  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || {};
  console.log(items, 'items');
  const token = Cookies.get('accessToken');
  const dispatch = useDispatch()



  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });
  const required = items?.survey?.is_estimate_required?.split(',') || [];

  const isExtensionWork = required.includes('is_extension_work_required');
  const isSCCW = items?.survey?.scheme_name === "SCCW";

  // 🔥 Extension Amount Logic
  let extensionAmount = 0;

  if (isExtensionWork) {

    if (isSCCW) {
      // Only supervision + CGST + SGST
      extensionAmount =
        (Number(items?.survey?.supervision_amt) || 0) +
        (Number(items?.survey?.supervision_cgst) || 0) +
        (Number(items?.survey?.supervision_sgst) || 0);

    } else {
      // Normal Extension Estimate
      extensionAmount =
        Number(items?.survey?.total_estimated_amt) || 0;
    }
  }

  // 🔥 ME Amount
  const meAmount =
    Number(items?.survey?.ndf_total_amt) || 0;
  const total_estimate_amt = extensionAmount + meAmount;

  // 🔥 Final Demand Note Amount
  // const total_estimate_amt = extensionAmount + meAmount;
  //   let total_estimate_amt =
  //     (Number(items?.survey?.ndf_total_amt) || 0) + (Number(items?.survey?.total_estimated_amt) || 0);

  // setValue('total_demand_note_amt', total_estimate_amt);
  // setValue('total_me_estimate_amt', items?.survey?.ndf_total_amt);
  // setValue('total_ext_estimate_amt', items?.survey?.total_estimated_amt);
  // setValue('total_estimate_amt', total_estimate_amt);
  // setValue('application', items.id);
  useEffect(() => {
     
    setValue('total_demand_note_amt', total_estimate_amt);

    setValue('total_me_estimate_amt', meAmount);

    setValue('total_ext_estimate_amt', extensionAmount);

    setValue('total_estimate_amt', total_estimate_amt);

    setValue('application', items.id);

  }, [items,total_estimate_amt]);

  const demand_note_response = watch('demand_note_response');

  const loadDemandNoteRevertOption = [
    ...revertOption,
    {
      label: "Due to Incorrect Estimate Details",
      value: "due to Incorrect Estimate Details",
    },
  ];

  //timer 
  useEffect(() => {
    let interval;

    if (timer > 0 && !isProcessing) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    if (timer === 0 && showOtpBtn && !isProcessing) {
      setIsOtpExpired(true);
    }

    return () => clearInterval(interval);
  }, [timer, showOtpBtn, isProcessing]);

  // ---------- FORMAT TIME ----------
  const formatTime = sec => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };


  useEffect(() => {
    if (officerData?.employee_detail?.cug_mobile) {
      setMobileNo(officerData.employee_detail.cug_mobile);
    }
  }, [officerData]);

  // ---------- SEND OTP ----------
  // const handleSendOtp = async formData => {
  //   if (isSendOtpLoading) return;

  //   setIsSendOtpLoading(true);
  //   setFromDataValue(formData);
  //   clearErrors();

  //   try {
  //     const res = await sendOtpNew(mobileNo);

  //     if (res.success) {
  //       setShowOtpBtn(true);
  //       setIsDisabled(true);

  //       setTimer(120);          // ⬅ start 2-min timer
  //       setIsOtpExpired(false);

  //       setError("otpSuccess", {
  //         type: "manual",
  //         message: res.message,
  //       });
  //     } else {
  //       setError("otpStatus", {
  //         type: "manual",
  //         message: res.message,
  //       });
  //     }
  //   } catch {
  //     setError("otpStatus", {
  //       type: "manual",
  //       message: "Failed to send OTP. Please try again.",
  //     });
  //   } finally {
  //     setIsSendOtpLoading(false);
  //   }
  // };
  const handleSendOtp = async formData => {

    // 🔴 VALIDATION: Demand note amount must be > 0
    const totalAmount = Number(formData.total_demand_note_amt || 0);

    if (totalAmount <= 0) {
      alert("Demand note cannot be generated with zero amount");
      return; // ⛔ stop further execution
    }

    if (isSendOtpLoading) return;

    setIsSendOtpLoading(true);
    setFromDataValue(formData);
    clearErrors();

    try {
      const res = await sendOtpNew(mobileNo);

      if (res.success) {
        setShowOtpBtn(true);
        setIsDisabled(true);
        setTimer(120);
        setIsOtpExpired(false);

        setError("otpSuccess", {
          type: "manual",
          message: res.message,
        });
      } else {
        setError("otpStatus", {
          type: "manual",
          message: res.message,
        });
      }
    } catch {
      setError("otpStatus", {
        type: "manual",
        message: "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsSendOtpLoading(false);
    }
  };



  // const handleVerifyOtp = async () => {
  //   const otpValue = getValues('otp');
  //   setBtnIsDisabled(true);
  //   const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);
  //   if (verifyOtpResponse.success) {
  //     handleFinalSubmit();
  //   } else {
  //     setError('otp', {
  //       type: 'manual',
  //       message: verifyOtpResponse.error,
  //     });
  //     setBtnIsDisabled(false);
  //   }
  // };
  const handleVerifyOtp = async () => {
    if (isOtpExpired) {
      setError("otp", {
        type: "manual",
        message: "OTP expired. Please resend OTP.",
      });
      return;
    }

    const otpValue = getValues("otp");
    // setBtnIsDisabled(true);
    setBtnIsDisabled(true);

    const res = await verifyOtpNew(mobileNo, otpValue);

    if (res.success) {
      // 🔥 SUCCESS FLOW
      setIsProcessing(true);   // show processing text
      setTimer(0);             // stop timer
      setShowOtpBtn(false);    // hide OTP UI

      await handleFinalSubmit();  // call final API
    } else {
      setError("otp", {
        type: "manual",
        message: res.error,
      });
      // setBtnIsDisabled(false);
      setBtnIsDisabled(false);
    }
  };

  // const handleReSendOtp = async () => {
  //   clearErrors('otpSuccess');
  //   const sentOtp = await sendOtpNew(mobileNo);
  //   setShowOtpBtn(true);
  //   if (sentOtp) {
  //     setError('otpSuccess', {
  //       type: 'manual',
  //       message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
  //     });
  //   } else {
  //     setError('otp', {
  //       type: 'manual',
  //       message: `Failed to send OTP on ****${mobileNo.slice(-4)}`,
  //     });
  //   }
  // };
  const handleReSendOtp = async () => {
    clearErrors();

    const res = await sendOtpNew(mobileNo);

    if (res.success) {
      setTimer(120);          // restart timer
      setIsOtpExpired(false);

      setError("otpSuccess", {
        type: "manual",
        message: `OTP resent to ****${mobileNo.slice(-4)}`,
      });
    } else {
      setError("otp", {
        type: "manual",
        message: res.message,
      });
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const formValue = fromDataValue;
      const formData = new FormData();

      Object.keys(formValue).forEach(key => {
        if (formValue[key] instanceof FileList) {
          if (formValue[key].length > 0) {
            formData.append(key, formValue[key][0]);
          }
        } else {
          formData.append(key, formValue[key]);
        }
      });
      const { data } = await axios.post(`${HT_LOAD_CHANGE_BASE}/demand-note/`, formData, {
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const { data: apiData, ...rest } = data;
      alert(apiData?.demand_note_response === "Reverted" ? "Application Reverted successfully" : "Demand Note submitted successfully ✅");
      navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
      const updatedFlags = await handleOfficerFlagCount();
      dispatch(setOfficerData(updatedFlags));
    } catch (error) {
      if (handleTokenExpiry(error, navigate)) return;

      // normal error handling
      console.log(error, 'error from api');
      alert('Something went wrong ❌');
    } finally {
      setBtnIsDisabled(false);
    }
  };
  let total_Amount_convert = Math.round(items?.survey?.ndf_total_amt)
  // console.log(total_Amount_convert,'amounttttttttttt')
  return (
    <>
      <div>
        <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
          <div className="card-header px-4 py-2 border-b border-gray-300">
            <h2 className="text-lg font-bold capitalize ">HT Load Change Demand Note generation</h2>
          </div>
          <div className="card-body px-4 pb-4">
            <div className="mt-6 overflow-x-auto">{officerData?.employee_detail.role}</div>
          </div>
        </div>
        <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
        {/* <ApplicantFillDetails htConsumers={items} /> */}
        {officerData?.employee_detail.role == 3 && (
          <>
            {required.includes('is_extension_work_required') && (
              <>
                <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                  <div className="card-header px-4 py-2 border-b border-gray-300">
                    <h2 className="text-lg font-bold capitalize ">
                      ERP Details Of Extension Work Demand Amounts
                    </h2>
                  </div>
                  <div className="card-body px-4 pb-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            ERP No:-{items?.survey?.erp_no}
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                            Scheme Name:-{items?.survey?.scheme_name}
                          </th>
                          <th
                            colSpan={2}
                            className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase"
                          >
                            Estimate Date:-{items?.survey?.estimate_date}
                          </th>
                        </tr>
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            S No.
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            Particular
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            Account Head
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">1</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              Supervision Amount
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            62.925
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                            {items?.survey?.supervision_amt}
                          </td>
                        </tr>
                        <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">2</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              Supervision CGST Cost
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            46.948
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                            {items?.survey?.supervision_cgst}
                          </td>
                        </tr>
                        <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">3</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              Supervision SGST Cost
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            46.948
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                            {items?.survey?.supervision_sgst}
                          </td>
                        </tr>
                        <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                          <td
                            colspan="3"
                            className="px-6 py-4 text-sm text-center text-gray-500 font-medium  whitespace-nowrap"
                          >
                            Total Costs
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                            {isSCCW
                              ? extensionAmount
                              : items?.survey?.total_estimated_amt}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {required.includes('is_me_meter_required') && (
              <>
                <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                  <div className="card-header px-4 py-2 border-b border-gray-300">
                    <h2 className="text-lg font-bold capitalize ">
                      ERP Details Of Deposit ME Meter Estimates Amounts
                    </h2>
                  </div>
                  <div className="card-body px-4 pb-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            ERP No:-
                            <span className="font-medium"> {items?.survey?.ndf_erp_no}</span>
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                            Scheme Name:-{' '}
                            <span className="font-medium">{items?.survey?.ndf_scheme_name}</span>
                          </th>
                          <th
                            colSpan={2}
                            className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase"
                          >
                            Estimate Date :-
                            <span className="font-medium">{items?.survey?.ndf_estimate_date}</span>
                          </th>
                        </tr>
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            S No.
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            Particular
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            Account Head
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">1</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              Total Cost of Estimate in Rs.
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            47.320
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                            {/* {items?.survey?.ndf_total_amt} */}
                            {total_Amount_convert}
                          </td>
                        </tr>
                        {/* <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                          <td
                            colSpan={3}
                            className="px-6 py-4 text-sm text-center text-gray-500 font-medium whitespace-nowrap"
                          >
                            Total ME Costs
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                            {items?.survey?.ndf_total_amt}
                          </td>
                        </tr> */}
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase"
                          >
                            Total Demand Note Amount
                          </td>
                          <td className="px-6 py-3 text-xs text-left  font-medium text-gray-500 uppercase">
                            {total_estimate_amt}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit(handleSendOtp)}>
              <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                <div className="card-header px-4 py-2 ">
                  <h2 className="text-lg font-bold capitalize "></h2>
                </div>
                <div className="card-body px-4 pb-4">
                  <input type="hidden" {...register('application')}></input>
                    <input
                    type="hidden"
                    name="employee_id"
                    {...register('employee_id')}
                    value={officerData?.employee_detail.employee_login_id}>
                   </input>
                   
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <SelectTag
                      LName="Acceptance"
                      options={responseOption}
                      {...register('demand_note_response', {
                        required: 'Please Select  Acceptance is required',
                      })}
                      errorMsg={errors.demand_note_response?.message}
                      labelKey="label"
                      valueKey="value"
                      disabled={isDisabled}
                    />
                    {demand_note_response === 'Accepted' && (
                      <>
                        <input type="hidden" {...register('total_demand_note_amt')}></input>
                        <input type="hidden" {...register('total_me_estimate_amt')}></input>
                        <input type="hidden" {...register('total_ext_estimate_amt')}></input>
                        <input type="hidden" {...register('total_estimate_amt')}></input>

                        {/* NEW FIELD */}
                        <InputTag
                          LName="Supplement Draft Agreement (PDF)"
                          type="file"
                          acceptPdfOnly={true}
                          accept="application/pdf"
                          {...register('supplement_draft_agreement', {
                            required: 'Supplement Draft Agreement is required',
                          })}
                          errorMsg={errors.supplement_draft_agreement?.message}
                          disabled={isDisabled}
                        />
                      </>
                    )}
                    {demand_note_response === 'Reverted' && (
                      <>
                        {/* <SelectTag
                            options={revertOption}
                            LName="Revert Reason"
                            {...register('revert_reason', {
                              required: 'Please Select Revert Reason is required',
                            })}
                            errorMsg={errors.revert_reason?.message}
                            labelKey="label"
                            valueKey="value"
                            disabled={isDisabled}
                          /> */}
                        <SelectTag
                          options={loadDemandNoteRevertOption}
                          LName="Revert Reason"
                          {...register('revert_reason', {
                            required: 'Please Select Revert Reason is required',
                          })}
                          errorMsg={errors.revert_reason?.message}
                          labelKey="label"
                          valueKey="value"
                          disabled={isDisabled}
                        />

                        <InputTag
                          LName="Revert Reason Remark"
                          placeholder="Please Enter Revert Reason Remark"
                          {...register('revert_reason_remark', {
                            required: 'Revert Reason Remark is required',
                          })}
                          errorMsg={errors.revert_reason_remark?.message}
                          disabled={isDisabled}
                        />
                        <InputTag
                          LName="Upload Revert Docs"
                          type="file"
                          acceptPdfOnly={true}
                          {...register('upload_revert_docs', {
                            required: 'Upload Upload Revert Docs is required',
                          })}
                          errorMsg={errors.upload_revert_docs?.message}
                          disabled={isDisabled}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 flex flex-col justify-center items-center">
                    <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                      {!showOtpBtn && (
                        <>
                          <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-red-600 duration-300">
                            Reset
                          </button>
                          {demand_note_response === 'Reverted' ? (
                            <button
                              type="submit"
                              className={`  text-white px-4 py-2 mt-4 rounded 
                                            ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-purple-800 text-white'}`}
                              disabled={isDisabled || isBtnDisabled}
                            >
                              {isSendOtpLoading ? 'Please wait...' : 'Revet For Survey'}
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className={`  text-white px-4 py-2 mt-4 rounded 
                                            ${isSendOtpLoading || isBtnDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-purple-800 text-white'}`}
                              disabled={isSendOtpLoading || isBtnDisabled || isProcessing}
                            >
                              {isSendOtpLoading ? 'Please wait...' : 'Send for Applicant'}
                            </button>
                          )}
                        </>
                      )}
                      {/* {showOtpBtn && (
                        <>
                          <InputTag
                            LName=""
                            placeholder="Please Enter Otp."
                            {...register('otp', {
                              required: 'Otp is required',
                            })}
                            errorMsg={errors.otp?.message}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className={`bg-green-600 text-white px-4 py-2 mt-4 rounded"
                                                                      ${isBtnDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-purple-800 text-white'}`}
                            disabled={isBtnDisabled}
                          >
                            {isBtnDisabled ? 'Please wait...' : ' Verify Otp'}
                          </button>

                          <button
                            type="button"
                            onClick={handleReSendOtp}
                            className="bg-emerald-600 text-white px-4 py-2 mt-4 rounded"
                          >
                            Resend Otp
                          </button>
                        </>
                      )} */}
                      {showOtpBtn && !isProcessing && (
                        <>
                          <InputTag
                            placeholder="Enter OTP"
                            {...register("otp", { required: "OTP is required" })}
                            errorMsg={errors.otp?.message}
                          />

                          {/* RED TIMER */}
                          <p className="text-red-600 font-semibold text-sm mt-1">
                            {timer > 0
                              ? `OTP expires in ${formatTime(timer)}`
                              : "OTP expired. Please resend OTP."}
                          </p>

                          {/* VERIFY BUTTON */}
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={isBtnDisabled || isOtpExpired}
                            className={`px-4 py-2 mt-3 rounded text-white
                                               ${isBtnDisabled || isOtpExpired
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-800"}`}
                          >
                            {isBtnDisabled ? "Verifying..." : "Verify OTP"}
                          </button>

                          {/* RESEND BUTTON */}
                          <button
                            type="button"
                            onClick={handleReSendOtp}
                            className="px-4 py-2 mt-3 rounded bg-emerald-600 text-white hover:bg-emerald-800"
                          >
                            Resend OTP
                          </button>
                        </>
                      )}

                      {/* PROCESSING MESSAGE */}
                      {isProcessing && (
                        <p className="text-blue-700 font-semibold mt-2 animate-pulse">
                          Processing... Please wait
                        </p>
                      )}

                    </div>
                    {errors?.otpSuccess && (
                      <p className="text-green-500 text-sm mt-1">{errors?.otpSuccess?.message}</p>
                    )}
                    {errors?.otpStatus && (
                      <p className="text-red-500 text-sm mt-1">{errors?.otpStatus?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};
export default LoadDemandNote;

