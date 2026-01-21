// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { useSelector } from "react-redux";
// import { setUserData, setLoading, setError } from '../../redux/slices/userSlice.js';
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js'

// // import AlertModalBox from '../../component/alertModelBox.jsx';

// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import {
//   InputTag,
//   SelectTag,
//   ApplicantBasicDetails,
//   ApplicantFillDetails,
//   AlertModalBox,
//   toFormData,
//   sendOtpNew,
//   verifyOtpNew,
// } from '../importComponents.js';
// import { TypeOfValue } from '../newComponents/commonOption.js';
// import {
//   handleSupplyVoltage,
//   contractDemandRange,
//   checkLoadReductionDate,
//   validateContractDemand,
// } from '../../utils/handleLogicLoad.js';

// function ApplicantReg() {
//   const { consumerId, application_no } = useParams();
//   const [isLocked, setIsLocked] = useState(false);
//   const [showButton, setShowButton] = useState(false)
//   const location = useLocation();
//   const [htConsumers, setHtConsumer] = useState("");
//   const [subTypeOfChange, setSubTypeOfChange] = useState([]);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [supplyVoltage, setSupplyVoltage] = useState([]);
//   const [totalYearConn, setTotalYearConn] = useState('')
//   const [loadReductionApply, setLoadReductionApply] = useState('')
//   const [isCalculating, setIsCalculating] = useState(false);

//   const [otpSent, setOtpSent] = useState(false);
//   const [isBtnDisabled, setBtnDisabled] = useState(false);

//   const reduxUserData = useSelector(state => state.user.userData);
//   const data = location.state?.data || reduxUserData;


//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [modalAction, setModalAction] = useState(() => () => { });
//   const [isButton, setIsButton] = useState(false);

//   const isUpdatePage = location.pathname.includes("/update/");

//   const showModal = (message, action = () => { }) => {
//     setModalMessage(message);
//     setModalAction(() => action); // save callback
//     setModalOpen(true);
//   };
//   // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE inside register')

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     setError,
//     clearErrors,
//     getValues,
//     formState: { errors, isSubmitting },
//   } = useForm(
//     {
//       defaultValues: data || {},
//       mode: "onChange",  // validates as user types
//       reValidateMode: "onChange",

//     }
//   );
//   const typeOfChange = watch('type_of_change');
//   const SubTypeOfChange = watch('lc_type');
//   const SupplyVoltage = watch('new_supply_voltage');
//   const ContractDemand = watch('new_contact_demand');

//   console.log(htConsumers,'htconsumer details')

//   // useEffect(() => {
//   //   if (Object.keys(data).length) {
//   //     // console.log(data, "data")
//   //     setHtConsumer(data);
//   //   } else {
//   //     navigate(`/ht-load-change/`);
//   //   }
//   // }, [data]);
//   useEffect(() => {
//   if (data && Object.keys(data).length) {
//     setHtConsumer(data);
//   }
// }, [data, reset]);



//   useEffect(() => {
//     if (isUpdatePage) {
//       setShowButton(true);
//       setIsDisabled(false);
//     }
//   }, [isUpdatePage]);

//   useEffect(() => {
//     setTimeout(() => {
//       setValue("lc_type", data?.lc_type)
//       setValue("new_supply_voltage", data?.new_supply_voltage)
//       setValue('contract_demand_difference', data?.contract_demand_difference)
//       setValue('contract_demand_difference', data?.contract_demand_difference)

//     }, 1000);
//   }, [application_no]);

//   useEffect(() => {
//     if (typeOfChange === 'Load_Enhancement') {
//       if (htConsumers.LoadEnhancement) {
//         setSubTypeOfChange(TypeOfValue.enhancementOptions);
//       } else {
//         showModal(
//           ' You are not allowed for load Enhancement as per the Payment pending.'
//         );
//       }
//     } else if (typeOfChange === 'Load_Reduction') {
//       setSubTypeOfChange(TypeOfValue.reductionOptions);
//       let Load_Reduction_apply = checkLoadReductionDate(htConsumers);

//       if (Load_Reduction_apply?.Load_Reduction) {
//         setLoadReductionApply(Load_Reduction_apply)

//       } else {
//         showModal(
//           ' You are not allowed for load reduction as per the clause 7.12 or 7.13 of supply code  2021.'
//         );
//       }
//     } else {
//       setSubTypeOfChange([]);
//     }
//   }, [typeOfChange]);

//   useEffect(() => {
//     if (SupplyVoltage) {
//       setValue("new_contact_demand", "");
//       setValue("contract_demand_difference", "");
//       // clearErrors("new_contact_demand");
//       if (SubTypeOfChange === "Only_Voltage_Upgrade") {
//         setValue("contract_demand_difference", 0);
//         // setValue("new_contact_demand", htConsumers?.existing_contract_demand);
//         setValue("new_contact_demand", htConsumers?.cd);
//         setIsLocked(true)
//         // const contract_demand = contractDemandRange(SupplyVoltage, htConsumers?.existing_contract_demand);
//          const contract_demand = contractDemandRange(SupplyVoltage, htConsumers?.cd);
//         if (contract_demand) {
//           setValue("new_contact_demand", "");
//           setValue("contract_demand_difference", "");
//           setError("new_contact_demand", {
//             type: "manual",
//             message: contract_demand,
//           });
//         }

//       } else {
//         setIsLocked(false)
//         setValue("new_contact_demand", "");
//         setValue("contract_demand_difference", "");
//         clearErrors("new_contact_demand");
//       }
//     }

//   }, [SupplyVoltage])


//   useEffect(() => {
//     let timer;
//     if (typeOfChange && SubTypeOfChange && htConsumers?.existing_supply_voltage) {
//       timer = setTimeout(() => {
//         setValue("new_supply_voltage", "");
//         setValue("contract_demand_difference", "");
//         setValue("new_contact_demand", "");

//         let supply_voltage = handleSupplyVoltage(
//           htConsumers?.existing_supply_voltage,
//           SubTypeOfChange
//         );
//         setSupplyVoltage(supply_voltage);
//       }, 1000);
//     }

//     return () => clearTimeout(timer);
//   }, [SubTypeOfChange, htConsumers?.existing_supply_voltage]);


//   // useEffect(() => {
//   //   if (ContractDemand && typeOfChange && SubTypeOfChange && SupplyVoltage) {
//   //     const handler = setTimeout(() => {
//   //       const contract_demand = contractDemandRange(SupplyVoltage, ContractDemand);
//   //       const demandError = validateContractDemand(
//   //         typeOfChange,
//   //         ContractDemand,
//   //         SubTypeOfChange,
//   //         htConsumers,
//   //         totalYearConn,
//   //         loadReductionApply
//   //       );
//   //       let contractDeffres = Math.abs(
//   //         ContractDemand - Number(htConsumers.existing_contract_demand)
//   //       );
//   //       setValue("contract_demand_difference", contractDeffres);

//   //       if (contract_demand) {
//   //         setError("new_contact_demand", {
//   //           type: "manual",
//   //           message: contract_demand,
//   //         });
//   //         setValue("contract_demand_difference", "");
//   //         setValue("new_contact_demand", "");
//   //       } else if (demandError) {
//   //         setError("new_contact_demand", {
//   //           type: "manual",
//   //           message: demandError,
//   //         });
//   //         setValue("contract_demand_difference", "");
//   //         setValue("new_contact_demand", "");
//   //       } else {
//   //         clearErrors("new_contact_demand");
//   //       }
//   //     }, 600);

//   //     return () => clearTimeout(handler);
//   //   } else {
//   //     setValue("new_contact_demand", "");

//   //   }
//   // }, [ContractDemand]);

//   const normalizedHtConsumer = {
//   ...htConsumers,
//   existing_contract_demand: htConsumers?.cd,
// };

//   useEffect(() => {
//     let timeoutId;

//     if (ContractDemand && typeOfChange && SubTypeOfChange && SupplyVoltage) {
//       // 1.5 second delay before calculation
//       timeoutId = setTimeout(() => {
//         const contract_demand = contractDemandRange(SupplyVoltage, ContractDemand);
//         const demandError = validateContractDemand(
//           typeOfChange,
//           ContractDemand,
//           SubTypeOfChange,
//           // htConsumers,
//           normalizedHtConsumer,
//           totalYearConn,
//           loadReductionApply
//         );

//         let contractDiff = Math.abs(
//           // ContractDemand - Number(htConsumers.existing_contract_demand)
//             ContractDemand - Number(htConsumers.cd)
//         );
//         setValue("contract_demand_difference", contractDiff);

//         if (contract_demand) {
//           setError("new_contact_demand", {
//             type: "manual",
//             message: contract_demand,
//           });
//           setValue("contract_demand_difference", "");
//           setValue("new_contact_demand", "");
//         } else if (demandError) {
//           setError("new_contact_demand", {
//             type: "manual",
//             message: demandError,
//           });
//           setValue("contract_demand_difference", "");
//           setValue("new_contact_demand", "");
//         } else {
//           clearErrors("new_contact_demand");
//         }
//       }, 1500); // 1.5 seconds delay

//       return () => clearTimeout(timeoutId);
//     } else {
//       // Clear values if conditions not met
//       setValue("contract_demand_difference", "");
//     }
//   }, [ContractDemand, typeOfChange, SubTypeOfChange, SupplyVoltage]);

//   // 🧩 Submit or Update handler
//   const onSubmithandler = async (data) => {
//     if (isUpdatePage) {
//       // 🧠 When Update page → first send OTP instead of direct update
//       await handleSendOtp(data);
//     } else {
//       await handleSubmitNewApplication(data);
//     }
//   };

//   const handleSubmitNewApplication = async (data) => {
//     try {
//       dispatch(setLoading(true));
//       setIsDisabled(true);
//       const formData = toFormData(data);

//       const apiUrl = `${HT_LOAD_CHANGE_BASE}/submit-load-change-application/`;
//       const response = await axios.post(apiUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const result = response?.data;
//       if (!result) throw new Error("No response from server");

//       if (result.data) dispatch(setUserData(result.data));

//       if (result.application_no) {
//         navigate(`/ht-load-change/update/${result.application_no}`, {
//           state: { data: result.data },
//         });
//       }
//     } catch (err) {
//       alert(err?.response?.data?.message || "Something went wrong!");
//     } finally {
//       dispatch(setLoading(false));
//       setIsDisabled(false);
//     }
//   };

//   const handleSendOtp = async (formDataValues) => {
//     try {
//       dispatch(setLoading(true));
//       // const rawMobile = htConsumers?.mobile || "";
//       const rawMobile = String(9754548330)
//       const mobileNo = String(rawMobile);
//       const otpResp = await sendOtpNew(mobileNo);

//       if (otpResp.success) {
//         setOtpSent(true);
//         setError("otpSuccess", {
//           type: "manual",
//           message: otpResp.message,
//         })
//         setIsDisabled(true);
//       } else {
//         setError('otpStatus', {
//           type: 'manual',
//           message: otpResp.message,
//         })
//       }
//     } catch (err) {
//       setError('otpStatus', {
//         type: 'manual',
//         message: sentOtp.message,
//       });
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // 🟢 Verify OTP
//   const handleVerifyOtp = async () => {
//     const otpValue = getValues("otp");
//     // const mobileNo = htConsumers?.mobile;
//     const mobileNo = 9754548330;

//     try {
//       setBtnDisabled(true);
//       const verifyResp = await verifyOtpNew(mobileNo, otpValue);

//       if (verifyResp.success) {
//         // setOtpMessage("✅ OTP verified successfully!");
//         await handleFinalUpdateSubmit(); // proceed to final API hit
//       } else setError('otp', {
//         type: 'manual',
//         message: verifyResp.error,
//       });
//     } catch (err) {
//       setError('otpStatus', {
//         type: 'manual',
//         message: verifyResp.message,
//       });
//     } finally {
//       setBtnDisabled(false);
//     }
//   };

//   const handleFinalUpdateSubmit = async () => {
//     try {
//       dispatch(setLoading(true));
//       const allFormData = getValues();
//       const formData = toFormData(allFormData);

//       const apiUrl = `${HT_LOAD_CHANGE_BASE}/update-load-change-application/?application_no=${application_no}`;
//       const response = await axios.put(apiUrl, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const result = response?.data;

//       if (result?.data) dispatch(setUserData(result.data));

//       // ✅ Navigate to details page after OTP verification
//       navigate(`/ht-load-change/Details`,{
//          state: { data: result.data },
//       });
//     } catch (err) {
//       alert(err?.response?.data?.message || "Update failed!");
//     } finally {
//       dispatch(setLoading(false));
//       setIsDisabled(false);
//       setOtpSent(false);
//     }
//   };

//   // 🔄 Resend OTP
//   const handleReSendOtp = async () => {
//     const rawMobile = htConsumers?.mobile || "";
//     const mobileNo = String(rawMobile);
//     clearErrors("otp");
//     const otpResp = await sendOtpNew(mobileNo);
//     if (otpResp.success) {
//       setError('otpSuccess', {
//         type: 'manual',
//         message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
//       });
//     } else {
//       alert("Failed to resend OTP.");
//     }
//   };


//   useEffect(() => {
//     // Auto-fill purpose_of_installation_details with connection_purpose
//     if (htConsumers?.connection_purpose && !getValues('purpose_of_installation_details')) {
//       setValue('purpose_of_installation_details', htConsumers.connection_purpose);
//     }
//   }, [htConsumers?.connection_purpose]);


//   return (

//     <>
//       <div className='flex '>
//         <div className='w-1/5  p-4'></div>
//         <div className='w-4/5'>
//           <form onSubmit={handleSubmit(onSubmithandler)}>
//             <AlertModalBox
//               open={modalOpen}
//               onClose={() => setModalOpen(false)}
//               message={modalMessage}
//               onConfirm={modalAction}
//             />

//             <div className="space-y-12 container mx-auto border my-5  rounded-md border-gray shadow-md bg-white">
//               <div className="border-b border-gray-900/10 pb-12">
//                 <div className="block mb-2 border-b-2 p-2 ">
//                   <h2 className="text-base font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//                     {isUpdatePage
//                       ? "HT NSC Load Change Application (Preview / Update)"
//                       : "HT NSC Load Change Application"}
//                   </h2>
//                 </div>
//                 <div className="body p-4">
//                   <ApplicantFillDetails htConsumers={htConsumers} register={register} errors={errors} isUpdatePage={isUpdatePage} />
//                   <div className="border-b border-gray-900/10 pb-12">
//                     <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//                       Required Load Details
//                     </h2>

//                     <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//                       <SelectTag
//                         LName="Type of Change"
//                         options={TypeOfValue.typeOfChanges}
//                         {...register('type_of_change', {
//                           required: 'Please Select Type of Changes is required',
//                         })}
//                         errorMsg={errors.type_of_change?.message}
//                         labelKey="label"
//                         valueKey="value"
//                         disabled={isDisabled}
//                       />
//                       <SelectTag
//                         LName="Sub Type of Change"
//                         options={subTypeOfChange}
//                         {...register('lc_type', {
//                           required: 'Please Select Sub Type of Changes is required',
//                         })}
//                         errorMsg={errors.lc_type?.message}
//                         labelKey="label"
//                         valueKey="value"
//                         disabled={isDisabled}
//                       />
//                       <SelectTag
//                         LName="New Supply Voltage"
//                         options={supplyVoltage}
//                         {...register('new_supply_voltage', {
//                           required: 'Please Select New Supply Voltage is required',
//                         })}
//                         errorMsg={errors.new_supply_voltage?.message}
//                         labelKey="label"
//                         valueKey="value"
//                         disabled={isDisabled}
//                       />
//                       {/* <InputTag
//                         LName="Total Required Contract Demand(in KVA)"
//                         type={'number'}
//                         placeholder="Please Enter New Contract Demand "
//                         {...register('new_contact_demand', {
//                           required: 'New Contract Demand is required',
//                         })}
//                         errorMsg={errors.new_contact_demand?.message}
//                         disabled={isDisabled}
//                         readOnly={isLocked}
//                       /> */}
//                       <InputTag
//                         LName="Total Required Contract Demand(in KVA)"
//                         type={'number'}
//                         placeholder="Please Enter New Contract Demand"
//                         {...register('new_contact_demand', {
//                           required: 'New Contract Demand is required',
//                           onChange: (e) => {
//                             // Optional: Show loading indicator
//                             setIsCalculating(true);
//                           }
//                         })}
//                         errorMsg={errors.new_contact_demand?.message}
//                         disabled={isDisabled}
//                         readOnly={isLocked}
//                       />
//                       <InputTag
//                         LName="Contract Demand Difference"
//                         type={'number'}
//                         {...register('contract_demand_difference', {
//                           required: true,
//                         })}
//                         errorMsg={errors.contract_demand_difference?.message}
//                         disabled={isDisabled}
//                         readOnly={isLocked}
//                       />
//                       {/* <InputTag
//                         LName="Purpose Of Installation (Optional)"
//                         {...register('purpose_of_installation_details')}
//                         placeholder="Please Enter Purpose Of Installation Details"
//                         errorMsg={errors.purpose_of_installation_details?.message}
//                         disabled={isDisabled}

//                       /> */}
//                       {/* <InputTag
//                         LName="Purpose Of Installation (Optional)"
//                         {...register('purpose_of_installation_details')}
//                         placeholder="Please Enter Purpose Of Installation Details"
//                         errorMsg={errors.purpose_of_installation_details?.message}
//                         disabled={isDisabled}

//                       /> */}
//                       <InputTag
//                         LName="Purpose Of Installation (Optional)"
//                         {...register('purpose_of_installation_details')}
//                         placeholder="Please Enter Purpose Of Installation Details"
//                         errorMsg={errors.purpose_of_installation_details?.message}
//                         disabled={isDisabled}
//                         defaultValue={htConsumers?.connection_purpose || ''}
//                       />

//                     </div>
//                   </div>
//                   <div className="border-b border-gray-900/10 pb-12">
//                     <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//                       Bank Details..
//                     </h2>
//                     <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">

//                       <InputTag
//                         LName="Account Holder Name"
//                         {...register('ac_holder_name')}
//                         placeholder="Please Enter Purpose Of Installation Details"
//                         errorMsg={errors.ac_holder_name?.message}
//                         disabled={isDisabled}

//                       />
//                       <InputTag
//                         LName="Bank Name"
//                         {...register('bank_name')}
//                         placeholder="Please Enter Bank Name"
//                         errorMsg={errors.bank_name?.message}
//                         disabled={isDisabled}

//                       />
//                       {/* <InputTag
//                         LName="Bank IFSC Code"
//                         {...register('bank_ifsc_code')}
//                         placeholder="Please Enter Bank IFSC Code"
//                         errorMsg={errors.bank_ifsc_code?.message}
//                         disabled={isDisabled}

//                       /> */}
//                       <InputTag
//                         LName="Bank IFSC Code"
//                         {...register("bank_ifsc_code", {
//                           // required: "IFSC Code is required",
//                           pattern: {
//                             value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
//                             message: "Enter a valid IFSC Code (e.g. SBIN0123456)",
//                           },
//                           onChange: (e) => {
//                             e.target.value = e.target.value.toUpperCase();
//                           },
//                         })}
//                         placeholder="Please Enter Bank IFSC Code"
//                         errorMsg={errors.bank_ifsc_code?.message}
//                         disabled={isDisabled}
//                       />
//                       {/* 
//                       <InputTag
//                         LName="Bank Account Number"
//                         {...register('bank_ac_no')}
//                         placeholder="Please Enter Bank Account Number"
//                         errorMsg={errors.bank_ac_no?.message}
//                         disabled={isDisabled}

//                       /> */}
//                       <InputTag
//                         LName="Bank Account Number"
//                         placeholder="Please Enter Bank Account Number"
//                         disabled={isDisabled}
//                         errorMsg={errors.bank_ac_no?.message}
//                         {...register("bank_ac_no", {
//                           pattern: {
//                             value: /^[0-9]*$/, // empty allowed, numbers only
//                             message: "Only numbers are allowed",
//                           },
//                           minLength: {
//                             value: 9,
//                             message: "Account number must be at least 9 digits",
//                           },
//                           maxLength: {
//                             value: 18,
//                             message: "Account number cannot exceed 18 digits",
//                           },
//                           onChange: (e) => {
//                             // typing ke time hi characters block
//                             e.target.value = e.target.value.replace(/\D/g, "");
//                           },
//                         })}
//                       />


//                       <InputTag
//                         LName="Upload Bank Passbook/Cheque "
//                         {...register('bank_docs')}
//                         type="file"
//                         errorMsg={errors.bank_docs?.message}
//                         disabled={isDisabled}

//                       />

//                     </div>
//                   </div>
//                   <div className="border-b border-gray-900/10 pb-12">
//                     <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//                       Firm Document Details..
//                     </h2>
//                     <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">

//                       {/* {htConsumers.pan_card_no === "" || htConsumers.pan_card_no == "NA" && (
//                         <>
//                           <InputTag
//                             LName="Pan No"
//                             {...register('pan_no')}
//                             errorMsg={errors.pan_no?.message}
//                             placeholder="Enter Pan No.  "
//                             disabled={isDisabled}

//                           />

//                           <InputTag
//                             LName="Upload Pan No"
//                             {...register('pan_card_doc')}
//                             type="file"
//                             errorMsg={errors.pan_card_doc?.message}
//                             disabled={isDisabled}

//                           />
//                         </>
//                       )} */}
//                       {(htConsumers.pan_card_no === "" || htConsumers.pan_card_no === "NA") && (
//                         <>
//                           <InputTag
//                             LName="Pan No"
//                             {...register("pan_no", {
//                               required: "PAN No is required",
//                               pattern: {
//                                 value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
//                                 message: "PAN must be 10 characters (e.g. ABCDE1234F)",
//                               },
//                             })}
//                             errorMsg={errors.pan_no?.message}
//                             placeholder="Enter PAN No."
//                             disabled={isDisabled}
//                           />

//                           <InputTag
//                             LName="Upload PAN Card"
//                             {...register("pan_card_doc", {
//                               required: "PAN document is required",
//                             })}
//                             type="file"
//                             errorMsg={errors.pan_card_doc?.message}
//                             disabled={isDisabled}
//                           />
//                         </>
//                       )}


//                       <InputTag
//                         LName="Upload GST Document"
//                         {...register('gst_doc')}
//                         type="file"
//                         errorMsg={errors.gst_doc?.message}
//                         disabled={isDisabled}

//                       />
//                       <InputTag
//                         LName="Enter Other Document No"
//                         {...register('uploaded_doc_no')}

//                         placeholder="Enter Other Document No. "
//                         errorMsg={errors.uploaded_doc_no?.message}
//                         disabled={isDisabled}

//                       />
//                       <InputTag
//                         LName="Enter Other Document Name"
//                         {...register('uploaded_doc_name')}

//                         placeholder="Enter Other Document Name "
//                         errorMsg={errors.uploaded_doc_no?.message}
//                         disabled={isDisabled}

//                       />
//                       <InputTag
//                         LName="Upload Other Document."
//                         {...register('upload_file')}
//                         type="file"

//                         errorMsg={errors.upload_file?.message}
//                         disabled={isDisabled}

//                       />


//                     </div>
//                     <br></br>
//                     <strong>Note:</strong> Please merge the documents pdfs, if mulltiple documents to be upload.

//                   </div>

//                   {isUpdatePage && (
//                     <div className="border-b border-gray-900/10 pb-12">
//                       {/* <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//                   Firm Document Details..
//                 </h2> */}
//                       <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-0">
//                         <div className="col-span-8">
//                           <div className="p-4 border rounded-lg shadow-sm bg-white">
//                             {/* Checkbox with Declaration Heading */}
//                             <div className="flex items-start space-x-2">
//                               <input
//                                 type="checkbox"
//                                 name="agreeBtn"
//                                 {...register("agreeBtn", { required: "कृपया शर्तों से सहमत हों" })}
//                                 className="mt-1"
//                               />
//                               <label htmlFor="agreeBtn" className="font-semibold">
//                                 मैं यह घोषणा करता हूँ कि
//                               </label>
//                             </div>
//                             {errors.agreeBtn && (
//                               <p className="text-red-600 text-sm mt-1">{errors.agreeBtn.message}</p>
//                             )}

//                             {/* Instructions */}
//                             <div className="mt-4 space-y-3 text-sm leading-6">
//                               <div>
//                                 <span className="font-medium">1.</span> मेरे द्वारा आवेदन करते समय सभी जानकारियाँ सही प्रदान की गई हैं।
//                                 <div className="text-gray-600">
//                                   (All the information provided by me while applying is correct.)
//                                 </div>
//                               </div>

//                               <div>
//                                 <span className="font-medium">2.</span>मैंने वर्तमान में लागू मध्य प्रदेश विद्युत आपूर्ति संहिता और उसके संशोधन को पढ़ लिया है और उसमें उल्लिखित
//                                 शर्तों का पालन करने के लिए सहमत हूँ।
//                                 <div className="text-gray-600">
//                                   (I have read the Madhya Pradesh Electricity Supply Code and amendment thereof and agree to abide by the
//                                   condition mentioned therein.)
//                                 </div>
//                               </div>

//                               <div>
//                                 <span className="font-medium">3.</span> आवेदन करते समय जो जानकारियाँ मेरे द्वारा प्रदान की गई है, अगर इनमें से कोई भी जानकारी सत्यापन के
//                                 दौरान गलत / असत्य पाई जाती है तो मैं इसके लिये स्वयं जिम्मेदार रहूँगा ।
//                                 <div className="text-gray-600">
//                                   (The information provided by me is very correct and while applying; if any of the information is found
//                                   incorrect/false during verification then I will be responsible for it.)
//                                 </div>
//                               </div>

//                               <div>
//                                 <span className="font-medium">4.</span> मेरे द्वारा आवेदन करते समय सभी आवश्यक दस्तावेज को स्पष्ट व सही तरीके से अपलोड किया गया है।
//                                 <div className="text-gray-600">
//                                   (While applying, all the necessary documents have been uploaded clearly and correctly by me.)
//                                 </div>
//                               </div>

//                               <div>
//                                 <span className="font-medium">5.</span>मेरे किसी भी विद्युत संयोजन पर पहले से कोई बकाया राशि नहीं है।
//                                 <div className="text-gray-600">
//                                   (I do not have any outstanding dues on any of my electricity connections.)
//                                 </div>
//                               </div>

//                               <div>
//                                 <span className="font-medium">6.</span>म.प्र.क्षे.वि.वि.कं.लि.भार परिवर्तन के अंतर्गत संदर्भ में जो भी सेवाएँ व शर्तें लागू होती हैं, मैं उनका पूर्ण
//                                 रूप से पालन करूँगा।
//                                 <div className="text-gray-600">
//                                   (I will fully comply with whatever services and conditions are applicable in the context under MPMKVVCL
//                                   “Load Change”.)
//                                 </div>
//                               </div>

//                               <div>
//                                 <span className="font-medium">7.</span>यदि लोड और कनेक्शन के उद्देश्य में कोई परिवर्तन होता है, तो मैं अपनी नई आवश्यकता के अनुसार नया
//                                 आवेदन प्रस्तुत करूंगा। डिस्कॉम के पास पिछले आवेदन को रद्द करने और आवेदन के साथ जमा किए गए
//                                 पंजीकरण शुल्क को जब्त करने का अधिकार है।
//                                 <div className="text-gray-600">
//                                   (If there is any changes in the Load and purpose of connection, I will submit the new application as per my
//                                   new requirement. The Discom has rights to cancel the previous application and forfeit the registration
//                                   charges submitted with the application.)
//                                 </div>
//                               </div>

//                               <div>
//                                 <span className="font-medium">8.</span>ऊर्जा की बचत किये जाने हेतु, मैं बिजली का व्यर्थ उपयोग नहीं करूँगा ।
//                                 <div className="text-gray-600">
//                                   (To save energy, I will not use electricity unnecessarily.)
//                                 </div>
//                               </div>

//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* --- OTP Verification Section --- */}
//                   {otpSent ? (
//                     <div className="border-b border-gray-900/10 pb-12 mt-5">
//                       <h2 className="text-base font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//                         Verify OTP
//                       </h2>
//                       <div className="mt-6 flex flex-col justify-center items-center">
//                         <InputTag
//                           placeholder="Enter OTP"
//                           {...register("otp", { required: "OTP is required" })}
//                           errorMsg={errors.otp?.message}
//                         />
//                         <div className="flex space-x-3 mt-3">
//                           <button
//                             type="button"
//                             onClick={handleVerifyOtp}
//                             disabled={isBtnDisabled}
//                             className={`px-4 py-2 rounded text-white ${isBtnDisabled
//                               ? "bg-gray-400"
//                               : "bg-green-600 hover:bg-green-700"
//                               }`}
//                           >
//                             {isBtnDisabled ? "Verifying..." : "Verify OTP"}
//                           </button>
//                           <button
//                             type="button"
//                             onClick={handleReSendOtp}
//                             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                           >
//                             Resend OTP
//                           </button>
//                         </div>
//                         {errors?.otpSuccess && (
//                           <p className="text-green-500 text-sm mt-1">{errors?.otpSuccess?.message}</p>
//                         )}
//                         {errors?.otpStatus && (
//                           <p className="text-red-500 text-sm mt-1">{errors?.otpStatus?.message}</p>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="border-b border-gray-900/10 pb-12 mt-5">
//                       <div className="flex justify-center items-center gap-2">
//                         <button type='reset' className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-red-600 duration-300" onClick={() => reset()}>
//                           Reset
//                         </button>
//                         <button
//                           type="submit"
//                           disabled={isDisabled}
//                           className={`text-white px-4 py-2 rounded ${isDisabled
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-orange-500 hover:bg-purple-800"
//                             }`}
//                         >
//                           {isDisabled
//                             ? "Please wait..."
//                             : isUpdatePage
//                               ? "Update"
//                               : "Submit"}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//         <div className='w-1/5  p-4'></div>
//       </div>

//     </>
//   );
// }

// export default ApplicantReg;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { setUserData, setLoading, setError } from '../../redux/slices/userSlice.js';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js'

// import AlertModalBox from '../../component/alertModelBox.jsx';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  InputTag,
  SelectTag,
  ApplicantBasicDetails,
  ApplicantFillDetails,
  AlertModalBox,
  toFormData,
  sendOtpNew,
  verifyOtpNew,
} from '../importComponents.js';
import { TypeOfValue } from '../newComponents/commonOption.js';
import {
  handleSupplyVoltage,
  contractDemandRange,
  checkLoadReductionDate,
  validateContractDemand,
} from '../../utils/handleLogicLoad.js';
import { saveAppAuth } from "../../utils/Storage/Storage.js";

function ApplicantReg() {
  const { consumerId, application_no } = useParams();
  const [isLocked, setIsLocked] = useState(false);
  const [showButton, setShowButton] = useState(false)
  const location = useLocation();
  const [htConsumers, setHtConsumer] = useState("");
  const [subTypeOfChange, setSubTypeOfChange] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [supplyVoltage, setSupplyVoltage] = useState([]);
  const [totalYearConn, setTotalYearConn] = useState('')
  const [loadReductionApply, setLoadReductionApply] = useState('')
  const [isCalculating, setIsCalculating] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [isBtnDisabled, setBtnDisabled] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const reduxUserData = useSelector(state => state.user.userData);
  const data = location.state?.data || reduxUserData;


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => () => { });
  const [isButton, setIsButton] = useState(false);

  // const isUpdatePage = location.pathname.includes("/update/");

  const showModal = (message, action = () => { }) => {
    setModalMessage(message);
    setModalAction(() => action); // save callback
    setModalOpen(true);
  };
  // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE inside register')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm(
    {
      defaultValues: data || {},
      mode: "onChange",  // validates as user types
      reValidateMode: "onChange",

    }
  );
  const typeOfChange = watch('type_of_change');
  const SubTypeOfChange = watch('lc_type');
  const SupplyVoltage = watch('new_supply_voltage');
  const ContractDemand = watch('new_contact_demand');

  // console.log(htConsumers, 'htconsumer details')

  // useEffect(() => {
  //   if (Object.keys(data).length) {
  //     // console.log(data, "data")
  //     setHtConsumer(data);
  //   } else {
  //     navigate(`/ht-load-change/`);
  //   }
  // }, [data]);
  useEffect(() => {
    if (data && Object.keys(data).length) {
      setHtConsumer(data);
    }
  }, [data, reset]);

  console.log(htConsumers, 'ht consumer cdddddddd')

  // useEffect(() => {
  //   if (isUpdatePage) {
  //     setShowButton(true);
  //     setIsDisabled(false);
  //   }
  // }, [isUpdatePage]);

  useEffect(() => {
    setTimeout(() => {
      setValue("lc_type", data?.lc_type)
      setValue("new_supply_voltage", data?.new_supply_voltage)
      setValue('contract_demand_difference', data?.contract_demand_difference)
      setValue('contract_demand_difference', data?.contract_demand_difference)
    }, 1000);
  }, [application_no]);

  useEffect(() => {
    if (typeOfChange === 'Load_Enhancement') {
      if (htConsumers.LoadEnhancement) {
        setSubTypeOfChange(TypeOfValue.enhancementOptions);
      } else {
        showModal(
          ' You are not allowed for load Enhancement as per the Payment pending.'
        );
      }
    } else if (typeOfChange === 'Load_Reduction') {
      setSubTypeOfChange(TypeOfValue.reductionOptions);
      let Load_Reduction_apply = checkLoadReductionDate(htConsumers);

      if (Load_Reduction_apply?.Load_Reduction) {
        setLoadReductionApply(Load_Reduction_apply)

      } else {
        showModal(
          ' You are not allowed for load reduction as per the clause 7.12 or 7.13 of supply code  2021.'
        );
      }
    } else {
      setSubTypeOfChange([]);
    }
  }, [typeOfChange]);

  useEffect(() => {
    if (SupplyVoltage) {
      setValue("new_contact_demand", "");
      setValue("contract_demand_difference", "");
      // clearErrors("new_contact_demand");
      if (SubTypeOfChange === "Only_Voltage_Upgrade") {
        setValue("contract_demand_difference", 0);
        setValue("new_contact_demand", htConsumers?.existing_contract_demand);
        // setValue("new_contact_demand", htConsumers?.cd);
        setIsLocked(true)
        const contract_demand = contractDemandRange(SupplyVoltage, htConsumers?.existing_contract_demand);
        // const contract_demand = contractDemandRange(SupplyVoltage, htConsumers?.cd);
        if (contract_demand) {
          setValue("new_contact_demand", "");
          setValue("contract_demand_difference", "");
          setError("new_contact_demand", {
            type: "manual",
            message: contract_demand,
          });
        }

      } else {
        setIsLocked(false)
        setValue("new_contact_demand", "");
        setValue("contract_demand_difference", "");
        clearErrors("new_contact_demand");
      }
    }

  }, [SupplyVoltage])


  useEffect(() => {
    let timer;
    if (typeOfChange && SubTypeOfChange && htConsumers?.existing_supply_voltage) {
      timer = setTimeout(() => {
        setValue("new_supply_voltage", "");
        setValue("contract_demand_difference", "");
        setValue("new_contact_demand", "");

        let supply_voltage = handleSupplyVoltage(
          htConsumers?.existing_supply_voltage,
          SubTypeOfChange
        );
        setSupplyVoltage(supply_voltage);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [SubTypeOfChange, htConsumers?.existing_supply_voltage]);


  // useEffect(() => {
  //   if (ContractDemand && typeOfChange && SubTypeOfChange && SupplyVoltage) {
  //     const handler = setTimeout(() => {
  //       const contract_demand = contractDemandRange(SupplyVoltage, ContractDemand);
  //       const demandError = validateContractDemand(
  //         typeOfChange,
  //         ContractDemand,
  //         SubTypeOfChange,
  //         htConsumers,
  //         totalYearConn,
  //         loadReductionApply
  //       );
  //       let contractDeffres = Math.abs(
  //         ContractDemand - Number(htConsumers.existing_contract_demand)
  //       );
  //       setValue("contract_demand_difference", contractDeffres);

  //       if (contract_demand) {
  //         setError("new_contact_demand", {
  //           type: "manual",
  //           message: contract_demand,
  //         });
  //         setValue("contract_demand_difference", "");
  //         setValue("new_contact_demand", "");
  //       } else if (demandError) {
  //         setError("new_contact_demand", {
  //           type: "manual",
  //           message: demandError,
  //         });
  //         setValue("contract_demand_difference", "");
  //         setValue("new_contact_demand", "");
  //       } else {
  //         clearErrors("new_contact_demand");
  //       }
  //     }, 600);

  //     return () => clearTimeout(handler);
  //   } else {
  //     setValue("new_contact_demand", "");

  //   }
  // }, [ContractDemand]);

  const normalizedHtConsumer = {
    ...htConsumers,
    existing_contract_demand: htConsumers?.existing_contract_demand,
  };

  useEffect(() => {
    let timeoutId;

    if (ContractDemand && typeOfChange && SubTypeOfChange && SupplyVoltage) {
      // 1.5 second delay before calculation
      timeoutId = setTimeout(() => {
        const contract_demand = contractDemandRange(SupplyVoltage, ContractDemand);
        const demandError = validateContractDemand(
          typeOfChange,
          ContractDemand,
          SubTypeOfChange,
          // htConsumers,
          normalizedHtConsumer,
          totalYearConn,
          loadReductionApply
        );

        let contractDiff = Math.abs(
          ContractDemand - Number(htConsumers.existing_contract_demand)
          // ContractDemand - Number(htConsumers.cd)
        );
        setValue("contract_demand_difference", contractDiff);

        if (contract_demand) {
          setError("new_contact_demand", {
            type: "manual",
            message: contract_demand,
          });
          setValue("contract_demand_difference", "");
          setValue("new_contact_demand", "");
        } else if (demandError) {
          setError("new_contact_demand", {
            type: "manual",
            message: demandError,
          });
          setValue("contract_demand_difference", "");
          setValue("new_contact_demand", "");
        } else {
          clearErrors("new_contact_demand");
        }
      }, 1500); // 1.5 seconds delay

      return () => clearTimeout(timeoutId);
    } else {
      // Clear values if conditions not met
      setValue("contract_demand_difference", "");
    }
  }, [ContractDemand, typeOfChange, SubTypeOfChange, SupplyVoltage]);

  // 🧩 Submit or Update handler
  const onSubmithandler = async (data) => {
    await handleSendOtp(data);
    // await handleSubmitNewApplication(data);
  };

  const handleSubmitNewApplication = async (data) => {
    try {
      dispatch(setLoading(true));
      setIsDisabled(true);
      const formData = toFormData(data);
      console.log(formData,'formDataaa')
      const apiUrl = `${HT_LOAD_CHANGE_BASE}/submit-load-change-application/`;
      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = response?.data;
      if (!result) throw new Error("No response from server");

      // 🔐 SAVE application_no + password (MOST IMPORTANT)
      if (result.application_no && result.password) {
        saveAppAuth({
          application_no: result.application_no,
          password: result.password,
          consumer_name: result.data?.consumer_name,
          consumer_id: result.data?.consumer_id,
        });
      }

      if (result.data) dispatch(setUserData(result.data));

      if (result.application_no) {
        navigate(`/ht-load-change/Details`, {
          state: { data: result.data },
        });
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setLoading(false));
      setIsDisabled(false);
    }
  };

  const handleSendOtp = async (formDataValues) => {
    try {
      dispatch(setLoading(true));
      setIsSendingOtp(true); // ✅ Disable Save button when OTP is being sent
      setIsDisabled(true);
      const rawMobile = htConsumers?.mobile || "";
      // const rawMobile = String(9754548330)
      const mobileNo = String(rawMobile);
      const otpResp = await sendOtpNew(mobileNo);

      if (otpResp.success) {
        setOtpSent(true);
        setError("otpSuccess", {
          type: "manual",
          message: otpResp.message,
        })
        setIsDisabled(true);
      } else {
        setError('otpStatus', {
          type: 'manual',
          message: otpResp.message,
        })
        setIsSendingOtp(false); // ✅ Enable button if OTP fails
        setIsDisabled(false);
      }
    } catch (err) {
      setError('otpStatus', {
        type: 'manual',
        message: sentOtp.message,
      });
      setIsSendingOtp(false); // ✅ Enable button on error
      setIsDisabled(false);   // ✅ Enable form fields on error
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 🟢 Verify OTP
  // const handleVerifyOtp = async () => {
  //   const otpValue = getValues("otp");
  //   // const mobileNo = htConsumers?.mobile;
  //   const mobileNo = 9754548330;

  //   try {
  //     setBtnDisabled(true);
  //     const verifyResp = await verifyOtpNew(mobileNo, otpValue);

  //     if (verifyResp.success) {
  //       // setOtpMessage("✅ OTP verified successfully!");
  //       await handleSubmitNewApplication(); // proceed to final API hit
  //     } else setError('otp', {
  //       type: 'manual',
  //       message: verifyResp.error,
  //     });
  //   } catch (err) {
  //     setError('otpStatus', {
  //       type: 'manual',
  //       message: verifyResp.message,
  //     });
  //   } finally {
  //     setBtnDisabled(false);
  //   }
  // };
  const handleVerifyOtp = async () => {
    const otpValue = getValues("otp");
    const mobileNo = htConsumers?.mobile;
    // const mobileNo = 9754548330;

    try {
      setBtnDisabled(true);
      const verifyResp = await verifyOtpNew(mobileNo, otpValue);

      if (verifyResp.success) {
        // ✅ PURE FORM DATA PASS KARO
        const formData = getValues();
        console.log(formData,'form dataaaaa')
        await handleSubmitNewApplication(formData);
      } else {
        setError("otp", {
          type: "manual",
          message: verifyResp.error,
        });
      }
    } catch (err) {
      setError("otpStatus", {
        type: "manual",
        message: err?.message || "OTP verification failed",
      });
    } finally {
      setBtnDisabled(false);
    }
  };


  // const handleFinalUpdateSubmit = async () => {
  //   try {
  //     dispatch(setLoading(true));
  //     const allFormData = getValues();
  //     const formData = toFormData(allFormData);

  //     const apiUrl = `${HT_LOAD_CHANGE_BASE}/update-load-change-application/?application_no=${application_no}`;
  //     const response = await axios.put(apiUrl, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     const result = response?.data;

  //     if (result?.data) dispatch(setUserData(result.data));

  //     // ✅ Navigate to details page after OTP verification
  //     navigate(`/ht-load-change/Details`, {
  //       state: { data: result.data },
  //     });
  //   } catch (err) {
  //     alert(err?.response?.data?.message || "Update failed!");
  //   } finally {
  //     dispatch(setLoading(false));
  //     setIsDisabled(false);
  //     setOtpSent(false);
  //   }
  // };

  // 🔄 Resend OTP
  // const handleReSendOtp = async () => {
  //   const rawMobile = htConsumers?.mobile || "";
  //   const mobileNo = String(rawMobile);
  //   clearErrors("otp");
  //   const otpResp = await sendOtpNew(mobileNo);
  //   if (otpResp.success) {
  //     setError('otpSuccess', {
  //       type: 'manual',
  //       message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
  //     });
  //   } else {
  //     alert("Failed to resend OTP.");
  //   }
  // };
  const handleReSendOtp = async () => {
    const rawMobile = htConsumers?.mobile || "";
    const mobileNo = String(rawMobile);
    clearErrors("otp");

    try {
      setBtnDisabled(true); // ✅ Disable Resend button
      const otpResp = await sendOtpNew(mobileNo);

      if (otpResp.success) {
        setError('otpSuccess', {
          type: 'manual',
          message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
        });
      } else {
        alert("Failed to resend OTP.");
      }
    } catch (err) {
      alert("Failed to resend OTP.");
    } finally {
      setBtnDisabled(false); // ✅ Enable Resend button
    }
  };


  useEffect(() => {
    // Auto-fill purpose_of_installation_details with connection_purpose
    if (htConsumers?.connection_purpose && !getValues('purpose_of_installation_details')) {
      setValue('purpose_of_installation_details', htConsumers.connection_purpose);
    }
  }, [htConsumers?.connection_purpose]);


  return (

    <>
      <div className='flex '>
        <div className='w-1/5  p-4'></div>
        <div className='w-4/5'>
          <form onSubmit={handleSubmit(onSubmithandler)}>
            <AlertModalBox
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              message={modalMessage}
              onConfirm={modalAction}
            />

            <div className="space-y-12 container mx-auto border my-5  rounded-md border-gray shadow-md bg-white">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="block mb-2 border-b-2 p-2 ">
                  <h2 className="text-base font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                    HT NSC Load Change Application
                  </h2>
                </div>
                <div className="body p-4">
                  <ApplicantFillDetails htConsumers={htConsumers} register={register} errors={errors} />
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                      Required Load Details
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <SelectTag
                        LName="Type of Change"
                        options={TypeOfValue.typeOfChanges}
                        {...register('type_of_change', {
                          required: 'Please Select Type of Changes is required',
                        })}
                        errorMsg={errors.type_of_change?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName="Sub Type of Change"
                        options={subTypeOfChange}
                        {...register('lc_type', {
                          required: 'Please Select Sub Type of Changes is required',
                        })}
                        errorMsg={errors.lc_type?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName="New Supply Voltage"
                        options={supplyVoltage}
                        {...register('new_supply_voltage', {
                          required: 'Please Select New Supply Voltage is required',
                        })}
                        errorMsg={errors.new_supply_voltage?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      />
                      {/* <InputTag
                        LName="Total Required Contract Demand(in KVA)"
                        type={'number'}
                        placeholder="Please Enter New Contract Demand "
                        {...register('new_contact_demand', {
                          required: 'New Contract Demand is required',
                        })}
                        errorMsg={errors.new_contact_demand?.message}
                        disabled={isDisabled}
                        readOnly={isLocked}
                      /> */}
                      <InputTag
                        LName="Total Required Contract Demand(in KVA)"
                        type={'number'}
                        placeholder="Please Enter New Contract Demand"
                        {...register('new_contact_demand', {
                          required: 'New Contract Demand is required',
                          onChange: (e) => {
                            // Optional: Show loading indicator
                            setIsCalculating(true);
                          }
                        })}
                        errorMsg={errors.new_contact_demand?.message}
                        disabled={isDisabled}
                        readOnly={isLocked}
                      />
                      <InputTag
                        LName="Contract Demand Difference"
                        type={'number'}
                        {...register('contract_demand_difference', {
                          required: true,
                        })}
                        errorMsg={errors.contract_demand_difference?.message}
                        disabled={isDisabled}
                        readOnly={isLocked}
                      />
                      {/* <InputTag
                        LName="Purpose Of Installation (Optional)"
                        {...register('purpose_of_installation_details')}
                        placeholder="Please Enter Purpose Of Installation Details"
                        errorMsg={errors.purpose_of_installation_details?.message}
                        disabled={isDisabled}

                      /> */}
                      {/* <InputTag
                        LName="Purpose Of Installation (Optional)"
                        {...register('purpose_of_installation_details')}
                        placeholder="Please Enter Purpose Of Installation Details"
                        errorMsg={errors.purpose_of_installation_details?.message}
                        disabled={isDisabled}

                      /> */}
                      <InputTag
                        LName="Purpose Of Installation (Optional)"
                        {...register('purpose_of_installation_details')}
                        placeholder="Please Enter Purpose Of Installation Details"
                        errorMsg={errors.purpose_of_installation_details?.message}
                        disabled={isDisabled}
                        defaultValue={htConsumers?.connection_purpose || ''}
                      />

                    </div>
                  </div>
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                      Bank Details..
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">

                      <InputTag
                        LName="Account Holder Name"
                        {...register('ac_holder_name')}
                        placeholder="Please Enter Purpose Of Installation Details"
                        errorMsg={errors.ac_holder_name?.message}
                        disabled={isDisabled}

                      />
                      <InputTag
                        LName="Bank Name"
                        {...register('bank_name')}
                        placeholder="Please Enter Bank Name"
                        errorMsg={errors.bank_name?.message}
                        disabled={isDisabled}

                      />
                      {/* <InputTag
                        LName="Bank IFSC Code"
                        {...register('bank_ifsc_code')}
                        placeholder="Please Enter Bank IFSC Code"
                        errorMsg={errors.bank_ifsc_code?.message}
                        disabled={isDisabled}

                      /> */}
                      <InputTag
                        LName="Bank IFSC Code"
                        {...register("bank_ifsc_code", {
                          // required: "IFSC Code is required",
                          pattern: {
                            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                            message: "Enter a valid IFSC Code (e.g. SBIN0123456)",
                          },
                          onChange: (e) => {
                            e.target.value = e.target.value.toUpperCase();
                          },
                        })}
                        placeholder="Please Enter Bank IFSC Code"
                        errorMsg={errors.bank_ifsc_code?.message}
                        disabled={isDisabled}
                      />
                      {/* 
                      <InputTag
                        LName="Bank Account Number"
                        {...register('bank_ac_no')}
                        placeholder="Please Enter Bank Account Number"
                        errorMsg={errors.bank_ac_no?.message}
                        disabled={isDisabled}

                      /> */}
                      <InputTag
                        LName="Bank Account Number"
                        placeholder="Please Enter Bank Account Number"
                        disabled={isDisabled}
                        errorMsg={errors.bank_ac_no?.message}
                        {...register("bank_ac_no", {
                          pattern: {
                            value: /^[0-9]*$/, // empty allowed, numbers only
                            message: "Only numbers are allowed",
                          },
                          minLength: {
                            value: 9,
                            message: "Account number must be at least 9 digits",
                          },
                          maxLength: {
                            value: 18,
                            message: "Account number cannot exceed 18 digits",
                          },
                          onChange: (e) => {
                            // typing ke time hi characters block
                            e.target.value = e.target.value.replace(/\D/g, "");
                          },
                        })}
                      />


                      <InputTag
                        LName="Upload Bank Passbook/Cheque "
                        {...register('bank_docs')}
                        type="file"
                        errorMsg={errors.bank_docs?.message}
                        disabled={isDisabled}

                      />

                    </div>
                  </div>
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                      Firm Document Details..
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">

                      {/* {htConsumers.pan_card_no === "" || htConsumers.pan_card_no == "NA" && (
                        <>
                          <InputTag
                            LName="Pan No"
                            {...register('pan_no')}
                            errorMsg={errors.pan_no?.message}
                            placeholder="Enter Pan No.  "
                            disabled={isDisabled}

                          />

                          <InputTag
                            LName="Upload Pan No"
                            {...register('pan_card_doc')}
                            type="file"
                            errorMsg={errors.pan_card_doc?.message}
                            disabled={isDisabled}

                          />
                        </>
                      )} */}
                      {(htConsumers.pan_card_no === "" || htConsumers.pan_card_no === "NA") && (
                        <>
                          <InputTag
                            LName="Pan No"
                            {...register("pan_no", {
                              required: "PAN No is required",
                              pattern: {
                                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                message: "PAN must be 10 characters (e.g. ABCDE1234F)",
                              },
                            })}
                            errorMsg={errors.pan_no?.message}
                            placeholder="Enter PAN No."
                            disabled={isDisabled}
                          />

                          <InputTag
                            LName="Upload PAN Card"
                            {...register("pan_card_doc", {
                              required: "PAN document is required",
                            })}
                            type="file"
                            errorMsg={errors.pan_card_doc?.message}
                            disabled={isDisabled}
                          />
                        </>
                      )}


                      <InputTag
                        LName="Upload GST Document"
                        {...register('gst_doc')}
                        type="file"
                        errorMsg={errors.gst_doc?.message}
                        disabled={isDisabled}

                      />
                      <InputTag
                        LName="Enter Other Document No"
                        {...register('uploaded_doc_no')}

                        placeholder="Enter Other Document No. "
                        errorMsg={errors.uploaded_doc_no?.message}
                        disabled={isDisabled}

                      />
                      <InputTag
                        LName="Enter Other Document Name"
                        {...register('uploaded_doc_name')}

                        placeholder="Enter Other Document Name "
                        errorMsg={errors.uploaded_doc_no?.message}
                        disabled={isDisabled}

                      />
                      <InputTag
                        LName="Upload Other Document."
                        {...register('upload_file')}
                        type="file"

                        errorMsg={errors.upload_file?.message}
                        disabled={isDisabled}

                      />


                    </div>
                    <br></br>
                    <strong>Note:</strong> Please merge the documents pdfs, if mulltiple documents to be upload.

                  </div>

                  {/* 🔴 IMPORTANT NOTE (ENGLISH + HINDI) */}
                  <div className="mt-4 p-4 border-l-4 border-red-500 bg-red-50 rounded">
                    <p className="text-sm text-red-700 font-semibold">
                      Important Note:
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      If the payment has been deducted against the online application, DO
                      NOT make same payment further until the deducted amount is refunded.
                    </p>

                    <p className="text-sm text-red-700 font-semibold mt-3">
                      महत्वपूर्ण टीप:
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      यदि ऑनलाइन आवेदन के विरुद्ध भुगतान काट लिया गया है, तो कटे हुए
                      राशि के वापस मिलने तक उसी भुगतान को फिर से न करें।
                    </p>
                  </div>


                  <div className="border-b border-gray-900/10 pb-12">
                    {/* <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                  Firm Document Details..
                </h2> */}
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-0">
                      <div className="col-span-8">
                        <div className="p-4 border rounded-lg shadow-sm bg-white">
                          {/* Checkbox with Declaration Heading */}
                          <div className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              name="agreeBtn"
                              {...register("agreeBtn", { required: "कृपया शर्तों से सहमत हों" })}
                              className="mt-1"
                            />
                            <label htmlFor="agreeBtn" className="font-semibold">
                              मैं यह घोषणा करता हूँ कि
                            </label>
                          </div>
                          {errors.agreeBtn && (
                            <p className="text-red-600 text-sm mt-1">{errors.agreeBtn.message}</p>
                          )}

                          {/* Instructions */}
                          <div className="mt-4 space-y-3 text-sm leading-6">
                            <div>
                              <span className="font-medium">1.</span> मेरे द्वारा आवेदन करते समय सभी जानकारियाँ सही प्रदान की गई हैं।
                              <div className="text-gray-600">
                                (All the information provided by me while applying is correct.)
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">2.</span>मैंने वर्तमान में लागू मध्य प्रदेश विद्युत आपूर्ति संहिता और उसके संशोधन को पढ़ लिया है और उसमें उल्लिखित
                              शर्तों का पालन करने के लिए सहमत हूँ।
                              <div className="text-gray-600">
                                (I have read the Madhya Pradesh Electricity Supply Code and amendment thereof and agree to abide by the
                                condition mentioned therein.)
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">3.</span> आवेदन करते समय जो जानकारियाँ मेरे द्वारा प्रदान की गई है, अगर इनमें से कोई भी जानकारी सत्यापन के
                              दौरान गलत / असत्य पाई जाती है तो मैं इसके लिये स्वयं जिम्मेदार रहूँगा ।
                              <div className="text-gray-600">
                                (The information provided by me is very correct and while applying; if any of the information is found
                                incorrect/false during verification then I will be responsible for it.)
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">4.</span> मेरे द्वारा आवेदन करते समय सभी आवश्यक दस्तावेज को स्पष्ट व सही तरीके से अपलोड किया गया है।
                              <div className="text-gray-600">
                                (While applying, all the necessary documents have been uploaded clearly and correctly by me.)
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">5.</span>मेरे किसी भी विद्युत संयोजन पर पहले से कोई बकाया राशि नहीं है।
                              <div className="text-gray-600">
                                (I do not have any outstanding dues on any of my electricity connections.)
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">6.</span>म.प्र.क्षे.वि.वि.कं.लि.भार परिवर्तन के अंतर्गत संदर्भ में जो भी सेवाएँ व शर्तें लागू होती हैं, मैं उनका पूर्ण
                              रूप से पालन करूँगा।
                              <div className="text-gray-600">
                                (I will fully comply with whatever services and conditions are applicable in the context under MPMKVVCL
                                “Load Change”.)
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">7.</span>यदि लोड और कनेक्शन के उद्देश्य में कोई परिवर्तन होता है, तो मैं अपनी नई आवश्यकता के अनुसार नया
                              आवेदन प्रस्तुत करूंगा। डिस्कॉम के पास पिछले आवेदन को रद्द करने और आवेदन के साथ जमा किए गए
                              पंजीकरण शुल्क को जब्त करने का अधिकार है।
                              <div className="text-gray-600">
                                (If there is any changes in the Load and purpose of connection, I will submit the new application as per my
                                new requirement. The Discom has rights to cancel the previous application and forfeit the registration
                                charges submitted with the application.)
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">8.</span>ऊर्जा की बचत किये जाने हेतु, मैं बिजली का व्यर्थ उपयोग नहीं करूँगा ।
                              <div className="text-gray-600">
                                (To save energy, I will not use electricity unnecessarily.)
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* --- OTP Verification Section --- */}
                  {otpSent ? (
                    <div className="border-b border-gray-900/10 pb-12 mt-5">
                      <h2 className="text-base font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                        Verify OTP
                      </h2>
                      <div className="mt-6 flex flex-col justify-center items-center">
                        <InputTag
                          placeholder="Enter OTP"
                          {...register("otp", { required: "OTP is required" })}
                          errorMsg={errors.otp?.message}
                        />
                        <div className="flex space-x-3 mt-3">
                          {/* <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={isBtnDisabled}
                            className={`px-4 py-2 rounded text-white ${isBtnDisabled
                              ? "bg-gray-400"
                              : "bg-green-600 hover:bg-green-700"
                              }`}
                          >
                            {isBtnDisabled ? "Verifying..." : "Verify OTP"}
                          </button> */}
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={isBtnDisabled}
                            className={`px-4 py-2 rounded text-white ${isBtnDisabled
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"}`}
                          >
                            {isBtnDisabled ? "Verifying..." : "Verify OTP"}
                          </button>
                          {/* <button
                            type="button"
                            onClick={handleReSendOtp}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Resend OTP
                          </button> */}
                          <button
                            type="button"
                            onClick={handleReSendOtp}
                            disabled={isBtnDisabled}
                            className={`px-4 py-2 rounded text-white ${isBtnDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                          >
                            {isBtnDisabled ? "Resending..." : "Resend OTP"}
                          </button>
                        </div>
                        {errors?.otpSuccess && (
                          <p className="text-green-500 text-sm mt-1">{errors?.otpSuccess?.message}</p>
                        )}
                        {errors?.otpStatus && (
                          <p className="text-red-500 text-sm mt-1">{errors?.otpStatus?.message}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-b border-gray-900/10 pb-12 mt-5">
                      <div className="flex justify-center items-center gap-2">
                        <button type='reset' className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-red-600 duration-300" onClick={() => reset()}>
                          Reset
                        </button>
                        {/* <button
                          type="submit"
                          disabled={isDisabled}
                          className="bg-orange-500 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button> */}
                        <button
                          type="submit"
                          disabled={isDisabled || isSendingOtp} // ✅ Disable when sending OTP
                          className={`bg-orange-500 text-white px-4 py-2 rounded ${isSendingOtp ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'}`}
                        >
                          {isSendingOtp ? 'Sending OTP...' : 'Save'} {/* ✅ Show loading text */}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className='w-1/5  p-4'></div>
      </div>

    </>
  );
}

export default ApplicantReg;

