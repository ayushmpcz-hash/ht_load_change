import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { ApplicantBasicDetails, SelectTag, InputTag, Button } from '../../importComponents'
import { sendOtpNew, verifyOtpNew } from "../../importComponents";
import { responseOption, revertOption } from "../../newComponents/commonOption"
import { HT_LOAD_CHANGE_BASE } from "../../../api/api";
import { handleOfficerFlagCount } from "../../../utils/handleOfficerFlagCount";
import { setOfficerData } from "../../../redux/slices/userSlice";

const LoadWorkCompletionChargingPermission = () => {
    const officerData = useSelector(state => state.user.officerData);
    const location = useLocation()
    const { items } = location.state || {}
    console.log(items, "items")
    const { register, setError, handleSubmit, clearErrors, watch, setValue, getValues, formState: { errors }, } = useForm({
        defaultValues: items || {}
    })

    const token = Cookies.get("accessToken");

    // States
    const [otpSent, setOtpSent] = useState(false)
    const [isBtnDisabled, setBtnDisabled] = useState(false)
    const [isSendingOtp, setIsSendingOtp] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);
     const dispatch = useDispatch()
     const navigate = useNavigate();

    const work_completion_response = watch("work_completion_response")

    const onSubmitHandler = async (formData) => {
        await handleSendOtp(formData);
    };

   const handleSendOtp = async () => {
  try {
    setIsSendingOtp(true);
    setIsDisabled(true);
    clearErrors();

    const mobileNo = String(items?.mobile);
    // const mobileNo = String(9754548330);

    const otpResp = await sendOtpNew(mobileNo);

    if (otpResp?.success) {
      setOtpSent(true);

      setError("otpSuccess", {
        type: "manual",
        message: otpResp.message,
      });
    } else {
      setError("otpStatus", {
        type: "manual",
        message: otpResp.message || "Failed to send OTP",
      });

      setIsSendingOtp(false);
      setIsDisabled(false);
    }
  } catch (err) {
    setError("otpStatus", {
      type: "manual",
      message: "OTP sending failed",
    });

    setIsSendingOtp(false);
    setIsDisabled(false);
  }
};

 const handleVerifyOtp = async () => {
  const otpValue = getValues("otp");
  const mobileNo = String(items?.mobile);
    //    const mobileNo = String(9754548330);

  try {
    setBtnDisabled(true);
    clearErrors("otp");

    const verifyResp = await verifyOtpNew(mobileNo, otpValue);

    if (verifyResp?.success) {
      await handleFinalSubmit();
    } else {
      setError("otp", {
        type: "manual",
        message: verifyResp?.error || "Invalid OTP",
      });
    }
  } catch (err) {
    console.error(err);
    setError("otpStatus", {
      type: "manual",
      message: "OTP verification failed",
    });
  } finally {
    setBtnDisabled(false);
  }
};

    const handleReSendOtp = async () => {

        const mobileNo = String(items?.mobile);
        clearErrors("otp");

        try {

            setBtnDisabled(true);

            const otpResp = await sendOtpNew(mobileNo);

            if (otpResp.success) {

                setError("otpSuccess", {
                    type: "manual",
                    message: `OTP Resent successfully to ****${mobileNo.slice(-4)}`,
                });

            } else {

                setError("otpStatus", {
                    type: "manual",
                    message: otpResp.message,
                });

            }

        } catch (err) {

            setError("otpStatus", {
                type: "manual",
                message: "Failed to resend OTP",
            });

        } finally {

            setBtnDisabled(false);

        }
    };

    // const handleFinalSubmit = async () => {

    //     try {

    //         const formValue = getValues()
    //         const formData = new FormData()

    //         Object.keys(formValue).forEach(key => {

    //             if (formValue[key] instanceof FileList) {

    //                 if (formValue[key].length > 0) {
    //                     formData.append(key, formValue[key][0])
    //                 }

    //             } else {
    //                 formData.append(key, formValue[key])
    //             }

    //         })

    //         const { data } = await axios.post(
    //             `${HT_LOAD_CHANGE_BASE}/consumer-agreement-upload/`,
    //             formData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             }
    //         )

    //         alert("Work Completion & Upload Charging Permission Submitted Successfully")

    //     } catch (err) {

    //         console.error(err)
    //         alert("Submission Failed")

    //     }

    // }
   const handleFinalSubmit = async () => {
  try {
    const formValue = getValues();
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

    const response = await axios.post(
      `${HT_LOAD_CHANGE_BASE}/consumer-agreement-upload/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response?.data;

    alert("Work Completion & Upload Charging Permission Submitted Successfully ✅");

    if (result?.data?.application) {
      navigate(`/user-dashboard/success-respones/${result.data.application}`, {
        state: result.data,
      });
    }

    const updatedFlags = await handleOfficerFlagCount();
    dispatch(setOfficerData(updatedFlags));

  } catch (error) {
    console.error(error);
    alert("Submission Failed ❌");
  } finally {
    setBtnDisabled(false);
  }
};
    useEffect(() => {
        if (items?.agreement_details) {
            const agr = items.agreement_details;

            setValue("agreement_no", agr.agreement_no);
            setValue("agreement_effective_date", agr.agreement_effective_date);
        }
    }, [items]);

    useEffect(() => {
        if (items?.agreement_details) {

            setValue("contractor_category", items?.agreement_details?.contractor_category);
            setValue("contractor_name", items?.agreement_details?.contractor_name);
            setValue("contractor_company_name", items?.agreement_details?.contractor_company);
            setValue("contractor_mobile_no", items?.agreement_details?.contractor_mobile);
            setValue("authentication_id", items?.agreement_details?.authentication_id);
            setValue("registration_date", items?.agreement_details?.registration_date);

        }
    }, [items]);

    return (
        <>
            <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                HT Load Change {items.application_status_text}
            </h2>
            <div className="mt-6 overflow-x-auto">
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <input
                        type="hidden"
                        value={items?.id}
                        {...register("application")}
                    />
                    <div className="body p-4">
                        <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
                        {officerData?.employee_detail.role !== 3 && (
                            <>
                                <div className="border-b border-gray-900/10 pb-12">
                                    <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                                        {items.application_status_text}
                                    </h2>
                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                                        {/* <SelectTag
                                            LName="Contractor Category"
                                            options={responseOption}
                                            {...register("contractor_category", {
                                                required: "Please Select Contractor Category",
                                            })}
                                            errorMsg={errors.contractor_category?.message}
                                            labelKey="label"
                                            valueKey="value"
                                            disabled={isDisabled}
                                        />
                                        <SelectTag
                                            LName="Contractor Name"
                                            options={responseOption}
                                            {...register("contractor_name", {
                                                required: "Please Select Contractor Name",
                                            })}
                                            errorMsg={errors.contractor_name?.message}
                                            labelKey="label"
                                            valueKey="value"
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
                                            LName="Contractor Mobile No."
                                            {...register("contractor_mobile_no", {
                                                required: "Contractor Mobile No is required",
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
                                        /> */}
                                        {/* <InputTag
                        LName="Contractor Consent Letter"
                        type="file"
                        {...register("contractor_consent_docs", {
                            required: "Contractor Consent Letter is required",
                        })}
                        errorMsg={errors.contractor_consent_docs?.message}
                        disabled={isDisabled}
                        /> */}
                                        <InputTag
                                            LName="Contractor Category"
                                            {...register("contractor_category")}
                                            disabled
                                        />
                                        <InputTag
                                            LName="Contractor Name"
                                            {...register("contractor_name")}
                                            disabled
                                        />
                                        <InputTag
                                            LName="Contractor Company Name"
                                            {...register("contractor_company_name")}
                                            disabled
                                        />

                                        <InputTag
                                            LName="Contractor Mobile No."
                                            {...register("contractor_mobile_no")}
                                            disabled
                                        />

                                        <InputTag
                                            LName="Authentication id"
                                            {...register("authentication_id")}
                                            disabled
                                        />

                                        <InputTag
                                            LName="Registration Date"
                                            {...register("registration_date")}
                                            disabled
                                        />
                                        <InputTag
                                            LName="Signed Letter of Work Completion"
                                            type="file"
                                            {...register("signed_docs", {
                                                required: "Signed Letter is required",
                                            })}
                                            errorMsg={errors.signed_docs?.message}
                                            disabled={isDisabled}
                                        />
                                        <InputTag
                                            LName="Clearance Certificate From Electrical Inspector"
                                            type="file"
                                            {...register("clearance_certificate_docs", {
                                                required: "Clearance Certificate is required",
                                            })}
                                            errorMsg={errors.clearance_certificate_docs?.message}
                                            disabled={isDisabled}
                                        />



                                        {otpSent ? (

                                            <div className="col-span-8 flex flex-col items-center justify-center mt-5">

                                                <div className="w-full sm:w-1/3 flex flex-col items-center">

                                                    <InputTag
                                                        placeholder="Enter OTP"
                                                        {...register("otp", { required: "OTP is required" })}
                                                        errorMsg={errors.otp?.message}
                                                    />

                                                    {errors?.otpSuccess && (
                                                        <p className="text-green-600 text-sm mt-1 text-center">
                                                            {errors.otpSuccess.message}
                                                        </p>
                                                    )}

                                                    {errors?.otpStatus && (
                                                        <p className="text-red-600 text-sm mt-1 text-center">
                                                            {errors.otpStatus.message}
                                                        </p>
                                                    )}

                                                    <div className="flex gap-3 mt-3 justify-center">

                                                        <button
                                                            type="button"
                                                            onClick={handleVerifyOtp}
                                                            disabled={isBtnDisabled}
                                                            className={`px-4 py-2 rounded text-white ${isBtnDisabled
                                                                    ? "bg-gray-400 cursor-not-allowed"
                                                                    : "bg-green-600 hover:bg-green-700"
                                                                }`}
                                                        >
                                                            {isBtnDisabled ? "Verifying..." : "Verify OTP"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={handleReSendOtp}
                                                            disabled={isBtnDisabled}
                                                            className={`px-4 py-2 rounded text-white ${isBtnDisabled
                                                                    ? "bg-gray-400 cursor-not-allowed"
                                                                    : "bg-blue-500 hover:bg-blue-600"
                                                                }`}
                                                        >
                                                            {isBtnDisabled ? "Resending..." : "Resend OTP"}
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        ) : (

                                            <div className="col-span-8 flex justify-center mt-5">

                                                <button
                                                    type="submit"
                                                    disabled={isSendingOtp}
                                                    className={`px-4 py-2 rounded text-white ${isSendingOtp
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-orange-500 hover:bg-orange-600"
                                                        }`}
                                                >
                                                    {isSendingOtp ? "Sending OTP..." : "Submit"}
                                                </button>

                                            </div>

                                        )}
                                    </div>
                                </div>

                            </>
                        )}



                    </div>
                </form>
            </div>
        </>

    );
};
export default LoadWorkCompletionChargingPermission;
