import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
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
import { HT_LOAD_CHANGE_BASE } from "../../api/api.js";
import { handleTokenExpiry } from "../../utils/handleTokenExpiry";
import { revertOption } from "../newComponents/commonOption.js";
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
import { setOfficerData } from "../../redux/slices/userSlice.js";

const statusOptions = [
    { label: "Accepted", value: "accepted" },   // ✅ lowercase
    { label: "Reverted", value: "reverted" },   // ✅ lowercase
];


const ApplicationRecivedFromCGM = () => {
    const officerData = useSelector((s) => s.user.officerData);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
            status: "",
            document: null,
            revert_reason: "",
            revert_remark: "",
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

    const status = watch("status");

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
            form.append("status", fv.status);

            // Only send optional fields when needed

            if (fv.status === "accepted") {
                if (fv.document?.length) {
                    form.append("document", fv.document[0]);
                }

                if (fv.letter_no) {
                    form.append("letter_no", fv.letter_no);
                }

                // remark OPTIONAL (DB already has default)
                // form.append("remark", "Application received from CGM after EDCRA approval");
            }

            if (fv.status === "reverted") {
                form.append("revert_reason", fv.revert_reason);
                form.append("revert_remark", fv.revert_remark);

                if (fv.document?.length) {
                    form.append("document", fv.document[0]);
                }

                form.append("remark", "Reverted by CGM after EDCRA approval");
            }

            const resp = await axios.post(
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

            let backendMessage = "";

            const data = err?.response?.data;

            // 1️⃣ If backend sends simple message
            if (typeof data === "string") {
                backendMessage = data;
            }

            // 2️⃣ If backend sends { message: "" }
            else if (data?.message) {
                backendMessage = data.message;
            }

            // 3️⃣ If Django validation object { field: ["msg"] }
            else if (typeof data === "object" && data !== null) {
                const firstKey = Object.keys(data)[0];

                if (Array.isArray(data[firstKey])) {
                    backendMessage = data[firstKey][0]; // ⭐ MAIN FIX
                }
            }

            // 4️⃣ Final fallback
            if (!backendMessage) {
                backendMessage = "Unable to submit. Please try again.";
            }

            alert(backendMessage);
        }
        finally {
            setBtnIsDisabled(false);
            setIsProcessing(false);
        }
    };


    // ---------------- UI ----------------
    return (
        <div>
            <form onSubmit={handleSubmit(handleSendOtp)}>
                {/* Applicant */}
                <div className="card mt-2 mb-2 bg-white rounded shadow-md">
                    <div className="card-header px-4 py-2 border-b border-gray-300">
                        <h2 className="text-lg font-bold">HT Load Change GM Approval</h2>
                    </div>
                    <div className="card-body px-4 pb-4">
                        <ApplicantBasicDetails
                            htConsumers={items}
                            register={register}
                            errors={errors}
                        />
                    </div>
                </div>

                {/* CGM Action */}
                {Number(officerData?.employee_detail?.role) === 19 && (
                    <div className="card mt-2 mb-2 bg-white rounded shadow-md">
                        <div className="card-header px-4 py-2 border-b border-gray-300">
                            <h2 className="text-lg font-bold">GM Action</h2>
                        </div>

                        <div className="card-body px-4 pb-4">
                            <input type="hidden" {...register("application")} />
                            <input
                                type="hidden"
                                name="employee_id"
                                {...register('employee_id')}
                                value={officerData?.employee_detail.employee_login_id}
                            ></input>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <SelectTag
                                    LName="Acceptance"
                                    options={statusOptions}
                                    {...register("status", { required: "Required" })}
                                    errorMsg={errors.status?.message}
                                    labelKey="label"
                                    valueKey="value"
                                    disabled={isDisabled}
                                />

                                {/* ACCEPTED */}
                                {status === "accepted" && (
                                    <InputTag
                                        LName="Upload Document"
                                        type="file"
                                        {...register("document", { required: "Document required" })}
                                        errorMsg={errors.document?.message}
                                        disabled={isDisabled}
                                    />
                                )}

                                {/* REVERTED */}
                                {status === "reverted" && (
                                    <>
                                        <SelectTag
                                            LName="Revert Reason"
                                            options={revertOption}
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
                                            {...register("revert_remark", {
                                                required: "Remark is required",
                                            })}
                                            errorMsg={errors.revert_remark?.message}
                                            disabled={isDisabled}
                                        />

                                        <InputTag
                                            LName="Upload Revert Docs"
                                            type="file"
                                            {...register("document", {
                                                required: "Revert Docs are required",
                                            })}
                                            errorMsg={errors.document?.message}
                                            disabled={isDisabled}
                                        />
                                    </>
                                )}
                            </div>

                            {/* OTP SECTION */}
                            <div className="mt-10 flex flex-col justify-center items-center">
                                <div className="flex space-x-2 flex-wrap justify-center items-baseline">
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
                                                disabled={isSendOtpLoading || !status}
                                                className={`px-4 py-2 rounded text-white ${isSendOtpLoading || !status
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-green-500 hover:bg-purple-800"
                                                    }`}
                                            >
                                                {isSendOtpLoading
                                                    ? "Please wait..."
                                                    : status === "reverted"
                                                        ? "Revert"
                                                        : "Submit"}
                                            </button>

                                        </>
                                    ) : showOtpBtn && !isProcessing ? (
                                        <>
                                            <InputTag
                                                placeholder="Enter OTP"
                                                {...register("otp", { required: "OTP required" })}
                                                errorMsg={errors.otp?.message}
                                            />

                                            <p className="text-red-600 text-sm font-semibold">
                                                {timer > 0
                                                    ? `OTP expires in ${formatTime(timer)}`
                                                    : "OTP expired. Please resend OTP."}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={isBtnDisabled || isOtpExpired}
                                                className={`px-4 py-2 rounded text-white ${isBtnDisabled || isOtpExpired
                                                    ? "bg-gray-400"
                                                    : "bg-green-600"
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
                                        <p className="text-blue-700 font-semibold animate-pulse">
                                            Processing... Please wait
                                        </p>
                                    )}
                                </div>

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
            </form>
        </div>
    );
};

export default ApplicationRecivedFromCGM;
