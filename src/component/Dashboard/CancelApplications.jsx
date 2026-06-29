import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
import { setOfficerData } from "../../redux/slices/userSlice.js";

import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  InputTag,
  ApplicantBasicDetails,
  AlertModalBox,
  sendOtpNew,
  verifyOtpNew,
  SelectTag,
} from '../importComponents.js';
import { revertOption } from '../newComponents/commonOption.js';

const CancelApplications = () => {
  const officerData = useSelector(state => state.user.officerData);
  const [mobileNo, setMobileNo] = useState('');
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [fromDataValue, setFromDataValue] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [searchError, setSearchError] = useState('');

  const [timer, setTimer] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatch = useDispatch();

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
    defaultValues: {},
    shouldUnregister: true,
  });

  const token = Cookies.get('accessToken');


  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => () => { });

  // Timer effect
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

  // Format time
  const formatTime = sec => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Set mobile number from officer data
  useEffect(() => {
    if (officerData?.employee_detail?.cug_mobile) {
      setMobileNo(officerData.employee_detail.cug_mobile);
    }
  }, [officerData]);

  const showModal = (message, action = () => { }) => {
    setModalMessage(message);
    setModalAction(() => action);
    setModalOpen(true);
  };

  // Search application by application number
  const handleSearchApplication = async () => {
    if (!applicationNumber.trim()) {
      setSearchError('Please enter application number');
      return;
    }

    setIsLoading(true);
    setSearchError('');

    try {
      const response = await axios.get(
        `${HT_LOAD_CHANGE_BASE}/cancel-applications/${applicationNumber}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setApplicationData(response.data.data);
        // Set form values if needed
        setValue('application', response.data.id);
        setValue('consumer_number', response.data.consumer_number);
        setIsDisabled(false);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      setSearchError(error?.response?.data?.message || 'Application not found');
      setApplicationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP
  const handleSendOtp = async formData => {
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

  // Verify OTP
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
      setError("otp", {
        type: "manual",
        message: res.error,
      });
      setBtnIsDisabled(false);
    }
  };

  // Resend OTP
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
      setError("otp", {
        type: "manual",
        message: res.message,
      });
    }
  };

  // Final submit
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

      const { data } = await axios.post(
        `${HT_LOAD_CHANGE_BASE}/api/cancel-applications/submit/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data: apiData, ...rest } = data;

      navigate(`/dashboard/respones/${apiData.application}`, {
        state: apiData,
        rest,
      });

      const updatedFlags = await handleOfficerFlagCount();
      dispatch(setOfficerData(updatedFlags));

    } catch (error) {
      console.error("API Error:", error);

      let backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.error;

      if (!backendMessage && typeof error?.response?.data === "object") {
        const firstKey = Object.keys(error.response.data)[0];
        backendMessage = error.response.data[firstKey]?.[0];
      }

      alert(
        backendMessage ||
        "Unable to submit the form right now. Please try again later."
      );
    } finally {
      setBtnIsDisabled(false);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(handleSendOtp)}>
          {/* Search Application Section */}
          <div className="card mt-2 mb-2 bg-white rounded shadow-md">
            <div className="card-header px-4 py-2 border-b border-gray-300">
              <h2 className="text-lg font-bold capitalize">
                Search Cancel Application
              </h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                {/* <div className="grid grid-cols-1 gap-x-1 gap-y-8 sm:grid-cols-4">
                  <div className="w-full sm:w-[70%]">
                    <InputTag
                      LName="Application Number"
                      placeholder="Enter Application Number"
                      value={applicationNumber}
                      onChange={(e) => setApplicationNumber(e.target.value)}
                      errorMsg={searchError}
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={handleSearchApplication}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 w-auto min-w-[120px]"
                    >
                      {isLoading ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div> */}
                <div className="flex gap-4 items-end flex-wrap">

  <div className="w-full sm:w-[20%]">
    <InputTag
      LName="Application Number"
      placeholder="Enter Application Number"
      value={applicationNumber}
      onChange={(e) => setApplicationNumber(e.target.value)}
      errorMsg={searchError}
    />
  </div>

  <div>
    <button
      type="button"
      onClick={handleSearchApplication}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 min-w-[120px]"
    >
      {isLoading ? "Searching..." : "Search"}
    </button>
  </div>

</div>
              </div>
            </div>
          </div>

          {/* Consumer Basic Details Section */}
          {applicationData && (
            <div className="card mt-2 mb-2 bg-white rounded shadow-md">
              <div className="card-header px-4 py-2 border-b border-gray-300">
                <h2 className="text-lg font-bold capitalize">
                  Consumer Basic Details
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
                    <ApplicantBasicDetails
                      htConsumers={applicationData}
                      register={register}
                      errors={errors}
                      officerData={officerData}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GM Action Section */}
          {applicationData && (
            <div className="card mt-2 mb-2 bg-white rounded shadow-md">
              <div className="card-header px-4 py-2 border-b border-gray-300">
                <h2 className="text-lg font-bold capitalize">
                  GM Action for Cancel Application
                </h2>
              </div>
              <div className="card-body px-4 pb-4">
                <div className="">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                    <input
                      type="hidden"
                      name="application"
                      {...register('application')}
                      value={applicationData?.id}
                    />
                    <input
                      type="hidden"
                      name="employee_id"
                      {...register('employee_id')}
                      value={officerData?.employee_detail.employee_login_id}
                    />
                    <input
                      type="hidden"
                      name="consumer_number"
                      {...register('consumer_number')}
                      value={applicationData?.consumer_number}
                    />

                    <SelectTag
                      LName="Cancel Option"
                      options={[
                        { label: "Consumer Request", value: "Consumer Request" },
                        { label: "Duplicate Application", value: "Duplicate Application" },
                        { label: "Technical Issue", value: "Technical Issue" },
                        { label: "Other", value: "Other" },
                      ]}
                      {...register("cancel_option", {
                        required: "Cancel option is required",
                      })}
                      errorMsg={errors.cancel_option?.message}
                      labelKey="label"
                      valueKey="value"
                    />

                    <InputTag
                      LName="Cancel Reason"
                      placeholder="Enter cancellation reason"
                      {...register("cancel_reason", {
                        required: "Cancel remark is required",
                      })}
                      errorMsg={errors.cancel_reason?.message}
                    />

                    <InputTag
                      LName="Cancel Remark"
                      placeholder="Enter cancellation remark"
                      {...register("remark", {
                        required: "Cancel remark is required",
                      })}
                      errorMsg={errors.cancel_reason?.message}
                    />

                    <InputTag
                      LName="Letter Number"
                      placeholder="Enter Letter Number"
                      {...register("cancel_letter_no", {
                        required: "Letter Number is required",
                      })}
                      errorMsg={errors.cancel_letter_no?.message}
                    />

                    <InputTag
                      LName="Upload Letter"
                      type="file"
                      acceptPdfOnly={true}
                      {...register("cancel_letter_doc", {
                        required: "Letter upload is required",
                      })}
                      errorMsg={errors.cancel_letter_doc?.message}
                    />
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 flex flex-col justify-center items-center">
                    <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">

                      {/* Without OTP Section */}
                      {!showOtpBtn && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              resetField('cancel_response');
                              resetField('accept_remark');
                              resetField('letter_number');
                              resetField('gm_upload_pdf');
                              resetField('revert_reason');
                              resetField('revert_remark');
                              resetField('upload_revert_docs');
                              setApplicationData(null);
                              setApplicationNumber('');
                              setSearchError('');
                            }}
                            className="rounded-lg px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 duration-300"
                          >
                            Reset
                          </button>

                          <button
                            type="submit"
                            className={`text-white px-4 py-2 mt-4 rounded
                            ${isSendOtpLoading || isDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"}`}
                            disabled={isSendOtpLoading || isDisabled}
                          >
                            {isSendOtpLoading
                              ? "Sending OTP..."
                              : "Cancel Application"}
                          </button>
                        </>
                      )}

                      {/* OTP Section */}
                      {showOtpBtn && !isProcessing && (
                        <>
                          <InputTag
                            placeholder="Enter OTP"
                            {...register("otp", { required: "OTP is required" })}
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
                            className={`px-4 py-2 mt-3 rounded text-white
                              ${isBtnDisabled || isOtpExpired
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-800"}`}
                          >
                            {isBtnDisabled ? "Verifying..." : "Verify OTP"}
                          </button>

                          <button
                            type="button"
                            onClick={handleReSendOtp}
                            className="px-4 py-2 mt-3 rounded bg-emerald-600 text-white hover:bg-emerald-800"
                          >
                            Resend OTP
                          </button>
                        </>
                      )}

                      {/* Processing Message */}
                      {isProcessing && (
                        <p className="text-blue-700 font-semibold mt-2 animate-pulse">
                          Processing... Please wait
                        </p>
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
          )}
        </form>
      </div>
    </>
  );
};

export default CancelApplications;