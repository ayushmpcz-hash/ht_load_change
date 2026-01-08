// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { useSelector } from 'react-redux';
// // import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
// // import Cookies from 'js-cookie';
// // import { useForm } from 'react-hook-form';
// // import { ApplicantBasicDetails, SelectTag, InputTag, Button } from '../../importComponents'
// // import { responseOption, revertOption } from "../../newComponents/commonOption"
// // const LoadRegistrationFeePayment = () => {
// //   const officerData = useSelector(state => state.user.officerData);
// //   const location = useLocation()
// //   const { items } = location.state || {}
// //   console.log(items, "itemsssssssss")
// //   const { register, setError, clearErrors, watch, setValue, getValues, formState: { errors }, } = useForm({
// //     defaultValues: items || {}
// //   })

// //   const token = Cookies.get("accessToken");

// //   // States
// //   const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
// //   const [showOtpBtn, setShowOtpBtn] = useState(false);
// //   const [formDataValue, setFormDataValue] = useState(null);
// //   const [isDisabled, setIsDisabled] = useState(false);
// //   const [isBtnDisabled, setBtnIsDisabled] = useState(false);
// //   const work_completion_response = watch("work_completion_response")
// //   setValue('registration_amount', items?.tariff_charges?.total_pay_amount)
// //   //  const handleSendOtp = async formData => {
// //   //     setFormDataValue(formData);
// //   //     const sentOtp = await sendOtpNew(mobileNo);
// //   //     if (sentOtp.success) {
// //   //       setShowOtpBtn(true);
// //   //       setIsDisabled(true);
// //   //       setError('otpSuccess', {
// //   //         type: 'manual',
// //   //         message: sentOtp.message,
// //   //       });
// //   //     } else {
// //   //       setError('otpStatus', {
// //   //         type: 'manual',
// //   //         message: sentOtp.message,
// //   //       });
// //   //     }
// //   //   };
// //   //   const handleVerifyOtp = async () => {
// //   //     const otpValue = getValues('otp');
// //   //     setBtnIsDisabled(true);
// //   //     const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);
// //   //     if (verifyOtpResponse.success) {
// //   //       handleFinalSubmit();
// //   //     } else {
// //   //       setError('otp', {
// //   //         type: 'manual',
// //   //         message: verifyOtpResponse.error,
// //   //       });
// //   //       setBtnIsDisabled(false);
// //   //     }
// //   //   };
// //   //   const handleReSendOtp = async () => {
// //   //     clearErrors('otpSuccess');
// //   //     const sentOtp = await sendOtpNew(mobileNo);
// //   //     setShowOtpBtn(true);
// //   //     if (sentOtp) {
// //   //       setError('otpSuccess', {
// //   //         type: 'manual',
// //   //         message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
// //   //       });
// //   //     } else {
// //   //       setError('otp', {
// //   //         type: 'manual',
// //   //         message: `Failed to send OTP on ****${mobileNo.slice(-4)}`,
// //   //       });
// //   //     }
// //   //   };

// //   //   const handleFinalSubmit = async () => {
// //   //     try {
// //   //       const formValue = fromDataValue;
// //   //       const formData = new FormData();

// //   //       Object.keys(formValue).forEach(key => {
// //   //         if (formValue[key] instanceof FileList) {
// //   //           if (formValue[key].length > 0) {
// //   //             formData.append(key, formValue[key][0]);
// //   //           }
// //   //         } else {
// //   //           formData.append(key, formValue[key]);
// //   //         }
// //   //       });
// //   //       const { data } = await axios.post('/ht_load_change/demand-note/', formData, {
// //   //         headers: {
// //   //           // 'Content-Type': 'application/json',
// //   //           Authorization: `Bearer ${token}`,
// //   //         },
// //   //       });
// //   //       const { data: apiData, ...rest } = data;
// //   //       alert('Demand Note submitted successfully ✅');
// //   //       navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
// //   //     } catch (error) {
// //   //       console.error('API Error:', error);
// //   //       alert('Something went wrong ❌');

// //   //     }finally{
// //   //       setBtnIsDisabled(false)

// //   //     }
// //   //   };
// //   console.log(officerData?.employee_detail.role !== 3, 'officerDataaaINSIDE REGISTRATRION')

// //   return (
// //     <>
// //       <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
// //         HT Load Change {items.application_status_text}
// //       </h2>
// //       <div className="mt-6 overflow-x-auto">
// //         <form >
// //           <div className="body p-4">
// //             {officerData?.employee_detail?.role}
// //             { }
// //             <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
// //             {officerData?.employee_detail.role !== 3 && (
// //               <>
// //                 <div className="border-b border-gray-900/10 pb-12">
// //                   <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
// //                     {items.application_status_text}
// //                   </h2>
// //                   <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
// //                     {

// //                         items.application_status === 1 && (
// //                           <>
// //                         <InputTag
// //                           LName="Registration Amount"
// //                           {...register("registration_amount",)}
// //                           errorMsg={errors.registration_amount?.message}
// //                           disabled={isDisabled}
// //                         />
// //                         <Button label="Pay Registration" />
// //                         </>
// //                         )

// //                     }


// //                     <div className="flex flex-wrap gap-4 ">
// //                       <button
// //                         type="button"
// //                         className="flex-1 bg-purple-700 text-white py-2 rounded uppercase text-sm font-semibold hover:bg-purple-800 transition"
// //                       >
// //                         <Link to={`/ht-load-change/update/${items?.application_no}`} state={{ data: items }}>
// //                           Update Application
// //                         </Link>
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>

// //               </>
// //             )}

// //           </div>
// //         </form>
// //       </div>
// //     </>
// //   );
// // };
// // export default LoadRegistrationFeePayment;

// // LoadRegistrationFeePayment.jsx (updated: ensures modal form autofill; uses ApplicantFillDetails identical to ApplicantReg)
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { useForm } from 'react-hook-form';
// import {
//   ApplicantFillDetails,
//   ApplicantBasicDetails,
//   SelectTag,
//   InputTag,
// } from '../../importComponents';
// import { TypeOfValue } from '../../newComponents/commonOption';
// import {
//   handleSupplyVoltage,
//   contractDemandRange,
//   checkLoadReductionDate,
//   validateContractDemand,
// } from '../../../utils/handleLogicLoad.js';
// import { HT_LOAD_CHANGE_BASE } from '../../../api/api.js';

// const LoadRegistrationFeePayment = () => {
//   const officerData = useSelector((s) => s.user.officerData);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id: routeId } = useParams(); // this route is /user-dashboard/pending_for_application_resubmission/:id
//   const token = Cookies.get('accessToken');

//   // items may be passed via location.state.items (original flow) — fallback to fetched
//   const incomingItems = location.state?.items || location.state?.data || null;
//   console.log(officerData, 'officerDataaaaa')
//   // Local state
//   const [items, setItems] = useState(incomingItems || null);
//   const [htConsumers, setHtConsumer] = useState({});
//   const [openModal, setOpenModal] = useState(false);
//   const [loadingUpdate, setLoadingUpdate] = useState(false);
//   const [serverError, setServerError] = useState('');
//   const [subTypeOfChange, setSubTypeOfChange] = useState([]);
//   const [supplyVoltageOptions, setSupplyVoltageOptions] = useState([]);
//   const [isLocked, setIsLocked] = useState(false);
//   const [loadReductionApply, setLoadReductionApply] = useState('');
//   const [totalYearConn] = useState('');

//   // which fields are editable in resubmission
//   const editableInPending = new Set([
//     'ac_holder_name',
//     'bank_name',
//     'bank_ifsc_code',
//     'bank_ac_no',
//     'bank_docs',
//     'pan_card_doc',
//     'gst_doc',
//     'upload_file',
//     'pan_no',
//     'uploaded_doc_no',
//     'uploaded_doc_name',
//   ]);

//   // form (same field names as ApplicantReg)
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     getValues,
//     setError,
//     clearErrors,
//     formState: { errors },
//   } = useForm({ defaultValues: {} });

//   const typeOfChange = watch('type_of_change');
//   const SubTypeOfChange = watch('lc_type');
//   const SupplyVoltage = watch('new_supply_voltage');
//   const ContractDemand = watch('new_contact_demand');

//   // If back-navigation passed successMessage show alert (keeps old behavior)
//   useEffect(() => {
//     if (location.state?.successMessage) {
//       alert(location.state.successMessage);
//       window.history.replaceState({}, document.title);
//     }
//   }, [location]);

//   // Helper: fetch application by id from backend (fallback)
//   const fetchApplicationById = async (idToFetch) => {
//     try {
//       const url = `${HT_LOAD_CHANGE_BASE}/get-load-change-application/`;
//       const params = {};
//       // backend might accept id param
//       if (idToFetch) params.id = idToFetch;
//       console.log(params, 'payloaddd')
//       const resp = await axios.get(url, { params });
//       // adapt depending on response shape
//       return resp?.data?.data ?? resp?.data ?? null;
//     } catch (err) {
//       console.error('fetchApplicationById err', err);
//       return null;
//     }
//   };

//   // prepare and reset form with mapped values (atomic reset)
//   const prepareAndResetForm = (raw) => {
//     if (!raw) return;
//     setHtConsumer(raw);
//     // map server keys to form keys exactly like ApplicantReg expects
//     const mapped = {
//       ...raw,
//       pan_no: raw?.pan_card_no ?? raw?.pan_no ?? '',
//       purpose_of_installation_details:
//         raw?.purpose_of_installation_details ?? raw?.purpose_of_installation ?? '',
//       new_contact_demand: raw?.new_contact_demand ?? '',
//       contract_demand_difference: raw?.contract_demand_difference ?? '',
//       // leave file inputs undefined to keep browser happy
//       bank_docs: undefined,
//       pan_card_doc: undefined,
//       gst_doc: undefined,
//       upload_file: undefined,
//     };

//     // atomic set of all fields
//     reset(mapped);

//     // explicitly set some watched fields so dependent effects run
//     setValue('type_of_change', mapped.type_of_change);
//     setValue('lc_type', mapped.lc_type);
//     setValue('new_supply_voltage', mapped.new_supply_voltage);
//     setValue('new_contact_demand', mapped.new_contact_demand);
//     setValue('contract_demand_difference', mapped.contract_demand_difference);
//     setValue('purpose_of_installation_details', mapped.purpose_of_installation_details);

//     // compute subtype & supply options (same logic as ApplicantReg)
//     if (mapped.type_of_change === 'Load_Enhancement') {
//       setSubTypeOfChange(TypeOfValue.enhancementOptions);
//     } else if (mapped.type_of_change === 'Load_Reduction') {
//       setSubTypeOfChange(TypeOfValue.reductionOptions);
//       const lr = checkLoadReductionDate(mapped);
//       if (lr?.Load_Reduction) setLoadReductionApply(lr);
//     } else {
//       setSubTypeOfChange([]);
//     }

//     try {
//       const supplyOpts = handleSupplyVoltage(mapped.existing_supply_voltage, mapped.lc_type);
//       setSupplyVoltageOptions(supplyOpts || []);
//     } catch (e) {
//       setSupplyVoltageOptions([]);
//     }

//     setIsLocked(mapped.lc_type === 'Only_Voltage_Upgrade');
//   };

//   // When modal opens, ensure we have items (either incoming or fetched) and populate form
//   const openUpdateModal = async () => {
//     let source = items;
//     if (!source) {
//       // try routeId (param) fallback
//       const idToFetch = routeId || (location.state && (location.state.id || location.state.application_id));
//       if (idToFetch) {
//         const fetched = await fetchApplicationById(idToFetch);
//         if (fetched) {
//           source = fetched;
//           setItems(fetched);
//         }
//       }
//     }

//     if (!source) {
//       alert('Application data not available.');
//       return;
//     }

//     prepareAndResetForm(source);
//     setServerError('');
//     setOpenModal(true);
//   };

//   // keep same interdependent logic as ApplicantReg for selects/locking
//   useEffect(() => {
//     if (typeOfChange === 'Load_Enhancement') {
//       if (htConsumers.LoadEnhancement) {
//         setSubTypeOfChange(TypeOfValue.enhancementOptions);
//       } else {
//         // optional: show modal/alert
//       }
//     } else if (typeOfChange === 'Load_Reduction') {
//       setSubTypeOfChange(TypeOfValue.reductionOptions);
//       const lr = checkLoadReductionDate(htConsumers);
//       if (lr?.Load_Reduction) setLoadReductionApply(lr);
//     } else {
//       setSubTypeOfChange([]);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [typeOfChange]);

//   useEffect(() => {
//     if (SupplyVoltage) {
//       if (SubTypeOfChange === 'Only_Voltage_Upgrade') {
//         setValue('contract_demand_difference', 0);
//         setValue('new_contact_demand', htConsumers?.existing_contract_demand ?? '');
//         setIsLocked(true);
//         const contract_demand = contractDemandRange(SupplyVoltage, htConsumers?.existing_contract_demand);
//         if (contract_demand) {
//           setValue('new_contact_demand', '');
//           setValue('contract_demand_difference', '');
//           setError('new_contact_demand', { type: 'manual', message: contract_demand });
//         }
//       } else {
//         setIsLocked(false);
//         clearErrors('new_contact_demand');
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [SupplyVoltage, SubTypeOfChange]);

//   useEffect(() => {
//     if (ContractDemand && typeOfChange && SubTypeOfChange && SupplyVoltage) {
//       const handler = setTimeout(() => {
//         const contract_demand = contractDemandRange(SupplyVoltage, ContractDemand);
//         const demandError = validateContractDemand(
//           typeOfChange,
//           ContractDemand,
//           SubTypeOfChange,
//           htConsumers,
//           totalYearConn,
//           loadReductionApply
//         );
//         let contractDeffres = Math.abs(ContractDemand - Number(htConsumers.existing_contract_demand || 0));
//         setValue('contract_demand_difference', contractDeffres);

//         if (contract_demand) {
//           setError('new_contact_demand', { type: 'manual', message: contract_demand });
//           setValue('contract_demand_difference', '');
//           setValue('new_contact_demand', '');
//         } else if (demandError) {
//           setError('new_contact_demand', { type: 'manual', message: demandError });
//           setValue('contract_demand_difference', '');
//           setValue('new_contact_demand', '');
//         } else {
//           clearErrors('new_contact_demand');
//         }
//       }, 600);

//       return () => clearTimeout(handler);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ContractDemand]);

//   const getDisabled = (fieldName) => {
//     return !editableInPending.has(fieldName);
//   };

//   const buildFormData = (values) => {
//     const fd = new FormData();

//     Object.keys(values).forEach((key) => {
//       const newVal = values[key];
//       const originalVal = htConsumers[key];
//       const shouldInclude =

//         editableInPending.has(key) ||

//         key === 'bank_docs' ||
//         key === 'pan_card_doc' ||
//         key === 'gst_doc' ||
//         key === 'upload_file' ||

//         newVal !== originalVal;

//       if (!shouldInclude) {
//         return;
//       }


//       if (newVal instanceof FileList) {
//         if (newVal.length > 0) {
//           fd.append(key, newVal[0]);
//         }

//         else if (originalVal && typeof originalVal === 'string') {
//           fd.append(key, originalVal);
//         }
//       }

//       else if (newVal !== undefined) {
//         fd.append(key, newVal === null ? '' : newVal);
//       }
//     });

//     const appNo = items?.application_no;
//     if (appNo) {
//       fd.append('application_no', appNo);
//       fd.append('application_no', appNo);
//     }

//     if (items?.id) fd.append('id', items.id);

//     return fd;
//   };

//   const onModalSubmit = async (vals) => {
//     setServerError('');
//     setLoadingUpdate(true);
//     try {
//       const fd = buildFormData(vals);


//       console.log('FormData contents:');
//       for (let [key, value] of fd.entries()) {
//         console.log(key, ':', value);
//       }

//       const appNo = items?.application_no;
//       if (!appNo) throw new Error('Application number missing.');

//       const url = `${HT_LOAD_CHANGE_BASE}/update-load-change-application/?application_no=${appNo}`;

//       const headers = {
//         'Content-Type': 'multipart/form-data'
//       };
//       if (token) headers.Authorization = `Bearer ${token}`;

//       fd.append('application_no', appNo);

//       const resp = await axios.put(url, fd, { headers });

//       // Success handling
//      navigate(`/user-dashboard/success-respones/${items?.id || routeId}`, {
//   state: {
//     title: "Application Updated",
//     message: "Application updated successfully!",
//     subMessage: "Your changes have been saved successfully",
//     showDashboard: true,
//     showPending: true,
//     pendingRoute: "/user-dashboard",
//   },
// });


//     } catch (err) {
//       console.error('Update error:', err.response || err);
//       setServerError(
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         err?.message ||
//         'Update failed!'
//       );
//     } finally {
//       setLoadingUpdate(false);
//       setOpenModal(false);
//     }
//   };
//   return (
//     <>
//       <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//         HT Load Change {items?.application_status_text}
//       </h2>

//       <div className="mt-6 overflow-x-auto">
//         <div className="body p-4">
//           <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />

//           {items?.application_status === 2 && officerData?.employee_detail.role !== 3 && (
//             <div className="border-b border-gray-900/10 pb-12 mt-4">
//               <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//                 {items?.application_status_text}
//               </h2>


//               <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                 <div className="flex flex-wrap gap-4 col-span-8 mt-4">
//                   <button
//                     type="button"
//                     onClick={openUpdateModal}
//                     className="w-[200px] flex-none cursor-pointer bg-purple-700 text-white py-2 rounded uppercase text-sm font-semibold hover:bg-purple-800 transition"
//                   >
//                     Update Application
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {openModal && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-auto">
//           <div className="bg-white w-full max-w-5xl rounded-md shadow-xl my-8">
//             <div className="flex items-center justify-between px-4 py-3 border-b">
//               <h3 className="text-lg font-semibold">HT Load Change Application Update</h3>
//               <div>
//                 <button onClick={() => setOpenModal(false)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
//                   Close
//                 </button>
//               </div>
//             </div>

//             <div className="p-4">
//               <form onSubmit={handleSubmit(onModalSubmit)}>
//                 <div className="space-y-6">
//                   {/* ApplicantFillDetails exactly as ApplicantReg */}
//                   <ApplicantFillDetails htConsumers={htConsumers} register={register} errors={errors} isUpdatePage={true} />

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
//                         disabled={getDisabled('type_of_change')}
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
//                         disabled={getDisabled('lc_type')}
//                       />
//                       <SelectTag
//                         LName="New Supply Voltage"
//                         options={supplyVoltageOptions}
//                         {...register('new_supply_voltage', {
//                           required: 'Please Select New Supply Voltage is required',
//                         })}
//                         errorMsg={errors.new_supply_voltage?.message}
//                         labelKey="label"
//                         valueKey="value"
//                         disabled={getDisabled('new_supply_voltage')}
//                       />
//                       <InputTag
//                         LName="Total Required Contract Demand(in KVA)"
//                         type={'number'}
//                         placeholder="Please Enter New Contract Demand "
//                         {...register('new_contact_demand', {
//                           required: 'New Contract Demand is required',
//                         })}
//                         errorMsg={errors.new_contact_demand?.message}
//                         disabled={getDisabled('new_contact_demand')}
//                         readOnly={isLocked}
//                       />
//                       <InputTag
//                         LName="Contract Demand Difference"
//                         type={'number'}
//                         {...register('contract_demand_difference', {
//                           required: true,
//                         })}
//                         errorMsg={errors.contract_demand_difference?.message}
//                         disabled={getDisabled('contract_demand_difference')}
//                         readOnly={isLocked}
//                       />
//                       <InputTag
//                         LName="Purpose Of Installation (Optional)"
//                         {...register('purpose_of_installation_details')}
//                         placeholder="Please Enter Purpose Of Installation Details"
//                         errorMsg={errors.purpose_of_installation_details?.message}
//                         disabled={getDisabled('purpose_of_installation_details')}
//                       />
//                     </div>
//                   </div>

//                   {/* Bank Details */}
//                   <div className="border-b border-gray-900/10 pb-12">
//                     <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">Bank Details..</h2>
//                     <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                       <InputTag LName="Account Holder Name" {...register('ac_holder_name')} errorMsg={errors.ac_holder_name?.message} placeholder="Please Enter Account Holder Name" disabled={getDisabled('ac_holder_name')} />
//                       <InputTag LName="Bank Name" {...register('bank_name')} errorMsg={errors.bank_name?.message} placeholder="Please Enter Bank Name" disabled={getDisabled('bank_name')} />
//                       <InputTag LName="Bank IFSC Code" {...register('bank_ifsc_code')} errorMsg={errors.bank_ifsc_code?.message} placeholder="Please Enter Bank IFSC Code" disabled={getDisabled('bank_ifsc_code')} />
//                       <InputTag LName="Bank Account Number" {...register('bank_ac_no')} errorMsg={errors.bank_ac_no?.message} placeholder="Please Enter Bank Account Number" disabled={getDisabled('bank_ac_no')} />
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">Upload Bank Passbook/Cheque</label>
//                         <input type="file" {...register('bank_docs')} className="mt-1 block w-full" />
//                         {items?.bank_docs && <div className="text-sm mt-1">Existing: <a href={items.bank_docs} target="_blank" rel="noreferrer" className="underline">View</a></div>}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Firm Docs */}
//                   <div className="border-b border-gray-900/10 pb-12">
//                     <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">Firm Document Details..</h2>
//                     <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                       {(items?.pan_card_no === '' || items?.pan_card_no === 'NA') && (
//                         <>
//                           <InputTag LName="Pan No" {...register('pan_no')} errorMsg={errors.pan_no?.message} placeholder="Enter Pan No." disabled={getDisabled('pan_no')} />
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Upload Pan</label>
//                             <input type="file" {...register('pan_card_doc')} className="mt-1 block w-full" />
//                             {items?.pan_card_doc && <div className="text-sm mt-1">Existing: <a href={items.pan_card_doc} target="_blank" rel="noreferrer" className="underline">View</a></div>}
//                           </div>
//                         </>
//                       )}

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">Upload GST Document</label>
//                         <input type="file" {...register('gst_doc')} className="mt-1 block w-full" />
//                         {items?.gst_doc && <div className="text-sm mt-1">Existing: <a href={items.gst_doc} target="_blank" rel="noreferrer" className="underline">View</a></div>}
//                       </div>

//                       <InputTag LName="Enter Other Document No" {...register('uploaded_doc_no')} placeholder="Enter Other Document No." errorMsg={errors.uploaded_doc_no?.message} disabled={getDisabled('uploaded_doc_no')} />
//                       <InputTag LName="Enter Other Document Name" {...register('uploaded_doc_name')} placeholder="Enter Other Document Name" errorMsg={errors.uploaded_doc_name?.message} disabled={getDisabled('uploaded_doc_name')} />

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">Upload Other Document</label>
//                         <input type="file" {...register('upload_file')} className="mt-1 block w-full" />
//                         {items?.upload_file && <div className="text-sm mt-1">Existing: <a href={items.upload_file} target="_blank" rel="noreferrer" className="underline">View</a></div>}
//                       </div>
//                     </div>

//                     <br />
//                     <strong>Note:</strong> Please merge the documents pdfs, if multiple documents to be upload.
//                   </div>

//                   {serverError && <div className="text-red-600">{serverError}</div>}

//                   <div className="flex justify-end gap-3">
//                     <button type="button" onClick={() => setOpenModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
//                     <button type="submit" disabled={loadingUpdate} className={`px-4 py-2 rounded text-white ${loadingUpdate ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
//                       {loadingUpdate ? 'Updating...' : 'Update Application'}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default LoadRegistrationFeePayment;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { useForm } from 'react-hook-form';
// import { ApplicantBasicDetails, SelectTag, InputTag, Button } from '../../importComponents'
// import { responseOption, revertOption } from "../../newComponents/commonOption"
// const LoadRegistrationFeePayment = () => {
//   const officerData = useSelector(state => state.user.officerData);
//   const location = useLocation()
//   const { items } = location.state || {}
//   console.log(items, "itemsssssssss")
//   const { register, setError, clearErrors, watch, setValue, getValues, formState: { errors }, } = useForm({
//     defaultValues: items || {}
//   })

//   const token = Cookies.get("accessToken");

//   // States
//   const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
//   const [showOtpBtn, setShowOtpBtn] = useState(false);
//   const [formDataValue, setFormDataValue] = useState(null);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [isBtnDisabled, setBtnIsDisabled] = useState(false);
//   const work_completion_response = watch("work_completion_response")
//   setValue('registration_amount', items?.tariff_charges?.total_pay_amount)
//   //  const handleSendOtp = async formData => {
//   //     setFormDataValue(formData);
//   //     const sentOtp = await sendOtpNew(mobileNo);
//   //     if (sentOtp.success) {
//   //       setShowOtpBtn(true);
//   //       setIsDisabled(true);
//   //       setError('otpSuccess', {
//   //         type: 'manual',
//   //         message: sentOtp.message,
//   //       });
//   //     } else {
//   //       setError('otpStatus', {
//   //         type: 'manual',
//   //         message: sentOtp.message,
//   //       });
//   //     }
//   //   };
//   //   const handleVerifyOtp = async () => {
//   //     const otpValue = getValues('otp');
//   //     setBtnIsDisabled(true);
//   //     const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);
//   //     if (verifyOtpResponse.success) {
//   //       handleFinalSubmit();
//   //     } else {
//   //       setError('otp', {
//   //         type: 'manual',
//   //         message: verifyOtpResponse.error,
//   //       });
//   //       setBtnIsDisabled(false);
//   //     }
//   //   };
//   //   const handleReSendOtp = async () => {
//   //     clearErrors('otpSuccess');
//   //     const sentOtp = await sendOtpNew(mobileNo);
//   //     setShowOtpBtn(true);
//   //     if (sentOtp) {
//   //       setError('otpSuccess', {
//   //         type: 'manual',
//   //         message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
//   //       });
//   //     } else {
//   //       setError('otp', {
//   //         type: 'manual',
//   //         message: `Failed to send OTP on ****${mobileNo.slice(-4)}`,
//   //       });
//   //     }
//   //   };

//   //   const handleFinalSubmit = async () => {
//   //     try {
//   //       const formValue = fromDataValue;
//   //       const formData = new FormData();

//   //       Object.keys(formValue).forEach(key => {
//   //         if (formValue[key] instanceof FileList) {
//   //           if (formValue[key].length > 0) {
//   //             formData.append(key, formValue[key][0]);
//   //           }
//   //         } else {
//   //           formData.append(key, formValue[key]);
//   //         }
//   //       });
//   //       const { data } = await axios.post('/ht_load_change/demand-note/', formData, {
//   //         headers: {
//   //           // 'Content-Type': 'application/json',
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       });
//   //       const { data: apiData, ...rest } = data;
//   //       alert('Demand Note submitted successfully ✅');
//   //       navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
//   //     } catch (error) {
//   //       console.error('API Error:', error);
//   //       alert('Something went wrong ❌');

//   //     }finally{
//   //       setBtnIsDisabled(false)

//   //     }
//   //   };
//   console.log(officerData?.employee_detail.role !== 3, 'officerDataaaINSIDE REGISTRATRION')

//   return (
//     <>
//       <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//         HT Load Change {items.application_status_text}
//       </h2>
//       <div className="mt-6 overflow-x-auto">
//         <form >
//           <div className="body p-4">
//             {officerData?.employee_detail?.role}
//             { }
//             <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
//             {officerData?.employee_detail.role !== 3 && (
//               <>
//                 <div className="border-b border-gray-900/10 pb-12">
//                   <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
//                     {items.application_status_text}
//                   </h2>
//                   <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                     {

//                         items.application_status === 1 && (
//                           <>
//                         <InputTag
//                           LName="Registration Amount"
//                           {...register("registration_amount",)}
//                           errorMsg={errors.registration_amount?.message}
//                           disabled={isDisabled}
//                         />
//                         <Button label="Pay Registration" />
//                         </>
//                         )

//                     }


//                     <div className="flex flex-wrap gap-4 ">
//                       <button
//                         type="button"
//                         className="flex-1 bg-purple-700 text-white py-2 rounded uppercase text-sm font-semibold hover:bg-purple-800 transition"
//                       >
//                         <Link to={`/ht-load-change/update/${items?.application_no}`} state={{ data: items }}>
//                           Update Application
//                         </Link>
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//               </>
//             )}

//           </div>
//         </form>
//       </div>
//     </>
//   );
// };
// export default LoadRegistrationFeePayment;

// LoadRegistrationFeePayment.jsx (updated: ensures modal form autofill; uses ApplicantFillDetails identical to ApplicantReg)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import {
  ApplicantFillDetails,
  ApplicantBasicDetails,
  SelectTag,
  InputTag,
} from '../../importComponents';
import { TypeOfValue } from '../../newComponents/commonOption';
import {
  handleSupplyVoltage,
  contractDemandRange,
  checkLoadReductionDate,
  validateContractDemand,
} from '../../../utils/handleLogicLoad.js';
import { HT_LOAD_CHANGE_BASE } from '../../../api/api.js';

const LoadRegistrationFeePayment = () => {
  const officerData = useSelector((s) => s.user.officerData);
  const location = useLocation();
  const navigate = useNavigate();
  const { id: routeId } = useParams(); // this route is /user-dashboard/pending_for_application_resubmission/:id
  const token = Cookies.get('accessToken');

  // items may be passed via location.state.items (original flow) — fallback to fetched
  const incomingItems = location.state?.items || location.state?.data || null;
  console.log(officerData, 'officerDataaaaa')
  // Local state
  const [items, setItems] = useState(incomingItems || null);
  const [htConsumers, setHtConsumer] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [serverError, setServerError] = useState('');
  const [subTypeOfChange, setSubTypeOfChange] = useState([]);
  const [supplyVoltageOptions, setSupplyVoltageOptions] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [loadReductionApply, setLoadReductionApply] = useState('');
  const [totalYearConn] = useState('');

  // which fields are editable in resubmission
  const editableInPending = new Set([
    'ac_holder_name',
    'bank_name',
    'bank_ifsc_code',
    'bank_ac_no',
    'bank_docs',
    'pan_card_doc',
    'gst_doc',
    'upload_file',
    'pan_no',
    'uploaded_doc_no',
    'uploaded_doc_name',
  ]);

  // form (same field names as ApplicantReg)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues: {} });

  const typeOfChange = watch('type_of_change');
  const SubTypeOfChange = watch('lc_type');
  const SupplyVoltage = watch('new_supply_voltage');
  const ContractDemand = watch('new_contact_demand');

  // If back-navigation passed successMessage show alert (keeps old behavior)
  useEffect(() => {
    if (location.state?.successMessage) {
      alert(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Helper: fetch application by id from backend (fallback)
  const fetchApplicationById = async (idToFetch) => {
    try {
      const url = `${HT_LOAD_CHANGE_BASE}/get-load-change-application/`;
      const params = {};
      // backend might accept id param
      if (idToFetch) params.id = idToFetch;
      console.log(params, 'payloaddd')
      const resp = await axios.get(url, { params });
      // adapt depending on response shape
      return resp?.data?.data ?? resp?.data ?? null;
    } catch (err) {
      console.error('fetchApplicationById err', err);
      return null;
    }
  };

  // prepare and reset form with mapped values (atomic reset)
  const prepareAndResetForm = (raw) => {
    if (!raw) return;
    setHtConsumer(raw);
    // map server keys to form keys exactly like ApplicantReg expects
    const mapped = {
      ...raw,
      pan_no: raw?.pan_card_no ?? raw?.pan_no ?? '',
      purpose_of_installation_details:
        raw?.purpose_of_installation_details ?? raw?.purpose_of_installation ?? '',
      new_contact_demand: raw?.new_contact_demand ?? '',
      contract_demand_difference: raw?.contract_demand_difference ?? '',
      // leave file inputs undefined to keep browser happy
      bank_docs: undefined,
      pan_card_doc: undefined,
      gst_doc: undefined,
      upload_file: undefined,
    };

    // atomic set of all fields
    reset(mapped);

    // explicitly set some watched fields so dependent effects run
    setValue('type_of_change', mapped.type_of_change);
    setValue('lc_type', mapped.lc_type);
    setValue('new_supply_voltage', mapped.new_supply_voltage);
    setValue('new_contact_demand', mapped.new_contact_demand);
    setValue('contract_demand_difference', mapped.contract_demand_difference);
    setValue('purpose_of_installation_details', mapped.purpose_of_installation_details);

    // compute subtype & supply options (same logic as ApplicantReg)
    if (mapped.type_of_change === 'Load_Enhancement') {
      setSubTypeOfChange(TypeOfValue.enhancementOptions);
    } else if (mapped.type_of_change === 'Load_Reduction') {
      setSubTypeOfChange(TypeOfValue.reductionOptions);
      const lr = checkLoadReductionDate(mapped);
      if (lr?.Load_Reduction) setLoadReductionApply(lr);
    } else {
      setSubTypeOfChange([]);
    }

    try {
      const supplyOpts = handleSupplyVoltage(mapped.existing_supply_voltage, mapped.lc_type);
      setSupplyVoltageOptions(supplyOpts || []);
    } catch (e) {
      setSupplyVoltageOptions([]);
    }

    setIsLocked(mapped.lc_type === 'Only_Voltage_Upgrade');
  };

  // When modal opens, ensure we have items (either incoming or fetched) and populate form
  const openUpdateModal = async () => {
    let source = items;
    if (!source) {
      // try routeId (param) fallback
      const idToFetch = routeId || (location.state && (location.state.id || location.state.application_id));
      if (idToFetch) {
        const fetched = await fetchApplicationById(idToFetch);
        if (fetched) {
          source = fetched;
          setItems(fetched);
        }
      }
    }

    if (!source) {
      alert('Application data not available.');
      return;
    }

    prepareAndResetForm(source);
    setServerError('');
    setOpenModal(true);
  };

  // keep same interdependent logic as ApplicantReg for selects/locking
  useEffect(() => {
    if (typeOfChange === 'Load_Enhancement') {
      if (htConsumers.LoadEnhancement) {
        setSubTypeOfChange(TypeOfValue.enhancementOptions);
      } else {
        // optional: show modal/alert
      }
    } else if (typeOfChange === 'Load_Reduction') {
      setSubTypeOfChange(TypeOfValue.reductionOptions);
      const lr = checkLoadReductionDate(htConsumers);
      if (lr?.Load_Reduction) setLoadReductionApply(lr);
    } else {
      setSubTypeOfChange([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeOfChange]);

  useEffect(() => {
    if (SupplyVoltage) {
      if (SubTypeOfChange === 'Only_Voltage_Upgrade') {
        setValue('contract_demand_difference', 0);
        setValue('new_contact_demand', htConsumers?.existing_contract_demand ?? '');
        setIsLocked(true);
        const contract_demand = contractDemandRange(SupplyVoltage, htConsumers?.existing_contract_demand);
        if (contract_demand) {
          setValue('new_contact_demand', '');
          setValue('contract_demand_difference', '');
          setError('new_contact_demand', { type: 'manual', message: contract_demand });
        }
      } else {
        setIsLocked(false);
        clearErrors('new_contact_demand');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SupplyVoltage, SubTypeOfChange]);

  useEffect(() => {
    if (ContractDemand && typeOfChange && SubTypeOfChange && SupplyVoltage) {
      const handler = setTimeout(() => {
        const contract_demand = contractDemandRange(SupplyVoltage, ContractDemand);
        const demandError = validateContractDemand(
          typeOfChange,
          ContractDemand,
          SubTypeOfChange,
          htConsumers,
          totalYearConn,
          loadReductionApply
        );
        let contractDeffres = Math.abs(ContractDemand - Number(htConsumers.existing_contract_demand || 0));
        setValue('contract_demand_difference', contractDeffres);

        if (contract_demand) {
          setError('new_contact_demand', { type: 'manual', message: contract_demand });
          setValue('contract_demand_difference', '');
          setValue('new_contact_demand', '');
        } else if (demandError) {
          setError('new_contact_demand', { type: 'manual', message: demandError });
          setValue('contract_demand_difference', '');
          setValue('new_contact_demand', '');
        } else {
          clearErrors('new_contact_demand');
        }
      }, 600);

      return () => clearTimeout(handler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractDemand]);

  const getDisabled = (fieldName) => {
    return !editableInPending.has(fieldName);
  };



  const onModalSubmit = async (vals) => {
    setServerError('');
    setLoadingUpdate(true);
    try {
      const fd = buildFormData(vals);


      console.log('FormData contents:');
      for (let [key, value] of fd.entries()) {
        console.log(key, ':', value);
      }

      const appNo = items?.application_no;
      if (!appNo) throw new Error('Application number missing.');

      const url = `${HT_LOAD_CHANGE_BASE}/update-load-change-application/?application_no=${appNo}`;

      const headers = {
        'Content-Type': 'multipart/form-data'
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      fd.append('application_no', appNo);

      const resp = await axios.put(url, fd, { headers });

      // Success handling
      navigate(`/user-dashboard/success-respones/${items?.id || routeId}`, {
        state: {
          title: "Application Updated",
          message: "Application updated successfully!",
          subMessage: "Your changes have been saved successfully",
          showDashboard: true,
          showPending: true,
          pendingRoute: "/user-dashboard",
        },
      });


    } catch (err) {
      console.error('Update error:', err.response || err);
      setServerError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Update failed!'
      );
    } finally {
      setLoadingUpdate(false);
      setOpenModal(false);
    }
  };

  const buildFormData = (values) => {
    const fd = new FormData();

    Object.keys(values).forEach((key) => {
      // For document fields, check if a new file was selected
      const documentFields = ['bank_docs', 'pan_card_doc', 'gst_doc', 'upload_file'];

      if (documentFields.includes(key)) {
        // If a new file is selected, use it
        if (values[key] && values[key][0] instanceof File) {
          fd.append(key, values[key][0]);
        }
        // If no new file selected but we have existing document, keep it
        else if (htConsumers[key]) {
          // Keep existing document URL in form data
          fd.append(key, htConsumers[key]);
        }
      } else {
        // For non-document fields
        const newVal = values[key];
        const originalVal = htConsumers[key];
        const shouldInclude = editableInPending.has(key) || newVal !== originalVal;

        if (shouldInclude && newVal !== undefined) {
          fd.append(key, newVal === null ? '' : newVal);
        }
      }
    });

    const appNo = items?.application_no;
    if (appNo) {
      fd.append('application_no', appNo);
    }

    if (items?.id) fd.append('id', items.id);

    return fd;
  };
  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
        HT Load Change {items?.application_status_text}
      </h2>

      <div className="mt-6 overflow-x-auto">
        <div className="body p-4">
          <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />

          {items?.application_status === 2 && officerData?.employee_detail.role !== 3 && (
            <div className="border-b border-gray-900/10 pb-12 mt-4">
              <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                {items?.application_status_text}
              </h2>


              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                <div className="flex flex-wrap gap-4 col-span-8 mt-4">
                  <button
                    type="button"
                    onClick={openUpdateModal}
                    className="w-[200px] flex-none cursor-pointer bg-purple-700 text-white py-2 rounded uppercase text-sm font-semibold hover:bg-purple-800 transition"
                  >
                    Update Application
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-auto">
          <div className="bg-white w-full max-w-5xl rounded-md shadow-xl my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">HT Load Change Application Update</h3>
                  <p className="text-sm text-gray-600 mt-1">Application No: {items?.application_no}</p>
                </div>
                <button
                  onClick={() => setOpenModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>


            <div className="p-4">
              <form onSubmit={handleSubmit(onModalSubmit)}>
                <div className="space-y-6">
                  {/* ApplicantFillDetails exactly as ApplicantReg */}
                  <ApplicantFillDetails htConsumers={htConsumers} register={register} errors={errors} isUpdatePage={true} />

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
                        disabled={getDisabled('type_of_change')}
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
                        disabled={getDisabled('lc_type')}
                      />
                      <SelectTag
                        LName="New Supply Voltage"
                        options={supplyVoltageOptions}
                        {...register('new_supply_voltage', {
                          required: 'Please Select New Supply Voltage is required',
                        })}
                        errorMsg={errors.new_supply_voltage?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={getDisabled('new_supply_voltage')}
                      />
                      <InputTag
                        LName="Total Required Contract Demand(in KVA)"
                        type={'number'}
                        placeholder="Please Enter New Contract Demand "
                        {...register('new_contact_demand', {
                          required: 'New Contract Demand is required',
                        })}
                        errorMsg={errors.new_contact_demand?.message}
                        disabled={getDisabled('new_contact_demand')}
                        readOnly={isLocked}
                      />
                      <InputTag
                        LName="Contract Demand Difference"
                        type={'number'}
                        {...register('contract_demand_difference', {
                          required: true,
                        })}
                        errorMsg={errors.contract_demand_difference?.message}
                        disabled={getDisabled('contract_demand_difference')}
                        readOnly={isLocked}
                      />
                      <InputTag
                        LName="Purpose Of Installation (Optional)"
                        {...register('purpose_of_installation_details')}
                        placeholder="Please Enter Purpose Of Installation Details"
                        errorMsg={errors.purpose_of_installation_details?.message}
                        disabled={getDisabled('purpose_of_installation_details')}
                      />
                    </div>
                  </div>

                  {/* Bank Details */}

                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">Bank Details..</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                      <InputTag LName="Account Holder Name" {...register('ac_holder_name')} errorMsg={errors.ac_holder_name?.message} placeholder="Please Enter Account Holder Name" disabled={getDisabled('ac_holder_name')} />
                      <InputTag LName="Bank Name" {...register('bank_name')} errorMsg={errors.bank_name?.message} placeholder="Please Enter Bank Name" disabled={getDisabled('bank_name')} />
                      <InputTag LName="Bank IFSC Code" {...register('bank_ifsc_code')} errorMsg={errors.bank_ifsc_code?.message} placeholder="Please Enter Bank IFSC Code" disabled={getDisabled('bank_ifsc_code')} />
                      <InputTag LName="Bank Account Number" {...register('bank_ac_no')} errorMsg={errors.bank_ac_no?.message} placeholder="Please Enter Bank Account Number" disabled={getDisabled('bank_ac_no')} />

                      {/* Updated Bank Document Upload */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Bank Passbook/Cheque
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        {/* Display existing document with view option */}
                        {htConsumers?.bank_docs && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Existing document:</span>
                              <a
                                href={htConsumers.bank_docs}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                              >
                                View Document
                              </a>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {/* <p>Upload a new file to replace the existing document</p> */}
                            </div>
                          </div>
                        )}

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          {...register('bank_docs')}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {/* <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG (Max: 5MB)</p> */}
                        {errors.bank_docs && <p className="mt-1 text-sm text-red-600">{errors.bank_docs.message}</p>}
                      </div>
                    </div>
                  </div>


                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">Firm Document Details..</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                      {(items?.pan_card_no === '' || items?.pan_card_no === 'NA') && (
                        <>
                          <InputTag LName="Pan No" {...register('pan_no')} errorMsg={errors.pan_no?.message} placeholder="Enter Pan No." disabled={getDisabled('pan_no')} />

                          {/* Updated PAN Document Upload */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Pan Card
                              <span className="text-red-500 ml-1">*</span>
                            </label>

                            {/* Display existing PAN document */}
                            {htConsumers?.pan_card_doc && (
                              <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Existing PAN:</span>
                                  <a
                                    href={htConsumers.pan_card_doc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                                  >
                                    View Document
                                  </a>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                  {/* <p>Upload a new file to replace the existing document</p> */}
                                </div>
                              </div>
                            )}

                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              {...register('pan_card_doc')}
                              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {/* <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG (Max: 5MB)</p> */}
                            {errors.pan_card_doc && <p className="mt-1 text-sm text-red-600">{errors.pan_card_doc.message}</p>}
                          </div>
                        </>
                      )}

                      {/* Updated GST Document Upload */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload GST Document
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        {/* Display existing GST document */}
                        {htConsumers?.gst_doc && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Existing GST:</span>
                              <a
                                href={htConsumers.gst_doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                              >
                                View Document
                              </a>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {/* <p>Upload a new file to replace the existing document</p> */}
                            </div>
                          </div>
                        )}

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          {...register('gst_doc')}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {/* <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG (Max: 5MB)</p> */}
                        {errors.gst_doc && <p className="mt-1 text-sm text-red-600">{errors.gst_doc.message}</p>}
                      </div>

                      <InputTag LName="Enter Other Document No" {...register('uploaded_doc_no')} placeholder="Enter Other Document No." errorMsg={errors.uploaded_doc_no?.message} disabled={getDisabled('uploaded_doc_no')} />
                      <InputTag LName="Enter Other Document Name" {...register('uploaded_doc_name')} placeholder="Enter Other Document Name" errorMsg={errors.uploaded_doc_name?.message} disabled={getDisabled('uploaded_doc_name')} />

                      {/* Updated Other Document Upload */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Other Document
                        </label>

                        {/* Display existing other document */}
                        {htConsumers?.upload_file && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Existing document:</span>
                              <a
                                href={htConsumers.upload_file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                              >
                                View Document
                              </a>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {/* <p>Upload a new file to replace the existing document</p> */}
                            </div>
                          </div>
                        )}

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          {...register('upload_file')}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {/* <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG (Max: 5MB)</p> */}
                        {errors.upload_file && <p className="mt-1 text-sm text-red-600">{errors.upload_file.message}</p>}
                      </div>
                    </div>

                    <br />
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <strong className="text-yellow-800">Note:</strong>
                      <span className="text-yellow-700 ml-2">Please merge the documents pdfs, if multiple documents to be upload.</span>
                    </div>
                  </div>

                  {/* Firm Docs */}
                  {/* <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">Firm Document Details..</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                      {(items?.pan_card_no === '' || items?.pan_card_no === 'NA') && (
                        <>
                          <InputTag LName="Pan No" {...register('pan_no')} errorMsg={errors.pan_no?.message} placeholder="Enter Pan No." disabled={getDisabled('pan_no')} />
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Upload Pan</label>
                            <input type="file" {...register('pan_card_doc')} className="mt-1 block w-full" />
                            {items?.pan_card_doc && <div className="text-sm mt-1">Existing: <a href={items.pan_card_doc} target="_blank" rel="noreferrer" className="underline">View</a></div>}
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Upload GST Document</label>
                        <input type="file" {...register('gst_doc')} className="mt-1 block w-full" />
                        {items?.gst_doc && <div className="text-sm mt-1">Existing: <a href={items.gst_doc} target="_blank" rel="noreferrer" className="underline">View</a></div>}
                      </div>

                      <InputTag LName="Enter Other Document No" {...register('uploaded_doc_no')} placeholder="Enter Other Document No." errorMsg={errors.uploaded_doc_no?.message} disabled={getDisabled('uploaded_doc_no')} />
                      <InputTag LName="Enter Other Document Name" {...register('uploaded_doc_name')} placeholder="Enter Other Document Name" errorMsg={errors.uploaded_doc_name?.message} disabled={getDisabled('uploaded_doc_name')} />

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Other Document</label>
                        <input type="file" {...register('upload_file')} className="mt-1 block w-full" />
                        {items?.upload_file && <div className="text-sm mt-1">Existing: <a href={items.upload_file} target="_blank" rel="noreferrer" className="underline">View</a></div>}
                      </div>
                    </div>

                    <br />
                    <strong>Note:</strong> Please merge the documents pdfs, if multiple documents to be upload.
                  </div> */}

                  {serverError && <div className="text-red-600">{serverError}</div>}

                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setOpenModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={loadingUpdate} className={`px-4 py-2 rounded text-white ${loadingUpdate ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
                      {loadingUpdate ? 'Updating...' : 'Update Application'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadRegistrationFeePayment;






