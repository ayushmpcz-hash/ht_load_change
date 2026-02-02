// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import Cookies from 'js-cookie';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';

// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import {
//   InputTag,
//   SelectTag,
//   RadioTag,
//   fetchCtPtData,
//   ApplicantBasicDetails,
//   ApplicantFillDetails,
//   AlertModalBox,
//   sendOtpNew,
//   verifyOtpNew,
// } from '../importComponents.js';
// import { responseOption, revertOption } from '../newComponents/commonOption.js';
// import { use } from 'react';
// const LoadSanction = () => {
//   const officerData = useSelector(state => state.user.officerData);
//   const [mobileNo, setMobileNo] = useState(officerData?.employee_detail.cug_mobile);
//   const [showOtpBtn, setShowOtpBtn] = useState(false);
//   const [fromDataValue, setFromDataValue] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { items } = location.state || {};
//   const [ctRatio, setCtRatio] = useState([]);
//   const [ctSelectRatio, setSelectCtRatio] = useState('');
//   const [radioOptions, setRadioOptions] = useState([]);
//   const [ptRatio, setPtRatio] = useState([]);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [isBtnDisabled, setBtnIsDisabled] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     getValues,
//     setError,
//     clearErrors,
//     resetField,
//     formState: { errors },
//   } = useForm({
//     defaultValues: items || {},
//     shouldUnregister: true,
//   });
//   const token = Cookies.get('accessToken');
//   console.log(items,'itemssss in gm')

//   const load_sanction_response = watch('load_sanction_response');
//   const is_required = watch('is_required');
//   const new_ct_ratio = watch('new_ct_ratio');

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [modalAction, setModalAction] = useState(() => () => { });
//   const showModal = (message, action = () => { }) => {
//     setModalMessage(message);
//     setModalAction(() => action); // save callback
//     setModalOpen(true);
//   };

//   useEffect(() => {
//   // when CT or PT ratio changes, reset is_required and any dependent file field
//   resetField('is_required'); // clear radio selection
//   resetField('draft_agreement_pdf'); // clear draft upload if any
//   // optionally clear errors
// }, [new_ct_ratio, resetField]);

//   useEffect(() => {
//     let cleaned = items.me_ct_ratio.slice(1);
//     //  console.log(new_ct_ratio,"new_ct_ratio")
//     //  console.log(cleaned,"ctSelectRatio")
//     if (new_ct_ratio !== cleaned.trim()) {
//       setRadioOptions([{ label: 'Survey is Required', value: 'is_survey_required' }]);
//     } else {
//       setRadioOptions([
//         // { label: 'Survey is Required', value: 'is_survey_required' },
//         { label: 'Agreement is Required', value: 'is_agreement_required' },
//       ]);
//     }
//   }, [new_ct_ratio]);


//   useEffect(() => {
//     const fetchData = async () => {
//       const ratioData = await fetchCtPtData(items);
//       setCtRatio(ratioData.ct_result.data);
//       setPtRatio(ratioData.pt_result.data);
//       // setSelectCtRatio(ratioData.matched);
//       // setValue('new_ct_ratio', ratioData.matched);
//       // setValue('new_pt_ratio', ratioData.pt_result.data[0].pt_ratio);
//     };
//     if (items?.new_supply_voltage) {
//       fetchData();
//     }
//   }, [items?.new_supply_voltage]);

//   const handleSendOtp = async formData => {
//     setFromDataValue(formData);

//     const sentOtp = await sendOtpNew(mobileNo);
//     if (sentOtp.success) {
//       setShowOtpBtn(true);
//       setIsDisabled(true);
//       setError('otpSuccess', {
//         type: 'manual',
//         message: sentOtp.message,
//       });
//     } else {
//       setError('otpStatus', {
//         type: 'manual',
//         message: sentOtp.message,
//       });
//     }
//   };
//   const handleVerifyOtp = async () => {
//     const otpValue = getValues('otp');
//     setBtnIsDisabled(true);
//     const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);

//     if (verifyOtpResponse.success) {
//       handleFinalSubmit();
//     } else {
//       setError('otp', {
//         type: 'manual',
//         message: verifyOtpResponse.error,
//       });
//       setBtnIsDisabled(false);
//     }
//   };
//   const handleReSendOtp = async () => {
//     clearErrors('otpSuccess');
//     const sentOtp = await sendOtpNew(mobileNo);
//     setShowOtpBtn(true);
//     if (sentOtp) {
//       setError('otpSuccess', {
//         type: 'manual',
//         message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
//       });
//     } else {
//       setError('otp', {
//         type: 'manual',
//         message: `Failed to send OTP on ****${mobileNo.slice(-4)}`,
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
//       const { data } = await axios.post(`${HT_LOAD_CHANGE_BASE}/api/load-sanctions/`, formData, {
//         headers: {
//           // 'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const { data: apiData, ...rest } = data;

//       navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
//     } catch (error) {
//       console.error('API Error:', error);
//       alert('Something went wrong ❌');
//     } finally {
//       setBtnIsDisabled(false);
//     }
//   };

//   //  const onSubmit = async (data) => {
//   //        const formData = new FormData();

//   //     Object.keys(data).forEach((key) => {
//   //       if (data[key] instanceof FileList) {
//   //         if (data[key].length > 0) {
//   //           formData.append(key, data[key][0]);
//   //         }
//   //       } else {
//   //         formData.append(key, data[key]);
//   //       }
//   //     });
//   //     try {
//   //       const response = await axios.post(`/ht_load_change/api/load-sanctions/`,formData);
//   //        showModal(
//   //           '✅ scsessfullye submit .'
//   //         );

//   //    navigate("/dashboard/success_respones", { state: { response: response.data } });
//   //     } catch (err) {
//   //       handleFormErrors(err);
//   //     }

//   //   };

//   // const handleFormErrors = err => {
//   //   const newErrors = {};
//   //   if (err.inner && Array.isArray(err.inner)) {
//   //     err.inner.forEach(error => {
//   //       newErrors[error.path] = error.message;
//   //     });
//   //   } else if (err.path && err.message) {
//   //     newErrors[err.path] = err.message;
//   //   } else {
//   //     newErrors.general = 'Something went wrong. Please try again.';
//   //   }
//   //   setError(newErrors);
//   //   // setIsDisabled(false);
//   // };
//   return (
//     <>
//       <div>
//         <form onSubmit={handleSubmit(handleSendOtp)}>
//           <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//             <div className="card-header px-4 py-2 border-b border-gray-300">
//               <h2 className="text-lg font-bold capitalize ">
//                 HT Load Change load Sanction
//               </h2>
//             </div>
//             <div className="card-body px-4 pb-4">
//               <div className="mt-6 overflow-x-auto">
//                 <div className="">
//                   <AlertModalBox
//                     open={modalOpen}
//                     onClose={() => setModalOpen(false)}
//                     message={modalMessage}
//                     onConfirm={modalAction}
//                   />
//                   <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//             <div className="card-header px-4 py-2 border-b border-gray-300">
//               <h2 className="text-lg font-bold capitalize ">Required ME Details..</h2>
//             </div>
//             <div className="card-body px-4 pb-4">
//               {/* <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"> */}
//               {/* <InputTag Iname="sanction_letter_date"placeholder="Please Enter Sanction Letter Date" {...register("sanction_letter_date", { required: "Sanction Letter Date is required" })} /> */}
//               {/* </div> */}
//               <div className="">
//                 <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                   <input
//                     type="hidden"
//                     name="application"
//                     {...register('application')}
//                     value={items?.id}
//                   ></input>
//                   <input
//                     type="hidden"
//                     name="employee_id"
//                     {...register('employee_id')}
//                     value={officerData?.employee_detail.employee_login_id}
//                   ></input>
//                   <SelectTag
//                     LName="Load Acceptance"
//                     options={responseOption}
//                     {...register('load_sanction_response', {
//                       required: 'Please Select Load Acceptance is required',
//                     })}
//                     errorMsg={errors.load_sanction_response?.message}
//                     labelKey="label"
//                     valueKey="value"
//                     disabled={isDisabled}
//                   />
//                   {load_sanction_response === 'Accepted' && (
//                     <>
//                       <SelectTag
//                         LName="Required ME CT Ratio"
//                         options={ctRatio}
//                         {...register('new_ct_ratio', {
//                           required: 'Please  select Ct Ratio is required',
//                         })}
//                         errorMsg={errors.new_ct_ratio?.message}
//                         labelKey="ct_ratio_me"
//                         valueKey="ct_ratio_me"
//                         disabled={isDisabled}
//                       />
//                       <SelectTag
//                         LName="Required ME PT Ratio"
//                         options={ptRatio}
//                         {...register('new_pt_ratio', {
//                           required: 'Please  select Pt Ratio is required',
//                         })}
//                         errorMsg={errors.new_pt_ratio?.message}
//                         labelKey="pt_ratio"
//                         valueKey="pt_ratio"
//                         disabled={isDisabled}
//                       />

//                       <InputTag
//                         LName="Accept Remark"
//                         placeholder="Please Enter Accept Remark"
//                         {...register('accept_remark', {
//                           required: 'Accept Remark is required',
//                         })}
//                         errorMsg={errors.accept_remark?.message}
//                         disabled={isDisabled}
//                       />
//                       <RadioTag
//                         options={radioOptions}
//                         {...register('is_required', { required: 'option is required' })}
//                         errorMsg={errors.is_required?.message}
//                         disabled={isDisabled}
//                       />
//                       {is_required === 'is_agreement_required' && (
//                         <InputTag
//                           LName="Draft Agreement Letter"
//                           type="file"
//                           {...register('draft_agreement_pdf', {
//                             required: 'Upload Agreement Letter is required',
//                           })}
//                           errorMsg={errors.draft_agreement_pdf?.message}
//                           disabled={isDisabled}
//                         />
//                       )}
//                     </>
//                   )}
//                   {load_sanction_response === 'Reverted' && (
//                     <>
//                       <SelectTag
//                         options={revertOption}
//                         LName="Revert Reason"
//                         {...register('revert_reason', {
//                           required: 'Please Select Revert Reason is required',
//                         })}
//                         errorMsg={errors.revert_reason?.message}
//                         labelKey="label"
//                         valueKey="value"
//                         disabled={isDisabled}
//                       />
//                       <InputTag
//                         LName="Revert Reason Remark"
//                         placeholder="Please Enter Revert Reason Remark"
//                         {...register('revert_reason_remark', {
//                           required: 'Revert Reason Remark is required',
//                         })}
//                         errorMsg={errors.revert_reason_remark?.message}
//                         disabled={isDisabled}
//                       />
//                       <InputTag
//                         LName="Upload Revert Docs"
//                         type="file"
//                         {...register('upload_revert_docs', {
//                           required: 'Upload Upload Revert Docs is required',
//                         })}
//                         errorMsg={errors.upload_revert_docs?.message}
//                       />
//                     </>
//                   )}
//                 </div>
//               </div>
//               <div className="border-b border-gray-900/10 pb-12 ">
//                 <div className="mt-10 flex flex-col justify-center items-center">
//                   <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
//                     {!showOtpBtn && (
//                       <>
//                         <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-red-600 duration-300">
//                           Reset
//                         </button>
//                         {load_sanction_response === 'Reverted' ? (
//                           <button
//                             type="submit"
//                             className="rounded-lg px-4 py-2 bg-red-700 text-green-100 hover:bg-green-800 duration-300"
//                           >
//                             Revert
//                           </button>
//                         ) : is_required === 'is_agreement_required' ? (
//                           <button
//                             type="submit"
//                             className={`  text-white px-4 py-2 mt-4 rounded 
//                       ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-purple-800 text-white'}`}
//                             disabled={isDisabled}
//                           >
//                             {isDisabled ? 'Please wait...' : 'Send for Agreement'}
//                           </button>
//                         ) : (
//                           <button
//                             type="submit"
//                             className={` text-white px-4 py-2 mt-4 rounded
//                      ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-purple-800 text-white'}`}
//                             disabled={isDisabled}
//                           >
//                             {isDisabled ? 'Please wait...' : ' Send for Survey'}
//                           </button>
//                         )}
//                       </>
//                     )}
//                     {showOtpBtn && (
//                       <>
//                         <InputTag
//                           LName=""
//                           placeholder="Please Enter Otp."
//                           {...register('otp', {
//                             required: 'Otp is required',
//                           })}
//                           errorMsg={errors.otp?.message}
//                         />
//                         <button
//                           type="button"
//                           onClick={handleVerifyOtp}
//                           className={`bg-green-600 text-white px-4 py-2 mt-4 rounded"
//                                                 ${isBtnDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-purple-800 text-white'}`}
//                           disabled={isBtnDisabled}
//                         >
//                           {isBtnDisabled ? 'Please wait...' : ' Verify Otp'}
//                         </button>

//                         <button
//                           type="button"
//                           onClick={handleReSendOtp}
//                           className="bg-emerald-600 text-white px-4 py-2 mt-4 rounded"
//                         >
//                           Resend Otp
//                         </button>

//                         {/* {errors.otpSuccess && (
//                                                   <p className="text-green-500 text-sm mt-1">{errors.otpSuccess.message}</p>
//                                                 )} */}
//                         {/* {errors.otp && (
//                                                   <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
//                                                 )} */}
//                       </>
//                     )}
//                   </div>
//                   {errors?.otpSuccess && (
//                     <p className="text-green-500 text-sm mt-1">{errors?.otpSuccess?.message}</p>
//                   )}
//                   {errors?.otpStatus && (
//                     <p className="text-red-500 text-sm mt-1">{errors?.otpStatus?.message}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };
// export default LoadSanction;

import React, { useState, useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
import { setOfficerData } from "../../redux/slices/userSlice.js";

import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  InputTag,
  SelectTag,
  RadioTag,
  fetchCtPtData,
  ApplicantBasicDetails,
  ApplicantFillDetails,
  AlertModalBox,
  sendOtpNew,
  verifyOtpNew,
} from '../importComponents.js';
import { responseOption, revertOption } from '../newComponents/commonOption.js';
import { use } from 'react';
const LoadSanction = () => {
  const officerData = useSelector(state => state.user.officerData);
  const [mobileNo, setMobileNo] = useState('');
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [fromDataValue, setFromDataValue] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || {};
  const [ctRatio, setCtRatio] = useState([]);
  const [ctSelectRatio, setSelectCtRatio] = useState('');
  const [radioOptions, setRadioOptions] = useState([]);
  const [ptRatio, setPtRatio] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);

  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
    shouldUnregister: true,
  });
  const token = Cookies.get('accessToken');
  // console.log(items, 'itemssss in gm')
  // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE inside load sanction')

  const load_sanction_response = watch('load_sanction_response');
  const is_required = watch('is_required');
  const new_ct_ratio = watch('new_ct_ratio');

  const HIGH_VOLT = items?.new_supply_voltage === "132 KV" || items?.new_supply_voltage === "132 KV"

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => () => { });

  useEffect(() => {
  if (officerData?.employee_detail?.cug_mobile) {
    setMobileNo(officerData.employee_detail.cug_mobile);
  }
}, [officerData]);

  const showModal = (message, action = () => { }) => {
    setModalMessage(message);
    setModalAction(() => action); // save callback
    setModalOpen(true);
  };

  useEffect(() => {
    // when CT or PT ratio changes, reset is_required and any dependent file field
    resetField('is_required'); // clear radio selection
    resetField('draft_agreement_pdf'); // clear draft upload if any
    // optionally clear errors
  }, [new_ct_ratio, resetField]);

  useEffect(() => {
    if (HIGH_VOLT && !items?.transco_approval ) {
      setRadioOptions([
        { label: 'EDCRA Required', value: 'is_EDCRA_required' }
      ])
      return
    }
    let cleaned = items.me_ct_ratio.slice(1);
    //  console.log(new_ct_ratio,"new_ct_ratio")
    //  console.log(cleaned,"ctSelectRatio")
    if (new_ct_ratio !== cleaned.trim()) {
      setRadioOptions([{ label: 'Survey/Estimate is Required', value: 'is_survey_required' }]);
    } else {
      setRadioOptions([
        // { label: 'Survey is Required', value: 'is_survey_required' },
        { label: 'Agreement is Required', value: 'is_agreement_required' },
      ]);
    }
  }, [new_ct_ratio,is_required]);


  useEffect(() => {
    if (HIGH_VOLT && !items?.transco_approval ) return
    const fetchData = async () => {
      const ratioData = await fetchCtPtData(items);
      setCtRatio(ratioData.ct_result.data);
      setPtRatio(ratioData.pt_result.data);
      // setSelectCtRatio(ratioData.matched);
      // setValue('new_ct_ratio', ratioData.matched);
      // setValue('new_pt_ratio', ratioData.pt_result.data[0].pt_ratio);
    };
    if (items?.new_supply_voltage) {
      fetchData();
    }
  }, [items?.new_supply_voltage]);

  const handleSendOtp = async formData => {
    setFromDataValue(formData);
    console.log(mobileNo,'mobile numberrrrrr')
    const sentOtp = await sendOtpNew(mobileNo);
    if (sentOtp.success) {
      setShowOtpBtn(true);
      setIsDisabled(true);
      setError('otpSuccess', {
        type: 'manual',
        message: sentOtp.message,
      });
    } else {
      setError('otpStatus', {
        type: 'manual',
        message: sentOtp.message,
      });
    }
  };
  const handleVerifyOtp = async () => {
    const otpValue = getValues('otp');
    setBtnIsDisabled(true);
    const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);

    if (verifyOtpResponse.success) {
      handleFinalSubmit();
    } else {
      setError('otp', {
        type: 'manual',
        message: verifyOtpResponse.error,
      });
      setBtnIsDisabled(false);
    }
  };
  const handleReSendOtp = async () => {
    clearErrors('otpSuccess');
    const sentOtp = await sendOtpNew(mobileNo);
    setShowOtpBtn(true);
    if (sentOtp) {
      setError('otpSuccess', {
        type: 'manual',
        message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
      });
    } else {
      setError('otp', {
        type: 'manual',
        message: `Failed to send OTP on ****${mobileNo.slice(-4)}`,
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
      console.log(formData, 'formData')
      const { data } = await axios.post(`${HT_LOAD_CHANGE_BASE}/api/load-sanctions/`, formData, {
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const { data: apiData, ...rest } = data;

      navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
      const updatedFlags = await handleOfficerFlagCount();
      dispatch(setOfficerData(updatedFlags));
      
    } catch (error) {
      console.error('API Error:', error);
      alert('Something went wrong ❌');
    } finally {
      setBtnIsDisabled(false);
    }
  };


  return (
    <>
      <div>
        <form onSubmit={handleSubmit(handleSendOtp)}>
          <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
            <div className="card-header px-4 py-2 border-b border-gray-300">
              <h2 className="text-lg font-bold capitalize ">
                HT Load Change load Sanction
              </h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                <div className="">
                  <AlertModalBox
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    message={modalMessage}
                    onConfirm={modalAction}
                  />
                  <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
                </div>
              </div>
            </div>
          </div>

          <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
            <div className="card-header px-4 py-2 border-b border-gray-300">
              <h2 className="text-lg font-bold capitalize ">{HIGH_VOLT && !items?.transco_approval  ? "Forward to CGM Region for Approval" : "Required ME Details.."}</h2>
            </div>
            <div className="card-body px-4 pb-4">
              {/* <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"> */}
              {/* <InputTag Iname="sanction_letter_date"placeholder="Please Enter Sanction Letter Date" {...register("sanction_letter_date", { required: "Sanction Letter Date is required" })} /> */}
              {/* </div> */}
              <div className="">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                  <input
                    type="hidden"
                    name="application"
                    {...register('application')}
                    value={items?.id}
                  ></input>
                  <input
                    type="hidden"
                    name="employee_id"
                    {...register('employee_id')}
                    value={officerData?.employee_detail.employee_login_id}
                  ></input>
                  <SelectTag
                    LName={HIGH_VOLT && !items?.transco_approval  ? "Forward to CGM Region for Approval" : "Load Acceptance"}
                    options={responseOption}
                    {...register('load_sanction_response', {
                      required: 'Please Select Load Acceptance is required',
                    })}
                    errorMsg={errors.load_sanction_response?.message}
                    labelKey="label"
                    valueKey="value"
                    disabled={isDisabled}
                  />
                  {
                    load_sanction_response === 'Accepted' && (
                      <>
                        {/* HIGH VOLTAGE CASE (>33kV) */}
                        {HIGH_VOLT && !items?.transco_approval  ? (
                          <>
                            {/* Only one radio button */}

                            <RadioTag
                              options={[{ label: "EDCRA Required", value: "is_EDCRA_required" }]}
                              {...register("is_required", { required: "Option is required" })}
                              errorMsg={errors.is_required?.message}
                              disabled={isDisabled}
                            />
                          </>
                        ) : (
                          <>
                            {/* NORMAL FLOW (<=33kV) – same as your existing flow */}

                            <SelectTag
                              LName="Required ME CT Ratio"
                              options={ctRatio}
                              {...register("new_ct_ratio", {
                                required: "Please select Ct Ratio is required",
                              })}
                              errorMsg={errors.new_ct_ratio?.message}
                              labelKey="ct_ratio_me"
                              valueKey="ct_ratio_me"
                              disabled={isDisabled}
                            />

                            <SelectTag
                              LName="Required ME PT Ratio"
                              options={ptRatio}
                              {...register("new_pt_ratio", {
                                required: "Please select Pt Ratio is required",
                              })}
                              errorMsg={errors.new_pt_ratio?.message}
                              labelKey="pt_ratio"
                              valueKey="pt_ratio"
                              disabled={isDisabled}
                            />

                            <InputTag
                              LName="Accept Remark"
                              placeholder="Please Enter Accept Remark"
                              {...register("accept_remark", {
                                required: "Accept Remark is required",
                              })}
                              errorMsg={errors.accept_remark?.message}
                              disabled={isDisabled}
                            />

                            <RadioTag
                              options={radioOptions}
                              {...register("is_required", { required: "Option is required" })}
                              errorMsg={errors.is_required?.message}
                              disabled={isDisabled}
                            />

                            {is_required === "is_agreement_required" && (
                              <InputTag
                                LName="Draft Agreement Letter"
                                type="file"
                                {...register("draft_agreement_pdf", {
                                  required: "Upload Agreement Letter is required",
                                })}
                                errorMsg={errors.draft_agreement_pdf?.message}
                                disabled={isDisabled}
                              />
                            )}
                          </>
                        )}
                      </>
                    )
                  }

                  {
                    load_sanction_response === 'Reverted' && (
                      <>
                        <SelectTag
                          options={revertOption}
                          LName="Revert Reason"
                          {...register("revert_reason", {
                            required: "Please Select Revert Reason is required",
                          })}
                          errorMsg={errors.revert_reason?.message}
                          labelKey="label"
                          valueKey="value"
                          disabled={isDisabled}
                        />

                        <InputTag
                          LName="Revert Reason Remark"
                          placeholder="Please Enter Revert Reason Remark"
                          {...register("revert_remark", {
                            required: "Revert Reason Remark is required",
                          })}
                          errorMsg={errors.revert_remark?.message}
                          disabled={isDisabled}
                        />

                        <InputTag
                          LName="Upload Revert Docs"
                          type="file"
                          {...register("upload_revert_docs", {
                            required: "Upload Upload Revert Docs is required",
                          })}
                          errorMsg={errors.upload_revert_docs?.message}
                        />
                      </>
                    )
                  }

                </div>
              </div>
              <div className="border-b border-gray-900/10 pb-12 ">
                <div className="mt-10 flex flex-col justify-center items-center">
                  <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">

                    {/* -------------------- WITHOUT OTP -------------------- */}
                    {!showOtpBtn && (
                      <>
                        <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-red-600 duration-300">
                          Reset
                        </button>

                        {load_sanction_response === "Reverted" ? (
                          <button
                            type="submit"
                            className="rounded-lg px-4 py-2 bg-red-700 text-green-100 hover:bg-green-800 duration-300"
                          >
                            Revert
                          </button>
                        ) : (
                          <>
                            {/* -------------------- HIGH VOLT LOGIC (>33kV) -------------------- */}
                            {HIGH_VOLT && !items?.transco_approval  ? (
                              is_required === "is_EDCRA_required" && (
                                <button
                                  type="submit"
                                  className={`text-white px-4 py-2 mt-4 rounded
                    ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-900"}`}
                                  disabled={isDisabled}
                                >
                                  {isDisabled ? "Please wait..." : "Forward to EDCRA"}
                                </button>
                              )
                            ) : (
                              <>
                                {/* -------------------- NORMAL FLOW (<=33kV) -------------------- */}
                                {is_required === "is_agreement_required" ? (
                                  <button
                                    type="submit"
                                    className={`text-white px-4 py-2 mt-4 rounded 
                      ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-purple-800"}`}
                                    disabled={isDisabled}
                                  >
                                    {isDisabled ? "Please wait..." : "Send for Agreement"}
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    className={`text-white px-4 py-2 mt-4 rounded
                      ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-purple-800"}`}
                                    disabled={isDisabled}
                                  >
                                    {isDisabled ? "Please wait..." : "Send for Survey"}
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* -------------------- OTP SECTION -------------------- */}
                    {showOtpBtn && (
                      <>
                        <InputTag
                          LName=""
                          placeholder="Please Enter Otp."
                          {...register("otp", {
                            required: "Otp is required",
                          })}
                          errorMsg={errors.otp?.message}
                        />

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className={`bg-green-600 text-white px-4 py-2 mt-4 rounded
            ${isBtnDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-purple-800"}`}
                          disabled={isBtnDisabled}
                        >
                          {isBtnDisabled ? "Please wait..." : "Verify Otp"}
                        </button>

                        <button
                          type="button"
                          onClick={handleReSendOtp}
                          className="bg-emerald-600 text-white px-4 py-2 mt-4 rounded"
                        >
                          Resend Otp
                        </button>
                      </>
                    )}
                  </div>

                  {/* OTP Messages */}
                  {errors?.otpSuccess && (
                    <p className="text-green-500 text-sm mt-1">{errors?.otpSuccess?.message}</p>
                  )}
                  {errors?.otpStatus && (
                    <p className="text-red-500 text-sm mt-1">{errors?.otpStatus?.message}</p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default LoadSanction;

