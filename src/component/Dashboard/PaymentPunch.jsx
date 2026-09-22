import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
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

// const paymentSourceOptions = [
//   { label: "NEFT", value: "NEFT" },
//   { label: "RTGS", value: "RTGS" },
//   { label: "Cheque", value: "Cheque" },
//   { label: "DD", value: "DD" },
//   { label: "Challan / VAN", value: "Challan" },
// ];
const paymentSourceOptions = [
    { label: "Please Select Payment Type", value: "" },
    { label: "Card", value: "Card" },
    { label: "NetBanking", value: "NetBanking" },
    { label: "NEFT/RTGS", value: "NEFT/RTGS" },
    { label: "Fund Transfer", value: "Fund Transfer" },
    { label: "Transfer in Head Office Account", value: "Transfer in Head Office Account" },
    { label: "Direct Transfer in NSC Office", value: "Direct Transfer in NSC Office" },
    { label: "Direct Transfer in DSP Office", value: "Direct Transfer in DSP Office" },
    { label: "Transfer in Circle Account", value: "Transfer in Circle Account" },
    { label: "Energy Amount For VAN", value: "Energy Amount For VAN" },
];

const PaymentPunch = () => {
    const officerData = useSelector(state => state.user.officerData);
    const [mobileNo, setMobileNo] = useState('');
    const [showOtpBtn, setShowOtpBtn] = useState(false);
    const [fromDataValue, setFromDataValue] = useState(null);
    const [applicationData, setApplicationData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isBtnDisabled, setBtnIsDisabled] = useState(false);
    const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
    const [applicationNumber, setApplicationNumber] = useState('');
    const [searchError, setSearchError] = useState('');

    const [timer, setTimer] = useState(0);
    const [isOtpExpired, setIsOtpExpired] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        register, handleSubmit, setValue, getValues,
        setError, clearErrors, resetField,
        formState: { errors },
    } = useForm({ defaultValues: {}, shouldUnregister: true });

    const token = Cookies.get('accessToken');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalAction, setModalAction] = useState(() => () => { });

    useEffect(() => {
        let interval;
        if (timer > 0 && !isProcessing) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        if (timer === 0 && showOtpBtn && !isProcessing) setIsOtpExpired(true);
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

    // ---------------- SEARCH APPLICATION ----------------
    const handleSearchApplication = async () => {
        if (!applicationNumber.trim()) {
            setSearchError('Please enter application number');
            return;
        }

        setIsLoading(true);
        setSearchError('');

        try {
            const response = await axios.get(
                `${HT_LOAD_CHANGE_BASE}/payment-punch/${applicationNumber}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data?.data) {
                setApplicationData(response.data.data);
                setValue('application', response.data.data.id);
                setValue('amount', response.data.data.pending_payment_amount);
                setIsDisabled(false);
            }
        } catch (error) {
            setSearchError(
                error?.response?.data?.message || 'Application not found or no pending payment.'
            );
            setApplicationData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // ---------------- OTP FLOW ----------------
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
                setError("otpSuccess", { type: "manual", message: res.message });
            } else {
                setError("otpStatus", { type: "manual", message: res.message });
            }
        } catch {
            setError("otpStatus", { type: "manual", message: "Failed to send OTP. Please try again." });
        } finally {
            setIsSendOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (isOtpExpired) {
            setError("otp", { type: "manual", message: "OTP expired. Please resend OTP." });
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

    const handleReSendOtp = async () => {
        clearErrors();
        const res = await sendOtpNew(mobileNo);
        if (res.success) {
            setTimer(120);
            setIsOtpExpired(false);
            setError("otpSuccess", { type: "manual", message: `OTP resent to ****${mobileNo.slice(-4)}` });
        } else {
            setError("otp", { type: "manual", message: res.message });
        }
    };

    // ---------------- FINAL SUBMIT ----------------
    const handleFinalSubmit = async () => {
        try {
            const formValue = fromDataValue;
            const formData = new FormData();

            Object.keys(formValue).forEach(key => {
                if (formValue[key] instanceof FileList) {
                    if (formValue[key].length > 0) formData.append(key, formValue[key][0]);
                } else {
                    formData.append(key, formValue[key]);
                }
            });

            const { data } = await axios.post(
                `${HT_LOAD_CHANGE_BASE}/api/payment-punch/submit/`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate(`/dashboard/respones/${data?.data?.bank_response?.application}`, { state: data });

        } catch (error) {
            const backendMessage =
                error?.response?.data?.message ||
                error?.response?.data?.detail ||
                "Unable to submit payment punch right now. Please try again later.";
            alert(backendMessage);
        } finally {
            setBtnIsDisabled(false);
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(handleSendOtp)}>

                {/* Search Application */}
                <div className="card mt-2 mb-2 bg-white rounded shadow-md">
                    <div className="card-header px-4 py-2 border-b border-gray-300">
                        <h2 className="text-lg font-bold capitalize">Search Application For Payment Punch</h2>
                    </div>
                    <div className="card-body px-4 pb-4">
                        <div className="flex gap-4 items-end flex-wrap mt-6">
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

                {/* Consumer Basic Details - same global component reuse */}
                {applicationData && (
                    <div className="card mt-2 mb-2 bg-white rounded shadow-md">
                        <div className="card-header px-4 py-2 border-b border-gray-300">
                            <h2 className="text-lg font-bold capitalize">Consumer Basic Details</h2>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <div className="mt-6 overflow-x-auto">
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
                )}

                {/* AO Payment Punch Form */}
                {applicationData && (
                    <div className="card mt-2 mb-2 bg-white rounded shadow-md">
                        <div className="card-header px-4 py-2 border-b border-gray-300">
                            <h2 className="text-lg font-bold capitalize">
                                Payment Punch — Pending: {applicationData.pending_payment_type}
                                &nbsp;(₹{applicationData.pending_payment_amount})
                            </h2>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                                <input type="hidden" name="application" {...register('application')} value={applicationData?.id} />
                                <input
                                    type="hidden" name="employee_id" {...register('employee_id')}
                                    value={officerData?.employee_detail?.employee_login_id}
                                />

                                <InputTag
                                    LName="Transaction ID"
                                    placeholder="Enter Transaction ID"
                                    {...register("transaction_id", { required: "Transaction ID is required" })}
                                    errorMsg={errors.transaction_id?.message}
                                />

                                <SelectTag
                                    LName="Payment Source"
                                    options={paymentSourceOptions}
                                    {...register("payment_source", { required: "Payment source is required" })}
                                    errorMsg={errors.payment_source?.message}
                                    labelKey="label"
                                    valueKey="value"
                                />

                                {/* <InputTag
                                LName="Transaction Date"
                                type="datetime-local"
                                {...register("transaction_date", { required: "Transaction date is required" })}
                                errorMsg={errors.transaction_date?.message}
                                /> */}
                                <InputTag
                                    LName="Transaction Date"
                                    type="date"
                                    {...register("transaction_date", {
                                        required: "Transaction date is required"
                                    })}
                                    errorMsg={errors.transaction_date?.message}
                                />

                                <InputTag
                                    LName={`Amount (Expected: ₹${applicationData.pending_payment_amount})`}
                                    type="number"
                                    step="0.01"
                                    {...register("amount", { required: "Amount is required" })}
                                    errorMsg={errors.amount?.message}
                                />

                                <InputTag
                                    LName="Letter Number"
                                    placeholder="Enter Letter Number"
                                    {...register("letter_no", { required: "Letter number is required" })}
                                    errorMsg={errors.letter_no?.message}
                                />

                                <InputTag
                                    LName="Letter Date"
                                    type="date"
                                    {...register("letter_date", { required: "Letter date is required" })}
                                    errorMsg={errors.letter_date?.message}
                                />

                                <InputTag
                                    LName="Upload Bank Statement"
                                    type="file"
                                    acceptPdfOnly={true}
                                    {...register("bank_statement_pdf", { required: "Bank statement is required" })}
                                    errorMsg={errors.bank_statement_pdf?.message}
                                />

                                <InputTag
                                    LName="Upload Reference Letter"
                                    type="file"
                                    acceptPdfOnly={true}
                                    {...register("circle_reference_letter")}
                                    errorMsg={errors.circle_reference_letter?.message}
                                />

                                <InputTag
                                    LName="Remark"
                                    placeholder="Enter remark"
                                    {...register("remark")}
                                    errorMsg={errors.remark?.message}
                                />
                            </div>

                            {/* OTP + Submit — same pattern as CancelApplications */}
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="mt-10 flex flex-col justify-center items-center">
                                    <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                                        {!showOtpBtn && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        resetField('transaction_id');
                                                        resetField('payment_source');
                                                        resetField('transaction_date');
                                                        resetField('amount');
                                                        resetField('letter_no');
                                                        resetField('letter_date');
                                                        resetField('bank_statement_pdf');
                                                        resetField('circle_reference_letter');
                                                        resetField('remark');
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
                          ${isSendOtpLoading || isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                                                    disabled={isSendOtpLoading || isDisabled}
                                                >
                                                    {isSendOtpLoading ? "Sending OTP..." : "Submit Payment Punch"}
                                                </button>
                                            </>
                                        )}

                                        {showOtpBtn && !isProcessing && (
                                            <>
                                                <InputTag
                                                    placeholder="Enter OTP"
                                                    {...register("otp", { required: "OTP is required" })}
                                                    errorMsg={errors.otp?.message}
                                                />
                                                <p className="text-red-600 font-semibold text-sm mt-1">
                                                    {timer > 0 ? `OTP expires in ${formatTime(timer)}` : "OTP expired. Please resend OTP."}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={isBtnDisabled || isOtpExpired}
                                                    className={`px-4 py-2 mt-3 rounded text-white
                            ${isBtnDisabled || isOtpExpired ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-800"}`}
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

                                        {isProcessing && (
                                            <p className="text-blue-700 font-semibold mt-2 animate-pulse">Processing... Please wait</p>
                                        )}
                                    </div>

                                    {errors?.otpSuccess && <p className="text-green-500 text-sm mt-1">{errors?.otpSuccess?.message}</p>}
                                    {errors?.otpStatus && <p className="text-red-500 text-sm mt-1">{errors?.otpStatus?.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PaymentPunch;