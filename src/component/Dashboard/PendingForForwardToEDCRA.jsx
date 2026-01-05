// PendingForForwardToEDCRA.jsx
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
import { revertOption } from "../newComponents/commonOption.js";
import { HT_LOAD_CHANGE_BASE } from "../../api/api.js";

// status options as required
const statusOptions = [
  { label: "Self Approval", value: "self_approval" },
  { label: "Forward to EDCRA", value: "forward_to_edcra" },
  { label: "Reverted", value: "reverted" },
];

const PendingForForwardToEDCRA = () => {
  const officerData = useSelector((s) => s.user.officerData);
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.items || location.state?.data || null;

  const token = Cookies.get("accessToken");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: items || {} ,
  });

  // OTP & UI state
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);
  const [formDataValue, setFormDataValue] = useState(null);
  const status = watch("status");

  useEffect(() => {
    if (items?.id) {
      setValue("application", items.id);
    }
  }, [items, setValue]);

  useEffect(() => {
  if (status) {
    let remarkValue = "";
    if (status === "forward_to_edcra") remarkValue = "forward_to_edcra";
    else if (status === "self_approval") remarkValue = "self_approval";
    else if (status === "reverted") remarkValue = "reverted";
    setValue("remark", remarkValue, { shouldValidate: true, shouldDirty: true });
  }
}, [status, setValue]);

  // send OTP first (called on initial submit)
  const handleSendOtp = async (formData) => {
    // store form data to use after OTP verified
    setFormDataValue(formData);
    try {
      // send OTP to officer's registered cug_mobile (pattern same as your app)
      const mobileNo = String(officerData?.employee_detail?.cug_mobile || "");
      const sent = await sendOtpNew(mobileNo);
      if (sent.success) {
        setShowOtpBtn(true);
        setIsDisabled(true);
        setError("otpSuccess", { type: "manual", message: sent.message });
      } else {
        setError("otpStatus", { type: "manual", message: sent.message });
      }
    } catch (err) {
      setError("otpStatus", { type: "manual", message: "Failed to send OTP" });
    }
  };

  // verify OTP then final submit
  const handleVerifyOtp = async () => {
    const otpValue = getValues("otp");
    setBtnIsDisabled(true);
    try {
      const mobileNo = String(officerData?.employee_detail?.cug_mobile || "");
      const verifyResp = await verifyOtpNew(mobileNo, otpValue);
      if (verifyResp.success) {
        await handleFinalSubmit(); // proceed to API
      } else {
        setError("otp", { type: "manual", message: verifyResp.error || "OTP invalid" });
        setBtnIsDisabled(false);
      }
    } catch (err) {
      setError("otpStatus", { type: "manual", message: "OTP verification failed" });
      setBtnIsDisabled(false);
    }
  };

  const handleReSendOtp = async () => {
    clearErrors("otpSuccess");
    const mobileNo = String(officerData?.employee_detail?.cug_mobile || "");
    const sent = await sendOtpNew(mobileNo);
    setShowOtpBtn(true);
    if (sent?.success) {
      setError("otpSuccess", { type: "manual", message: `OTP Resent successfully to ****${mobileNo.slice(-4)}` });
    } else {
      setError("otp", { type: "manual", message: `Failed to send OTP to ****${mobileNo.slice(-4)}` });
    }
  };

  // final API call (after OTP)
  const handleFinalSubmit = async () => {
    try {
      const fv = formDataValue || getValues();
      // validation guard for conditional fields
      if ((fv.status === "self_approval" || fv.status === "forward_to_edcra")) {
        // require agreement/letter fields
        if (!fv.agreement_no && !fv.letter_no) {
          alert("Please enter Agreement / Letter Number.");
          return;
        }
        if (!(fv.agreement_doc?.length > 0 || fv.document?.length > 0)) {
          alert("Please upload Agreement / Letter document.");
          return;
        }
      }

      if (fv.status === "reverted") {
        if (!fv.revert_reason) {
          alert("Please select revert reason.");
          return;
        }
        if (!fv.revert_reason_remark) {
          alert("Please add revert remark.");
          return;
        }
        if (!(fv.upload_revert_docs?.length > 0)) {
          alert("Please upload revert document(s).");
          return;
        }
      }

      const fd = new FormData();
      fd.append("application", fv.application);
      fd.append("status", fv.status);
      fd.append("remark", fv.remark);
   

      // For accepted/forward -> map Agreement inputs to backend expected keys
      // Using agreement_no as letter_no and agreement_doc as document
      if (fv.agreement_no) fd.append("letter_no", fv.agreement_no);
      if (fv.agreement_effective_date) fd.append("agreement_effective_date", fv.agreement_effective_date);
      if (fv.agreement_doc && fv.agreement_doc.length > 0) fd.append("document", fv.agreement_doc[0]);

      // also accept direct keys if present (defensive)
      if (fv.letter_no) fd.append("letter_no", fv.letter_no);
      if (fv.document && fv.document.length > 0) fd.append("document", fv.document[0]);

      // Revert specific
      if (fv.revert_reason) fd.append("revert_reason", fv.revert_reason);
      if (fv.revert_reason_remark) fd.append("revert_reason_remark", fv.revert_reason_remark);
      if (fv.upload_revert_docs && fv.upload_revert_docs.length > 0) fd.append("upload_revert_docs", fv.upload_revert_docs[0]);

      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      // multipart automatically set by browser; axios will set boundary if FormData passed

      const url = `${HT_LOAD_CHANGE_BASE}/edcra-approval/`; // adjust if backend expects different
      const resp = await axios.post(url, fd, { headers });
      const result = resp?.data;

      if (result?.status === "success") {
        alert(result.message || "EDCRA Approval submitted successfully");
        // navigate to responses page (consistent with other flows)
        navigate(`/dashboard/respones/${result.data.application}`, { state: result.data });
      } else {
        alert(result?.message || "Submission failed");
      }
    } catch (err) {
      console.error("submit err", err);
      alert(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setBtnIsDisabled(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSendOtp)}>
        <div className="card mt-2 mb-2 bg-white rounded shadow-md ">
          <div className="card-header px-4 py-2 border-b border-gray-300">
            <h2 className="text-lg font-bold capitalize ">HT Load Change EDCRA Permission</h2>
          </div>
          <div className="card-body px-4 pb-4">
            <div className="mt-6 overflow-x-auto">
              <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
            </div>
          </div>
        </div>

        {/* Show EDCRA action only for role 19 */}
        {Number(officerData?.employee_detail?.role) === 19 && (
          <div className="card mt-2 mb-2 bg-white rounded shadow-md ">
            <div className="card-header px-4 py-2 border-b border-gray-300">
              <h2 className="text-lg font-bold capitalize ">EDCRA Action</h2>
            </div>

            <div className="card-body px-4 pb-4">
              <input type="hidden" {...register("application")} value={items?.id || ""} />

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                {/* Acceptance / Status */}
                <div className="sm:col-span-2">
                  <SelectTag
                    LName="Acceptance"
                    options={statusOptions}
                    {...register("status", { required: "Please select action" })}
                    errorMsg={errors.status?.message}
                    labelKey="label"
                    valueKey="value"
                    disabled={isDisabled}
                  />
                </div>

                {/* If Self Approval or Forward to EDCRA -> show Agreement inputs (styled like screenshot) */}
                {(status === "self_approval" || status === "forward_to_edcra") && (
                  <>
                    <div className="sm:col-span-2">
                      <InputTag
                        LName="Agreement No."
                        placeholder="Enter Agreement No."
                        {...register("agreement_no", {
                          required: "Agreement No is required",
                        })}
                        errorMsg={errors.agreement_no?.message}
                        disabled={isDisabled}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <InputTag
                        LName="Agreement Effective Date"
                        type="date"
                        {...register("agreement_effective_date", {
                          required: "Effective Date is required",
                        })}
                        errorMsg={errors.agreement_effective_date?.message}
                        disabled={isDisabled}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <InputTag
                        LName="Final Agreement Letter"
                        type="file"
                        {...register("agreement_doc", {
                          required: "Agreement Letter is required",
                        })}
                        errorMsg={errors.agreement_doc?.message}
                        disabled={isDisabled}
                      />
                      {/* Show existing document link if present */}
                      {items?.document && (
                        <div className="text-sm mt-1">
                          Existing:{" "}
                          <a href={items.document} target="_blank" rel="noreferrer" className="underline">
                            View
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Reverted Case */}
                {status === "reverted" && (
                  <>
                    <div className="sm:col-span-2">
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
                    </div>

                    <div className="sm:col-span-3">
                      <InputTag
                        LName="Revert Reason Remark"
                        placeholder="Enter Remark"
                        {...register("revert_reason_remark", {
                          required: "Remark is required",
                        })}
                        errorMsg={errors.revert_reason_remark?.message}
                        disabled={isDisabled}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <InputTag
                        LName="Upload Revert Docs"
                        type="file"
                        {...register("upload_revert_docs", {
                          required: "Revert Docs are required",
                        })}
                        errorMsg={errors.upload_revert_docs?.message}
                        disabled={isDisabled}
                      />
                      {items?.upload_revert_docs && (
                        <div className="text-sm mt-1">
                          Existing:{" "}
                          <a href={items.upload_revert_docs} target="_blank" rel="noreferrer" className="underline">
                            View
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Remark textarea */}
                <div className="sm:col-span-8">
                  <label className="block text-sm font-medium text-gray-700">Remark</label>
                  <textarea
                    {...register("remark")}
                    // defaultValue="EDCRA approval submitted"
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                    rows={2}
                    placeholder="Remark"
                  />
                </div>
              </div>

              {/* Buttons & OTP area */}
              <div className="border-b border-gray-900/10 pb-12 shadow-md p-4 mt-4">
                <div className="mt-10 flex flex-col justify-center items-center">
                  <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                    {!showOtpBtn ? (
                      <>
                        <button type="reset" className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => { clearErrors(); setIsDisabled(false); setShowOtpBtn(false); }}>
                          Reset
                        </button>

                        <button
                          type="submit"
                          className={`px-4 py-2 rounded text-white ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-purple-800"}`}
                          disabled={isDisabled}
                        >
                          {status === "reverted" ? "Revert Application" : status === "self_approval" ? "Self Approve" : "Forward to EDCRA"}
                        </button>
                      </>
                    ) : (
                      <>
                        <InputTag placeholder="Enter OTP" {...register("otp", { required: "Otp is required" })} errorMsg={errors.otp?.message} />
                        <button type="button" onClick={handleVerifyOtp} className={`px-4 py-2 rounded text-white ${isBtnDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-purple-800"}`} disabled={isBtnDisabled}>
                          {isBtnDisabled ? "Please wait..." : "Verify OTP"}
                        </button>
                        <button type="button" onClick={handleReSendOtp} className="px-4 py-2 bg-emerald-600 text-white rounded">
                          Resend OTP
                        </button>
                      </>
                    )}
                  </div>

                  {/* Error & Success messages */}
                  {errors?.otpSuccess && <p className="text-green-500 text-sm mt-2">{errors.otpSuccess.message}</p>}
                  {errors?.otpStatus && <p className="text-red-500 text-sm mt-2">{errors.otpStatus.message}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PendingForForwardToEDCRA;