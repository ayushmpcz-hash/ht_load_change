// PendingForTranscoApproval.jsx
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

// If you prefer, replace this url with HT_LOAD_CHANGE_BASE + '/transco_approval/' 
// const TRANSCO_URL = "https://htsanyojanuat.mpcz.in:8088/ht_load_change/transco_approval/";

// status options per backend
const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Accepted from CGM", value: "accepted_from_cgm" },
];

const PendingForTranscoApproval = () => {
  const officerData = useSelector((s) => s.user.officerData);
  const location = useLocation();
  const navigate = useNavigate();
  // items might be passed as location.state.items or .data
  const items = location.state?.items || location.state?.data || null;

  const token = Cookies.get("accessToken");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      application: items?.id || "",
      status: items?.status || "pending",
    },
  });

  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);
  const [formDataValue, setFormDataValue] = useState(null);

  const status = watch("status");

  useEffect(() => {
    if (items?.id) setValue("application", items.id);
  }, [items, setValue]);

  // send OTP (store form values to submit after verify)
  const handleSendOtp = async (fd) => {
    setFormDataValue(fd);
    try {
      const mobileNo = String(officerData?.employee_detail?.cug_mobile || "");
      const resp = await sendOtpNew(mobileNo);
      if (resp.success) {
        setShowOtpBtn(true);
        setIsDisabled(true);
        setError("otpSuccess", { type: "manual", message: resp.message });
      } else {
        setError("otpStatus", { type: "manual", message: resp.message });
      }
    } catch (err) {
      setError("otpStatus", { type: "manual", message: "Failed to send OTP" });
    }
  };

  // verify OTP then call final API
  const handleVerifyOtp = async () => {
    const otp = getValues("otp");
    setBtnIsDisabled(true);
    try {
      const mobileNo = String(officerData?.employee_detail?.cug_mobile || "");
      const v = await verifyOtpNew(mobileNo, otp);
      if (v.success) {
        await handleFinalSubmit();
      } else {
        setError("otp", { type: "manual", message: v.error || "OTP invalid" });
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
    if (sent?.success) setError("otpSuccess", { type: "manual", message: `OTP Resent successfully to ****${mobileNo.slice(-4)}` });
    else setError("otp", { type: "manual", message: `Failed to send OTP to ****${mobileNo.slice(-4)}` });
  };

  // actual submit (after OTP)
//   const handleFinalSubmit = async () => {
//     try {
//       const fv = formDataValue || getValues();

//       // basic conditional validation
//       if (fv.status === "accepted_from_cgm") {
//         if (!fv.letter_no) {
//           alert("Please enter Letter No.");
//           return;
//         }
//         if (!(fv.document && fv.document.length > 0)) {
//           alert("Please upload document.");
//           return;
//         }
//       }

//       const form = new FormData();
//       form.append("application", fv.application);
//       form.append("status", fv.status);
//       form.append("remark", fv.remark || "Transco approval submitted");

//       if (fv.letter_no) form.append("letter_no", fv.letter_no);
//       if (fv.document && fv.document.length > 0) form.append("document", fv.document[0]);

//       const headers = {};
//       if (token) headers["Authorization"] = `Bearer ${token}`;
//     const url = `${HT_LOAD_CHANGE_BASE}/ht_load_change/transco_approval/`
//       // POST to transco endpoint
//       const resp = await axios.post(TRANSCO_URL, form, { headers });
//       const result = resp?.data;

//       if (result?.status === "success") {
//         alert(result?.message || "Transco Approval submitted successfully");
//         navigate(`/dashboard/respones/${result.data.application}`, { state: result.data });
//       } else {
//         alert(result?.message || "Submission failed");
//       }
//     } catch (err) {
//       console.error("Transco submit error", err);
//       alert(err?.response?.data?.message || "Something went wrong!");
//     } finally {
//       setBtnIsDisabled(false);
//     }
//   };
  const handleFinalSubmit = async () => {
    try {
      const fv = formDataValue || getValues();
      console.log("Submitting values:", fv);

      // Derive remark from status
      let remarkToSend = fv.status === "accepted_from_cgm" ? "accepted_from_cgm" : "pending";

      // Conditional validation
      if (fv.status === "accepted_from_cgm") {
        if (!fv.letter_no) {
          alert("Please enter Letter No.");
          return;
        }
        if (!(fv.document && fv.document.length > 0)) {
          alert("Please upload document.");
          return;
        }
      }

      const form = new FormData();
      form.append("application", fv.application);
      form.append("status", fv.status);
      form.append("remark", remarkToSend);

      if (fv.letter_no) form.append("letter_no", fv.letter_no);
      if (fv.document && fv.document.length > 0) form.append("document", fv.document[0]);

      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const url = `${HT_LOAD_CHANGE_BASE}/transco_approval/`
      const resp = await axios.post(url, form, { headers });
      const result = resp.data;

      if (result?.status === "success") {
        alert(result?.message || "Transco Approval submitted successfully");
        navigate(`/dashboard/respones/${result.data.application}`, { state: result.data });
      } else {
        alert(result?.message || "Submission failed");
      }
    } catch (err) {
      console.error("Transco submit error:", err.response || err);
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
            <h2 className="text-lg font-bold capitalize ">HT Load Change Transco (CGM) Approval</h2>
          </div>
          <div className="card-body px-4 pb-4">
            <div className="mt-6 overflow-x-auto">
              <ApplicantBasicDetails htConsumers={items} register={register} errors={errors} />
            </div>
          </div>
        </div>

        {/* Show to CGM only — update role id if needed */}
        {Number(officerData?.employee_detail?.role) === 19 && (
          <div className="card mt-2 mb-2 bg-white rounded shadow-md ">
            <div className="card-header px-4 py-2 border-b border-gray-300">
              <h2 className="text-lg font-bold capitalize ">Transco Action</h2>
            </div>

            <div className="card-body px-4 pb-4">
              <input type="hidden" {...register("application")} value={items?.id || ""} />

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                <div className="sm:col-span-2">
                  <SelectTag
                    LName="Acceptance"
                    options={statusOptions}
                    {...register("status", { required: "Please select status" })}
                    errorMsg={errors.status?.message}
                    labelKey="label"
                    valueKey="value"
                    disabled={isDisabled}
                  />
                </div>

                {(status === "accepted_from_cgm") && (
                  <>
                    <div className="sm:col-span-3">
                      <InputTag
                        LName="Letter No"
                        placeholder="Enter Letter No."
                        {...register("letter_no", { required: "Letter No is required" })}
                        errorMsg={errors.letter_no?.message}
                        disabled={isDisabled}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <InputTag
                        LName="Upload Document"
                        type="file"
                        {...register("document", { required: "Document is required" })}
                        errorMsg={errors.document?.message}
                        disabled={isDisabled}
                      />
                      {items?.document && (
                        <div className="text-sm mt-1">
                          Existing: <a href={items.document} target="_blank" rel="noreferrer" className="underline">View</a>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="sm:col-span-8">
                  <label className="block text-sm font-medium text-gray-700">Remark</label>
                  <textarea
                    // {...register("remark")}
                    value={status === "accepted_from_cgm" ? "accepted_from_cgm from CGM" : "pending"}
                    // defaultValue="Transco approval submitted"
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                    rows={2}
                    placeholder="Remark"
                  />
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12 shadow-md p-4 mt-4">
                <div className="mt-10 flex flex-col justify-center items-center">
                  <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                    {!showOtpBtn ? (
                      <>
                        <button type="reset" className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => { clearErrors(); setIsDisabled(false); setShowOtpBtn(false); }}>
                          Reset
                        </button>

                        <button type="submit" className={`px-4 py-2 rounded text-white ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-purple-800"}`} disabled={isDisabled}>
                          {status === "accepted_from_cgm" ? "Accept (From CGM)" : "Submit"}
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

export default PendingForTranscoApproval;