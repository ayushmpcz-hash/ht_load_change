//old code
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import Cookies from "js-cookie";
// import axios from "axios";
// import {
//   InputTag,
//   SelectTag,
//   ApplicantBasicDetails,
//   sendOtpNew,
//   verifyOtpNew,
//   ApplicantFillDetails
// } from "../importComponents.js";
// import { responseOption, revertOption } from "../newComponents/commonOption.js";
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js'
// import { setOfficerData } from "../../redux/slices/userSlice.js";
// import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
// import { handleTokenExpiry } from '../../utils/handleTokenExpiry';


// const LoadAgreement = () => {
//   const officerData = useSelector((state) => state.user.officerData);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { items } = location.state || {};
//   const [mobileNo, setMobileNo] = useState('');
//   const [timer, setTimer] = useState(0);
//   const [isOtpExpired, setIsOtpExpired] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);

//   // console.log(items, "items")
//   // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE in Load Aggrement')
//   const required = items?.survey?.is_estimate_required?.split(',') || [];

//   const token = Cookies.get("accessToken");
//   const dispatch = useDispatch()


//   const [showOtpBtn, setShowOtpBtn] = useState(false);
//   const [formDataValue, setFormDataValue] = useState(null);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [isBtnDisabled, setBtnIsDisabled] = useState(false);



//   const transactionDateRaw = items?.bank_response?.transaction_date; // "2025-09-24T12:23:38+05:30"
//   const transactionDate = transactionDateRaw
//     ? new Date(transactionDateRaw).toISOString().split("T")[0] // "2025-09-24"
//     : null;

//   const todayDate = new Date().toISOString().split("T")[0]; // "2025-12-27"
//   const isAgreementFinalizationStep = items?.application_status === 11;



//   // Form
//   const {
//     register,
//     handleSubmit,
//     watch,
//     getValues,
//     setError,
//     clearErrors,
//     formState: { errors },
//   } = useForm({
//     defaultValues: items || {},
//   });

//   const agreement_response = watch("agreement_response");

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


//   const handleSendOtp = async () => {
//     if (isSendOtpLoading) return;

//     if (!mobileNo || mobileNo.length !== 10) {
//       setError("otpStatus", {
//         type: "manual",
//         message: "Mobile number not available. Please reload dashboard.",
//       });
//       return;
//     }

//     setIsSendOtpLoading(true);
//     clearErrors();

//     try {
//       const res = await sendOtpNew(mobileNo);

//       if (res.success) {
//         setShowOtpBtn(true);
//         setIsDisabled(true);
//         setTimer(120);
//         setIsOtpExpired(false);

//         setError("otpSuccess", { type: "manual", message: res.message });
//       } else {
//         setError("otpStatus", { type: "manual", message: res.message });
//       }
//     } finally {
//       setIsSendOtpLoading(false);
//     }
//   };


//   // 🔹 Verify OTP
//   // const handleVerifyOtp = async () => {
//   //   const otpValue = getValues("otp");
//   //   setBtnIsDisabled(true);
//   //   const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);

//   //   if (verifyOtpResponse.success) {
//   //     handleFinalSubmit();
//   //   } else {
//   //     setError("otp", { type: "manual", message: verifyOtpResponse.error });
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
//     setBtnIsDisabled(true);

//     const res = await verifyOtpNew(mobileNo, otpValue);

//     if (res.success) {
//       setIsProcessing(true);
//       setTimer(0);
//       setShowOtpBtn(false);

//       await handleFinalSubmit();
//     } else {
//       setError("otp", { type: "manual", message: res.error });
//       setBtnIsDisabled(false);
//     }
//   };

//   const handleReSendOtp = async () => {
//     clearErrors();

//     const res = await sendOtpNew(mobileNo);

//     if (res.success) {
//       setTimer(120);
//       setIsOtpExpired(false);

//       setError("otpSuccess", {
//         type: "manual",
//         message: `OTP resent to ****${mobileNo.slice(-4)}`,
//       });
//     } else {
//       setError("otp", { type: "manual", message: res.message });
//     }
//   };


//   // 🔹 Final Submit API Call
//   const handleFinalSubmit = async () => {
//     try {
//       const formValue = getValues();   // ⭐ FIXED
//       const formData = new FormData();

//       Object.entries(formValue).forEach(([key, value]) => {
//         if (value instanceof FileList && value.length > 0) {
//           formData.append(key, value[0]);
//           return;
//         }
//         if (value !== undefined && value !== null && value !== "") {
//           formData.append(key, value);
//         }
//       });

//       const { data } = await axios.post(
//         `${HT_LOAD_CHANGE_BASE}/agreement-details/`,
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Agreement And Work Order submitted successfully ✅");

//       navigate(`/dashboard/respones/${data.data.application}`, {
//         state: data.data,
//       });

//       const updatedFlags = await handleOfficerFlagCount();
//       dispatch(setOfficerData(updatedFlags));
//     } catch (error) {
//       if (handleTokenExpiry(error, navigate)) return;

//       console.error(error);
//       alert("Something went wrong ❌");
//     } finally {
//       setBtnIsDisabled(false);
//     }
//   };


//   return (
//     <>

//       <div>
//         <form onSubmit={handleSubmit(handleSendOtp)}>

//           <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//             <div className="card-header px-4 py-2 border-b border-gray-300">
//               <h2 className="text-lg font-bold capitalize ">
//                 HT Load Change Agreement Finalization
//               </h2>
//             </div>
//             <div className="card-body px-4 pb-4">
//               <div className="mt-6 overflow-x-auto">
//                 <div className="">
//                   <ApplicantBasicDetails
//                     htConsumers={items}
//                     register={register}
//                     errors={errors}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {officerData?.employee_detail.role == 3 && (
//             <>
//               <input
//                 type="hidden"
//                 value={items?.id}
//                 {...register("application")}
//               />


//               <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                 <div className="card-header px-4 py-2 border-b border-gray-300">
//                   <h2 className="text-lg font-bold capitalize ">

//                   </h2>
//                 </div>
//                 <div className="card-body px-4 pb-4">
//                   <div className="">
//                     <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">

//                       {/* <SelectTag
//                         LName="Acceptance"
//                         options={responseOption}
//                         {...register("agreement_response", {
//                           required: "Please Select Acceptance",
//                         })}
//                         errorMsg={errors.agreement_response?.message}
//                         labelKey="label"
//                         valueKey="value"
//                         disabled={isDisabled}
//                       /> */}
//                       <SelectTag
//                         LName="Acceptance"
//                         options={
//                           isAgreementFinalizationStep
//                             ? responseOption.filter(opt => opt.value !== "Reverted")
//                             : responseOption
//                         }
//                         {...register("agreement_response", {
//                           required: "Please Select Acceptance",
//                         })}
//                         errorMsg={errors.agreement_response?.message}
//                         labelKey="label"
//                         valueKey="value"
//                         disabled={isDisabled}
//                       />


//                       {/* Accepted Case */}
//                       {agreement_response === "Accepted" && (
//                         <>
//                           <InputTag
//                             LName="Agreement No."
//                             placeholder="Enter Agreement No."
//                             {...register("agreement_no", {
//                               required: "Agreement No is required",
//                             })}
//                             errorMsg={errors.agreement_no?.message}
//                             disabled={isDisabled}
//                           />

//                           {/* <InputTag
//                             LName="Agreement Date"
//                             type="date"
//                             {...register("agreement_effective_date", {

//                               required: "Effective Date is required",
//                             })}
//                             errorMsg={errors.agreement_effective_date?.message}
//                             disabled={isDisabled}
//                           /> */}
//                           <InputTag
//                             LName="Agreement Date"
//                             type="date"
//                             {...register("agreement_effective_date", {
//                               required: "Effective Date is required",
//                             })}
//                             min={transactionDate} // transaction date se pehle wali dates disable
//                             max={todayDate}       // aaj ke baad ki dates disable
//                             errorMsg={errors.agreement_effective_date?.message}
//                             disabled={isDisabled}
//                           />



//                           <InputTag
//                             LName="Final Agreement pdf"
//                             type="file"
//                             acceptPdfOnly={true}
//                             {...register("agreement_doc", {
//                               required: "Agreement Letter is required",
//                             })}
//                             errorMsg={errors.agreement_doc?.message}
//                             disabled={isDisabled}
//                           />

//                           {required?.includes('is_extension_work_required') && (
//                             <>
//                             <InputTag
//                               LName="Extension Work Order No."
//                               placeholder="Enter Extension Work Order No."
//                               {...register("ex_work_order_no", {
//                                 required: " Extension Work Order No is required",
//                               })}
//                               errorMsg={errors.ex_work_order_no?.message}
//                               disabled={isDisabled}
//                             />
//                             <InputTag
//                               LName=" Extension Work Order Date"
//                               type="date"
//                               {...register("ex_work_order_date", {
//                                 required: " Extension Work Order Date is required",
//                               })}
//                               errorMsg={errors.ex_work_order_date?.message}
//                               disabled={isDisabled}
//                             />
//                             <InputTag
//                               LName="Extension Work Order Letter"
//                               type="file"
//                               acceptPdfOnly={true}
//                               {...register("ex_work_order_docs", {
//                                 required: " Extension Work Order Letter is required",
//                               })}
//                               errorMsg={errors.ex_work_order_docs?.message}
//                               disabled={isDisabled}
//                             />

//                           </>
//                           )}
//                           {required.includes('is_me_meter_required') && (<>
//                             <InputTag
//                               LName="ME Meter Work Order No."
//                               placeholder="Enter ME Meter Work Order No."
//                               {...register("me_meter_work_order_no", {
//                                 required: "ME Meter Work Order No is required",
//                               })}
//                               errorMsg={errors.me_meter_work_order_no?.message}
//                               disabled={isDisabled}
//                             />
//                             {/* <InputTag
//                               LName="ME Meter Work Order Date"
//                               type="date"
//                               {...register("me_meter_work_order_date", {
//                                 required: "ME Meter Work Order Date is required",
//                               })}
//                               errorMsg={errors.me_meter_work_order_date?.message}
//                               disabled={isDisabled}
//                             /> */}
//                             <InputTag
//                               LName="ME Meter Work Order Date"
//                               type="date"
//                               {...register("me_meter_work_order_date", {
//                                 required: "ME Meter Work Order Date is required",
//                               })}
//                               min={transactionDate}   // ❌ payment se pehle ki date disable
//                               max={todayDate}         // ❌ future date disable
//                               errorMsg={errors.me_meter_work_order_date?.message}
//                               disabled={isDisabled}
//                             />

//                             <InputTag
//                               LName="ME Meter Work Order Letter"
//                               type="file"
//                               acceptPdfOnly={true}
//                               {...register("me_meter_work_order_docs", {
//                                 required: "ME Meter Work Order Letter is required",
//                               })}
//                               errorMsg={errors.me_meter_work_order_docs?.message}
//                               disabled={isDisabled}
//                             />
//                           </>
//                           )}

//                           {(items?.load_sanction?.is_required === "is_agreement_required" || items?.survey?.is_required === "is_agreement_required") && items?.type_of_change === "Load_Enhancement" && (
//                             <InputTag
//                               LName="Upload Commissioning Permission letter"
//                               type="file"
//                               acceptPdfOnly={true}
//                               {...register("commissioning_permission_doc", {
//                                 required: "Commissioning Permission letter is required",
//                               })}
//                               errorMsg={errors.commissioning_permission_docs?.message}
//                               disabled={isDisabled}
//                             />
//                           )}

//                         </>
//                       )}

//                       {/* Reverted Case */}
//                       {agreement_response === "Reverted" && (
//                         <>
//                           <SelectTag
//                             LName="Revert Reason"
//                             options={revertOption}
//                             {...register("revert_reason", {
//                               required: "Revert Reason is required",
//                             })}
//                             errorMsg={errors.revert_reason?.message}
//                             labelKey="label"
//                             valueKey="value"
//                             disabled={isDisabled}
//                           />
//                           <InputTag
//                             LName="Revert Reason Remark"
//                             placeholder="Enter Remark"
//                             {...register("revert_reason_remark", {
//                               required: "Remark is required",
//                             })}
//                             errorMsg={errors.revert_reason_remark?.message}
//                             disabled={isDisabled}
//                           />
//                           <InputTag
//                             LName="Upload Revert Docs"
//                             type="file"
//                             acceptPdfOnly={true}
//                             {...register("upload_revert_docs", {
//                               required: "Revert Docs are required",
//                             })}
//                             errorMsg={errors.upload_revert_docs?.message}
//                             disabled={isDisabled}
//                           />
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   <div className="border-b border-gray-900/10 pb-12 shadow-md p-4">
//                     <div className="mt-10 flex flex-col justify-center items-center">
//                       <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
//                         {!showOtpBtn ? (
//                           <>
//                             <button type="reset" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//                               Reset
//                             </button>

//                             <button
//                               type="submit"
//                               disabled={isSendOtpLoading}
//                               className={`px-4 py-2 rounded text-white ${isSendOtpLoading || isBtnDisabled
//                                   ? "bg-gray-400 cursor-not-allowed"
//                                   : "bg-green-500 hover:bg-purple-800"
//                                 }`}
//                             >
//                               {isSendOtpLoading
//                                 ? "Please wait..."
//                                 : agreement_response === "Reverted"
//                                   ? "Revert For Demand note"
//                                   : agreement_response === "Accepted" && required?.includes("is_me_meter_required")
//                                     ? "Send for Meter Issue"
//                                     : agreement_response === "Accepted" &&
//                                       (items?.load_sanction?.is_required === "is_agreement_required" ||
//                                         items?.survey?.is_required === "is_agreement_required") &&
//                                       items?.type_of_change === "Load_Enhancement"
//                                       ? "Send for BiCall"
//                                       : agreement_response === "Accepted" &&
//                                         (items?.load_sanction?.is_required === "is_agreement_required" ||
//                                           items?.survey?.is_required === "is_agreement_required") &&
//                                         items?.type_of_change === "Load_Reduction"
//                                         ? "Send for Completion certifying"
//                                         : "Send for Completion Certifying"}
//                             </button>
//                           </>
//                         ) : showOtpBtn && !isProcessing ? (
//                           <>
//                             <InputTag
//                               placeholder="Enter OTP"
//                               {...register("otp", { required: "Otp is required" })}
//                               errorMsg={errors.otp?.message}
//                             />

//                             <p className="text-red-600 font-semibold text-sm mt-1">
//                               {timer > 0
//                                 ? `OTP expires in ${formatTime(timer)}`
//                                 : "OTP expired. Please resend OTP."}
//                             </p>

//                             <button
//                               type="button"
//                               onClick={handleVerifyOtp}
//                               disabled={isBtnDisabled || isOtpExpired}
//                               className={`px-4 py-2 rounded text-white ${isBtnDisabled || isOtpExpired
//                                   ? "bg-gray-400 cursor-not-allowed"
//                                   : "bg-green-600 hover:bg-purple-800"
//                                 }`}
//                             >
//                               {isBtnDisabled ? "Verifying..." : "Verify OTP"}
//                             </button>

//                             <button
//                               type="button"
//                               onClick={handleReSendOtp}
//                               className="px-4 py-2 bg-emerald-600 text-white rounded"
//                             >
//                               Resend OTP
//                             </button>
//                           </>
//                         ) : (
//                           <p className="text-blue-700 font-semibold mt-2 animate-pulse">
//                             Processing... Please wait
//                           </p>
//                         )}



//                       </div>
//                       {/* Error & Success messages */}
//                       {errors?.otpSuccess && (
//                         <p className="text-green-500 text-sm">{errors.otpSuccess.message}</p>
//                       )}
//                       {errors?.otpStatus && (
//                         <p className="text-red-500 text-sm">{errors.otpStatus.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//         </form>
//       </div>
//     </>
//   );
// };

// export default LoadAgreement;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import {
  InputTag,
  SelectTag,
  ApplicantBasicDetails,
  sendOtpNew,
  verifyOtpNew,
  ApplicantFillDetails
} from "../importComponents.js";
import { responseOption, revertOption } from "../newComponents/commonOption.js";
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js'
import { setOfficerData } from "../../redux/slices/userSlice.js";
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
import { handleTokenExpiry } from '../../utils/handleTokenExpiry';


const LoadAgreement = () => {
  const officerData = useSelector((state) => state.user.officerData);

  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || {};
  const [mobileNo, setMobileNo] = useState('');
  const [timer, setTimer] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);

  const [contractorCategory, setContractorCategory] = useState([]);
  const [contractorList, setContractorList] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);

  // console.log(items, "items")
  // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE in Load Aggrement')
  const required = items?.survey?.is_estimate_required?.split(',') || [];

  const token = Cookies.get("accessToken");
  const dispatch = useDispatch()


  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [formDataValue, setFormDataValue] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);



  const transactionDateRaw = items?.bank_response?.transaction_date; // "2025-09-24T12:23:38+05:30"
  const transactionDate = transactionDateRaw
    ? new Date(transactionDateRaw).toISOString().split("T")[0] // "2025-09-24"
    : null;

  const todayDate = new Date().toISOString().split("T")[0]; // "2025-12-27"
  const isAgreementFinalizationStep = items?.application_status === 11;



  // Form
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });

  const agreement_response = watch("agreement_response");

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


  const handleSendOtp = async () => {
    if (isSendOtpLoading) return;

    if (!mobileNo || mobileNo.length !== 10) {
      setError("otpStatus", {
        type: "manual",
        message: "Mobile number not available. Please reload dashboard.",
      });
      return;
    }

    setIsSendOtpLoading(true);
    clearErrors();

    try {
      const res = await sendOtpNew(mobileNo);

      if (res.success) {
        setShowOtpBtn(true);
        setIsDisabled(true);
        setTimer(120);
        setIsOtpExpired(false);

        setError("otpSuccess", { type: "manual", message: res.message });
      } else {
        setError("otpStatus", { type: "manual", message: res.message });
      }
    } finally {
      setIsSendOtpLoading(false);
    }
  };


  // 🔹 Verify OTP
  // const handleVerifyOtp = async () => {
  //   const otpValue = getValues("otp");
  //   setBtnIsDisabled(true);
  //   const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);

  //   if (verifyOtpResponse.success) {
  //     handleFinalSubmit();
  //   } else {
  //     setError("otp", { type: "manual", message: verifyOtpResponse.error });
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
    setBtnIsDisabled(true);

    const res = await verifyOtpNew(mobileNo, otpValue);

    if (res.success) {
      setIsProcessing(true);
      setTimer(0);
      setShowOtpBtn(false);

      await handleFinalSubmit();
    } else {
      setError("otp", { type: "manual", message: res.error });
      setBtnIsDisabled(false);
    }
  };

  const handleReSendOtp = async () => {
    clearErrors();

    const res = await sendOtpNew(mobileNo);

    if (res.success) {
      setTimer(120);
      setIsOtpExpired(false);

      setError("otpSuccess", {
        type: "manual",
        message: `OTP resent to ****${mobileNo.slice(-4)}`,
      });
    } else {
      setError("otp", { type: "manual", message: res.message });
    }
  };


  // 🔹 Final Submit API Call
  const handleFinalSubmit = async () => {
    try {
      const formValue = getValues();   // ⭐ FIXED
      const formData = new FormData();

      Object.entries(formValue).forEach(([key, value]) => {
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
          return;
        }
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const { data } = await axios.post(
        `${HT_LOAD_CHANGE_BASE}/agreement-details/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Agreement And Work Order submitted successfully ✅");

      navigate(`/dashboard/respones/${data.data.application}`, {
        state: data.data,
      });

      const updatedFlags = await handleOfficerFlagCount();
      dispatch(setOfficerData(updatedFlags));
    } catch (error) {
      if (handleTokenExpiry(error, navigate)) return;

      console.error(error);
      alert("Something went wrong ❌");
    } finally {
      setBtnIsDisabled(false);
    }
  };

  useEffect(() => {
    const fetchContractorCategory = async () => {
      try {
        const res = await axios.get(
          "https://qcportal.mpcz.in/tkc/get_tkc_category"
        );

        if (res.data.status) {
          setContractorCategory(res.data.data);
        }
      } catch (err) {
        console.error("Category API Error", err);
      }
    };

    fetchContractorCategory();
  }, []);

  // const handleCategoryChange = async (e) => {
  //   const oyt = e.target.value;

  //   try {
  //     const res = await axios.get(
  //       `https://qcportal.mpcz.in/tkc/get_tkc_by_oyt/${oyt}`
  //     );

  //     if (res.data.status) {
  //       setContractorList(res.data.contractor_details);
  //     }
  //   } catch (err) {
  //     console.error("Contractor list error", err);
  //   }
  // };
  const handleCategoryChange = async (e) => {

  const category = e.target.value;

  const selected = contractorCategory.find(
    (cat) => cat.Category === category
  );

  const oyt = selected?.Original_Oyt;

  try {

    const res = await axios.get(
      `https://qcportal.mpcz.in/tkc/get_tkc_by_oyt/${oyt}`
    );

    if (res.data.status) {
      setContractorList(res.data.contractor_details);
    }

  } catch (err) {
    console.error("Contractor list error", err);
  }

};

  // const handleContractorChange = async (e) => {
  //   const userId = e.target.value;

  //   const contractor = contractorList.find(
  //     (c) => c.user_id_id.User_Id == userId
  //   );

  //   if (contractor) {
  //     setSelectedContractor(contractor);

  //     setValue("contractor_mobile", contractor.user_id_id.ContactNo);
  //     setValue("contractor_company", contractor.CompanyName_E);
  //     setValue("authentication_id", contractor.user_id_id.Authentication_id);

  //     const regRes = await axios.get(
  //       `https://qcportal.mpcz.in/tkc/get_reg_date/${userId}`
  //     );

  //     if (regRes.data.status) {
  //       setValue("registration_date", regRes.data.data.reg_date);
  //     }
  //   }
  // };
   const handleContractorChange = async (e) => {

  const contractorName = e.target.value;

  const contractor = contractorList.find(
    (c) => c.user_id_id.Authorised_person_E === contractorName
  );

  if (contractor) {

    setSelectedContractor(contractor);

    setValue("contractor_mobile", contractor.user_id_id.ContactNo);
    setValue("contractor_company", contractor.CompanyName_E);
    setValue("authentication_id", contractor.user_id_id.Authentication_id);

    const regRes = await axios.get(
      `https://qcportal.mpcz.in/tkc/get_reg_date/${contractor.user_id_id.User_Id}`
    );

    if (regRes.data.status) {
      setValue("registration_date", regRes.data.data.reg_date);
    }
  }
};

  const getVoltageValue = (voltage) => {
    if (!voltage) return 0;
    return parseInt(voltage.replace(" KV", ""));
  };

  const newVoltage = getVoltageValue(items?.new_supply_voltage);

  const filteredCategory = contractorCategory.filter((cat) => {

    const voltage = getVoltageValue(items?.new_supply_voltage);

    if (voltage === 33) {
      return ["A4", "A5"].includes(cat.Category);
    }

    if (voltage === 11) {
      return true;
    }

    return true;
  });

  return (
    <>

      <div>
        <form onSubmit={handleSubmit(handleSendOtp)}>

          <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
            <div className="card-header px-4 py-2 border-b border-gray-300">
              <h2 className="text-lg font-bold capitalize ">
                HT Load Change Agreement Finalization
              </h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                <div className="">
                  <ApplicantBasicDetails
                    htConsumers={items}
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
          </div>

          {officerData?.employee_detail.role == 3 && (
            <>
              <input
                type="hidden"
                value={items?.id}
                {...register("application")}
              />


              <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                <div className="card-header px-4 py-2 border-b border-gray-300">
                  <h2 className="text-lg font-bold capitalize ">

                  </h2>
                </div>
                <div className="card-body px-4 pb-4">
                  <div className="">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">

                      {/* <SelectTag
                        LName="Acceptance"
                        options={responseOption}
                        {...register("agreement_response", {
                          required: "Please Select Acceptance",
                        })}
                        errorMsg={errors.agreement_response?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      /> */}
                      <SelectTag
                        LName="Acceptance"
                        options={
                          isAgreementFinalizationStep
                            ? responseOption.filter(opt => opt.value !== "Reverted")
                            : responseOption
                        }
                        {...register("agreement_response", {
                          required: "Please Select Acceptance",
                        })}
                        errorMsg={errors.agreement_response?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      />


                      {/* Accepted Case */}
                      {agreement_response === "Accepted" && (
                        <>
                          <InputTag
                            LName="Agreement No."
                            placeholder="Enter Agreement No."
                            {...register("agreement_no", {
                              required: "Agreement No is required",
                            })}
                            errorMsg={errors.agreement_no?.message}
                            disabled={isDisabled}
                          />

                          {/* <InputTag
                            LName="Agreement Date"
                            type="date"
                            {...register("agreement_effective_date", {

                              required: "Effective Date is required",
                            })}
                            errorMsg={errors.agreement_effective_date?.message}
                            disabled={isDisabled}
                          /> */}
                          <InputTag
                            LName="Agreement Date"
                            type="date"
                            {...register("agreement_effective_date", {
                              required: "Effective Date is required",
                            })}
                            min={transactionDate} // transaction date se pehle wali dates disable
                            max={todayDate}       // aaj ke baad ki dates disable
                            errorMsg={errors.agreement_effective_date?.message}
                            disabled={isDisabled}
                          />



                          <InputTag
                            LName="Final Agreement pdf"
                            type="file"
                            acceptPdfOnly={true}
                            {...register("agreement_doc", {
                              required: "Agreement Letter is required",
                            })}
                            errorMsg={errors.agreement_doc?.message}
                            disabled={isDisabled}
                          />

                          {required.includes('is_me_meter_required') && (
                            <>
                              <InputTag
                                LName="ME Meter Work Order No."
                                placeholder="Enter ME Meter Work Order No."
                                {...register("me_meter_work_order_no", {
                                  required: "ME Meter Work Order No is required",
                                })}
                                errorMsg={errors.me_meter_work_order_no?.message}
                                disabled={isDisabled}
                              />
                              {/* <InputTag
                              LName="ME Meter Work Order Date"
                              type="date"
                              {...register("me_meter_work_order_date", {
                                required: "ME Meter Work Order Date is required",
                              })}
                              errorMsg={errors.me_meter_work_order_date?.message}
                              disabled={isDisabled}
                            /> */}
                              <InputTag
                                LName="ME Meter Work Order Date"
                                type="date"
                                {...register("me_meter_work_order_date", {
                                  required: "ME Meter Work Order Date is required",
                                })}
                                min={transactionDate}   // ❌ payment se pehle ki date disable
                                max={todayDate}         // ❌ future date disable
                                errorMsg={errors.me_meter_work_order_date?.message}
                                disabled={isDisabled}
                              />

                              <InputTag
                                LName="ME Meter Work Order Letter"
                                type="file"
                                acceptPdfOnly={true}
                                {...register("me_meter_work_order_docs", {
                                  required: "ME Meter Work Order Letter is required",
                                })}
                                errorMsg={errors.me_meter_work_order_docs?.message}
                                disabled={isDisabled}
                              />
                            </>
                          )}

                          {items?.survey?.scheme_name === "SCCW" &&
                            required?.includes("is_extension_work_required") &&
                            items?.lc_type === "Load_Enhancement_with_Voltage_Change" &&
                            newVoltage < 132 && (

                              <>
                                <h3 className="col-span-8 font-bold text-lg border-b pb-2">
                                  Work Execution
                                </h3>

                                <h4 className="col-span-8 font-bold text-lg text-red-500">Select contractor details as requested by the H.T. Consumer.</h4>

                                {/* <SelectTag
                                  LName="Contractor Category"
                                  options={filteredCategory}
                                  {...register("contractor_category", {
                                    required: "Contractor Category is required",
                                  })}
                                  errorMsg={errors.contractor_category?.message}
                                  labelKey="Category"
                                  valueKey="Original_Oyt"
                                  onChange={handleCategoryChange}
                                /> */}
                                <SelectTag
                                  LName="Contractor Category"
                                  options={filteredCategory}
                                  {...register("contractor_category", {
                                    required: "Contractor Category is required",
                                  })}
                                  errorMsg={errors.contractor_category?.message}
                                  labelKey="Category"
                                  valueKey="Category"
                                  onChange={handleCategoryChange}
                                />

                                <SelectTag
                                  LName="Contractor Name"
                                  // options={contractorList.map((con) => ({
                                  //   label: con.user_id_id.Authorised_person_E,
                                  //   value: con.user_id_id.User_Id
                                  // }))}
                                  options={contractorList.map((con) => ({
                                    label: con.user_id_id.Authorised_person_E,
                                    value: con.user_id_id.Authorised_person_E
                                  }))}
                                  {...register("contractor_name", {
                                    required: "Contractor Name is required",
                                  })}
                                  errorMsg={errors.contractor_name?.message}
                                  labelKey="label"
                                  valueKey="value"
                                  onChange={handleContractorChange}
                                />

                                <InputTag
                                  LName="Contractor Company Name"
                                  {...register("contractor_company")}
                                  disabled
                                />

                                <InputTag
                                  LName="Contractor Mobile No"
                                  {...register("contractor_mobile")}
                                  disabled
                                />

                                <InputTag
                                  LName="Authentication Id"
                                  {...register("authentication_id")}
                                  disabled
                                />

                                <InputTag
                                  LName="Registration Date"
                                  type="date"
                                  {...register("registration_date")}
                                  disabled
                                />

                              </>
                            )}

                          {required?.includes('is_extension_work_required') && (
                            <>
                              <InputTag
                                LName="Extension Work Order No."
                                placeholder="Enter Extension Work Order No."
                                {...register("ex_work_order_no", {
                                  required: " Extension Work Order No is required",
                                })}
                                errorMsg={errors.ex_work_order_no?.message}
                                disabled={isDisabled}
                              />
                              <InputTag
                                LName=" Extension Work Order Date"
                                type="date"
                                {...register("ex_work_order_date", {
                                  required: " Extension Work Order Date is required",
                                })}
                                errorMsg={errors.ex_work_order_date?.message}
                                disabled={isDisabled}
                              />
                              <InputTag
                                LName="Extension Work Order Letter"
                                type="file"
                                acceptPdfOnly={true}
                                {...register("ex_work_order_docs", {
                                  required: " Extension Work Order Letter is required",
                                })}
                                errorMsg={errors.ex_work_order_docs?.message}
                                disabled={isDisabled}
                              />

                            </>
                          )}

                          {(items?.load_sanction?.is_required === "is_agreement_required" || items?.survey?.is_required === "is_agreement_required") && items?.type_of_change === "Load_Enhancement" && (
                            <InputTag
                              LName="Upload Commissioning Permission letter"
                              type="file"
                              acceptPdfOnly={true}
                              {...register("commissioning_permission_doc", {
                                required: "Commissioning Permission letter is required",
                              })}
                              errorMsg={errors.commissioning_permission_docs?.message}
                              disabled={isDisabled}
                            />
                          )}

                        </>
                      )}

                      {/* Reverted Case */}
                      {agreement_response === "Reverted" && (
                        <>
                          <SelectTag
                            LName="Revert Reason"
                            options={revertOption}
                            {...register("revert_reason", {
                              required: "Revert Reason is required",
                            })}
                            errorMsg={errors.revert_reason?.message}
                            labelKey="label"
                            valueKey="value"
                            disabled={isDisabled}
                          />
                          <InputTag
                            LName="Revert Reason Remark"
                            placeholder="Enter Remark"
                            {...register("revert_reason_remark", {
                              required: "Remark is required",
                            })}
                            errorMsg={errors.revert_reason_remark?.message}
                            disabled={isDisabled}
                          />
                          <InputTag
                            LName="Upload Revert Docs"
                            type="file"
                            acceptPdfOnly={true}
                            {...register("upload_revert_docs", {
                              required: "Revert Docs are required",
                            })}
                            errorMsg={errors.upload_revert_docs?.message}
                            disabled={isDisabled}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="border-b border-gray-900/10 pb-12 shadow-md p-4">
                    <div className="mt-10 flex flex-col justify-center items-center">
                      <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                        {!showOtpBtn ? (
                          <>
                            <button type="reset" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                              Reset
                            </button>

                            {/* <button
                              type="submit"
                              disabled={isSendOtpLoading}
                              className={`px-4 py-2 rounded text-white ${isSendOtpLoading || isBtnDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-purple-800"
                                }`}
                            >
                              {isSendOtpLoading
                                ? "Please wait..."
                                : agreement_response === "Reverted"
                                  ? "Revert For Demand note"
                                  : agreement_response === "Accepted" && required?.includes("is_me_meter_required")
                                    ? "Send for Meter Issue"
                                    : agreement_response === "Accepted" &&
                                      (items?.load_sanction?.is_required === "is_agreement_required" ||
                                        items?.survey?.is_required === "is_agreement_required") &&
                                      items?.type_of_change === "Load_Enhancement"
                                      ? "Send for BiCall"
                                      : agreement_response === "Accepted" &&
                                        (items?.load_sanction?.is_required === "is_agreement_required" ||
                                          items?.survey?.is_required === "is_agreement_required") &&
                                        items?.type_of_change === "Load_Reduction"
                                        ? "Send for Completion certifying"
                                        : "Send for Completion Certifying"}
                            </button> */}
                            <button
                              type="submit"
                              disabled={isSendOtpLoading}
                              className={`px-4 py-2 rounded text-white ${isSendOtpLoading || isBtnDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-purple-800"
                                }`}
                            >
                              {isSendOtpLoading
                                ? "Please wait..."
                                : agreement_response === "Reverted"
                                  ? "Revert For Demand note"

                                  // ⭐ Extension Work Required
                                  : agreement_response === "Accepted" &&
                                    required?.includes("is_extension_work_required")
                                    ? "Send for Upload & Charging Permission"

                                    // ⭐ Only ME Meter Required
                                    : agreement_response === "Accepted" &&
                                      required?.includes("is_me_meter_required") &&
                                      !required?.includes("is_extension_work_required")
                                      ? "Send for Issue Meter"

                                      : agreement_response === "Accepted" &&
                                        (items?.load_sanction?.is_required === "is_agreement_required" ||
                                          items?.survey?.is_required === "is_agreement_required") &&
                                        items?.type_of_change === "Load_Enhancement"
                                        ? "Send for BiCall"

                                        : agreement_response === "Accepted" &&
                                          (items?.load_sanction?.is_required === "is_agreement_required" ||
                                            items?.survey?.is_required === "is_agreement_required") &&
                                          items?.type_of_change === "Load_Reduction"
                                          ? "Send for Completion certifying"

                                          : "Send for Completion Certifying"}
                            </button>
                          </>
                        ) : showOtpBtn && !isProcessing ? (
                          <>
                            <InputTag
                              placeholder="Enter OTP"
                              {...register("otp", { required: "Otp is required" })}
                              errorMsg={errors.otp?.message}
                            />

                            <p className="text-red-600 font-semibold text-sm mt-1">
                              {timer > 0
                                ? `OTP expires in ${formatTime(timer)}`
                                : "OTP expired. Please resend OTP."}
                            </p>

                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isBtnDisabled || isOtpExpired}
                              className={`px-4 py-2 rounded text-white ${isBtnDisabled || isOtpExpired
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-purple-800"
                                }`}
                            >
                              {isBtnDisabled ? "Verifying..." : "Verify OTP"}
                            </button>

                            <button
                              type="button"
                              onClick={handleReSendOtp}
                              className="px-4 py-2 bg-emerald-600 text-white rounded"
                            >
                              Resend OTP
                            </button>
                          </>
                        ) : (
                          <p className="text-blue-700 font-semibold mt-2 animate-pulse">
                            Processing... Please wait
                          </p>
                        )}



                      </div>
                      {/* Error & Success messages */}
                      {errors?.otpSuccess && (
                        <p className="text-green-500 text-sm">{errors.otpSuccess.message}</p>
                      )}
                      {errors?.otpStatus && (
                        <p className="text-red-500 text-sm">{errors.otpStatus.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </form>
      </div>
    </>
  );
};

export default LoadAgreement;

