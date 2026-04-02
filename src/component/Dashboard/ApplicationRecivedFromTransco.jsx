import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import {
    ApplicantBasicDetails,
    SelectTag,
    InputTag,
    sendOtpNew,
    verifyOtpNew,
} from "../importComponents.js";
import { responseOption } from "../newComponents/commonOption.js";
import { HT_LOAD_CHANGE_BASE } from "../../api/api.js";
import { handleTokenExpiry } from "../../utils/handleTokenExpiry";
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
import { setOfficerData } from "../../redux/slices/userSlice.js";

const ApplicationRecivedFromTransco = () => {
    const officerData = useSelector((s) => s.user.officerData);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const items = location.state?.items || location.state?.data || null;
    const token = Cookies.get("accessToken");

    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            application: items?.id || "",
            edcra_response: "",
            letter_no: "",
            document: null,
            remark: "Application received from EDCRA",
        },
    });

    // ---------------- STATE ----------------
    const [mobileNo, setMobileNo] = useState("");
    const [showOtpBtn, setShowOtpBtn] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isBtnDisabled, setBtnIsDisabled] = useState(false);

    const [timer, setTimer] = useState(0);
    const [isOtpExpired, setIsOtpExpired] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);

    const response = watch("edcra_response");

    // ---------------- MOBILE ----------------
    useEffect(() => {
        if (officerData?.employee_detail?.cug_mobile) {
            setMobileNo(String(officerData.employee_detail.cug_mobile));
        }
    }, [officerData]);

    useEffect(() => {
        if (items?.id) setValue("application", items.id);
    }, [items, setValue]);

    // ---------------- TIMER ----------------
    useEffect(() => {
        let interval;

        if (timer > 0 && !isProcessing) {
            interval = setInterval(() => setTimer((p) => p - 1), 1000);
        }

        if (timer === 0 && showOtpBtn && !isProcessing) {
            setIsOtpExpired(true);
        }

        return () => clearInterval(interval);
    }, [timer, showOtpBtn, isProcessing]);

    const formatTime = (sec) =>
        `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

    // ---------------- SEND OTP ----------------
    const handleSendOtp = async () => {
        if (isSendOtpLoading) return;

        if (!mobileNo || mobileNo.length !== 10) {
            setError("otpStatus", { message: "Mobile number missing" });
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

                setError("otpSuccess", { message: res.message });
            } else {
                setError("otpStatus", { message: res.message });
            }
        } finally {
            setIsSendOtpLoading(false);
        }
    };

    // ---------------- VERIFY OTP ----------------
    const handleVerifyOtp = async () => {
        if (isOtpExpired) {
            setError("otp", { message: "OTP expired. Please resend OTP." });
            return;
        }

        const otp = getValues("otp");
        setBtnIsDisabled(true);

        const v = await verifyOtpNew(mobileNo, otp);

        if (v.success) {
            setIsProcessing(true);
            setTimer(0);
            setShowOtpBtn(false);

            await handleFinalSubmit();
        } else {
            setError("otp", { message: v.error });
            setBtnIsDisabled(false);
        }
    };

    // ---------------- RESEND OTP ----------------
    const handleReSendOtp = async () => {
        clearErrors();

        const sent = await sendOtpNew(mobileNo);

        if (sent?.success) {
            setTimer(120);
            setIsOtpExpired(false);

            setError("otpSuccess", {
                message: `OTP resent to ****${mobileNo.slice(-4)}`,
            });
        } else {
            setError("otp", { message: "Failed to resend OTP" });
        }
    };

    // ---------------- FINAL SUBMIT ----------------
    const handleFinalSubmit = async () => {
        try {
            const fv = getValues();

            const form = new FormData();
            form.append("application", fv.application);
            form.append("status", "accepted");
            form.append("letter_no", fv.letter_no);
            form.append("document", fv.document[0]);
            form.append("remark", fv.remark);

            // ✅ ADD THIS
            const employeeId = officerData?.employee_detail?.employee_login_id;

            if (employeeId) {
                form.append("employee_id", employeeId);
            }

            const resp = await axios.post(
                // `${HT_LOAD_CHANGE_BASE}/received-edcra/`,
                `${HT_LOAD_CHANGE_BASE}/received-cgm-after-edcra/`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const result = resp.data;

            if (result?.status === "success") {
                alert(result.message);
                navigate(`/dashboard/respones/${result.data.application}`, {
                    state: result.data,
                });
                const updatedFlags = await handleOfficerFlagCount();
                dispatch(setOfficerData(updatedFlags));
            } else {
                alert(result.message || "Submission failed");
            }
        } catch (err) {
            if (handleTokenExpiry(err, navigate)) return;

            alert(
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                "Unable to submit. Please try again."
            );
        } finally {
            setBtnIsDisabled(false);
            setIsProcessing(false);
        }
    };

    // ---------------- UI ----------------
    return (
        <div>
            <form onSubmit={handleSubmit(handleSendOtp)}>
                {/* Applicant Card */}
                <div className="card mt-2 mb-2 bg-white rounded shadow-md">
                    <div className="card-header px-4 py-2 border-b border-gray-300">
                        <h2 className="text-lg font-bold">EDCRA Document Received</h2>
                    </div>
                    <div className="card-body px-4 pb-4">
                        <ApplicantBasicDetails
                            htConsumers={items}
                            register={register}
                            errors={errors}
                        />
                    </div>
                </div>

                {/* Form Card — SAME LAYOUT AS COMMISSIONING PERMISSION */}
                <div className="card mt-2 mb-2 bg-white rounded shadow-md">
                    <div className="card-body px-4 pb-4">
                        <input type="hidden" {...register("application")} />
                        <input
                            type="hidden"
                            name="employee_id"
                            {...register('employee_id')}
                            value={officerData?.employee_detail.employee_login_id}
                        ></input>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* ACCEPT DROPDOWN */}
                            <SelectTag
                                LName="Acceptance"
                                options={responseOption.filter((o) => o.value === "Accepted")}
                                {...register("edcra_response", { required: "Required" })}
                                errorMsg={errors.edcra_response?.message}
                                labelKey="label"
                                valueKey="value"
                                disabled={isDisabled}
                            />

                            {/* OPEN ONLY AFTER ACCEPT */}
                            {response === "Accepted" && (
                                <>
                                    <InputTag
                                        LName="Letter No"
                                        placeholder="Enter Letter No"
                                        {...register("letter_no", { required: "Letter No required" })}
                                        errorMsg={errors.letter_no?.message}
                                        disabled={isDisabled}
                                    />

                                    <InputTag
                                        LName="Upload  Document"
                                        type="file"
                                        {...register("document", { required: "Document required" })}
                                        errorMsg={errors.document?.message}
                                        disabled={isDisabled}
                                    />

                                    <InputTag
                                        LName="Remark"
                                        placeholder="Enter remark"
                                        {...register("remark")}
                                        disabled={isDisabled}
                                    />
                                </>
                            )}
                        </div>

                        {/* OTP SECTION — EXACT SAME AS COMMISSIONING PERMISSION */}
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
                                            type="submit"
                                            disabled={isSendOtpLoading || response !== "Accepted"}
                                            className={`px-4 py-2 rounded text-white ${isSendOtpLoading || response !== "Accepted"
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-500 hover:bg-purple-800"
                                                }`}
                                        >
                                            {isSendOtpLoading ? "Please wait..." : "Submit"}
                                        </button>
                                    </>
                                ) : showOtpBtn && !isProcessing ? (
                                    <>
                                        <InputTag
                                            placeholder="Enter OTP"
                                            {...register("otp", { required: "OTP required" })}
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

                            {errors?.otpSuccess && (
                                <p className="text-green-500 text-sm mt-1">
                                    {errors.otpSuccess.message}
                                </p>
                            )}
                            {errors?.otpStatus && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.otpStatus.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ApplicationRecivedFromTransco;
