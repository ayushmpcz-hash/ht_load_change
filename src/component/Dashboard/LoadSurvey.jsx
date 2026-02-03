// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { HT_LOAD_CHANGE_BASE, DSP_PRO_BASE, HT_NSC_BASE } from '../../api/api.js';

// // import { In, FileUpload, SelectTag } from '../InputTag.jsx'
// import {
//   InputTag,
//   SelectTag,
//   RadioTag,
//   fetchCtPtData,
//   ApplicantBasicDetails,
//   sendOtpNew,
//   verifyOtpNew,
//   Button,
// } from '../importComponents.js';
// import {
//   region,
//   lineType,
//   conductorType,
//   poleType,
//   setSurveyOptions,
//   responseOption,
//   revertOption,
//   getEstimateOptions,
// } from '../newComponents/commonOption.js';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { submitFormData } from '../../utils/handlePostApi.js';
// import { useSelector } from 'react-redux';
// import { useForm, useWatch } from 'react-hook-form';
// import { getFinalUsingData } from '../../utils/handlePostApi.js';
// import AlertModalBox from '../alertModelBox.jsx';
// import Cookies from 'js-cookie';

// const LoadSurvey = () => {
//   const officerData = useSelector(state => state.user.officerData);
//   const [mobileNo, setMobileNo] = useState(officerData?.employee_detail.cug_mobile);
//   const [showOtpBtn, setShowOtpBtn] = useState(false);
//   const [fromDataValue, setFromDataValue] = useState(null);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [isBtnDisabled, setBtnIsDisabled] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();

//   const { items } = location.state || {};
//   console.log(items, 'items ');
//   let supply_voltage = items.new_supply_voltage.replace(/kv/i, '').trim();
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     getValues,
//     control,
//     setError,
//     clearErrors,
//     formState: { errors },
//   } = useForm({
//     defaultValues: items || {},
//   });
//   const token = Cookies.get('accessToken');
//   const [circle, setCircle] = useState([]);
//   const [division, setDivision] = useState([]);
//   const [ehvSubStation, setEHVSubStation] = useState([]);
//   const [thirtyThreeFeeder, setThirtyThreeFeeder] = useState([]);
//   const [thirtyThreeSubstation, setThirtyThreeSubstation] = useState([]);
//   const [elevenFeeder, setElevenFeeder] = useState([]);
//   const [taskDescription, setTaskDescription] = useState([]);
//   const [ctRatio, setCtRatio] = useState([]);
//   const [ctSelectRatio, setSelectCtRatio] = useState('');
//   const [ptRatio, setPtRatio] = useState([]);
//   const [meExtimateblock, setMeExtimateblock] = useState(false);
//   const [exExtimateblock, setExExtimateblock] = useState(false);

//   const [isMeErpFetched, setIsMeErpFetched] = useState(false);
//   const [isExtErpFetched, setIsExtErpFetched] = useState(false);


//   console.log(DSP_PRO_BASE, 'DSP_PRO_BASE inside load survey')
//   console.log(HT_NSC_BASE, 'HT_NSC_BASE inside survey')

//   const RegionId = watch('region');
//   const CircleId = watch('circle');
//   const DivisionId = watch('division');
//   const EHVSubStationId = watch('ehv_sub_station');
//   const ThirtyThreeFeederId = watch('thirty_three_feeder');
//   const ThirtyThreeSubstation = watch('thirty_three_sub_station');
//   const is_required = watch('is_required');
//   const is_estimate_required = watch('is_estimate_required') || [];

//   const survey_response = watch('survey_response');
//   const existingMeCtRatio = items?.me_ct_ratio; // Installed ME CT Ratio (existing)

//   const selectedNewCtRatio = useWatch({
//     control,
//     name: 'new_ct_ratio',
//   });

//   const filteredSurveyOptions = React.useMemo(() => {
//     // agar dono values available hain aur same hain
//     if (
//       existingMeCtRatio &&
//       selectedNewCtRatio &&
//       existingMeCtRatio === selectedNewCtRatio
//     ) {
//       // Estimate option hide
//       return setSurveyOptions.filter(
//         opt => opt.value !== 'is_estimate_required'
//       );
//     }

//     // otherwise dono options dikhenge
//     return setSurveyOptions;
//   }, [existingMeCtRatio, selectedNewCtRatio]);

//   console.log(filteredSurveyOptions, 'filtered survey option')

//   useEffect(() => {
//     if (
//       existingMeCtRatio &&
//       selectedNewCtRatio &&
//       existingMeCtRatio === selectedNewCtRatio
//     ) {
//       setValue('is_required', '');
//     }
//   }, [existingMeCtRatio, selectedNewCtRatio]);



//   useEffect(() => {
//     const fetchData = async () => {
//       const ratioData = await fetchCtPtData(items);
//       setCtRatio(ratioData.ct_result.data);
//       setPtRatio(ratioData.pt_result.data);
//       setSelectCtRatio(ratioData.matched);
//       // setValue("new_ct_ratio", items.)
//       // setValue('new_ct_ratio', items?.load_sanction?.new_ct_ratio);
//       // setValue('new_pt_ratio', items?.load_sanction?.new_pt_ratio);
//       setValue('new_ct_ratio', items?.load_sanction?.new_ct_ratio);
//       setValue('new_pt_ratio', items?.load_sanction?.new_pt_ratio);
//     };
//     if (items?.new_supply_voltage) {
//       fetchData(items);
//     }
//   }, [items?.new_supply_voltage]);

//   useEffect(() => {
//     const getFatchData = async () => {
//       let response = await getFinalUsingData(`${HT_NSC_BASE}/tasks/filter/${supply_voltage}`);
//       let result = await response.json();
//       setTaskDescription(result.results);
//     };
//     getFatchData();
//   }, []);
//   useEffect(() => {
//     const getFatchData = async () => {
//       let response = await getFinalUsingData(`${HT_NSC_BASE}/get_circle?region=${RegionId}`);
//       let result = await response.json();
//       setCircle(result.Name);

//       // const selectedRegion = result.Name.find((r) => r.value === RegionId);
//       // console.log(selectedRegion, 'selectedRegion');
//     };
//     if (RegionId) {
//       getFatchData();
//     }
//   }, [RegionId]);


//   useEffect(() => {
//     const getFatchData = async () => {
//       let response = await getFinalUsingData(`${HT_NSC_BASE}/get_division?circle=${CircleId}`);
//       let result = await response.json();
//       setDivision(result.Name);
//     };
//     if (CircleId) {
//       getFatchData();
//     }
//   }, [CircleId]);
//   useEffect(() => {
//     const getFatchData = async () => {
//       let response = await getFinalUsingData(
//         `${HT_NSC_BASE}/get_ehv_by_division?division=${DivisionId}`
//       );
//       let result = await response.json();
//       setEHVSubStation(result.Name);
//     };
//     if (DivisionId) {
//       getFatchData();
//     }
//   }, [DivisionId]);
//   useEffect(() => {
//     const getFatchData = async () => {
//       let response = await getFinalUsingData(
//         `${HT_NSC_BASE}/get_feeder33_by_ehv?ehv=${EHVSubStationId}`
//       );
//       let result = await response.json();
//       setThirtyThreeFeeder(result.Name);
//     };
//     if (EHVSubStationId) {
//       getFatchData();
//     }
//   }, [EHVSubStationId]);

//   useEffect(() => {
//     const getFatchData = async () => {
//       let response = await getFinalUsingData(
//         `${HT_NSC_BASE}/get_substation_by_feeder33?feeder33=${ThirtyThreeFeederId}`
//       );
//       let result = await response.json();
//       setThirtyThreeSubstation(result.Name);
//     };
//     if (ThirtyThreeFeederId) {
//       getFatchData();
//     }
//   }, [ThirtyThreeFeederId]);

//   useEffect(() => {
//     const getFatchData = async () => {
//       let response = await getFinalUsingData(
//         `${HT_NSC_BASE}/get_feeder11_by_ss?ss=${ThirtyThreeSubstation}`
//       );
//       let result = await response.json();
//       setElevenFeeder(result.Name);
//     };
//     if (ThirtyThreeSubstation) {
//       getFatchData();
//     }
//   }, [ThirtyThreeSubstation]);

//   // 🔹 Common reusable function
//   // const fetchEstimateDetails = async (erpField, type) => {
//   //   console.log(type, 'type')
//   //   try {
//   //     let erp_no = getValues(erpField);
//   //     if (!erp_no) {
//   //       setError(erpField, { type: 'manual', message: 'ERP Number is required' });
//   //       return;
//   //     }

//   //     setIsDisabled(true);

//   //     const response = await axios.get(`${DSP_PRO_BASE}/XXPA_PROJECTS_HT_V/${erp_no}`);
//   //     console.log(response, 'response erp')
//   //     const projectData = response?.data?.data?.[0];
//   //     console.log(projectData.SCHEMECODE, "projectData")

//   //     // if (!projectData) {
//   //     //   setError(erpField, { message: 'No data found for this ERP No' });
//   //     //   return;
//   //     // }
//   //     if (!projectData) {
//   //       setIsMeErpFetched(false);
//   //       setIsExtErpFetched(false);
//   //       setError(erpField, { message: 'No data found for this ERP No' });
//   //       return;
//   //     }
//   //     if (type == "ME" && projectData.SCHEMECODE !== "DEPOSITE") {
//   //       setMeExtimateblock(false);
//   //       setError(erpField, { message: 'No data found for ME METER ERP No' });
//   //       return;
//   //     }
//   //     // clear error if data found
//   //     setError(erpField, { message: '' });

//   //     // destructure response
//   //     const {
//   //       STATUS,
//   //       SUPER_TAX,
//   //       ESTIMATE_DATE,
//   //       SANCTION_DATE,
//   //       ESTIMATED_TAX,
//   //       SUPERVISION_COST,
//   //       ESTIMATED_COST,
//   //       PROJECT_TYPE,
//   //       SCHEMECODE,
//   //       APPROVED_BY_NAME,
//   //       SANCT_COST,
//   //       ORG1,
//   //       ORG,
//   //       LONG_NAME,
//   //     } = projectData;

//   //     if (STATUS === 'Approved') {
//   //       const date = new Date(SANCTION_DATE).toISOString().split('T')[0];

//   //       if (type === 'ME') {
//   //         setMeExtimateblock(true);
//   //         setIsMeErpFetched(true);
//   //         setValue('ndf_approved_by_name', APPROVED_BY_NAME);
//   //         setValue('ndf_estimate_date', date);
//   //         setValue('ndf_sanction_amt', SANCT_COST);
//   //         // setValue("ndf_sanction_date", SANCTION_DATE);
//   //         setValue('ndf_long_name', LONG_NAME);
//   //         setValue('ndf_status', STATUS);
//   //         setValue('ndf_scheme_name', SCHEMECODE);
//   //         setValue('ndf_circle_name', ORG1);
//   //         setValue('ndf_division_name', ORG);
//   //         setValue('ndf_total_amt', SANCT_COST);
//   //       } else if (type === 'EXT') {
//   //         let super_tax = SUPER_TAX / 2;

//   //         setExExtimateblock(true);
//   //         setIsExtErpFetched(true);
//   //         setValue('status', STATUS);
//   //         setValue('scheme_name', SCHEMECODE);
//   //         setValue('supervision_cgst', super_tax.toFixed(2));
//   //         setValue('supervision_sgst', super_tax.toFixed(2));
//   //         setValue('supervision_amt', Math.ceil(SUPERVISION_COST));
//   //         setValue('long_name', LONG_NAME);

//   //         if (SCHEMECODE === 'SCCW') {
//   //           setValue(
//   //             'total_estimated_amt',
//   //             Math.ceil(Number(SUPER_TAX) + Number(SUPERVISION_COST))
//   //           );
//   //         } else {
//   //           setValue('total_estimated_amt', Math.ceil(ESTIMATED_COST));
//   //         }
//   //         setValue('estimate_date', date);
//   //       }
//   //     }
//   //     // } catch (error) {
//   //     //   console.error('API Error:', error);
//   //     //   setError(erpField, { message: 'Erp Number Does Not exist' });
//   //     setIsMeErpFetched(false);
//   //     setIsExtErpFetched(false);
//   //     setError(erpField, { message: 'ERP Number does not exist' });
//   //   } finally {
//   //     setIsDisabled(false);
//   //   }
//   // };
//   const fetchEstimateDetails = async (erpField, type) => {
//     console.log(type, 'type')
//     try {
//       let erp_no = getValues(erpField);
//       if (!erp_no) {
//         setError(erpField, { type: 'manual', message: 'ERP Number is required' });
//         return;
//       }

//       setIsDisabled(true);

//       const response = await axios.get(`${DSP_PRO_BASE}/XXPA_PROJECTS_HT_V/${erp_no}`);
//       const { statusCode, data, message } = response.data;

//       // ❌ ERP NOT FOUND (404 OR EMPTY)
//       if (statusCode !== "200" || !Array.isArray(data) || data.length === 0) {
//         if (type === 'ME') setIsMeErpFetched(false);
//         if (type === 'EXT') setIsExtErpFetched(false);

//         setError(erpField, {
//           type: 'manual',
//           message: 'ERP data not found',
//         });

//         return; // ⛔ STOP HERE
//       }

//       // ✅ ERP FOUND
//       const projectData = data[0];

//       // ❌ STATUS NOT APPROVED
//       if (projectData.STATUS !== 'Approved') {
//         setError(erpField, {
//           type: 'manual',
//           message: 'ERP is not Approved',
//         });
//         return;
//       }

//       // ✅ SUCCESS FLOW
//       clearErrors(erpField);

//       if (type === 'ME') setIsMeErpFetched(true);
//       if (type === 'EXT') setIsExtErpFetched(true);


//       if (projectData.STATUS !== 'Approved') {
//         setError(erpField, {
//           type: 'manual',
//           message: 'ERP is not Approved',
//         });

//         if (type === 'ME') setIsMeErpFetched(false);
//         if (type === 'EXT') setIsExtErpFetched(false);

//         return;
//       }

//       if (type === 'ME') {
//         setIsMeErpFetched(true);
//         setMeExtimateblock(true);
//       }

//       if (type === 'EXT') {
//         setIsExtErpFetched(true);
//         setExExtimateblock(true);
//       }


//       if (type == "ME" && projectData.SCHEMECODE !== "DEPOSITE") {
//         setMeExtimateblock(false);
//         setError(erpField, { message: 'No data found for ME METER ERP No' });
//         return;
//       }
//       // clear error if data found
//       setError(erpField, { message: '' });

//       // destructure response
//       const {
//         STATUS,
//         SUPER_TAX,
//         ESTIMATE_DATE,
//         SANCTION_DATE,
//         ESTIMATED_TAX,
//         SUPERVISION_COST,
//         ESTIMATED_COST,
//         PROJECT_TYPE,
//         SCHEMECODE,
//         APPROVED_BY_NAME,
//         SANCT_COST,
//         ORG1,
//         ORG,
//         LONG_NAME,
//       } = projectData;

//       if (STATUS === 'Approved') {
//         const date = new Date(SANCTION_DATE).toISOString().split('T')[0];

//         if (type === 'ME') {
//           setMeExtimateblock(true);
//           setIsMeErpFetched(true);
//           setValue('ndf_approved_by_name', APPROVED_BY_NAME);
//           setValue('ndf_estimate_date', date);
//           setValue('ndf_sanction_amt', SANCT_COST);
//           // setValue("ndf_sanction_date", SANCTION_DATE);
//           setValue('ndf_long_name', LONG_NAME);
//           setValue('ndf_status', STATUS);
//           setValue('ndf_scheme_name', SCHEMECODE);
//           setValue('ndf_circle_name', ORG1);
//           setValue('ndf_division_name', ORG);
//           setValue('ndf_total_amt', SANCT_COST);
//         } else if (type === 'EXT') {
//           let super_tax = SUPER_TAX / 2;

//           setExExtimateblock(true);
//           setIsExtErpFetched(true);
//           setValue('status', STATUS);
//           setValue('scheme_name', SCHEMECODE);
//           setValue('supervision_cgst', super_tax.toFixed(2));
//           setValue('supervision_sgst', super_tax.toFixed(2));
//           setValue('supervision_amt', Math.ceil(SUPERVISION_COST));
//           setValue('long_name', LONG_NAME);

//           if (SCHEMECODE === 'SCCW') {
//             setValue(
//               'total_estimated_amt',
//               Math.ceil(Number(SUPER_TAX) + Number(SUPERVISION_COST))
//             );
//           } else {
//             setValue('total_estimated_amt', Math.ceil(ESTIMATED_COST));
//           }
//           setValue('estimate_date', date);
//         }
//       }
//     } catch (error) {
//       //   console.error('API Error:', error);
//       //   setError(erpField, { message: 'Erp Number Does Not exist' });
//       console.error(err);

//       setError(erpField, {
//         type: 'manual',
//         message: 'ERP service error. Try again.',
//       });

//       if (type === 'ME') setIsMeErpFetched(false);
//       if (type === 'EXT') setIsExtErpFetched(false);
//       setError(erpField, { message: 'ERP Number does not exist' });
//     } finally {
//       setIsDisabled(false);
//     }
//   };

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

//   // const handleFinalSubmit = async () => {
//   //   try {
//   //     const formValue = fromDataValue;
//   //     const formData = new FormData();

//   //     Object.entries(formValue).forEach(([key, value]) => {
//   //       // ✅ FileList handle
//   //       if (value instanceof FileList) {
//   //         if (value.length > 0) {
//   //           formData.append(key, value[0]);
//   //         }
//   //         return; // empty FileList skip
//   //       }

//   //       // ✅ Single File
//   //       if (value instanceof File) {
//   //         formData.append(key, value);
//   //         return;
//   //       }

//   //       // ❌ empty / null / undefined skip
//   //       if (value === undefined || value === null || value === "") {
//   //         return;
//   //       }

//   //       // ✅ normal fields
//   //       formData.append(key, value);
//   //     });

//   //     console.log(formData, "formData")
//   //     const { data } = await axios.post(`${HT_LOAD_CHANGE_BASE}/surveys/`, formData, {
//   //       headers: {
//   //         // 'Content-Type': 'application/json',
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     });
//   //     const { data: apiData, ...rest } = data;
//   //     alert(apiData?.survey_response === "Reverted" ? "Application Reverted  Successfully " : "Survey Application submitted Successfully ✅");
//   //     navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
//   //   } catch (error) {
//   //     console.error('API Error:', error);
//   //     alert('Something went wrong ❌');
//   //   } finally {
//   //     setBtnIsDisabled(false);
//   //   }
//   // };

//   const handleFinalSubmit = async () => {

//     // 🚨 ERP REQUIRED BUT NOT FETCHED
//     if (is_required === 'is_estimate_required') {

//       if (
//         is_estimate_required.includes('is_me_meter_required') &&
//         !isMeErpFetched
//       ) {
//         setError('ndf_erp_no', {
//           type: 'manual',
//           message: 'ME Meter ERP data not fetched',
//         });
//         return; // ⛔ STOP SUBMIT
//       }

//       if (
//         is_estimate_required.includes('is_extension_work_required') &&
//         !isExtErpFetched
//       ) {
//         setError('erp_no', {
//           type: 'manual',
//           message: 'Extension Work ERP data not fetched',
//         });
//         return; // ⛔ STOP SUBMIT
//       }
//     }

//     // ✅ All validations passed → API CALL
//     try {
//       const formValue = fromDataValue;
//       const formData = new FormData();

//       Object.entries(formValue).forEach(([key, value]) => {
//         if (value instanceof FileList && value.length > 0) {
//           formData.append(key, value[0]);
//           return;
//         }
//         if (value instanceof File) {
//           formData.append(key, value);
//           return;
//         }
//         if (value !== undefined && value !== null && value !== '') {
//           formData.append(key, value);
//         }
//       });

//       const { data } = await axios.post(
//         `${HT_LOAD_CHANGE_BASE}/surveys/`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert('Survey submitted successfully ✅');
//       navigate(`/dashboard/respones/${data.data.application}`, {
//         state: data.data,
//       });

//     } catch (error) {
//       console.error(error);
//       alert('Submission failed ❌');
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
//               <h2 className="text-lg font-bold capitalize ">HT Load Change Survey</h2>
//             </div>
//             <div className="card-body px-4 pb-4">
//               <div className="mt-6 overflow-x-auto">
//                 {/* <div className="body p-4"> */}
//                 {/* {officerData?.employee_detail.role} */}
//                 <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
//               </div>
//               <input
//                 type="hidden"
//                 value={items.id}
//                 {...register('application')}
//               ></input>

//               {/* <ApplicantFillDetails htConsumers={items} /> */}
//               {(officerData?.employee_detail.role == 2 || officerData?.employee_detail.role == 34) && (
//                 <>
//                   {items.new_supply_voltage === items.existing_supply_voltage ? (
//                     <>
//                       <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                         {/* <div className="card-header px-4 py-2 border-b border-gray-300">
//                           <h2 className="text-lg font-bold capitalize ">
//                             Latitude and Longitude of Location where ME is to be installed
//                           </h2>
//                         </div> */}
//                         <div className="card-body px-4 pb-4">
//                           <div className="">
//                             <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

//                               <InputTag
//                                 LName="Maximum load on Feeder(in Amp)"
//                                 placeholder="Please Enter Maximum load on Feeder(in Amp)"
//                                 {...register('lr_values', {
//                                   required: ' Maximum load on Feeder(in Amp) is required',
//                                 })}
//                                 errorMsg={errors.lr_values?.message}
//                               />
//                               <InputTag
//                                 LName="Percentage Voltage Regulation(VR Value)"
//                                 placeholder="Please Enter Percentage Voltage Regulation(VR Value)"
//                                 {...register('vr_values', {
//                                   required: 'Percentage Voltage Regulation(VR Value) is required',
//                                 })}
//                                 errorMsg={errors.vr_values?.message}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                         <div className="card-header px-4 py-2 border-b border-gray-300">
//                           <h2 className="text-lg font-bold capitalize ">
//                             Choose the Orign Substation and Feeder Details (Supply Feeding to Consumer)
//                           </h2>
//                         </div>
//                         <div className="card-body px-4 pb-4">
//                           <div className="">
//                             <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                               <SelectTag
//                                 options={region}
//                                 LName="Region"
//                                 {...register('region', { required: 'Region is required' })}
//                                 errorMsg={errors.region?.message}
//                                 labelKey="label"
//                                 valueKey="value"
//                                 placeholder="Select Region"
//                               />
//                               <SelectTag
//                                 options={circle}
//                                 LName="Circle"
//                                 {...register('circle', { required: 'Circle is required' })}
//                                 errorMsg={errors.circle?.message}
//                                 labelKey="circle_code"
//                                 valueKey="circle_name"
//                               />
//                               <SelectTag
//                                 options={division}
//                                 LName="Division"
//                                 {...register('division', { required: 'division is required' })}
//                                 errorMsg={errors.division?.message}
//                                 labelKey="circle_code"
//                                 valueKey="circle_name"
//                               />
//                               <SelectTag
//                                 options={ehvSubStation}
//                                 LName="EHV SubStation Name"
//                                 {...register('ehv_sub_station', {
//                                   required: 'ehv SubStation is required',
//                                 })}
//                                 errorMsg={errors.ehv_sub_station?.message}
//                                 labelKey="circle_code"
//                                 valueKey="circle_name"
//                               />
//                               {items.new_supply_voltage === "33 KV" && (
//                                 <>
//                                   <SelectTag
//                                     options={thirtyThreeFeeder}
//                                     LName="33 Feeder Name"
//                                     {...register('thirty_three_feeder', {
//                                       required: 'thirty Three Feeder is required',
//                                     })}
//                                     errorMsg={errors.thirty_three_feeder?.message}
//                                     labelKey="circle_code"
//                                     valueKey="circle_name"
//                                   />
//                                   {items.new_supply_voltage === "11 KV" && (
//                                     <>
//                                       <SelectTag
//                                         options={thirtyThreeSubstation}
//                                         LName="33 SubStation Name"
//                                         {...register('thirty_three_sub_station', {
//                                           required: 'Thirty Three Feeder is required',
//                                         })}
//                                         errorMsg={errors.thirty_three_sub_station?.message}
//                                         labelKey="circle_code"
//                                         valueKey="circle_name"
//                                       />
//                                       <SelectTag
//                                         options={elevenFeeder}
//                                         LName="11 Feeder Name"
//                                         {...register('eleven_feeder', {
//                                           required: '11 Feeder Name is required',
//                                         })}
//                                         errorMsg={errors.eleven_feeder?.message}
//                                         labelKey="circle_code"
//                                         valueKey="circle_name"
//                                       />
//                                     </>
//                                   )}
//                                 </>
//                               )}

//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div class="card mt-2 mb-2 bg-white rounded shadow-md ">

//                         <div className="card-body px-4 pb-4">
//                           <div className="">
//                             <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//                               <InputTag
//                                 LName="Maximum load on Feeder(in Amp)"
//                                 placeholder="Please Enter Maximum load on Feeder(in Amp)"
//                                 {...register('lr_values', {
//                                   required: ' Maximum load on Feeder(in Amp) is required',
//                                 })}
//                                 errorMsg={errors.lr_values?.message}
//                               />
//                               <InputTag
//                                 LName="Percentage Voltage Regulation(VR Value)"
//                                 placeholder="Please Enter Percentage Voltage Regulation(VR Value)"
//                                 {...register('vr_values', {
//                                   required: 'Percentage Voltage Regulation(VR Value) is required',
//                                 })}
//                                 errorMsg={errors.vr_values?.message}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                         <div className="card-header px-4 py-2 border-b border-gray-300">
//                           <h2 className="text-lg font-bold capitalize ">
//                             Latitude and Longitude of Location where ME is to be installed
//                           </h2>
//                         </div>
//                         <div className="card-body px-4 pb-4">
//                           <div className="">
//                             <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//                               <InputTag
//                                 LName="Latitude of ME Installation Location"
//                                 placeholder="Please Enter Latitude of ME Installation Location"
//                                 {...register('latitude')}
//                                 errorMsg={errors.latitude?.message}
//                               />
//                               <InputTag
//                                 LName="Longitude of ME Installation Location"
//                                 placeholder="Please Enter Longitude of ME Installation Location"
//                                 {...register('longitude')}
//                                 errorMsg={errors.longitude?.message}
//                               />
//                               <InputTag

//                                 LName="Upload single line diagram including VR Calculation."
//                                 type={"file"}
//                                 {...register('upload_single_line_docs', {
//                                   required: 'single line diagram is required',
//                                 })}
//                                 errorMsg={errors.upload_single_line_docs?.message}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                         <div className="card-header px-4 py-2 border-b border-gray-300">
//                           <h2 className="text-lg font-bold capitalize ">
//                             Installed ME CT And PT Ratio
//                           </h2>
//                         </div>
//                         <div className="card-body px-4 pb-4">
//                           <div className="">
//                             <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                               <InputTag
//                                 LName="Installed ME CT Ratio"
//                                 Iname="me_ct_ratio"
//                                 {...register('me_ct_ratio')}
//                                 errorMsg={errors.me_ct_ratio?.message}
//                               />
//                               <InputTag
//                                 LName="Installed ME PT Ratio"
//                                 Iname="me_pt_ratio"
//                                 {...register('me_pt_ratio')}
//                                 errorMsg={errors.me_pt_ratio?.message}
//                               />
//                               <Button label='Download Check List'></Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                     <div className="card-header px-4 py-2 border-b border-gray-300">
//                       <h2 className="text-lg font-bold capitalize ">Summary of Infrastructure</h2>
//                     </div>
//                     <div className="card-body px-4 pb-4">
//                       <div className="">
//                         <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                           <SelectTag
//                             options={lineType}
//                             LName="Line Type"
//                             {...register('region_name', { required: 'Region is required' })}
//                             errorMsg={errors.me_pt_ratio?.message}
//                             labelKey="label"
//                             valueKey="value"
//                           />
//                           <InputTag
//                             LName="Distance From Existing Substation to Connection Premise(in KM)"
//                             placeholder=""
//                             {...register('distance')}
//                             errorMsg={errors.distance?.message}
//                           />
//                           <SelectTag
//                             options={conductorType}
//                             LName="Conductor Type"
//                             {...register('conductor_type', {
//                               required: 'conductor type is required',
//                             })}
//                             errorMsg={errors.conductor_type?.message}
//                             labelKey="label"
//                             valueKey="value"
//                           />
//                           <SelectTag
//                             options={poleType}
//                             LName="Pole Type"
//                             {...register('pole_type', { required: 'Pole Type is required' })}
//                             errorMsg={errors.pole_type?.message}
//                             labelKey="label"
//                             valueKey="value"
//                           />
//                           <SelectTag
//                             options={taskDescription}
//                             LName="Task Description"
//                             {...register('task_description', {
//                               required: 'Task Description is required',
//                             })}
//                             errorMsg={errors.task_description?.message}
//                             labelKey="sor_description"
//                             valueKey="scheme_name"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div> */}
//                     </>
//                   )}

//                   <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                     <div className="card-header px-4 py-2 border-b border-gray-300">
//                       <h2 className="text-lg font-bold capitalize ">Acceptance</h2>
//                     </div>
//                     <div className="card-body px-4 pb-4">
//                       <div className="">
//                         <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                           <SelectTag
//                             LName="Acceptance"
//                             options={responseOption}
//                             {...register('survey_response', {
//                               required: 'Please Select  Acceptance is required',
//                             })}
//                             errorMsg={errors.survey_response?.message}
//                             labelKey="label"
//                             valueKey="value"
//                           />

//                           {survey_response === 'Accepted' && (
//                             <>

//                               <InputTag
//                                 LName=" Signed Check List PDF"
//                                 type="file"
//                                 {...register('survey_checklist_pdf', {
//                                   required: 'Check List Letter is required',
//                                 })}
//                                 errorMsg={errors.survey_checklist_docs?.message}
//                               />
//                               {/* <RadioTag
//                                 options={setSurveyOptions}
//                                 {...register('is_required', { required: 'Option is required' })}
//                                 errorMsg={errors.is_required?.message}
//                               /> */}
//                               <RadioTag
//                                 options={filteredSurveyOptions}
//                                 {...register('is_required', { required: 'Option is required' })}
//                                 errorMsg={errors.is_required?.message}
//                               />


//                               <SelectTag
//                                 LName="Required ME CT Ratio"
//                                 options={ctRatio}
//                                 {...register('new_ct_ratio', {
//                                   required: 'Please  select Ct Ratio is required',
//                                 })}
//                                 errorMsg={errors.new_ct_ratio?.message}
//                                 labelKey="ct_ratio_me"
//                                 valueKey="ct_ratio_me"
//                               />
//                               <SelectTag
//                                 LName="Required ME PT Ratio"
//                                 options={ptRatio}
//                                 {...register('new_pt_ratio', {
//                                   required: 'Please  select Pt Ratio is required',
//                                 })}
//                                 errorMsg={errors.new_pt_ratio?.message}
//                                 labelKey="pt_ratio"
//                                 valueKey="pt_ratio"
//                               />
//                               {is_required === 'is_estimate_required' && (
//                                 <RadioTag
//                                   options={getEstimateOptions(
//                                     items.new_supply_voltage,
//                                     items.existing_supply_voltage
//                                   )}
//                                   {...register('is_estimate_required', {
//                                     required: 'Option is required',
//                                   })}
//                                   errorMsg={errors.is_estimate_required?.message}
//                                   type="checkbox"
//                                 />
//                               )}
//                             </>
//                           )}
//                           {survey_response === 'Reverted' && (
//                             <>
//                               <SelectTag
//                                 options={revertOption}
//                                 LName="Revert Reason"
//                                 {...register('revert_reason', {
//                                   required: 'Please Select Revert Reason is required',
//                                 })}
//                                 errorMsg={errors.revert_reason?.message}
//                                 labelKey="label"
//                                 valueKey="value"
//                               />
//                               <InputTag
//                                 LName="Revert Reason Remark"
//                                 placeholder="Please Enter Revert Reason Remark"
//                                 {...register('revert_remark', {
//                                   required: 'Revert Reason Remark is required',
//                                 })}
//                                 errorMsg={errors.revert_remark?.message}
//                               />
//                               <InputTag
//                                 LName="Upload Revert Docs"
//                                 type="file"
//                                 {...register('revert_reson_docs', {
//                                   required: 'Upload Upload Revert Docs is required',
//                                 })}
//                                 errorMsg={errors.revert_reson_docs?.message}
//                               />
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {survey_response === 'Accepted' && (
//                     <>
//                       {is_required === 'is_estimate_required' && (
//                         <>
//                           {is_estimate_required.includes('is_me_meter_required') && (
//                             <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                               <div className="card-header px-4 py-2 border-b border-gray-300">
//                                 <h2 className="text-lg font-bold capitalize ">
//                                   ERP Details Of NDF(Me Meter Estimate)Estimate
//                                 </h2>
//                               </div>
//                               <div className="card-body px-4 pb-4">
//                                 <div className="">
//                                   <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                                     <InputTag
//                                       LName="ERP No of Me Estimate"
//                                       placeholder="ME Estimate No."
//                                       {...register('ndf_erp_no', {
//                                         required: 'Me Estimate is required',
//                                       })}
//                                       errorMsg={errors.ndf_erp_no?.message}
//                                     />

//                                     <button
//                                       onClick={() => fetchEstimateDetails('ndf_erp_no', 'ME')}
//                                       disabled={isDisabled}
//                                       type="button"
//                                       className={`py-0 px-0 mt-6 rounded text-white ${isDisabled
//                                         ? 'bg-gray-400 cursor-not-allowed'
//                                         : 'bg-blue-600 hover:bg-blue-800'
//                                         }`}
//                                     >
//                                       {isDisabled ? 'Get ERP Details...' : 'Get ERP Details'}
//                                     </button>
//                                     {meExtimateblock && (
//                                       <>
//                                         <InputTag
//                                           LName="Circle Name"
//                                           type="text"
//                                           {...register('ndf_circle_name', {
//                                             required: 'Circle Name is required',
//                                           })}
//                                           errorMsg={errors.ndf_circle_name?.message}
//                                           readOnly
//                                         />

//                                         <InputTag
//                                           LName="Division Name"
//                                           {...register('ndf_division_name', {
//                                             required: 'Division Name is required',
//                                           })}
//                                           errorMsg={errors.ndf_division_name?.message}
//                                           readOnly
//                                         />
//                                         <InputTag
//                                           LName="Sanction Date"
//                                           placeholder="Estimate Date."
//                                           {...register('ndf_estimate_date', {
//                                             required: 'Estimate Date is required',
//                                           })}
//                                           errorMsg={errors.ndf_estimate_date?.message}
//                                           readOnly
//                                         />
//                                         <InputTag
//                                           LName="Long Name"
//                                           type={"taxtarea"}
//                                           {...register('ndf_long_name', {
//                                             required: 'lond Name is required',
//                                           })}
//                                           errorMsg={errors.ndf_long_name?.message}

//                                         />
//                                         {/* <InputTag
//                                                       LName="Sanction Date"
//                                                       placeholder="Sanction Date."
//                                                       type="date"
//                                                       {...register('ndf_sanction_date', {
//                                                         required: 'Sanction Date is required',
//                                                       })}
//                                                       errorMsg={errors.ndf_sanction_date?.message}
//                                                       readOnly
//                                                     /> */}
//                                         <InputTag
//                                           LName="Sanction Cost"
//                                           {...register('ndf_sanction_amt', {
//                                             required: 'Sanction Cost is required',
//                                           })}
//                                           errorMsg={errors.ndf_sanction_amt?.message}
//                                           readOnly
//                                         />
//                                         <InputTag
//                                           LName="Status"
//                                           {...register('ndf_status', {
//                                             required: 'Status is required',
//                                           })}
//                                           errorMsg={errors.ndf_status?.message}
//                                           readOnly
//                                         />

//                                         <InputTag
//                                           LName="Approved By Name"
//                                           {...register('ndf_approved_by_name', {
//                                             required: 'Approved By Name is required',
//                                           })}
//                                           errorMsg={errors.ndf_approved_by_name?.message}
//                                           readOnly
//                                         />
//                                         <InputTag
//                                           LName="Scheme Name"
//                                           {...register('ndf_scheme_name', {
//                                             required: 'Scheme Name is required',
//                                           })}
//                                           errorMsg={errors.ndf_scheme_name?.message}
//                                           readOnly
//                                         />

//                                         <InputTag
//                                           LName="Total Amount"
//                                           placeholder="Total Amount."
//                                           {...register('ndf_total_amt', {
//                                             required: 'Total  Amount is required',
//                                           })}
//                                           errorMsg={errors.ndf_total_amt?.message}
//                                           readOnly
//                                         />
//                                         <InputTag
//                                           LName="Me Estimate Pdf"
//                                           type="file"
//                                           {...register('ndf_upload_estimate_docs', {
//                                             required: 'Me Estimate Letter is required',
//                                           })}
//                                           errorMsg={errors.ndf_upload_estimate_docs?.message}
//                                         />
//                                       </>
//                                     )}

//                                     {/* <InputTag LName="Percentage Voltage Regulation(VR Value)"  placeholder="Percentage Voltage Regulation(VR Value)"{...register("vr_value", { required: "Percentage Voltage Regulation(VR Value) is required" })} errorMsg={errors.vr_value?.message} />
//                                       <SelectTag options={region} LName="Fetch ERP " {...register("region", { required: "Region is required" })} errorMsg={errors.region?.message} labelKey="label" valueKey="value" /> */}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                           {is_estimate_required.includes('is_extension_work_required') && (
//                             <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//                               <div className="card-header px-4 py-2 border-b border-gray-300">
//                                 <h2 className="text-lg font-bold capitalize ">
//                                   ERP Details Of Extension Work
//                                 </h2>
//                               </div>
//                               <div className="card-body px-4 pb-4">
//                                 <div className="">
//                                   <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                                     <InputTag
//                                       LName="ERP No of Extension Estimate"
//                                       placeholder="Extension Estimate No."
//                                       {...register('erp_no', {
//                                         required: 'Extension Estimate is required',
//                                       })}
//                                       errorMsg={errors.erp_no?.message}
//                                     />
//                                     <button
//                                       onClick={() => fetchEstimateDetails('erp_no', 'EXT')}
//                                       disabled={isDisabled}
//                                       type="button"
//                                       className={`py-0 px-0 mt-6 rounded text-white ${isDisabled
//                                         ? 'bg-gray-400 cursor-not-allowed'
//                                         : 'bg-blue-600 hover:bg-blue-800'
//                                         }`}
//                                     >
//                                       {isDisabled ? 'Get ERP Details...' : 'Get ERP Details'}
//                                     </button>
//                                     {exExtimateblock && (
//                                       <>
//                                         <InputTag
//                                           LName="Sanction Date"
//                                           placeholder="Estimate Date."
//                                           {...register('estimate_date', {
//                                             required: 'Estimate Date is required',
//                                           })}
//                                           errorMsg={errors.estimate_date?.message}
//                                         />
//                                         <InputTag
//                                           LName="Long Name"
//                                           type={"taxtarea"}
//                                           {...register('long_name', {
//                                             required: 'lond Name is required',
//                                           })}
//                                           errorMsg={errors.long_name?.message}

//                                         />


//                                         <InputTag
//                                           LName="Status"
//                                           placeholder="Status."
//                                           {...register('status', {
//                                             required: 'Estimate Status is required',
//                                           })}
//                                           errorMsg={errors.ndf_status?.message}
//                                         />
//                                         <InputTag
//                                           LName="Scheme Name"
//                                           placeholder="Scheme Name."
//                                           {...register('scheme_name', {
//                                             required: 'Estimate Scheme Name is required',
//                                           })}
//                                           errorMsg={errors.scheme_name?.message}
//                                         />
//                                         <InputTag
//                                           LName="Supervision Amount"
//                                           placeholder="Estimate Cost Excluding GST."
//                                           {...register('supervision_amt', {
//                                             required: 'Estimate Cost is required',
//                                           })}
//                                           errorMsg={errors.supervision_amt?.message}
//                                         />
//                                         <InputTag
//                                           LName=" Supervision CGST Cost"
//                                           placeholder=" Supervision CGST Cost."
//                                           {...register('supervision_cgst', {
//                                             required: ' Supervision CGST Cost is required',
//                                           })}
//                                           errorMsg={errors.supervision_cgst?.message}
//                                         />
//                                         <InputTag
//                                           LName="Supervision SGST Cost"
//                                           placeholder="Supervision SGST Cost."
//                                           {...register('supervision_sgst', {
//                                             required: 'Supervision SGST Cost is required',
//                                           })}
//                                           errorMsg={errors.supervision_sgst?.message}
//                                         />
//                                         <InputTag
//                                           LName="Total Amount"
//                                           placeholder="Total Amount"
//                                           {...register('total_estimated_amt', {
//                                             required: 'Total Amount is required',
//                                           })}
//                                           errorMsg={errors.total_estimated_amt?.message}
//                                         />
//                                         <InputTag
//                                           LName="Extension Estimate Pdf"
//                                           type="file"
//                                           {...register('extension_work_estimate_docs', {
//                                             required: 'Extension Estimate Letter is required',
//                                           })}
//                                           errorMsg={errors.extension_work_estimate_docs?.message}
//                                         />
//                                       </>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </>
//                   )}

//                   <div className="border-b border-gray-900/10 pb-12">
//                     <div className="mt-10 flex flex-col justify-center items-center">
//                       <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
//                         {!showOtpBtn && (
//                           <>
//                             <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-red-600 duration-300">
//                               Reset
//                             </button>
//                             {survey_response === 'Reverted' ? (
//                               <button
//                                 type="submit"
//                                 className={`  text-white px-4 py-2 mt-4 rounded 
//                             ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-purple-800 text-white'}`}
//                                 disabled={isDisabled}
//                               >
//                                 {isDisabled ? 'Please wait...' : 'Revet For Survey'}
//                               </button>
//                             ) : (
//                               <button
//                                 type="submit"
//                                 className={`  text-white px-4 py-2 mt-4 rounded 
//                             ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-purple-800 text-white'}`}
//                                 disabled={isDisabled}
//                               >
//                                 {isDisabled
//                                   ? "Please wait..."
//                                   : is_required === "is_estimate_required"
//                                     ? "Send for Demand Note"
//                                     : is_required === "is_agreement_required"
//                                       ? "Send for Agreement"
//                                       : "Send for Demand Note"}

//                               </button>
//                             )}
//                           </>
//                         )}
//                         {showOtpBtn && (
//                           <>
//                             <InputTag
//                               LName=""
//                               placeholder="Please Enter Otp."
//                               {...register('otp', {
//                                 required: 'Otp is required',
//                               })}
//                               errorMsg={errors.otp?.message}
//                             />
//                             <button
//                               type="button"
//                               onClick={handleVerifyOtp}
//                               className={`bg-green-600 text-white px-4 py-2 mt-4 rounded"
//                                                                                        ${isBtnDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-purple-800 text-white'}`}
//                               disabled={isBtnDisabled}
//                             >
//                               {isBtnDisabled ? 'Please wait...' : ' Verify Otp'}
//                             </button>

//                             <button
//                               type="button"
//                               onClick={handleReSendOtp}
//                               className="bg-emerald-600 text-white px-4 py-2 mt-4 rounded"
//                             >
//                               Resend Otp
//                             </button>
//                           </>
//                         )}
//                       </div>
//                       {errors?.otpSuccess && (
//                         <p className="text-green-500 text-sm mt-1">{errors?.otpSuccess?.message}</p>
//                       )}
//                       {errors?.otpStatus && (
//                         <p className="text-red-500 text-sm mt-1">{errors?.otpStatus?.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}

//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };
// export default LoadSurvey;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HT_LOAD_CHANGE_BASE, DSP_PRO_BASE, HT_NSC_BASE } from '../../api/api.js';
import { setOfficerData } from "../../redux/slices/userSlice.js";
import { useDispatch } from 'react-redux';
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
import { handleTokenExpiry } from '../../utils/handleTokenExpiry';

// import { In, FileUpload, SelectTag } from '../InputTag.jsx'
import {
  InputTag,
  SelectTag,
  RadioTag,
  fetchCtPtData,
  ApplicantBasicDetails,
  sendOtpNew,
  verifyOtpNew,
  Button,
} from '../importComponents.js';
import {
  region,
  lineType,
  conductorType,
  poleType,
  setSurveyOptions,
  responseOption,
  revertOption,
  getEstimateOptions,
} from '../newComponents/commonOption.js';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { submitFormData } from '../../utils/handlePostApi.js';
import { useSelector } from 'react-redux';
import { useForm, useWatch } from 'react-hook-form';
import { getFinalUsingData } from '../../utils/handlePostApi.js';
import AlertModalBox from '../alertModelBox.jsx';
import Cookies from 'js-cookie';

const LoadSurvey = () => {
  const officerData = useSelector(state => state.user.officerData);
  // const [mobileNo, setMobileNo] = useState(officerData?.employee_detail.cug_mobile);
  const [mobileNo, setMobileNo] = useState('');
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [fromDataValue, setFromDataValue] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { items } = location.state || {};
  console.log(items, 'items ');
  let supply_voltage = items.new_supply_voltage.replace(/kv/i, '').trim();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });
  const token = Cookies.get('accessToken');
  const [circle, setCircle] = useState([]);
  const [division, setDivision] = useState([]);
  const [ehvSubStation, setEHVSubStation] = useState([]);
  const [thirtyThreeFeeder, setThirtyThreeFeeder] = useState([]);
  const [thirtyThreeSubstation, setThirtyThreeSubstation] = useState([]);
  const [elevenFeeder, setElevenFeeder] = useState([]);
  const [taskDescription, setTaskDescription] = useState([]);
  const [ctRatio, setCtRatio] = useState([]);
  const [ctSelectRatio, setSelectCtRatio] = useState('');
  const [ptRatio, setPtRatio] = useState([]);
  const [meExtimateblock, setMeExtimateblock] = useState(false);
  const [exExtimateblock, setExExtimateblock] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);


  const [isMeErpFetched, setIsMeErpFetched] = useState(false);
  const [isExtErpFetched, setIsExtErpFetched] = useState(false);
  const dispatch = useDispatch()

  console.log(DSP_PRO_BASE, 'DSP_PRO_BASE inside load survey')
  console.log(HT_NSC_BASE, 'HT_NSC_BASE inside survey')

  const RegionId = watch('region');
  const CircleId = watch('circle');
  const DivisionId = watch('division');
  const EHVSubStationId = watch('ehv_sub_station');
  const ThirtyThreeFeederId = watch('thirty_three_feeder');
  const ThirtyThreeSubstation = watch('thirty_three_sub_station');
  const is_required = watch('is_required');
  const is_estimate_required = watch('is_estimate_required') || [];

  const survey_response = watch('survey_response');
  const existingMeCtRatio = items?.me_ct_ratio; // Installed ME CT Ratio (existing)

  const selectedNewCtRatio = useWatch({
    control,
    name: 'new_ct_ratio',
  });

  useEffect(() => {
    if (officerData?.employee_detail?.cug_mobile) {
      setMobileNo(officerData.employee_detail.cug_mobile);
    }
  }, [officerData]);

  const filteredSurveyOptions = React.useMemo(() => {

    if (
      existingMeCtRatio &&
      selectedNewCtRatio &&
      existingMeCtRatio === selectedNewCtRatio
    ) {
      // Estimate option hide
      return setSurveyOptions.filter(
        opt => opt.value !== 'is_estimate_required'
      );
    }

    // otherwise dono options dikhenge
    return setSurveyOptions;
  }, [existingMeCtRatio, selectedNewCtRatio]);

  console.log(filteredSurveyOptions, 'filtered survey option')

  useEffect(() => {
    if (
      existingMeCtRatio &&
      selectedNewCtRatio &&
      existingMeCtRatio === selectedNewCtRatio
    ) {
      setValue('is_required', '');
    }
  }, [existingMeCtRatio, selectedNewCtRatio]);



  useEffect(() => {
    const fetchData = async () => {
      const ratioData = await fetchCtPtData(items);
      setCtRatio(ratioData.ct_result.data);
      setPtRatio(ratioData.pt_result.data);
      setSelectCtRatio(ratioData.matched);
      // setValue("new_ct_ratio", items.)
      // setValue('new_ct_ratio', items?.load_sanction?.new_ct_ratio);
      // setValue('new_pt_ratio', items?.load_sanction?.new_pt_ratio);
      setValue('new_ct_ratio', items?.load_sanction?.new_ct_ratio);
      setValue('new_pt_ratio', items?.load_sanction?.new_pt_ratio);
    };
    if (items?.new_supply_voltage) {
      fetchData(items);
    }
  }, [items?.new_supply_voltage]);

  useEffect(() => {
    const getFatchData = async () => {
      let response = await getFinalUsingData(`${HT_NSC_BASE}/tasks/filter/${supply_voltage}`);
      let result = await response.json();
      setTaskDescription(result.results);
    };
    getFatchData();
  }, []);
  useEffect(() => {
    const getFatchData = async () => {
      let response = await getFinalUsingData(`${HT_NSC_BASE}/get_circle?region=${RegionId}`);
      let result = await response.json();
      setCircle(result.Name);

      // const selectedRegion = result.Name.find((r) => r.value === RegionId);
      // console.log(selectedRegion, 'selectedRegion');
    };
    if (RegionId) {
      getFatchData();
    }
  }, [RegionId]);


  useEffect(() => {
    const getFatchData = async () => {
      let response = await getFinalUsingData(`${HT_NSC_BASE}/get_division?circle=${CircleId}`);
      let result = await response.json();
      setDivision(result.Name);
    };
    if (CircleId) {
      getFatchData();
    }
  }, [CircleId]);
  useEffect(() => {
    const getFatchData = async () => {
      let response = await getFinalUsingData(
        `${HT_NSC_BASE}/get_ehv_by_division?division=${DivisionId}`
      );
      let result = await response.json();
      setEHVSubStation(result.Name);
    };
    if (DivisionId) {
      getFatchData();
    }
  }, [DivisionId]);
  useEffect(() => {
    const getFatchData = async () => {
      let response = await getFinalUsingData(
        `${HT_NSC_BASE}/get_feeder33_by_ehv?ehv=${EHVSubStationId}`
      );
      let result = await response.json();
      setThirtyThreeFeeder(result.Name);
    };
    if (EHVSubStationId) {
      getFatchData();
    }
  }, [EHVSubStationId]);

  useEffect(() => {
    const getFatchData = async () => {
      let response = await getFinalUsingData(
        `${HT_NSC_BASE}/get_substation_by_feeder33?feeder33=${ThirtyThreeFeederId}`
      );
      let result = await response.json();
      setThirtyThreeSubstation(result.Name);
    };
    if (ThirtyThreeFeederId) {
      getFatchData();
    }
  }, [ThirtyThreeFeederId]);

  useEffect(() => {
    const getFatchData = async () => {
      let response = await getFinalUsingData(
        `${HT_NSC_BASE}/get_feeder11_by_ss?ss=${ThirtyThreeSubstation}`
      );
      let result = await response.json();
      setElevenFeeder(result.Name);
    };
    if (ThirtyThreeSubstation) {
      getFatchData();
    }
  }, [ThirtyThreeSubstation]);


  const fetchEstimateDetails = async (erpField, type) => {
    console.log(type, 'type')
    try {
      let erp_no = getValues(erpField);
      if (!erp_no) {
        setError(erpField, { type: 'manual', message: 'ERP Number is required' });
        return;
      }

      setIsDisabled(true);

      const response = await axios.get(`${DSP_PRO_BASE}/XXPA_PROJECTS_HT_V/${erp_no}`);
      const { statusCode, data, message } = response.data;

      // ❌ ERP NOT FOUND (404 OR EMPTY)
      if (statusCode !== "200" || !Array.isArray(data) || data.length === 0) {
        if (type === 'ME') setIsMeErpFetched(false);
        if (type === 'EXT') setIsExtErpFetched(false);

        setError(erpField, {
          type: 'manual',
          message: 'ERP data not found',
        });

        return; // ⛔ STOP HERE
      }

      // ✅ ERP FOUND
      const projectData = data[0];

      // ❌ STATUS NOT APPROVED
      if (projectData.STATUS !== 'Approved') {
        setError(erpField, {
          type: 'manual',
          message: 'ERP is not Approved',
        });
        return;
      }

      // ✅ SUCCESS FLOW
      clearErrors(erpField);

      if (type === 'ME') setIsMeErpFetched(true);
      if (type === 'EXT') setIsExtErpFetched(true);


      if (projectData.STATUS !== 'Approved') {
        setError(erpField, {
          type: 'manual',
          message: 'ERP is not Approved',
        });

        if (type === 'ME') setIsMeErpFetched(false);
        if (type === 'EXT') setIsExtErpFetched(false);

        return;
      }

      if (type === 'ME') {
        setIsMeErpFetched(true);
        setMeExtimateblock(true);
      }

      if (type === 'EXT') {
        setIsExtErpFetched(true);
        setExExtimateblock(true);
      }


      if (type == "ME" && projectData.SCHEMECODE !== "DEPOSITE") {
        setMeExtimateblock(false);

        setError(erpField, { message: 'No data found for ME METER ERP No' });
        alert(
          "This ERP data is under the SCCW scheme. ME meter estimate is not permitted."
        );

        return;
      }
      // clear error if data found
      setError(erpField, { message: '' });

      // destructure response
      const {
        STATUS,
        SUPER_TAX,
        SUPER_CGST,
        SUPER_SGST,
        ESTIMATE_DATE,
        SANCTION_DATE,
        ESTIMATED_TAX,
        SUPERVISION_COST,
        ESTIMATED_COST,
        ESTIMATE_NO,
        PROJECT_TYPE,
        SCHEMECODE,
        APPROVED_BY_NAME,
        SANCT_COST,
        ORG1,
        ORG,
        LONG_NAME,
        EST_WITHOUT_SUPER_COST,
      } = projectData;

      if (STATUS === 'Approved') {
        const estimateDate = new Date(ESTIMATE_DATE).toISOString().split('T')[0];
        const sanctionDate = new Date(SANCTION_DATE).toISOString().split('T')[0];
        if (type === 'ME') {
          setMeExtimateblock(true);
          setIsMeErpFetched(true);
          setValue('ndf_approved_by_name', APPROVED_BY_NAME);
          setValue('ndf_estimate_date', estimateDate);
          setValue('ndf_sanction_date', sanctionDate);
          setValue('ndf_sanction_amt', SANCT_COST);
          setValue('ndf_supervision_cost', SUPERVISION_COST);
          setValue('ndf_estimate_amt', ESTIMATED_COST);
          setValue('ndf_supervision_cgst', SUPER_CGST);
          setValue('ndf_supervision_sgst', SUPER_SGST);
          // setValue("ndf_sanction_date", SANCTION_DATE);
          setValue('ndf_long_name', LONG_NAME);
          setValue('ndf_status', STATUS);
          setValue('ndf_scheme_name', SCHEMECODE);
          setValue('ndf_circle_name', ORG1);
          setValue('ndf_division_name', ORG);
          setValue('ndf_total_amt', SANCT_COST);
          setValue('ndf_estimate_no', ESTIMATE_NO);
          setValue('ndf_est_without_super_cost', EST_WITHOUT_SUPER_COST);
        } else if (type === 'EXT') {
          let super_tax = SUPER_TAX / 2;

          setExExtimateblock(true);
          setIsExtErpFetched(true);
          setValue('status', STATUS);
          setValue('scheme_name', SCHEMECODE);
          setValue('supervision_cgst', SUPER_CGST);
          setValue('supervision_sgst', SUPER_SGST);
          setValue('supervision_amt', SUPERVISION_COST);
          setValue('total_estimated_amt', ESTIMATED_COST);
          setValue('sanction_amt', SANCT_COST);
          setValue('estimate_date', new Date(ESTIMATE_DATE).toISOString().split('T')[0]);
          setValue('sanction_date', new Date(SANCTION_DATE).toISOString().split('T')[0]);
          setValue('long_name', LONG_NAME);
          setValue('est_without_super_cost', EST_WITHOUT_SUPER_COST);

          if (SCHEMECODE === 'SCCW') {
            setValue(
              'total_estimated_amt',
              // Math.ceil(Number(SUPER_TAX) + Number(SUPERVISION_COST))
              Math.ceil(Number(ESTIMATED_COST))
            );
          } else {
            setValue('total_estimated_amt', Math.ceil(ESTIMATED_COST));
          }
          setValue('estimate_date', date);
        }
      }
    } catch (error) {
      //   console.error('API Error:', error);
      //   setError(erpField, { message: 'Erp Number Does Not exist' });
      console.error(err);

      setError(erpField, {
        type: 'manual',
        message: 'ERP service error. Try again.',
      });

      if (type === 'ME') setIsMeErpFetched(false);
      if (type === 'EXT') setIsExtErpFetched(false);
      setError(erpField, { message: 'ERP Number does not exist' });
    } finally {
      setIsDisabled(false);
    }
  };
   //old 
  // const handleSendOtp = async formData => {
  //   setFromDataValue(formData);
  //   const sentOtp = await sendOtpNew(mobileNo);
  //   if (sentOtp.success) {
  //     setShowOtpBtn(true);
  //     setIsDisabled(true);
  //     setError('otpSuccess', {
  //       type: 'manual',
  //       message: sentOtp.message,
  //     });
  //   } else {
  //     setError('otpStatus', {
  //       type: 'manual',
  //       message: sentOtp.message,
  //     });
  //   }
  // };

  //using this func
  const handleSendOtp = async formData => {
    if (isSendOtpLoading) return; // safety guard

    setIsSendOtpLoading(true);   // ⬅️ button disable start
    setFromDataValue(formData);

    try {
      const sentOtp = await sendOtpNew(mobileNo);
      console.log(sentOtp,'sent otpppppppp')
      if (sentOtp.success) {
        setShowOtpBtn(true);
        setIsDisabled(true); // form fields lock
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
    } catch (err) {
      setError('otpStatus', {
        type: 'manual',
        message: 'Failed to send OTP. Please try again.',
      });
    } finally {
      setIsSendOtpLoading(false); // ⬅️ button enable back
    }
  };

  //new func
//   const handleSendOtp = async (formData) => {
//   setIsSendOtpLoading(true);
//   setFromDataValue(formData);

//   const result = await sendOtpNew(mobileNo);

//   if (result.success) {
//     setShowOtpBtn(true);
//     setIsDisabled(true);
//     setError("otpSuccess", { message: result.message });
//   } else {
//     setError("otpStatus", { message: result.message });
//   }

//   setIsSendOtpLoading(false);
// };

 //using this func
  const handleVerifyOtp = async () => {
    const otpValue = getValues('otp');
    setBtnIsDisabled(true);
    const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);
    console.log(verifyOtpResponse,'verifyOtpResponseeeee')
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
  
  //new func based on msg
//   const handleVerifyOtp = async () => {
//   setBtnIsDisabled(true);

//   const result = await verifyOtpNew(mobileNo, getValues("otp"));

//   if (result.success) {
//     handleFinalSubmit();
//   } else {
//     setError("otp", { message: result.error });
//     setBtnIsDisabled(false);
//   }
// };

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


  // const handleFinalSubmit = async () => {

  //   // 🚨 ERP REQUIRED BUT NOT FETCHED
  //   if (is_required === 'is_estimate_required') {

  //     if (
  //       is_estimate_required.includes('is_me_meter_required') &&
  //       !isMeErpFetched
  //     ) {
  //       setError('ndf_erp_no', {
  //         type: 'manual',
  //         message: 'ME Meter ERP data not fetched',
  //       });
  //       return; // ⛔ STOP SUBMIT
  //     }

  //     if (
  //       is_estimate_required.includes('is_extension_work_required') &&
  //       !isExtErpFetched
  //     ) {
  //       setError('erp_no', {
  //         type: 'manual',
  //         message: 'Extension Work ERP data not fetched',
  //       });
  //       return; // ⛔ STOP SUBMIT
  //     }
  //   }

  //   // ✅ All validations passed → API CALL
  //   try {
  //     const formValue = fromDataValue;
  //     const formData = new FormData();

  //     Object.entries(formValue).forEach(([key, value]) => {
  //       if (value instanceof FileList && value.length > 0) {
  //         formData.append(key, value[0]);
  //         return;
  //       }
  //       if (value instanceof File) {
  //         formData.append(key, value);
  //         return;
  //       }
  //       if (value !== undefined && value !== null && value !== '') {
  //         formData.append(key, value);
  //       }
  //     });

  //     const { data } = await axios.post(
  //       `${HT_LOAD_CHANGE_BASE}/surveys/`,
  //       formData,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     alert('Survey submitted successfully ✅');
  //     navigate(`/dashboard/respones/${data.data.application}`, {
  //       state: data.data,
  //     });

  //   } catch (error) {
  //     console.error(error);
  //     alert('Submission failed ❌');
  //   } finally {
  //     setBtnIsDisabled(false);
  //   }
  // };
  const handleFinalSubmit = async () => {

    // 🚨 ERP VALIDATION (as-is, no change)
    if (is_required === 'is_estimate_required') {

      if (
        is_estimate_required.includes('is_me_meter_required') &&
        !isMeErpFetched
      ) {
        setError('ndf_erp_no', {
          type: 'manual',
          message: 'ME Meter ERP data not fetched',
        });
        return;
      }

      if (
        is_estimate_required.includes('is_extension_work_required') &&
        !isExtErpFetched
      ) {
        setError('erp_no', {
          type: 'manual',
          message: 'Extension Work ERP data not fetched',
        });
        return;
      }
    }

    try {
      // ✅ TAKE FRESH VALUES (THIS IS THE FIX)
      const formValue = getValues();   // ⭐⭐⭐ MAIN FIX ⭐⭐⭐
      const formData = new FormData();

      Object.entries(formValue).forEach(([key, value]) => {

        // FileList
        if (value instanceof FileList && value.length > 0) {
          formData.append(key, value[0]);
          return;
        }

        // File
        if (value instanceof File) {
          formData.append(key, value);
          return;
        }

        // Skip empty
        if (value === undefined || value === null || value === '') {
          return;
        }

        // Normal fields
        formData.append(key, value);
      });

      // 🧪 DEBUG (optional – once)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const { data } = await axios.post(
        `${HT_LOAD_CHANGE_BASE}/surveys/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Survey submitted successfully ✅');
      navigate(`/dashboard/respones/${data.data.application}`, {
        state: data.data,
      });
      const updatedFlags = await handleOfficerFlagCount();
      dispatch(setOfficerData(updatedFlags));

    } catch (error) {
      if (handleTokenExpiry(error, navigate)) return;

      // normal error handling
      console.error(error);
      alert('Submission failed ❌');
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
              <h2 className="text-lg font-bold capitalize ">HT Load Change Survey</h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                {/* <div className="body p-4"> */}
                {/* {officerData?.employee_detail.role} */}
                <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
              </div>
              <input
                type="hidden"
                value={items.id}
                {...register('application')}
              ></input>

              {/* <ApplicantFillDetails htConsumers={items} /> */}
              {(officerData?.employee_detail.role == 2 || officerData?.employee_detail.role == 34) && (
                <>
                  {items.new_supply_voltage === items.existing_supply_voltage ? (
                    <>
                      <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                        {/* <div className="card-header px-4 py-2 border-b border-gray-300">
                          <h2 className="text-lg font-bold capitalize ">
                            Latitude and Longitude of Location where ME is to be installed
                          </h2>
                        </div> */}
                        <div className="card-body px-4 pb-4">
                          <div className="">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                              <InputTag
                                LName="Maximum load on Feeder(in Amp)"
                                placeholder="Please Enter Maximum load on Feeder(in Amp)"
                                {...register('lr_values', {
                                  required: ' Maximum load on Feeder(in Amp) is required',
                                })}
                                errorMsg={errors.lr_values?.message}
                              />
                              <InputTag
                                LName="Percentage Voltage Regulation(VR Value)"
                                placeholder="Please Enter Percentage Voltage Regulation(VR Value)"
                                {...register('vr_values', {
                                  required: 'Percentage Voltage Regulation(VR Value) is required',
                                })}
                                errorMsg={errors.vr_values?.message}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                        <div className="card-header px-4 py-2 border-b border-gray-300">
                          <h2 className="text-lg font-bold capitalize ">
                            Choose the Orign Substation and Feeder Details (Supply Feeding to Consumer)
                          </h2>
                        </div>
                        <div className="card-body px-4 pb-4">
                          <div className="">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                              <SelectTag
                                options={region}
                                LName="Region"
                                {...register('region', { required: 'Region is required' })}
                                errorMsg={errors.region?.message}
                                labelKey="label"
                                valueKey="value"
                                placeholder="Select Region"
                              />
                              <SelectTag
                                options={circle}
                                LName="Circle"
                                {...register('circle', { required: 'Circle is required' })}
                                errorMsg={errors.circle?.message}
                                labelKey="circle_code"
                                valueKey="circle_name"
                              />
                              <SelectTag
                                options={division}
                                LName="Division"
                                {...register('division', { required: 'division is required' })}
                                errorMsg={errors.division?.message}
                                labelKey="circle_code"
                                valueKey="circle_name"
                              />
                              <SelectTag
                                options={ehvSubStation}
                                LName="EHV SubStation Name"
                                {...register('ehv_sub_station', {
                                  required: 'ehv SubStation is required',
                                })}
                                errorMsg={errors.ehv_sub_station?.message}
                                labelKey="circle_code"
                                valueKey="circle_name"
                              />
                              {items.new_supply_voltage === "33 KV" && (
                                <>
                                  <SelectTag
                                    options={thirtyThreeFeeder}
                                    LName="33 Feeder Name"
                                    {...register('thirty_three_feeder', {
                                      required: 'thirty Three Feeder is required',
                                    })}
                                    errorMsg={errors.thirty_three_feeder?.message}
                                    labelKey="circle_code"
                                    valueKey="circle_name"
                                  />
                                  {items.new_supply_voltage === "11 KV" && (
                                    <>
                                      <SelectTag
                                        options={thirtyThreeSubstation}
                                        LName="33 SubStation Name"
                                        {...register('thirty_three_sub_station', {
                                          required: 'Thirty Three Feeder is required',
                                        })}
                                        errorMsg={errors.thirty_three_sub_station?.message}
                                        labelKey="circle_code"
                                        valueKey="circle_name"
                                      />
                                      <SelectTag
                                        options={elevenFeeder}
                                        LName="11 Feeder Name"
                                        {...register('eleven_feeder', {
                                          required: '11 Feeder Name is required',
                                        })}
                                        errorMsg={errors.eleven_feeder?.message}
                                        labelKey="circle_code"
                                        valueKey="circle_name"
                                      />
                                    </>
                                  )}
                                </>
                              )}

                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card mt-2 mb-2 bg-white rounded shadow-md ">

                        <div className="card-body px-4 pb-4">
                          <div className="">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                              <InputTag
                                LName="Maximum load on Feeder(in Amp)"
                                placeholder="Please Enter Maximum load on Feeder(in Amp)"
                                {...register('lr_values', {
                                  required: ' Maximum load on Feeder(in Amp) is required',
                                })}
                                errorMsg={errors.lr_values?.message}
                              />
                              <InputTag
                                LName="Percentage Voltage Regulation(VR Value)"
                                placeholder="Please Enter Percentage Voltage Regulation(VR Value)"
                                {...register('vr_values', {
                                  required: 'Percentage Voltage Regulation(VR Value) is required',
                                })}
                                errorMsg={errors.vr_values?.message}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                        <div className="card-header px-4 py-2 border-b border-gray-300">
                          <h2 className="text-lg font-bold capitalize ">
                            Latitude and Longitude of Location where ME is to be installed
                          </h2>
                        </div>
                        <div className="card-body px-4 pb-4">
                          <div className="">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                              <InputTag
                                LName="Latitude of ME Installation Location"
                                placeholder="Please Enter Latitude of ME Installation Location"
                                {...register('latitude')}
                                errorMsg={errors.latitude?.message}
                              />
                              <InputTag
                                LName="Longitude of ME Installation Location"
                                placeholder="Please Enter Longitude of ME Installation Location"
                                {...register('longitude')}
                                errorMsg={errors.longitude?.message}
                              />
                              <InputTag

                                LName="Upload single line diagram including VR Calculation."
                                type={"file"}
                                {...register('upload_single_line_docs', {
                                  required: 'single line diagram is required',
                                })}
                                errorMsg={errors.upload_single_line_docs?.message}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                        <div className="card-header px-4 py-2 border-b border-gray-300">
                          <h2 className="text-lg font-bold capitalize ">
                            Installed ME CT And PT Ratio
                          </h2>
                        </div>
                        <div className="card-body px-4 pb-4">
                          <div className="">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                              <InputTag
                                LName="Installed ME CT Ratio"
                                Iname="me_ct_ratio"
                                {...register('me_ct_ratio')}
                                errorMsg={errors.me_ct_ratio?.message}
                              />
                              <InputTag
                                LName="Installed ME PT Ratio"
                                Iname="me_pt_ratio"
                                {...register('me_pt_ratio')}
                                errorMsg={errors.me_pt_ratio?.message}
                              />
                              <Button label='Download Check List'></Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                    <div className="card-header px-4 py-2 border-b border-gray-300">
                      <h2 className="text-lg font-bold capitalize ">Summary of Infrastructure</h2>
                    </div>
                    <div className="card-body px-4 pb-4">
                      <div className="">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                          <SelectTag
                            options={lineType}
                            LName="Line Type"
                            {...register('region_name', { required: 'Region is required' })}
                            errorMsg={errors.me_pt_ratio?.message}
                            labelKey="label"
                            valueKey="value"
                          />
                          <InputTag
                            LName="Distance From Existing Substation to Connection Premise(in KM)"
                            placeholder=""
                            {...register('distance')}
                            errorMsg={errors.distance?.message}
                          />
                          <SelectTag
                            options={conductorType}
                            LName="Conductor Type"
                            {...register('conductor_type', {
                              required: 'conductor type is required',
                            })}
                            errorMsg={errors.conductor_type?.message}
                            labelKey="label"
                            valueKey="value"
                          />
                          <SelectTag
                            options={poleType}
                            LName="Pole Type"
                            {...register('pole_type', { required: 'Pole Type is required' })}
                            errorMsg={errors.pole_type?.message}
                            labelKey="label"
                            valueKey="value"
                          />
                          <SelectTag
                            options={taskDescription}
                            LName="Task Description"
                            {...register('task_description', {
                              required: 'Task Description is required',
                            })}
                            errorMsg={errors.task_description?.message}
                            labelKey="sor_description"
                            valueKey="scheme_name"
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                    </>
                  )}

                  <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                    <div className="card-header px-4 py-2 border-b border-gray-300">
                      <h2 className="text-lg font-bold capitalize ">Acceptance</h2>
                    </div>
                    <div className="card-body px-4 pb-4">
                      <div className="">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                          <SelectTag
                            LName="Acceptance"
                            options={responseOption}
                            {...register('survey_response', {
                              required: 'Please Select  Acceptance is required',
                            })}
                            errorMsg={errors.survey_response?.message}
                            labelKey="label"
                            valueKey="value"
                          />

                          {survey_response === 'Accepted' && (
                            <>

                              <InputTag
                                LName=" Signed Check List PDF"
                                type="file"
                                {...register('survey_checklist_pdf', {
                                  required: 'Check List Letter is required',
                                })}
                                errorMsg={errors.survey_checklist_docs?.message}
                              />
                              {/* <RadioTag
                                options={setSurveyOptions}
                                {...register('is_required', { required: 'Option is required' })}
                                errorMsg={errors.is_required?.message}
                              /> */}
                              <RadioTag
                                options={filteredSurveyOptions}
                                {...register('is_required', { required: 'Option is required' })}
                                errorMsg={errors.is_required?.message}
                              />


                              <SelectTag
                                LName="Required ME CT Ratio"
                                options={ctRatio}
                                {...register('new_ct_ratio', {
                                  required: 'Please  select Ct Ratio is required',
                                })}
                                errorMsg={errors.new_ct_ratio?.message}
                                labelKey="ct_ratio_me"
                                valueKey="ct_ratio_me"
                              />
                              <SelectTag
                                LName="Required ME PT Ratio"
                                options={ptRatio}
                                {...register('new_pt_ratio', {
                                  required: 'Please  select Pt Ratio is required',
                                })}
                                errorMsg={errors.new_pt_ratio?.message}
                                labelKey="pt_ratio"
                                valueKey="pt_ratio"
                              />
                              {is_required === 'is_estimate_required' && (
                                <RadioTag
                                  options={getEstimateOptions(
                                    items.new_supply_voltage,
                                    items.existing_supply_voltage
                                  )}
                                  {...register('is_estimate_required', {
                                    required: 'Option is required',
                                  })}
                                  errorMsg={errors.is_estimate_required?.message}
                                  type="checkbox"
                                />
                              )}
                            </>
                          )}
                          {survey_response === 'Reverted' && (
                            <>
                              <SelectTag
                                options={revertOption}
                                LName="Revert Reason"
                                {...register('revert_reason', {
                                  required: 'Please Select Revert Reason is required',
                                })}
                                errorMsg={errors.revert_reason?.message}
                                labelKey="label"
                                valueKey="value"
                              />
                              <InputTag
                                LName="Revert Reason Remark"
                                placeholder="Please Enter Revert Reason Remark"
                                {...register('revert_remark', {
                                  required: 'Revert Reason Remark is required',
                                })}
                                errorMsg={errors.revert_remark?.message}
                              />
                              <InputTag
                                LName="Upload Revert Docs"
                                type="file"
                                {...register('revert_reson_docs', {
                                  required: 'Upload Upload Revert Docs is required',
                                })}
                                errorMsg={errors.revert_reson_docs?.message}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {survey_response === 'Accepted' && (
                    <>
                      {is_required === 'is_estimate_required' && (
                        <>
                          {is_estimate_required.includes('is_me_meter_required') && (
                            <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                              <div className="card-header px-4 py-2 border-b border-gray-300">
                                <h2 className="text-lg font-bold capitalize ">
                                  ERP Details Of NDF(Me Meter Estimate)Estimate
                                </h2>
                              </div>
                              <div className="card-body px-4 pb-4">
                                <div className="">
                                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                                    <InputTag
                                      LName="ERP No of Me Estimate"
                                      placeholder="ME Estimate No."
                                      {...register('ndf_erp_no', {
                                        required: 'Me Estimate is required',
                                      })}
                                      errorMsg={errors.ndf_erp_no?.message}
                                    />

                                    <button
                                      onClick={() => fetchEstimateDetails('ndf_erp_no', 'ME')}
                                      disabled={isDisabled}
                                      type="button"
                                      className={`py-0 px-0 mt-6 rounded text-white ${isDisabled
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-800'
                                        }`}
                                    >
                                      {isDisabled ? 'Get ERP Details...' : 'Get ERP Details'}
                                    </button>
                                    {meExtimateblock && (
                                      <>
                                        <InputTag
                                          LName="Circle Name"
                                          type="text"
                                          {...register('ndf_circle_name', {
                                            required: 'Circle Name is required',
                                          })}
                                          errorMsg={errors.ndf_circle_name?.message}
                                          readOnly
                                        />

                                        <InputTag
                                          LName="Division Name"
                                          {...register('ndf_division_name', {
                                            required: 'Division Name is required',
                                          })}
                                          errorMsg={errors.ndf_division_name?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Sanction Date"
                                          placeholder="Estimate Date."
                                          {...register('ndf_estimate_date', {
                                            required: 'Estimate Date is required',
                                          })}
                                          errorMsg={errors.ndf_estimate_date?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Long Name"
                                          type={"taxtarea"}
                                          {...register('ndf_long_name', {
                                            required: 'lond Name is required',
                                          })}
                                          errorMsg={errors.ndf_long_name?.message}

                                        />
                                        {/* <InputTag
                                                      LName="Sanction Date"
                                                      placeholder="Sanction Date."
                                                      type="date"
                                                      {...register('ndf_sanction_date', {
                                                        required: 'Sanction Date is required',
                                                      })}
                                                      errorMsg={errors.ndf_sanction_date?.message}
                                                      readOnly
                                        /> */}
                                        {/* <InputTag
                                          LName="Sanction Cost"
                                          {...register('ndf_sanction_amt', {
                                            required: 'Sanction Cost is required',
                                          })}
                                          errorMsg={errors.ndf_sanction_amt?.message}
                                          readOnly
                                        /> */}

                                        <InputTag
                                          LName="Status"
                                          {...register('ndf_status', {
                                            required: 'Status is required',
                                          })}
                                          errorMsg={errors.ndf_status?.message}
                                          readOnly
                                        />

                                        <InputTag
                                          LName="Approved By Name"
                                          {...register('ndf_approved_by_name', {
                                            required: 'Approved By Name is required',
                                          })}
                                          errorMsg={errors.ndf_approved_by_name?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Scheme Name"
                                          {...register('ndf_scheme_name', {
                                            required: 'Scheme Name is required',
                                          })}
                                          errorMsg={errors.ndf_scheme_name?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Estimate Cost Without Supervision Amount"
                                          placeholder="Estimate Cost Without Supervision Amount."
                                          {...register('ndf_est_without_super_cost', {
                                            required: 'ndf_est_without_super_cost',
                                          })}
                                          errorMsg={errors.ndf_Est_Without_Super_Cost?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Supervision Amount"
                                          {...register('ndf_supervision_cost', {
                                            required: 'Sanction Cost is required',
                                          })}
                                          errorMsg={errors.ndf_supervision_cost?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName=" Supervision CGST Cost"
                                          placeholder=" Supervision CGST Cost."
                                          {...register('ndf_supervision_cgst', {
                                            required: ' Supervision CGST Cost is required',
                                          })}
                                          errorMsg={errors.ndf_supervision_cgst?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Supervision SGST Cost"
                                          placeholder="Supervision SGST Cost."
                                          {...register('ndf_supervision_sgst', {
                                            required: 'Supervision SGST Cost is required',
                                          })}
                                          errorMsg={errors.ndf_supervision_sgst?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Total Amount"
                                          placeholder="Total Amount."
                                          {...register('ndf_total_amt', {
                                            required: 'Total  Amount is required',
                                          })}
                                          errorMsg={errors.ndf_total_amt?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Me Estimate Pdf"
                                          type="file"
                                          {...register('ndf_upload_estimate_docs', {
                                            required: 'Me Estimate Letter is required',
                                          })}
                                          errorMsg={errors.ndf_upload_estimate_docs?.message}
                                        />
                                      </>
                                    )}

                                    {/* <InputTag LName="Percentage Voltage Regulation(VR Value)"  placeholder="Percentage Voltage Regulation(VR Value)"{...register("vr_value", { required: "Percentage Voltage Regulation(VR Value) is required" })} errorMsg={errors.vr_value?.message} />
                                      <SelectTag options={region} LName="Fetch ERP " {...register("region", { required: "Region is required" })} errorMsg={errors.region?.message} labelKey="label" valueKey="value" /> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {is_estimate_required.includes('is_extension_work_required') && (
                            <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                              <div className="card-header px-4 py-2 border-b border-gray-300">
                                <h2 className="text-lg font-bold capitalize ">
                                  ERP Details Of Extension Work
                                </h2>
                              </div>
                              <div className="card-body px-4 pb-4">
                                <div className="">
                                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                                    <InputTag
                                      LName="ERP No of Extension Estimate"
                                      placeholder="Extension Estimate No."
                                      {...register('erp_no', {
                                        required: 'Extension Estimate is required',
                                      })}
                                      errorMsg={errors.erp_no?.message}
                                    />
                                    <button
                                      onClick={() => fetchEstimateDetails('erp_no', 'EXT')}
                                      disabled={isDisabled}
                                      type="button"
                                      className={`py-0 px-0 mt-6 rounded text-white ${isDisabled
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-800'
                                        }`}
                                    >
                                      {isDisabled ? 'Get ERP Details...' : 'Get ERP Details'}
                                    </button>
                                    {exExtimateblock && (
                                      <>
                                        <InputTag
                                          LName="Sanction Date"
                                          placeholder="Estimate Date."
                                          {...register('estimate_date', {
                                            required: 'Estimate Date is required',
                                          })}
                                          errorMsg={errors.estimate_date?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Long Name"
                                          type={"taxtarea"}
                                          {...register('long_name', {
                                            required: 'lond Name is required',
                                          })}
                                          errorMsg={errors.long_name?.message}
                                          readOnly
                                        />


                                        <InputTag
                                          LName="Status"
                                          placeholder="Status."
                                          {...register('status', {
                                            required: 'Estimate Status is required',
                                          })}
                                          errorMsg={errors.ndf_status?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Scheme Name"
                                          placeholder="Scheme Name."
                                          {...register('scheme_name', {
                                            required: 'Estimate Scheme Name is required',
                                          })}
                                          errorMsg={errors.scheme_name?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Estimate Cost Without Supervision Amount"
                                          placeholder="Estimate Cost Without Supervision Amount."
                                          {...register('est_without_super_cost', {
                                            required: 'est_without_super_cost',
                                          })}
                                          errorMsg={errors.est_without_super_cost?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Supervision Amount"
                                          placeholder="Estimate Cost Excluding GST."
                                          {...register('supervision_amt', {
                                            required: 'Estimate Cost is required',
                                          })}
                                          errorMsg={errors.supervision_amt?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName=" Supervision CGST Cost"
                                          placeholder=" Supervision CGST Cost."
                                          {...register('supervision_cgst', {
                                            required: ' Supervision CGST Cost is required',
                                          })}
                                          errorMsg={errors.supervision_cgst?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Supervision SGST Cost"
                                          placeholder="Supervision SGST Cost."
                                          {...register('supervision_sgst', {
                                            required: 'Supervision SGST Cost is required',
                                          })}
                                          errorMsg={errors.supervision_sgst?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Total Amount"
                                          placeholder="Total Amount"
                                          {...register('total_estimated_amt', {
                                            required: 'Total Amount is required',
                                          })}
                                          errorMsg={errors.total_estimated_amt?.message}
                                          readOnly
                                        />
                                        <InputTag
                                          LName="Extension Estimate Pdf"
                                          type="file"
                                          {...register('extension_work_estimate_docs', {
                                            required: 'Extension Estimate Letter is required',
                                          })}
                                          errorMsg={errors.extension_work_estimate_docs?.message}
                                          readOnly
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 flex flex-col justify-center items-center">
                      <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                        {!showOtpBtn && (
                          <>
                            <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-red-600 duration-300">
                              Reset
                            </button>
                            {survey_response === 'Reverted' ? (
                              <button
                                type="submit"
                                className={`  text-white px-4 py-2 mt-4 rounded 
                            ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-purple-800 text-white'}`}
                                disabled={isDisabled}
                              >
                                {isSendOtpLoading ? 'Please wait...' : 'Revet For Survey'}
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className={`  text-white px-4 py-2 mt-4 rounded 
                               ${isSendOtpLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-purple-800 text-white'}`}
                                disabled={isSendOtpLoading}
                              >
                                {isSendOtpLoading
                                  ? "Please wait..."
                                  : is_required === "is_estimate_required"
                                    ? "Send for Demand Note"
                                    : is_required === "is_agreement_required"
                                      ? "Send for Agreement"
                                      : "Send for Demand Note"}

                              </button>
                            )}
                          </>
                        )}
                        {showOtpBtn && (
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
                </>
              )}

            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default LoadSurvey;





