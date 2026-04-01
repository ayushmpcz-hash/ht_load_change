import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
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
import { setOfficerData } from "../../redux/slices/userSlice.js";
import { handleTokenExpiry } from '../../utils/handleTokenExpiry';
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";

const revertOptionFor29 = [
  { label: "Officer Requested", value: "Officer Requested" },
  { label: "Incorrect Details", value: "Incorrect Details" },
];

const LoadCommissioningPermission = () => {
  const officerData = useSelector(state => state.user.officerData);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { items } = location.state || {};
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });
  // console.log(officerData, 'officerData');
  // console.log(items, 'items');
  console.log(HT_LOAD_CHANGE_BASE, 'HT_LOAD_CHANGE_BASE in Coomisioning permision')

  const token = Cookies.get('accessToken');

  // States
  // const [mobileNo] = useState(officerData?.employee_detail.cug_mobile);
  const [mobileNo, setMobileNo] = useState('');
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [formDataValue, setFormDataValue] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
  const commissioning_permission_response = watch('commissioning_permission_response');

  // timer logic
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

  const isStatus29 = items?.application_status === 29;

  // const handleSendOtp = async formData => {
  //   setFormDataValue(formData);
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

        setTimer(120);        // ⏱ start timer
        setIsOtpExpired(false);

        setError("otpSuccess", { type: "manual", message: res.message });
      } else {
        setError("otpStatus", { type: "manual", message: res.message });
      }
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


  // const handleFinalSubmit = async () => {
  //   try {
  //     const formValue = formDataValue;
  //     const formData = new FormData();

  //     Object.keys(formValue).forEach(key => {
  //       if (formValue[key] instanceof FileList) {
  //         if (formValue[key].length > 0) {
  //           formData.append(key, formValue[key][0]);
  //         }
  //       } else {
  //         formData.append(key, formValue[key]);
  //       }
  //     });
  //     const { data } = await axios.post(
  //       `${HT_LOAD_CHANGE_BASE}/commissioning-permission/`,
  //       formData,
  //       {
  //         headers: {
  //           // 'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const { data: apiData, ...rest } = data;
  //     alert('Commissioning submitted successfully ✅');
  //     navigate(`/dashboard/respones/${apiData.application}`, { state: apiData, rest });
  //     const updatedFlags = await handleOfficerFlagCount();
  //     dispatch(setOfficerData(updatedFlags));
  //   } catch (error) {
  //     if (handleTokenExpiry(error, navigate)) return;
  //     console.error('API Error:', error);
  //     alert('Something went wrong ❌');
  //   } finally {
  //     setBtnIsDisabled(false);
  //   }
  // };
  const handleFinalSubmit = async () => {
    try {
      const formValue = getValues();   // ⭐ FIXED (no stale formDataValue)
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
        `${HT_LOAD_CHANGE_BASE}/commissioning-permission/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Commissioning submitted successfully ✅");

      navigate(`/dashboard/respones/${data.data.application}`, {
        state: data.data,
      });

      const updatedFlags = await handleOfficerFlagCount();
      dispatch(setOfficerData(updatedFlags));
    } catch (error) {
      if (handleTokenExpiry(error, navigate)) return;

      console.error("API Error:", error);
      alert("Something went wrong ❌");
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
                HT Load Change Commissioning Permission
              </h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                {officerData?.employee_detail?.role}
                <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
                {/* <ApplicantFillDetails htConsumers={items} /> */}
              </div>
            </div>
          </div>
          {officerData?.employee_detail.role == 3 && (
            <>
              <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                <div className="card-header px-4 py-2 border-b border-gray-300">
                  <h2 className="text-lg font-bold capitalize ">
                    Commissioning Permission Details
                  </h2>
                </div>
                <div className="card-body px-4 pb-4">
                  <input type="hidden" {...register('application')} value={items?.id}></input>
                  <input
                    type="hidden"
                    name="employee_id"
                    {...register('employee_id')}
                    value={officerData?.employee_detail.employee_login_id}
                  ></input>
                  
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <SelectTag
                      LName="Acceptance"
                      options={responseOption}
                      {...register('commissioning_permission_response', {
                        required: 'Please Select Acceptance',
                      })}
                      errorMsg={errors.commissioning_permission_response?.message}
                      labelKey="label"
                      valueKey="value"
                      disabled={isDisabled}
                    />
                    {commissioning_permission_response === 'Accepted' && (
                      <>
                        {/* <InputTag
                          LName="Upload Commissioning Permission letter"
                          type="file"
                          {...register('commissioning_permission_letter', {
                            required: 'Commissioning Permission letter is required',
                          })}
                          errorMsg={errors.commissioning_permission_letter?.message}
                          disabled={isDisabled}
                        /> */}
                        <InputTag
                          LName="Accept Remark"
                          placeholder="Please Enter Accept Remark"
                          {...register("accept_remark", {
                            required: "Accept Remark is required",
                          })}
                          errorMsg={errors.accept_remark?.message}
                          disabled={isDisabled}
                        />
                      </>
                    )}

                    {/* Reverted Case */}
                    {commissioning_permission_response === 'Reverted' && (
                      <>
                        {/* <SelectTag
                          LName="Revert Reason"
                          options={revertOption}
                          {...register('revert_reason', {
                            required: 'Revert Reason is required',
                          })}
                          errorMsg={errors.revert_reason?.message}
                          labelKey="label"
                          valueKey="value"
                          disabled={isDisabled}
                        /> */}
                        <SelectTag
                          LName="Revert Reason"
                          options={isStatus29 ? revertOptionFor29 : revertOption}
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
                          {...register('revert_remark', {
                            required: 'Remark is required',
                          })}
                          errorMsg={errors.revert_remark?.message}
                          disabled={isDisabled}
                        />
                        {/* <InputTag
                          LName="Upload Revert Docs"
                          type="file"
                          {...register('upload_revert_docs', {
                            required: 'Revert Docs are required',
                          })}
                          errorMsg={errors.upload_revert_docs?.message}
                          disabled={isDisabled}
                        /> */}
                      </>
                    )}
                  </div>
                  <div className="mt-10 flex flex-col justify-center items-center">
                    <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                      {/* {!showOtpBtn ? (
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
                            {commissioning_permission_response === 'Reverted'
                              ? 'Revert For Survey'
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
                      )} */}
                      {!showOtpBtn ? (
                        <>
                          <button type="reset" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                            Reset
                          </button>

                          <button
                            type="submit"
                            disabled={isSendOtpLoading || isBtnDisabled}
                            className={`px-4 py-2 rounded text-white ${isSendOtpLoading || isBtnDisabled
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-purple-800"
                              }`}
                          >
                            {isSendOtpLoading
                              ? "Please wait..."
                              : commissioning_permission_response === "Reverted"
                                ? "Revert For Survey"
                                : "Send for Commissioning"}
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
            </>
          )}
        </form>
      </div>
    </>
  );
};
export default LoadCommissioningPermission;
