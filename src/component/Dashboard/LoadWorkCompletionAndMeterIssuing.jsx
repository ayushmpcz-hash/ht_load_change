import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import {
  ApplicantBasicDetails,
  SelectTag,
  InputTag,
  getNgbToken,
  getFinalUsingDataToken,
  sendOtpNew,
  verifyOtpNew,
} from '../importComponents.js';
import { responseOption, revertOption } from '../newComponents/commonOption.js';
import { NGB_PRO_BASE, HT_LOAD_CHANGE_BASE,HT_NSC_NGB_ID,HT_NGB_PASSWORD } from '../../api/api.js';
const LoadWorkCompletionAndMeterIssuing = () => {
  // let base_url = import.meta.env.VITE_NGB_URL;
  const officerData = useSelector(state => state.user.officerData);
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = location.state || {};

   console.log(NGB_PRO_BASE,'NGB_PRO_BASE inside work completion and isue meter')

    const getDefaultValues = () => {
    if (!items) return {};
    
    const loadSanctionData = items?.load_sanction || {};
    
    return {
      ...items,
      // Map the existing fields to form field names
      me_make:    items?.me_make || '',
      me_ct_ratio:  loadSanctionData?.new_ct_ratio || '',
      me_pt_ratio:  loadSanctionData?.new_pt_ratio || '',
      me_serial_no: items?.me_serial_no || '',

    };
  };

  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues() || {},
  });

  const token = Cookies.get('accessToken');

  // States
  const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [formDataValue, setFormDataValue] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);
  const [allManufactures, setAllManufactures] = useState([]);
  const [allMeModels, setAllMeModels] = useState([]);
  const [allMeterModels, setAllMeterModels] = useState([]);
  const [allCTRatios, setAllCTRatios] = useState([]);
  const [allPTRatios, setAllPTRatios] = useState([]);

  const [ngbToken, setNgbToken] = useState('');
  const work_completion_response = watch('work_completion_response');
  const meter_make = watch('meter_make_issuing');
  const me_make = watch('me_make');
   
  console.log(me_make,'me make---------------')
   console.log(meter_make,'me meter_make********************')

   // Reset form when items are available
  useEffect(() => {
    if (items) {
      const defaults = getDefaultValues();
      console.log('Setting form defaults:', defaults);
      reset(defaults);
    }
  }, [items, reset]);

  useEffect(() => {
    (async () => {
      try {
        const data = {
          userId: HT_NSC_NGB_ID,
          userPwd: HT_NGB_PASSWORD,
        };
        const url = `${NGB_PRO_BASE}/login/verification`;
        const response = await getNgbToken(data, url);
        const token = response?.headers?.get('Authorization');
        if (!token) throw new Error('Authorization token missing');
        const cleanToken = token.replace(/^Bearer\s+/i, '');
        setNgbToken(cleanToken);

        const manufactures = await getFinalUsingDataToken(
          `${NGB_PRO_BASE}/masters/getAllManufactures`,
          cleanToken
        );
        setAllManufactures(manufactures.list);
        const CTRatios = await getFinalUsingDataToken(
          `${NGB_PRO_BASE}/masters/getAllCTRatios`,
          cleanToken
        );
        setAllCTRatios(CTRatios.list);
        const PTRatios = await getFinalUsingDataToken(
          `${NGB_PRO_BASE}/masters/getAllPTRatios`,
          cleanToken
        );
        setAllPTRatios(PTRatios.list);
      } catch (err) {
        console.error('Error fetching NGB token:', err.message || err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const models = await getFinalUsingDataToken(
          `${NGB_PRO_BASE}/masters/getAllModelsByMeterManufacturer/${meter_make}`,
          ngbToken
        );
        setAllMeterModels(models.list);
      } catch (err) {
        console.error('Error fetching NGB token:', err.message || err);
      }
    })();
  }, [meter_make]);
  useEffect(() => {
    (async () => {
      try {
        const models = await getFinalUsingDataToken(
          `${NGB_PRO_BASE}/masters/getAllModelsByMeterManufacturer/${me_make}`,
          ngbToken
        );
        setAllMeModels(models.list);
      } catch (err) {
        console.error('Error fetching NGB token:', err.message || err);
      }
    })();
  }, [me_make]);

  const handleSendOtp = async formData => {
    setFormDataValue(formData);
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
      const formValue = formDataValue;
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

      const { data } = await axios.post(
        `${HT_LOAD_CHANGE_BASE}/officer/meter-workcompletion/`,
        formData,
        {
          headers: {
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data: apiData, ...rest } = data;
      alert('Work Completion Certifying Submit successfully ✅');
      navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
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
                HT Load Change Work Completion Certifying & ME METER Issuing
              </h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                {officerData?.employee_detail?.role}
                <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
              </div>
            </div>
          </div>
          {/* <ApplicantFillDetails htConsumers={items} /> */}
          {/* {officerData?.employee_detail.role == 4 && ( */}
          <>
           {officerData?.employee_detail.role === 4 &&(
              <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
              <div className="card-header px-4 py-2 border-b border-gray-300">
                <h2 className="text-lg font-bold capitalize ">ME Issuing Details</h2>
              </div>
              <div className="card-body px-4 pb-4">
                <input type="hidden" {...register('application')} value={items?.id}></input>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <SelectTag
                    LName="Acceptance"
                    options={responseOption}
                    {...register('work_completion_response', {
                      required: 'Please Select Acceptance',
                    })}
                    errorMsg={errors.work_completion_response?.message}
                    labelKey="label"
                    valueKey="value"
                    disabled={isDisabled}
                  />
                  {work_completion_response === 'Accepted' && (
                    <>
                      {/* <InputTag
                        LName="Meter Serial No."
                        placeholder="Enter Agreement No."
                        {...register('meter_serial_no', {
                          required: 'Meter Serial No is required',
                        })}
                        errorMsg={errors.meter_serial_no?.message}
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName="Meter Make"
                        options={allManufactures}
                        {...register('meter_make_issuing', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.meter_make_issuing?.message}
                        labelKey="meterManufacturerName"
                        valueKey="meterMakeDetailId"
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName=" Meter Model"
                        options={allMeterModels}
                        {...register('meter_model', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.meter_model?.message}
                        labelKey="meterModelName"
                        valueKey="meterModelName"
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName="Meter CT Ratio"
                        options={allCTRatios}
                        {...register('meter_ct_ratio', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.meter_ct_ratio?.message}
                        labelKey="charVal"
                        valueKey="charVal"
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName="Meter PT Ratio"
                        options={allPTRatios}
                        {...register('meter_pt_ratio', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.meter_pt_ratio?.message}
                        labelKey="charVal"
                        valueKey="charVal"
                        disabled={isDisabled}
                      /> */}
                      <InputTag
                        LName="ME Serial No."
                        placeholder="Enter Agreement No."
                        {...register('me_serial_no', {
                          required: 'ME Serial No is required',
                        })}
                        errorMsg={errors.me_serial_no?.message}
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName="ME Make"
                        options={allManufactures}
                        {...register('me_make', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.me_make_issuing?.message}
                        labelKey="meterManufacturerName"
                        valueKey="meterMakeDetailId"
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName=" ME Model"
                        options={allMeModels}
                        {...register('me_model', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.me_model?.message}
                        labelKey="meterModelName"
                        valueKey="meterModelName"
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName="ME CT Ratio"
                        options={allCTRatios}
                        {...register('me_ct_ratio', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.me_ct_ratio?.message}
                        labelKey="charVal"
                        valueKey="charVal"
                        disabled={isDisabled}
                      />
                      <SelectTag
                        LName="ME PT Ratio"
                        options={allPTRatios}
                        {...register('me_pt_ratio', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.me_pt_ratio?.message}
                        labelKey="charVal"
                        valueKey="charVal"
                        disabled={isDisabled}
                      />
                    </>
                  )}

                  {/* Reverted Case */}
                  {work_completion_response === 'Reverted' && (
                    <>
                      <SelectTag
                        LName="Revert Reason"
                        options={revertOption}
                        {...register('revert_reason', {
                          required: 'Revert Reason is required',
                        })}
                        errorMsg={errors.revert_reason?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      />
                      <InputTag
                        LName="Revert Reason Remark"
                        placeholder="Enter Remark"
                        {...register('revert_reason_remark', {
                          required: 'Remark is required',
                        })}
                        errorMsg={errors.revert_reason_remark?.message}
                        disabled={isDisabled}
                      />
                      <InputTag
                        LName="Upload Revert Docs"
                        type="file"
                        {...register('upload_revert_docs', {
                          required: 'Revert Docs are required',
                        })}
                        errorMsg={errors.upload_revert_docs?.message}
                        disabled={isDisabled}
                      />
                    </>
                  )}
                </div>
                {/* <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                        Work Completion Certifying  Details
                      </h2>
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                         <InputTag
                            LName="Contractor Category"
                            {...register("contractor_category", {
                              required: "Contractor Category is required",
                            })}
                            errorMsg={errors.contractor_category?.message}
                            disabled={isDisabled}
                            
                          />
                         <InputTag
                            LName="Contractor Name"
                            {...register("contractor_name", {
                              required: "Contractor Name is required",
                            })}
                            errorMsg={errors.contractor_name?.message}
                            disabled={isDisabled}
                            
                          />
                         <InputTag
                            LName="Contractor Company Name"
                            {...register("contractor_company_name", {
                              required: "Contractor Company Name is required",
                            })}
                            errorMsg={errors.contractor_company_name?.message}
                            disabled={isDisabled}
                            
                          />
                         <InputTag
                            LName="Contractor Mobile No"
                            {...register("contractor_mobile_no", {
                              required: "Contractor Mobile  no is required",
                            })}
                            errorMsg={errors.contractor_mobile_no?.message}
                            disabled={isDisabled}
                            
                          />
                         <InputTag
                            LName="Authentication id"
                            {...register("authentication_id", {
                              required: "Authentication id is required",
                            })}
                            errorMsg={errors.authentication_id?.message}
                            disabled={isDisabled}
                            
                          />
                         <InputTag
                            LName="Registration Date"
                            {...register("registration_date", {
                              required: "Registration Date is required",
                            })}
                            errorMsg={errors.registration_date?.message}
                            disabled={isDisabled}
                            
                          />

                          <Link
                      to={items?.survey?.survey_checklist_docs} 
                      target="_blank" 
                      rel="noopener noreferrer" className="rounded-lg  px-3 py-2 text-center text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300">
                      {items?.survey?.survey_checklist_docs ? 'Contractor Consent Letter' : 'No File View'}
                        
                      </Link>
                          <Link
                      to={items?.survey?.survey_checklist_docs} 
                      target="_blank" 
                      rel="noopener noreferrer" className="rounded-lg  px-3 py-2 text-center text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300">
                      {items?.survey?.survey_checklist_docs ? 'Signed Letter of Work Completion' : 'No File View'}
                        
                      </Link>
                          <Link
                      to={items?.survey?.survey_checklist_docs} 
                      target="_blank" 
                      rel="noopener noreferrer" className="rounded-lg  px-3 py-2 text-center text-green-100 bg-indigo-500 hover:bg-fuchsia-500 duration-300">
                      {items?.survey?.survey_checklist_docs ? 'Clearance Certificate From Electrical Inspector' : 'No File View'}
                        
                      </Link>
                  
                       </div>
                    </div>    */}

                <div className="mt-10 flex flex-col justify-center items-center">
                  <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                    {!showOtpBtn ? (
                      <>
                        <button
                          type="reset"
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          Reset
                        </button>
                        <button
                          type="submit" // ✅ Yeh important hai, warna handleSendOtp call nahi hota
                          className={`px-4 py-2 rounded text-white ${
                            isDisabled
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-purple-800'
                          }`}
                          disabled={isDisabled}
                        >
                          {work_completion_response === 'Reverted'
                            ? 'Revert For Survey'
                            : 'Send for Commissioning Permission'}
                        </button>
                      </>
                    ) : (
                      <>
                        <InputTag
                          LName=""
                          placeholder="Enter OTP"
                          {...register('otp', { required: 'Otp is required' })}
                          errorMsg={errors.otp?.message}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className={`px-4 py-2 rounded text-white ${
                            isBtnDisabled
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-purple-800'
                          }`}
                          disabled={isBtnDisabled}
                        >
                          {isBtnDisabled ? 'Please wait...' : 'Verify OTP'}
                        </button>
                        <button
                          type="button"
                          onClick={handleReSendOtp}
                          className="px-4 py-2 bg-emerald-600 text-white rounded"
                        >
                          Resend OTP
                        </button>
                      </>
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
           )}
          </>
        </form>
      </div>
    </>
  );
};
export default LoadWorkCompletionAndMeterIssuing;
