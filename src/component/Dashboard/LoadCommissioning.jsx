import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import {
  ApplicantBasicDetails,
  SelectTag,
  InputTag,
  sendOtpNew,
  verifyOtpNew,
} from '../importComponents.js';
import { responseOption, revertOption } from '../newComponents/commonOption.js';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';

const LoadCommissioning = () => {
  const officerData = useSelector(state => state.user.officerData);
  const location = useLocation();
  const { items } = location.state || {};
  const navigate = useNavigate();
  const {
    register,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });
  console.log(officerData, 'officerData');
  console.log(items, 'items');

  const token = Cookies.get('accessToken');

  // States
  const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [formDataValue, setFormDataValue] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);
  const bi_cell_response = watch('bi_cell_response');

  // 🔹 Send OTP
  const handleSendOtp = async formData => {
    setFormDataValue(formData);
    const sentOtp = await sendOtpNew(mobileNo);
    if (sentOtp.success) {
      setShowOtpBtn(true);
      setIsDisabled(true);
      setError('otpSuccess', { type: 'manual', message: sentOtp.message });
    } else {
      setError('otpStatus', { type: 'manual', message: sentOtp.message });
    }
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = getValues('otp');
    setBtnIsDisabled(true);
    const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);

    if (verifyOtpResponse.success) {
      handleFinalSubmit();
    } else {
      setError('otp', { type: 'manual', message: verifyOtpResponse.error });
      setBtnIsDisabled(false);
    }
  };

  // 🔹 Resend OTP
  const handleReSendOtp = async () => {
    clearErrors('otpSuccess');
    const sentOtp = await sendOtpNew(mobileNo);
    setShowOtpBtn(true);

    if (sentOtp.success) {
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

  // 🔹 Final Submit API Call
  const handleFinalSubmit = async () => {
    try {
      const formValue = formDataValue;
      const formData = new FormData();

      Object.keys(formValue).forEach(key => {
        if (formValue[key] instanceof FileList && formValue[key].length > 0) {
          formData.append(key, formValue[key][0]);
        } else {
          formData.append(key, formValue[key]);
        }
      });

      const { data } = await axios.post(`${HT_LOAD_CHANGE_BASE}/bicell-response/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Commissioning Successfully ✅');
      navigate(`/dashboard/respones/${data.data.application}`, { state: data });
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
              <h2 className="text-lg font-bold capitalize ">HT Load Change Commissioning</h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                <div className="">
                  {officerData?.employee_detail?.role}
                  <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
                  {/* <ApplicantFillDetails htConsumers={items} /> */}
                </div>
              </div>
            </div>
          </div>
          {officerData?.employee_detail.role == 35 && (
            <>
              <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                <div className="card-header px-4 py-2 border-b border-gray-300">
                  <h2 className="text-lg font-bold capitalize ">Commissioning Details</h2>
                </div>
                <div className="card-body px-4 pb-4">
                  <div className="">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                      <input type="hidden" value={items?.id} {...register('application')} />
                      <SelectTag
                        LName="Acceptance"
                        options={responseOption}
                        {...register('bi_cell_response', {
                          required: 'Please Select Acceptance',
                        })}
                        errorMsg={errors.bi_cell_response?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      />
                      {bi_cell_response === 'Accepted' && (
                        <>
                          <InputTag
                            LName=" Import  KVA"
                            {...register('import_meter_reading_kva', {
                              required: 'Import Meter Reading KVA is required',
                            })}
                            errorMsg={errors.import_meter_reading_kva?.message}
                            disabled={isDisabled}
                            placeholder={' Enter Import Meter Reading KVA'}
                          />
                          <InputTag
                            LName=" Import  KVAH"
                            {...register('import_meter_reading_kvah', {
                              required: 'Import Meter Reading KVH is required',
                            })}
                            errorMsg={errors.import_meter_reading_kvah?.message}
                            disabled={isDisabled}
                            placeholder={' Enter Import Meter Reading KVAH'}
                          />
                           <InputTag
                            LName=" Import  KWH"
                            {...register('import_meter_reading_kwh', {
                              required: 'Import Meter Reading KWH is required',
                            })}
                            errorMsg={errors.import_meter_reading_kwh?.message}
                            disabled={isDisabled}
                            placeholder={' Enter Import Meter Reading KWH'}
                          />
                          <InputTag
                            LName=" Import TOD1"
                            {...register('import_meter_reading_tod1', {
                              required: 'Import Meter Reading TOD1 is required',
                            })}
                            errorMsg={errors.import_meter_reading_tod1?.message}
                            disabled={isDisabled}
                            placeholder={' Enter Import Meter Reading TOD1'}
                          />
                          <InputTag
                            LName=" Import  TOD2"
                            {...register('import_meter_reading_tod2', {
                              required: 'Import Meter Reading TOD2 is required',
                            })}
                            errorMsg={errors.import_meter_reading_tod2?.message}
                            disabled={isDisabled}
                            placeholder={' Enter Import Meter Reading TOD2'}
                          />
                          <InputTag
                            LName=" Import  TOD3"
                            {...register('import_meter_reading_tod3', {
                              required: 'Import Meter Reading TOD3 is required',
                            })}
                            errorMsg={errors.import_meter_reading_tod3?.message}
                            disabled={isDisabled}
                            placeholder={' Enter Import Meter Reading TOD3'}
                          />
                          <InputTag
                            LName=" Import  TOD4"
                            {...register('import_meter_reading_tod4', {
                              required: 'Import Meter Reading TOD4 is required',
                            })}
                            errorMsg={errors.import_meter_reading_tod4?.message}
                            disabled={isDisabled}
                            placeholder={' Enter Import Meter Reading TOD4'}
                          />
                          {items?.meter_type === 'HT Net Meter' && (
                            <>
                              <InputTag
                                LName=" Export  KVA"
                                {...register('export_meter_reading_kva', {
                                  required: 'Export Meter Reading KVA is required',
                                })}
                                errorMsg={errors.export_meter_reading_kva?.message}
                                disabled={isDisabled}
                                placeholder={' Enter Export Meter Reading KVA'}
                              />
                              <InputTag
                                LName=" Export KVAH"
                                {...register('export_meter_reading_kvah', {
                                  required: 'Export Meter Reading KVAH is required',
                                })}
                                errorMsg={errors.export_meter_reading_kvah?.message}
                                disabled={isDisabled}
                                placeholder={' Enter Export Meter Reading KVAH'}
                              />
                                <InputTag
                                LName=" Export KWH"
                                {...register('export_meter_reading_kwh', {
                                  required: 'Export Meter Reading KWH is required',
                                })}
                                errorMsg={errors.export_meter_reading_kwh?.message}
                                disabled={isDisabled}
                                placeholder={' Enter Export Meter Reading KWH'}
                              />
                              <InputTag
                                LName=" Export  TOD1"
                                {...register('export_meter_reading_tod1', {
                                  required: 'Export Meter Reading TOD1 is required',
                                })}
                                errorMsg={errors.export_meter_reading_tod1?.message}
                                disabled={isDisabled}
                                placeholder={' Enter Export Meter Reading TOD1'}
                              />
                              <InputTag
                                LName=" Export  TOD2"
                                {...register('export_meter_reading_tod2', {
                                  required: 'Export Meter Reading TOD2 is required',
                                })}
                                errorMsg={errors.export_meter_reading_tod2?.message}
                                disabled={isDisabled}
                                placeholder={' Enter Export Meter Reading TOD2'}
                              />
                              <InputTag
                                LName=" Export TOD3"
                                {...register('export_meter_reading_tod3', {
                                  required: 'Export Meter Reading TOD3 is required',
                                })}
                                errorMsg={errors.export_meter_reading_tod3?.message}
                                disabled={isDisabled}
                                placeholder={' Enter Export Meter Reading TOD3'}
                              />
                              <InputTag
                                LName=" Export  TOD4"
                                {...register('export_meter_reading_tod4', {
                                  required: 'Export Meter Reading TOD4 is required',
                                })}
                                errorMsg={errors.export_meter_reading_tod4?.message}
                                disabled={isDisabled}
                                placeholder={' Enter Export Meter Reading TOD4'}
                              />

                              <InputTag
                                LName="Commissioning pdf"
                                type="file"
                                {...register("agreement_doc", {
                                  required: "Agreement Letter is required",
                                })}
                                errorMsg={errors.agreement_doc?.message}
                                disabled={isDisabled}
                              />
                            </>
                          )}
                        </>
                      )}

                      {/* Reverted Case */}
                      {bi_cell_response === 'Reverted' && (
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
                            {...register('revert_remark', {
                              required: 'Remark is required',
                            })}
                            errorMsg={errors.revert_remark?.message}
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
                  </div>
                  <div className="border-b border-gray-900/10 pb-12">
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
                              className={`px-4 py-2 rounded text-white ${isDisabled
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-purple-800'
                                }`}
                              disabled={isDisabled}
                            >
                              {bi_cell_response === 'Accepted'
                                ? 'Send for Connection Served'
                                : 'Send for Commissioning'}
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
                              className={`px-4 py-2 rounded text-white ${isBtnDisabled
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
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};
export default LoadCommissioning;
