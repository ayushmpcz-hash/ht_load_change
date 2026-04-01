import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import {
  InputTag,
  SelectTag,
  ApplicantBasicDetails,
  sendOtpNew,
  verifyOtpNew,
  ApplicantFillDetails
} from "../importComponents.js";
import { responseOption, revertOption } from "../newComponents/commonOption.js";
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js'
import { setOfficerData } from "../../redux/slices/userSlice.js";
import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
import { handleTokenExpiry } from '../../utils/handleTokenExpiry';


const LoadAgreement = () => {
  const officerData = useSelector((state) => state.user.officerData);

  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || {};
  const [mobileNo, setMobileNo] = useState('');
  const [timer, setTimer] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);

  const [contractorCategory, setContractorCategory] = useState([]);
  const [contractorList, setContractorList] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);

  // console.log(items, "items")
  // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE in Load Aggrement')
  const required = items?.survey?.is_estimate_required?.split(',') || [];

  const token = Cookies.get("accessToken");
  const dispatch = useDispatch()


  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const [formDataValue, setFormDataValue] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);



  const transactionDateRaw = items?.bank_response?.transaction_date; // "2025-09-24T12:23:38+05:30"
  const transactionDate = transactionDateRaw
    ? new Date(transactionDateRaw).toISOString().split("T")[0] // "2025-09-24"
    : null;

  const todayDate = new Date().toISOString().split("T")[0]; // "2025-12-27"
  const isAgreementFinalizationStep = items?.application_status === 11;



  // Form
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });

  const agreement_response = watch("agreement_response");

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
        setTimer(120);
        setIsOtpExpired(false);

        setError("otpSuccess", { type: "manual", message: res.message });
      } else {
        setError("otpStatus", { type: "manual", message: res.message });
      }
    } finally {
      setIsSendOtpLoading(false);
    }
  };


  // 🔹 Verify OTP
  // const handleVerifyOtp = async () => {
  //   const otpValue = getValues("otp");
  //   setBtnIsDisabled(true);
  //   const verifyOtpResponse = await verifyOtpNew(mobileNo, otpValue);

  //   if (verifyOtpResponse.success) {
  //     handleFinalSubmit();
  //   } else {
  //     setError("otp", { type: "manual", message: verifyOtpResponse.error });
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


  // 🔹 Final Submit API Call
  const handleFinalSubmit = async () => {
    try {
      const formValue = getValues();   // ⭐ FIXED
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
        `${HT_LOAD_CHANGE_BASE}/agreement-details/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Agreement And Work Order submitted successfully ✅");

      navigate(`/dashboard/respones/${data.data.application}`, {
        state: data.data,
      });

      const updatedFlags = await handleOfficerFlagCount();
      dispatch(setOfficerData(updatedFlags));
    } catch (error) {
      if (handleTokenExpiry(error, navigate)) return;

      console.error(error);
      alert("Something went wrong ❌");
    } finally {
      setBtnIsDisabled(false);
    }
  };

  useEffect(() => {
    const fetchContractorCategory = async () => {
      try {
        const res = await axios.get(
          "https://qcportal.mpcz.in/tkc/get_tkc_category"
        );

        if (res.data.status) {
          setContractorCategory(res.data.data);
        }
      } catch (err) {
        console.error("Category API Error", err);
      }
    };

    fetchContractorCategory();
  }, []);

  // const handleCategoryChange = async (e) => {
  //   const oyt = e.target.value;

  //   try {
  //     const res = await axios.get(
  //       `https://qcportal.mpcz.in/tkc/get_tkc_by_oyt/${oyt}`
  //     );

  //     if (res.data.status) {
  //       setContractorList(res.data.contractor_details);
  //     }
  //   } catch (err) {
  //     console.error("Contractor list error", err);
  //   }
  // };
  const handleCategoryChange = async (e) => {

  const category = e.target.value;

  const selected = contractorCategory.find(
    (cat) => cat.Category === category
  );

  const oyt = selected?.Original_Oyt;

  try {

    const res = await axios.get(
      `https://qcportal.mpcz.in/tkc/get_tkc_by_oyt/${oyt}`
    );

    if (res.data.status) {
      setContractorList(res.data.contractor_details);
    }

  } catch (err) {
    console.error("Contractor list error", err);
  }

};

  // const handleContractorChange = async (e) => {
  //   const userId = e.target.value;

  //   const contractor = contractorList.find(
  //     (c) => c.user_id_id.User_Id == userId
  //   );

  //   if (contractor) {
  //     setSelectedContractor(contractor);

  //     setValue("contractor_mobile", contractor.user_id_id.ContactNo);
  //     setValue("contractor_company", contractor.CompanyName_E);
  //     setValue("authentication_id", contractor.user_id_id.Authentication_id);

  //     const regRes = await axios.get(
  //       `https://qcportal.mpcz.in/tkc/get_reg_date/${userId}`
  //     );

  //     if (regRes.data.status) {
  //       setValue("registration_date", regRes.data.data.reg_date);
  //     }
  //   }
  // };
   const handleContractorChange = async (e) => {

  const contractorName = e.target.value;

  const contractor = contractorList.find(
    (c) => c.user_id_id.Authorised_person_E === contractorName
  );

  if (contractor) {

    setSelectedContractor(contractor);

    setValue("contractor_mobile", contractor.user_id_id.ContactNo);
    setValue("contractor_company", contractor.CompanyName_E);
    setValue("authentication_id", contractor.user_id_id.Authentication_id);

    const regRes = await axios.get(
      `https://qcportal.mpcz.in/tkc/get_reg_date/${contractor.user_id_id.User_Id}`
    );

    if (regRes.data.status) {
      setValue("registration_date", regRes.data.data.reg_date);
    }
  }
};

  const getVoltageValue = (voltage) => {
    if (!voltage) return 0;
    return parseInt(voltage.replace(" KV", ""));
  };

  const newVoltage = getVoltageValue(items?.new_supply_voltage);

  const filteredCategory = contractorCategory.filter((cat) => {

    const voltage = getVoltageValue(items?.new_supply_voltage);

    if (voltage === 33) {
      return ["A4", "A5"].includes(cat.Category);
    }

    if (voltage === 11) {
      return true;
    }

    return true;
  });

  return (
    <>

      <div>
        <form onSubmit={handleSubmit(handleSendOtp)}>

          <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
            <div className="card-header px-4 py-2 border-b border-gray-300">
              <h2 className="text-lg font-bold capitalize ">
                HT Load Change Agreement Finalization
              </h2>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="mt-6 overflow-x-auto">
                <div className="">
                  <ApplicantBasicDetails
                    htConsumers={items}
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
          </div>

          {officerData?.employee_detail.role == 3 && (
            <>
              <input
                type="hidden"
                value={items?.id}
                {...register("application")}
              />


              <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
                <div className="card-header px-4 py-2 border-b border-gray-300">
                  <h2 className="text-lg font-bold capitalize ">

                  </h2>
                </div>
                <div className="card-body px-4 pb-4">
                  <div className="">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">

                      {/* <SelectTag
                        LName="Acceptance"
                        options={responseOption}
                        {...register("agreement_response", {
                          required: "Please Select Acceptance",
                        })}
                        errorMsg={errors.agreement_response?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      /> */}
                      <SelectTag
                        LName="Acceptance"
                        options={
                          isAgreementFinalizationStep
                            ? responseOption.filter(opt => opt.value !== "Reverted")
                            : responseOption
                        }
                        {...register("agreement_response", {
                          required: "Please Select Acceptance",
                        })}
                        errorMsg={errors.agreement_response?.message}
                        labelKey="label"
                        valueKey="value"
                        disabled={isDisabled}
                      />


                      {/* Accepted Case */}
                      {agreement_response === "Accepted" && (
                        <>
                          <InputTag
                            LName="Agreement No."
                            placeholder="Enter Agreement No."
                            {...register("agreement_no", {
                              required: "Agreement No is required",
                            })}
                            errorMsg={errors.agreement_no?.message}
                            disabled={isDisabled}
                          />

                          {/* <InputTag
                            LName="Agreement Date"
                            type="date"
                            {...register("agreement_effective_date", {

                              required: "Effective Date is required",
                            })}
                            errorMsg={errors.agreement_effective_date?.message}
                            disabled={isDisabled}
                          /> */}
                          <InputTag
                            LName="Agreement Date"
                            type="date"
                            {...register("agreement_effective_date", {
                              required: "Effective Date is required",
                            })}
                            min={transactionDate} // transaction date se pehle wali dates disable
                            max={todayDate}       // aaj ke baad ki dates disable
                            errorMsg={errors.agreement_effective_date?.message}
                            disabled={isDisabled}
                          />



                          <InputTag
                            LName="Final Agreement pdf"
                            type="file"
                            acceptPdfOnly={true}
                            {...register("agreement_doc", {
                              required: "Agreement Letter is required",
                            })}
                            errorMsg={errors.agreement_doc?.message}
                            disabled={isDisabled}
                          />

                          {required.includes('is_me_meter_required') && (
                            <>
                              <InputTag
                                LName="ME Meter Work Order No."
                                placeholder="Enter ME Meter Work Order No."
                                {...register("me_meter_work_order_no", {
                                  required: "ME Meter Work Order No is required",
                                })}
                                errorMsg={errors.me_meter_work_order_no?.message}
                                disabled={isDisabled}
                              />
                              {/* <InputTag
                              LName="ME Meter Work Order Date"
                              type="date"
                              {...register("me_meter_work_order_date", {
                                required: "ME Meter Work Order Date is required",
                              })}
                              errorMsg={errors.me_meter_work_order_date?.message}
                              disabled={isDisabled}
                            /> */}
                              <InputTag
                                LName="ME Meter Work Order Date"
                                type="date"
                                {...register("me_meter_work_order_date", {
                                  required: "ME Meter Work Order Date is required",
                                })}
                                min={transactionDate}   // ❌ payment se pehle ki date disable
                                max={todayDate}         // ❌ future date disable
                                errorMsg={errors.me_meter_work_order_date?.message}
                                disabled={isDisabled}
                              />

                              <InputTag
                                LName="ME Meter Work Order Letter"
                                type="file"
                                acceptPdfOnly={true}
                                {...register("me_meter_work_order_docs", {
                                  required: "ME Meter Work Order Letter is required",
                                })}
                                errorMsg={errors.me_meter_work_order_docs?.message}
                                disabled={isDisabled}
                              />
                            </>
                          )}

                          {items?.survey?.scheme_name === "SCCW" &&
                            required?.includes("is_extension_work_required") &&
                            items?.lc_type === "Load_Enhancement_with_Voltage_Change" &&
                            newVoltage < 132 && (

                              <>
                                <h3 className="col-span-8 font-bold text-lg border-b pb-2">
                                  Work Execution
                                </h3>

                                <h4 className="col-span-8 font-bold text-lg text-red-500">Select contractor details as requested by the H.T. Consumer.</h4>

                                {/* <SelectTag
                                  LName="Contractor Category"
                                  options={filteredCategory}
                                  {...register("contractor_category", {
                                    required: "Contractor Category is required",
                                  })}
                                  errorMsg={errors.contractor_category?.message}
                                  labelKey="Category"
                                  valueKey="Original_Oyt"
                                  onChange={handleCategoryChange}
                                /> */}
                                <SelectTag
                                  LName="Contractor Category"
                                  options={filteredCategory}
                                  {...register("contractor_category", {
                                    required: "Contractor Category is required",
                                  })}
                                  errorMsg={errors.contractor_category?.message}
                                  labelKey="Category"
                                  valueKey="Category"
                                  onChange={handleCategoryChange}
                                />

                                <SelectTag
                                  LName="Contractor Name"
                                  // options={contractorList.map((con) => ({
                                  //   label: con.user_id_id.Authorised_person_E,
                                  //   value: con.user_id_id.User_Id
                                  // }))}
                                  options={contractorList.map((con) => ({
                                    label: con.user_id_id.Authorised_person_E,
                                    value: con.user_id_id.Authorised_person_E
                                  }))}
                                  {...register("contractor_name", {
                                    required: "Contractor Name is required",
                                  })}
                                  errorMsg={errors.contractor_name?.message}
                                  labelKey="label"
                                  valueKey="value"
                                  onChange={handleContractorChange}
                                />

                                <InputTag
                                  LName="Contractor Company Name"
                                  {...register("contractor_company")}
                                  disabled
                                />

                                <InputTag
                                  LName="Contractor Mobile No"
                                  {...register("contractor_mobile")}
                                  disabled
                                />

                                <InputTag
                                  LName="Authentication Id"
                                  {...register("authentication_id")}
                                  disabled
                                />

                                <InputTag
                                  LName="Registration Date"
                                  type="date"
                                  {...register("registration_date")}
                                  disabled
                                />

                              </>
                            )}

                          {required?.includes('is_extension_work_required') && (
                            <>
                              <InputTag
                                LName="Extension Work Order No."
                                placeholder="Enter Extension Work Order No."
                                {...register("ex_work_order_no", {
                                  required: " Extension Work Order No is required",
                                })}
                                errorMsg={errors.ex_work_order_no?.message}
                                disabled={isDisabled}
                              />
                              <InputTag
                                LName=" Extension Work Order Date"
                                type="date"
                                {...register("ex_work_order_date", {
                                  required: " Extension Work Order Date is required",
                                })}
                                errorMsg={errors.ex_work_order_date?.message}
                                disabled={isDisabled}
                              />
                              <InputTag
                                LName="Extension Work Order Letter"
                                type="file"
                                acceptPdfOnly={true}
                                {...register("ex_work_order_docs", {
                                  required: " Extension Work Order Letter is required",
                                })}
                                errorMsg={errors.ex_work_order_docs?.message}
                                disabled={isDisabled}
                              />

                            </>
                          )}

                          {(items?.load_sanction?.is_required === "is_agreement_required" || items?.survey?.is_required === "is_agreement_required") && items?.type_of_change === "Load_Enhancement" && (
                            <InputTag
                              LName="Upload Commissioning Permission letter"
                              type="file"
                              acceptPdfOnly={true}
                              {...register("commissioning_permission_doc", {
                                required: "Commissioning Permission letter is required",
                              })}
                              errorMsg={errors.commissioning_permission_docs?.message}
                              disabled={isDisabled}
                            />
                          )}

                        </>
                      )}

                      {/* Reverted Case */}
                      {agreement_response === "Reverted" && (
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
                            placeholder="Enter Remark"
                            {...register("revert_reason_remark", {
                              required: "Remark is required",
                            })}
                            errorMsg={errors.revert_reason_remark?.message}
                            disabled={isDisabled}
                          />
                          <InputTag
                            LName="Upload Revert Docs"
                            type="file"
                            acceptPdfOnly={true}
                            {...register("upload_revert_docs", {
                              required: "Revert Docs are required",
                            })}
                            errorMsg={errors.upload_revert_docs?.message}
                            disabled={isDisabled}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="border-b border-gray-900/10 pb-12 shadow-md p-4">
                    <div className="mt-10 flex flex-col justify-center items-center">
                      <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                        {!showOtpBtn ? (
                          <>
                            <button type="reset" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                              Reset
                            </button>

                            {/* <button
                              type="submit"
                              disabled={isSendOtpLoading}
                              className={`px-4 py-2 rounded text-white ${isSendOtpLoading || isBtnDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-purple-800"
                                }`}
                            >
                              {isSendOtpLoading
                                ? "Please wait..."
                                : agreement_response === "Reverted"
                                  ? "Revert For Demand note"
                                  : agreement_response === "Accepted" && required?.includes("is_me_meter_required")
                                    ? "Send for Meter Issue"
                                    : agreement_response === "Accepted" &&
                                      (items?.load_sanction?.is_required === "is_agreement_required" ||
                                        items?.survey?.is_required === "is_agreement_required") &&
                                      items?.type_of_change === "Load_Enhancement"
                                      ? "Send for BiCall"
                                      : agreement_response === "Accepted" &&
                                        (items?.load_sanction?.is_required === "is_agreement_required" ||
                                          items?.survey?.is_required === "is_agreement_required") &&
                                        items?.type_of_change === "Load_Reduction"
                                        ? "Send for Completion certifying"
                                        : "Send for Completion Certifying"}
                            </button> */}
                            <button
                              type="submit"
                              disabled={isSendOtpLoading}
                              className={`px-4 py-2 rounded text-white ${isSendOtpLoading || isBtnDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-purple-800"
                                }`}
                            >
                              {isSendOtpLoading
                                ? "Please wait..."
                                : agreement_response === "Reverted"
                                  ? "Revert For Demand note"

                                  // ⭐ Extension Work Required
                                  : agreement_response === "Accepted" &&
                                    required?.includes("is_extension_work_required")
                                    ? "Send for Upload & Charging Permission"

                                    // ⭐ Only ME Meter Required
                                    : agreement_response === "Accepted" &&
                                      required?.includes("is_me_meter_required") &&
                                      !required?.includes("is_extension_work_required")
                                      ? "Send for Issue Meter"

                                      : agreement_response === "Accepted" &&
                                        (items?.load_sanction?.is_required === "is_agreement_required" ||
                                          items?.survey?.is_required === "is_agreement_required") &&
                                        items?.type_of_change === "Load_Enhancement"
                                        ? "Send for BiCall"

                                        : agreement_response === "Accepted" &&
                                          (items?.load_sanction?.is_required === "is_agreement_required" ||
                                            items?.survey?.is_required === "is_agreement_required") &&
                                          items?.type_of_change === "Load_Reduction"
                                          ? "Send for Completion certifying"

                                          : "Send for Completion Certifying"}
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
              </div>
            </>
          )}

        </form>
      </div>
    </>
  );
};

export default LoadAgreement;







// Updated LoadAgreement.jsx with Aadhar-based fields and checkbox
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import Cookies from "js-cookie";
// import axios from "axios";
// import {
//   InputTag,
//   SelectTag,
//   ApplicantBasicDetails,
//   sendOtpNew,
//   verifyOtpNew,
// } from "../importComponents.js";
// import { responseOption, revertOption } from "../newComponents/commonOption.js";
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js'
// import { setOfficerData } from "../../redux/slices/userSlice.js";
// import { handleOfficerFlagCount } from "../../utils/handleOfficerFlagCount.js";
// import { handleTokenExpiry } from '../../utils/handleTokenExpiry';

// const LoadAgreement = () => {
//   const officerData = useSelector((state) => state.user.officerData);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { items } = location.state || {};

//   // State for previous supplementary agreements
//   const [previousAgreements, setPreviousAgreements] = useState([]);
//   const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
//   const [mainAgreementDetails, setMainAgreementDetails] = useState({
//     main_agreement_date: "",
//     main_wef_date: ""
//   });

//   // State for E-stamp party details
//   const [showPartyDetails, setShowPartyDetails] = useState(false);
//   const [partyDetails, setPartyDetails] = useState({
//     discom_officer_name: "",
//     discom_officer_mobile: "",
//     authorized_person_name: "",
//     authorized_person_mobile: ""
//   });

//   // ... existing state variables ...
//   const [mobileNo, setMobileNo] = useState('');
//   const [timer, setTimer] = useState(0);
//   const [isOtpExpired, setIsOtpExpired] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
//   const [contractorCategory, setContractorCategory] = useState([]);
//   const [contractorList, setContractorList] = useState([]);
//   const [selectedContractor, setSelectedContractor] = useState(null);
//   const [showOtpBtn, setShowOtpBtn] = useState(false);
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [isBtnDisabled, setBtnIsDisabled] = useState(false);

//   const [previewHtml, setPreviewHtml] = useState("");
//   const [showPreviewModal, setShowPreviewModal] = useState(false);

//   const required = items?.survey?.is_estimate_required?.split(',') || [];
//   const token = Cookies.get("accessToken");
//   const dispatch = useDispatch();

//   const transactionDateRaw = items?.bank_response?.transaction_date;
//   const transactionDate = transactionDateRaw
//     ? new Date(transactionDateRaw).toISOString().split("T")[0]
//     : null;

//   const todayDate = new Date().toISOString().split("T")[0];
//   const isAgreementFinalizationStep = items?.application_status === 11;

//   // Form
//   const {
//     register,
//     handleSubmit,
//     watch,
//     getValues,
//     setValue,
//     setError,
//     clearErrors,
//     formState: { errors },
//   } = useForm({
//     defaultValues: items || {},
//   });

//   const agreement_response = watch("agreement_response");
//   const has_previous_agreements = watch("has_previous_agreements");

//   // Handle previous agreements toggle
//   useEffect(() => {
//     if (has_previous_agreements === "Yes") {
//       // Initialize at least one previous agreement field
//       if (previousAgreements.length === 0) {
//         setPreviousAgreements([{
//           id: Date.now(),
//           agreement_type: "",
//           agreement_executed_date: "",
//           previous_contract_demand: "",
//           new_contract_demand: "",
//           previous_name: "",
//           new_name: "",
//           previous_voltage: "",
//           new_voltage: ""
//         }]);
//       }
//     } else {
//       setPreviousAgreements([]);
//     }
//   }, [has_previous_agreements]);

//   // Add new previous agreement
//   const addPreviousAgreement = () => {
//     setPreviousAgreements([
//       ...previousAgreements,
//       {
//         id: Date.now(),
//         agreement_type: '',
//         agreement_executed_date: '',
//         previous_contract_demand: '',
//         new_contract_demand: '',
//         supply_voltage_changed: false,
//         previous_name: '',
//         new_name: '',
//         previous_voltage: '',
//         new_voltage: ''
//       }
//     ]);
//   };

//   // Remove previous agreement
//   const removePreviousAgreement = (id) => {
//     setPreviousAgreements(previousAgreements.filter(ag => ag.id !== id));
//   };

//   // Update previous agreement field
//   const updatePreviousAgreement = (id, field, value) => {
//     setPreviousAgreements(previousAgreements.map(ag =>
//       ag.id === id ? { ...ag, [field]: value } : ag
//     ));
//   };

//   // Handle party details input changes
//   const handlePartyDetailsChange = (field, value) => {
//     // Convert to uppercase for name fields
//     if (field === 'discom_officer_name' || field === 'authorized_person_name') {
//       value = value.toUpperCase();
//     }
//     setPartyDetails(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Validate mobile number
//   const validateMobile = (mobile) => {
//     const mobileRegex = /^[0-9]{10}$/;
//     return mobileRegex.test(mobile);
//   };

//   const sortedAgreements = [...previousAgreements].sort(
//     (a, b) =>
//       new Date(a.agreement_executed_date || 0) - new Date(b.agreement_executed_date || 0)
//   );

//   // Generate agreement preview
//   const handlePreviewAgreement = async () => {
//     if (!items?.id) return;
//     setIsGeneratingPreview(true);
//     try {
//       const cleanedAgreements = sortedAgreements.map(ag => {
//         const isLoadType =
//           ag.agreement_type === "LOAD_ENHANCEMENT" ||
//           ag.agreement_type === "LOAD_REDUCTION";
//         return {
//           ...ag,
//           previous_contract_demand: isLoadType
//             ? (ag.previous_contract_demand === "" ? null : Number(ag.previous_contract_demand))
//             : null,
//           new_contract_demand: isLoadType
//             ? (ag.new_contract_demand === "" ? null : Number(ag.new_contract_demand))
//             : null,
//           previous_voltage: ag.supply_voltage_changed
//             ? ag.previous_voltage
//             : items?.existing_supply_voltage,
//           new_voltage: ag.supply_voltage_changed
//             ? ag.new_voltage
//             : items?.existing_supply_voltage
//         };
//       });
//       await axios.post(
//         `${HT_LOAD_CHANGE_BASE}/save-previous-agreements/${items.id}/`,
//         {
//           agreements: cleanedAgreements,
//           main_agreement: mainAgreementDetails,
//           estamp_party_details: showPartyDetails ? partyDetails : null
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const response = await axios.get(
//         `${HT_LOAD_CHANGE_BASE}/estamp/preview/${items.id}/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const html = response.data;
//       setPreviewHtml(html);
//       setShowPreviewModal(true);
//     } catch (error) {
//       console.error("Preview error:", error);
//       alert("Failed to generate agreement preview");
//     } finally {
//       setIsGeneratingPreview(false);
//     }
//   };

//   // Initialize E-stamp process
//   const handleInitEStamp = async () => {
//     if (!items?.id) return;
//     try {
//       if (sortedAgreements.length > 0) {
//         await axios.post(
//           `${HT_LOAD_CHANGE_BASE}/save-previous-agreements/${items.id}/`,
//           {
//             agreements: sortedAgreements,
//             main_agreement: mainAgreementDetails,
//             estamp_party_details: showPartyDetails ? partyDetails : null
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }
//       const response = await axios.get(
//         `${HT_LOAD_CHANGE_BASE}/estamp/init/${items.id}/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.status === 200) {
//         alert("E-stamp initiated successfully");
//         handleSendOtp();
//       }
//     } catch (error) {
//       console.error("Error initiating E-stamp:", error);
//       alert("Failed to initiate E-stamp");
//     }
//   };

//   // ... existing timer effect and functions ...
//   useEffect(() => {
//     let interval;
//     if (timer > 0 && !isProcessing) {
//       interval = setInterval(() => setTimer(prev => prev - 1), 1000);
//     }
//     if (timer === 0 && showOtpBtn && !isProcessing) {
//       setIsOtpExpired(true);
//     }
//     return () => clearInterval(interval);
//   }, [timer, showOtpBtn, isProcessing]);

//   const formatTime = sec => {
//     const m = String(Math.floor(sec / 60)).padStart(2, "0");
//     const s = String(sec % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   useEffect(() => {
//     if (officerData?.employee_detail?.cug_mobile) {
//       setMobileNo(officerData.employee_detail.cug_mobile);
//     }
//   }, [officerData]);

//   const handleSendOtp = async () => {
//     if (isSendOtpLoading) return;
//     if (!mobileNo || mobileNo.length !== 10) {
//       setError("otpStatus", {
//         type: "manual",
//         message: "Mobile number not available. Please reload dashboard.",
//       });
//       return;
//     }
//     setIsSendOtpLoading(true);
//     clearErrors();
//     try {
//       const res = await sendOtpNew(mobileNo);
//       if (res.success) {
//         setShowOtpBtn(true);
//         setIsDisabled(true);
//         setTimer(120);
//         setIsOtpExpired(false);
//         setError("otpSuccess", { type: "manual", message: res.message });
//       } else {
//         setError("otpStatus", { type: "manual", message: res.message });
//       }
//     } finally {
//       setIsSendOtpLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (isOtpExpired) {
//       setError("otp", {
//         type: "manual",
//         message: "OTP expired. Please resend OTP.",
//       });
//       return;
//     }
//     const otpValue = getValues("otp");
//     setBtnIsDisabled(true);
//     const res = await verifyOtpNew(mobileNo, otpValue);
//     if (res.success) {
//       setIsProcessing(true);
//       setTimer(0);
//       setShowOtpBtn(false);
//       await handleFinalSubmit();
//     } else {
//       setError("otp", { type: "manual", message: res.error });
//       setBtnIsDisabled(false);
//     }
//   };

//   const handleReSendOtp = async () => {
//     clearErrors();
//     const res = await sendOtpNew(mobileNo);
//     if (res.success) {
//       setTimer(120);
//       setIsOtpExpired(false);
//       setError("otpSuccess", {
//         type: "manual",
//         message: `OTP resent to ****${mobileNo.slice(-4)}`,
//       });
//     } else {
//       setError("otp", { type: "manual", message: res.message });
//     }
//   };

//   const handleFinalSubmit = async () => {
//     try {
//       const formValue = getValues();
//       const formData = new FormData();
//       formData.append('previous_agreements', JSON.stringify(sortedAgreements));
//       formData.append('main_agreement', JSON.stringify(mainAgreementDetails));
//       formData.append('estamp_party_details', JSON.stringify(showPartyDetails ? partyDetails : null));
//       Object.entries(formValue).forEach(([key, value]) => {
//         if (value instanceof FileList && value.length > 0) {
//           formData.append(key, value[0]);
//         } else if (value !== undefined && value !== null && value !== "") {
//           formData.append(key, value);
//         }
//       });
//       const { data } = await axios.post(
//         `${HT_LOAD_CHANGE_BASE}/agreement-details/`,
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Agreement And Work Order submitted successfully ✅");
//       navigate(`/dashboard/respones/${data.data.application}`, {
//         state: data.data,
//       });
//       const updatedFlags = await handleOfficerFlagCount();
//       dispatch(setOfficerData(updatedFlags));
//     } catch (error) {
//       if (handleTokenExpiry(error, navigate)) return;
//       console.error(error);
//       alert("Something went wrong ❌");
//     } finally {
//       setBtnIsDisabled(false);
//     }
//   };

//   // ... existing contractor fetch functions ...
//   useEffect(() => {
//     const fetchContractorCategory = async () => {
//       try {
//         const res = await axios.get(
//           "https://qcportal.mpcz.in/tkc/get_tkc_category"
//         );
//         if (res.data.status) {
//           setContractorCategory(res.data.data);
//         }
//       } catch (err) {
//         console.error("Category API Error", err);
//       }
//     };
//     fetchContractorCategory();
//   }, []);

//   const handleCategoryChange = async (e) => {
//     const category = e.target.value;
//     const selected = contractorCategory.find(
//       (cat) => cat.Category === category
//     );
//     const oyt = selected?.Original_Oyt;
//     try {
//       const res = await axios.get(
//         `https://qcportal.mpcz.in/tkc/get_tkc_by_oyt/${oyt}`
//       );
//       if (res.data.status) {
//         setContractorList(res.data.contractor_details);
//       }
//     } catch (err) {
//       console.error("Contractor list error", err);
//     }
//   };

//   const handleContractorChange = async (e) => {
//     const contractorName = e.target.value;
//     const contractor = contractorList.find(
//       (c) => c.user_id_id.Authorised_person_E === contractorName
//     );
//     if (contractor) {
//       setSelectedContractor(contractor);
//       setValue("contractor_mobile", contractor.user_id_id.ContactNo);
//       setValue("contractor_company", contractor.CompanyName_E);
//       setValue("authentication_id", contractor.user_id_id.Authentication_id);
//       const regRes = await axios.get(
//         `https://qcportal.mpcz.in/tkc/get_reg_date/${contractor.user_id_id.User_Id}`
//       );
//       if (regRes.data.status) {
//         setValue("registration_date", regRes.data.data.reg_date);
//       }
//     }
//   };

//   const getVoltageValue = (voltage) => {
//     if (!voltage) return 0;
//     return parseInt(voltage.replace(" KV", ""));
//   };

//   const newVoltage = getVoltageValue(items?.new_supply_voltage);
//   const filteredCategory = contractorCategory.filter((cat) => {
//     const voltage = getVoltageValue(items?.new_supply_voltage);
//     if (voltage === 33) {
//       return ["A4", "A5"].includes(cat.Category);
//     }
//     if (voltage === 11) {
//       return true;
//     }
//     return true;
//   });

//   return (
//     <div className="p-6">
//       <form onSubmit={handleSubmit(handleInitEStamp)}>
//         <div className="card mt-2 mb-2 bg-white rounded shadow-md">
//           <div className="card-header px-4 py-2 border-b border-gray-300">
//             <h2 className="text-lg font-bold capitalize">
//               HT Load Change Agreement Finalization
//             </h2>
//           </div>
//           <div className="card-body px-4 pb-4">
//             <div className="mt-6 overflow-x-auto">
//               <ApplicantBasicDetails
//                 htConsumers={items}
//                 register={register}
//                 errors={errors}
//               />
//             </div>
//           </div>
//         </div>

//         {officerData?.employee_detail.role == 3 && (
//           <>
//             <input
//               type="hidden"
//               value={items?.id}
//               {...register("application")}
//             />

//             {/* Previous Supplementary Agreements Section */}
//             <div className="card mt-2 mb-2 bg-white rounded shadow-md">
//               <div className="card-header px-4 py-2 border-b border-gray-300">
//                 <h2 className="text-lg font-bold capitalize">
//                   Previous Supplementary Agreements
//                 </h2>
//               </div>
//               <div className="card-body px-4 pb-4">
//                 <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-8">
//                   <SelectTag
//                     LName="Any Previous Supplementary Agreement?"
//                     options={[
//                       { label: "No", value: "No" },
//                       { label: "Yes", value: "Yes" }
//                     ]}
//                     {...register("has_previous_agreements")}
//                     errorMsg={errors.has_previous_agreements?.message}
//                     labelKey="label"
//                     valueKey="value"
//                   />
//                 </div>

//                 {has_previous_agreements === "Yes" && (
//                   <div className="mt-6">

//                     {/* Main Agreement Override Section */}
//                     <div className="mb-6 p-4 border rounded-lg bg-blue-50 shadow-sm ">
//                       <h3 className="font-semibold text-md mb-3">
//                         Main Agreement Details (Override)
//                       </h3>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <InputTag
//                           LName="Main Agreement Date"
//                           type="date"
//                           value={mainAgreementDetails.main_agreement_date}
//                           onChange={(e) =>
//                             setMainAgreementDetails({
//                               ...mainAgreementDetails,
//                               main_agreement_date: e.target.value,
//                             })
//                           }
//                         />

//                         <InputTag
//                           LName="Main Agreement WEF Date"
//                           type="date"
//                           value={mainAgreementDetails.main_wef_date}
//                           onChange={(e) =>
//                             setMainAgreementDetails({
//                               ...mainAgreementDetails,
//                               main_wef_date: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>

//                     {/* Flex container for responsive grid - 2-3 blocks per row */}
//                     <div className="flex flex-wrap gap-6">
//                       {previousAgreements.map((agreement, index) => (
//                         <div
//                           key={agreement.id}
//                           className="relative border rounded-lg bg-gray-50 shadow-sm"
//                           style={{ width: '400px', flexShrink: 0 }}
//                         >
//                           {/* Header with title and close button */}
//                           <div className="flex justify-between items-center p-3 border-b bg-gray-100 rounded-t-lg">
//                             <h3 className="font-semibold text-sm">Agreement {index + 1}</h3>
//                             {previousAgreements.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => removePreviousAgreement(agreement.id)}
//                                 className="text-red-500 hover:text-red-700 transition-colors"
//                                 aria-label="Remove agreement"
//                               >
//                                 <svg
//                                   className="w-5 h-5"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M6 18L18 6M6 6l12 12"
//                                   />
//                                 </svg>
//                               </button>
//                             )}
//                           </div>

//                           {/* Content area */}
//                           <div className="p-4 space-y-4">
//                             <div>
//                               <SelectTag
//                                 LName="Agreement Type"
//                                 options={[
//                                   { label: "Load Enhancement", value: "LOAD_ENHANCEMENT" },
//                                   { label: "Load Reduction", value: "LOAD_REDUCTION" },
//                                   { label: "Name Change", value: "NAME_CHANGE" },
//                                   // { label: "Voltage Change", value: "VOLTAGE_CHANGE" }
//                                 ]}
//                                 value={agreement.agreement_type}
//                                 onChange={(e) => updatePreviousAgreement(agreement.id, 'agreement_type', e.target.value)}
//                                 labelKey="label"
//                                 valueKey="value"
//                               />
//                             </div>

//                             <div>
//                               <InputTag
//                                 LName="Agreement Executed Date"
//                                 type="date"
//                                 value={agreement.agreement_executed_date}
//                                 onChange={(e) => updatePreviousAgreement(agreement.id, 'agreement_executed_date', e.target.value)}
//                               />
//                             </div>

//                             {agreement.agreement_type === 'NAME_CHANGE' && (
//                               <>
//                                 <div>
//                                   <InputTag
//                                     LName="Previous Name"
//                                     value={agreement.previous_name}
//                                     onChange={(e) => updatePreviousAgreement(agreement.id, 'previous_name', e.target.value)}
//                                   />
//                                 </div>
//                                 <div>
//                                   <InputTag
//                                     LName="New Name"
//                                     value={agreement.new_name}
//                                     onChange={(e) => updatePreviousAgreement(agreement.id, 'new_name', e.target.value)}
//                                   />
//                                 </div>
//                               </>
//                             )}

//                             {(agreement.agreement_type === 'LOAD_ENHANCEMENT' || agreement.agreement_type === 'LOAD_REDUCTION') && (
//                               <>
//                                 <div>
//                                   <InputTag
//                                     LName="Previous Contract Demand (KVA)"
//                                     type="number"
//                                     value={agreement.previous_contract_demand}
//                                     onChange={(e) => updatePreviousAgreement(agreement.id, 'previous_contract_demand', e.target.value)}
//                                   />
//                                 </div>
//                                 <div>
//                                   <InputTag
//                                     LName="New Contract Demand (KVA)"
//                                     type="number"
//                                     value={agreement.new_contract_demand}
//                                     onChange={(e) => updatePreviousAgreement(agreement.id, 'new_contract_demand', e.target.value)}
//                                   />
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                   <input
//                                     type="checkbox"
//                                     id={`voltage_changed_${agreement.id}`}
//                                     checked={agreement.supply_voltage_changed}
//                                     onChange={(e) => updatePreviousAgreement(agreement.id, 'supply_voltage_changed', e.target.checked)}
//                                     className="w-4 h-4"
//                                   />
//                                   <label htmlFor={`voltage_changed_${agreement.id}`} className="text-sm">
//                                     Supply Voltage Changed
//                                   </label>
//                                 </div>
//                                 {agreement.supply_voltage_changed && (
//                                   <div className="space-y-3 mt-2">
//                                     <div>
//                                       <InputTag
//                                         LName="Previous Voltage (KV)"
//                                         value={agreement.previous_voltage}
//                                         onChange={(e) =>
//                                           updatePreviousAgreement(
//                                             agreement.id,
//                                             "previous_voltage",
//                                             e.target.value
//                                           )
//                                         }
//                                       />
//                                     </div>
//                                     <div>
//                                       <InputTag
//                                         LName="New Voltage (KV)"
//                                         value={agreement.new_voltage}
//                                         onChange={(e) =>
//                                           updatePreviousAgreement(
//                                             agreement.id,
//                                             "new_voltage",
//                                             e.target.value
//                                           )
//                                         }
//                                       />
//                                     </div>
//                                   </div>
//                                 )}
//                               </>
//                             )}

//                             {agreement.agreement_type === "VOLTAGE_CHANGE" && (
//                               <>
//                                 <div>
//                                   <InputTag
//                                     LName="Previous Voltage (KV)"
//                                     value={agreement.previous_voltage}
//                                     onChange={(e) =>
//                                       updatePreviousAgreement(
//                                         agreement.id,
//                                         "previous_voltage",
//                                         e.target.value
//                                       )
//                                     }
//                                   />
//                                 </div>
//                                 <div>
//                                   <InputTag
//                                     LName="New Voltage (KV)"
//                                     value={agreement.new_voltage}
//                                     onChange={(e) =>
//                                       updatePreviousAgreement(
//                                         agreement.id,
//                                         "new_voltage",
//                                         e.target.value
//                                       )
//                                     }
//                                   />
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <button
//                       type="button"
//                       onClick={addPreviousAgreement}
//                       className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
//                     >
//                       + Add Another Agreement
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Agreement Preview Button */}
//             <div className="card mt-2 mb-2 bg-white rounded shadow-md">
//               <div className="card-body px-4 py-4">
//                 <div className="flex justify-center items-center space-x-4">
//                   <button
//                     type="button"
//                     onClick={handlePreviewAgreement}
//                     disabled={isGeneratingPreview}
//                     className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
//                   >
//                     {isGeneratingPreview ? 'Generating...' : 'Preview Agreement'}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* E-stamp Party Details Section - After Supplementary Agreements */}
//             <div className="card mt-2 mb-2 bg-white rounded shadow-md">
//               <div className="card-header px-4 py-2 border-b border-gray-300">
//                 <h2 className="text-lg font-bold capitalize">
//                   E-Stamp Party Details
//                 </h2>
//               </div>
//               <div className="card-body px-4 pb-4">
//                 <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-8">
//                   <div className="sm:col-span-8">
//                     <label className="flex items-center space-x-3">
//                       <input
//                         type="checkbox"
//                         checked={showPartyDetails}
//                         onChange={(e) => setShowPartyDetails(e.target.checked)}
//                         className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                       />
//                       <span className="text-gray-700 font-medium">
//                         All supplementary agreements listed above (Yes)
//                       </span>
//                     </label>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Check this box if you want to include party details for all supplementary agreements listed above
//                     </p>
//                   </div>
//                 </div>

//                 {/* Party Details Fields - Only show when checkbox is checked */}
//                 {showPartyDetails && (
//                   <div className="mt-6 space-y-6">
//                     {/* Discom Officer Details */}
//                     <div className="border rounded-lg p-4 bg-gray-50">
//                       <h3 className="font-semibold text-md mb-4 text-blue-700">Discom Officer Details (As per Aadhaar)</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Discom Officer Name <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             value={partyDetails.discom_officer_name}
//                             onChange={(e) => handlePartyDetailsChange('discom_officer_name', e.target.value)}
//                             placeholder="Enter Name As per Aadhaar"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             style={{ textTransform: 'uppercase' }}
//                             required={showPartyDetails}
//                           />
//                           {partyDetails.discom_officer_name && !/^[A-Z\s]+$/.test(partyDetails.discom_officer_name) && (
//                             <p className="text-xs text-red-500 mt-1">Only uppercase letters and spaces allowed</p>
//                           )}
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Discom Officer Mobile <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             value={partyDetails.discom_officer_mobile}
//                             onChange={(e) => {
//                               const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                               handlePartyDetailsChange('discom_officer_mobile', value);
//                             }}
//                             placeholder="Enter Officer Mobile"
//                             maxLength="10"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required={showPartyDetails}
//                           />
//                           {partyDetails.discom_officer_mobile && !validateMobile(partyDetails.discom_officer_mobile) && (
//                             <p className="text-xs text-red-500 mt-1">Please enter a valid 10-digit mobile number</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Organization's Authorized Person Details */}
//                     <div className="border rounded-lg p-4 bg-gray-50">
//                       <h3 className="font-semibold text-md mb-4 text-green-700">Organization's Authorized Person Details (As per Aadhaar)</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Authorized Person Name <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             value={partyDetails.authorized_person_name}
//                             onChange={(e) => handlePartyDetailsChange('authorized_person_name', e.target.value)}
//                             placeholder="Enter Name As per Aadhaar"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             style={{ textTransform: 'uppercase' }}
//                             required={showPartyDetails}
//                           />
//                           {partyDetails.authorized_person_name && !/^[A-Z\s]+$/.test(partyDetails.authorized_person_name) && (
//                             <p className="text-xs text-red-500 mt-1">Only uppercase letters and spaces allowed</p>
//                           )}
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Authorized Person Mobile <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             value={partyDetails.authorized_person_mobile}
//                             onChange={(e) => {
//                               const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                               handlePartyDetailsChange('authorized_person_mobile', value);
//                             }}
//                             placeholder="Enter Mobile As per Aadhaar"
//                             maxLength="10"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required={showPartyDetails}
//                           />
//                           {partyDetails.authorized_person_mobile && !validateMobile(partyDetails.authorized_person_mobile) && (
//                             <p className="text-xs text-red-500 mt-1">Please enter a valid 10-digit mobile number</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Acceptance Section */}
//             <div className="card mt-2 mb-2 bg-white rounded shadow-md">
//               <div className="card-body px-4 pb-4">
//                 <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
//                   <SelectTag
//                     LName="Acceptance"
//                     options={
//                       isAgreementFinalizationStep
//                         ? responseOption.filter(opt => opt.value !== "Reverted")
//                         : responseOption
//                     }
//                     {...register("agreement_response", {
//                       required: "Please Select Acceptance",
//                     })}
//                     errorMsg={errors.agreement_response?.message}
//                     labelKey="label"
//                     valueKey="value"
//                     disabled={isDisabled}
//                   />

//                   {/* Accepted Case */}
//                   {agreement_response === "Accepted" && (
//                     <>
//                       <InputTag
//                         LName="Agreement No."
//                         placeholder="Enter Agreement No."
//                         {...register("agreement_no", {
//                           required: "Agreement No is required",
//                         })}
//                         errorMsg={errors.agreement_no?.message}
//                         disabled={isDisabled}
//                       />

//                       <InputTag
//                         LName="Agreement Date"
//                         type="date"
//                         {...register("agreement_effective_date", {
//                           required: "Effective Date is required",
//                         })}
//                         min={transactionDate}
//                         max={todayDate}
//                         errorMsg={errors.agreement_effective_date?.message}
//                         disabled={isDisabled}
//                       />

//                       <InputTag
//                         LName="Final Agreement pdf"
//                         type="file"
//                         acceptPdfOnly={true}
//                         {...register("agreement_doc", {
//                           required: "Agreement Letter is required",
//                         })}
//                         errorMsg={errors.agreement_doc?.message}
//                         disabled={isDisabled}
//                       />

//                       {required.includes('is_me_meter_required') && (
//                         <>
//                           <InputTag
//                             LName="ME Meter Work Order No."
//                             placeholder="Enter ME Meter Work Order No."
//                             {...register("me_meter_work_order_no", {
//                               required: "ME Meter Work Order No is required",
//                             })}
//                             errorMsg={errors.me_meter_work_order_no?.message}
//                             disabled={isDisabled}
//                           />
//                           <InputTag
//                             LName="ME Meter Work Order Date"
//                             type="date"
//                             {...register("me_meter_work_order_date", {
//                               required: "ME Meter Work Order Date is required",
//                             })}
//                             min={transactionDate}
//                             max={todayDate}
//                             errorMsg={errors.me_meter_work_order_date?.message}
//                             disabled={isDisabled}
//                           />
//                           <InputTag
//                             LName="ME Meter Work Order Letter"
//                             type="file"
//                             acceptPdfOnly={true}
//                             {...register("me_meter_work_order_docs", {
//                               required: "ME Meter Work Order Letter is required",
//                             })}
//                             errorMsg={errors.me_meter_work_order_docs?.message}
//                             disabled={isDisabled}
//                           />
//                         </>
//                       )}

//                       {items?.survey?.scheme_name === "SCCW" &&
//                         required?.includes("is_extension_work_required") &&
//                         items?.lc_type === "Load_Enhancement_with_Voltage_Change" &&
//                         newVoltage < 132 && (
//                           <>
//                             <h3 className="col-span-8 font-bold text-lg border-b pb-2">
//                               Work Execution
//                             </h3>
//                             <h4 className="col-span-8 font-bold text-lg text-red-500">
//                               Select contractor details as requested by the H.T. Consumer.
//                             </h4>
//                             <SelectTag
//                               LName="Contractor Category"
//                               options={filteredCategory}
//                               {...register("contractor_category", {
//                                 required: "Contractor Category is required",
//                               })}
//                               errorMsg={errors.contractor_category?.message}
//                               labelKey="Category"
//                               valueKey="Category"
//                               onChange={handleCategoryChange}
//                             />
//                             <SelectTag
//                               LName="Contractor Name"
//                               options={contractorList.map((con) => ({
//                                 label: con.user_id_id.Authorised_person_E,
//                                 value: con.user_id_id.Authorised_person_E
//                               }))}
//                               {...register("contractor_name", {
//                                 required: "Contractor Name is required",
//                               })}
//                               errorMsg={errors.contractor_name?.message}
//                               labelKey="label"
//                               valueKey="value"
//                               onChange={handleContractorChange}
//                             />
//                             <InputTag
//                               LName="Contractor Company Name"
//                               {...register("contractor_company")}
//                               disabled
//                             />
//                             <InputTag
//                               LName="Contractor Mobile No"
//                               {...register("contractor_mobile")}
//                               disabled
//                             />
//                             <InputTag
//                               LName="Authentication Id"
//                               {...register("authentication_id")}
//                               disabled
//                             />
//                             <InputTag
//                               LName="Registration Date"
//                               type="date"
//                               {...register("registration_date")}
//                               disabled
//                             />
//                           </>
//                         )}

//                       {required?.includes('is_extension_work_required') && (
//                         <>
//                           <InputTag
//                             LName="Extension Work Order No."
//                             placeholder="Enter Extension Work Order No."
//                             {...register("ex_work_order_no", {
//                               required: " Extension Work Order No is required",
//                             })}
//                             errorMsg={errors.ex_work_order_no?.message}
//                             disabled={isDisabled}
//                           />
//                           <InputTag
//                             LName=" Extension Work Order Date"
//                             type="date"
//                             {...register("ex_work_order_date", {
//                               required: " Extension Work Order Date is required",
//                             })}
//                             errorMsg={errors.ex_work_order_date?.message}
//                             disabled={isDisabled}
//                           />
//                           <InputTag
//                             LName="Extension Work Order Letter"
//                             type="file"
//                             acceptPdfOnly={true}
//                             {...register("ex_work_order_docs", {
//                               required: " Extension Work Order Letter is required",
//                             })}
//                             errorMsg={errors.ex_work_order_docs?.message}
//                             disabled={isDisabled}
//                           />
//                         </>
//                       )}

//                       {(items?.load_sanction?.is_required === "is_agreement_required" ||
//                         items?.survey?.is_required === "is_agreement_required") &&
//                         items?.type_of_change === "Load_Enhancement" && (
//                           <InputTag
//                             LName="Upload Commissioning Permission letter"
//                             type="file"
//                             acceptPdfOnly={true}
//                             {...register("commissioning_permission_doc", {
//                               required: "Commissioning Permission letter is required",
//                             })}
//                             errorMsg={errors.commissioning_permission_docs?.message}
//                             disabled={isDisabled}
//                           />
//                         )}
//                     </>
//                   )}

//                   {/* Reverted Case */}
//                   {agreement_response === "Reverted" && (
//                     <>
//                       <SelectTag
//                         LName="Revert Reason"
//                         options={revertOption}
//                         {...register("revert_reason", {
//                           required: "Revert Reason is required",
//                         })}
//                         errorMsg={errors.revert_reason?.message}
//                         labelKey="label"
//                         valueKey="value"
//                         disabled={isDisabled}
//                       />
//                       <InputTag
//                         LName="Revert Reason Remark"
//                         placeholder="Enter Remark"
//                         {...register("revert_reason_remark", {
//                           required: "Remark is required",
//                         })}
//                         errorMsg={errors.revert_reason_remark?.message}
//                         disabled={isDisabled}
//                       />
//                       <InputTag
//                         LName="Upload Revert Docs"
//                         type="file"
//                         acceptPdfOnly={true}
//                         {...register("upload_revert_docs", {
//                           required: "Revert Docs are required",
//                         })}
//                         errorMsg={errors.upload_revert_docs?.message}
//                         disabled={isDisabled}
//                       />
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* OTP and Submit Section */}
//               <div className="border-b border-gray-900/10 pb-12 shadow-md p-4">
//                 <div className="mt-10 flex flex-col justify-center items-center">
//                   <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
//                     {!showOtpBtn ? (
//                       <>
//                         <button type="reset" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//                           Reset
//                         </button>

//                         <button
//                           type="submit"
//                           disabled={isSendOtpLoading}
//                           className={`px-4 py-2 rounded text-white ${isSendOtpLoading || isBtnDisabled
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-green-500 hover:bg-purple-800"
//                             }`}
//                         >
//                           {isSendOtpLoading
//                             ? "Please wait..."
//                             : agreement_response === "Reverted"
//                               ? "Revert For Demand note"
//                               : agreement_response === "Accepted" &&
//                                 required?.includes("is_extension_work_required")
//                                 ? "Send for Upload & Charging Permission"
//                                 : agreement_response === "Accepted" &&
//                                   required?.includes("is_me_meter_required") &&
//                                   !required?.includes("is_extension_work_required")
//                                   ? "Send for Issue Meter"
//                                   : agreement_response === "Accepted" &&
//                                     (items?.load_sanction?.is_required === "is_agreement_required" ||
//                                       items?.survey?.is_required === "is_agreement_required") &&
//                                     items?.type_of_change === "Load_Enhancement"
//                                     ? "Send for BiCall"
//                                     : agreement_response === "Accepted" &&
//                                       (items?.load_sanction?.is_required === "is_agreement_required" ||
//                                         items?.survey?.is_required === "is_agreement_required") &&
//                                       items?.type_of_change === "Load_Reduction"
//                                       ? "Send for Completion certifying"
//                                       : "Send for Completion Certifying"}
//                         </button>
//                       </>
//                     ) : showOtpBtn && !isProcessing ? (
//                       <>
//                         <InputTag
//                           placeholder="Enter OTP"
//                           {...register("otp", { required: "Otp is required" })}
//                           errorMsg={errors.otp?.message}
//                         />
//                         <p className="text-red-600 font-semibold text-sm mt-1">
//                           {timer > 0
//                             ? `OTP expires in ${formatTime(timer)}`
//                             : "OTP expired. Please resend OTP."}
//                         </p>
//                         <button
//                           type="button"
//                           onClick={handleVerifyOtp}
//                           disabled={isBtnDisabled || isOtpExpired}
//                           className={`px-4 py-2 rounded text-white ${isBtnDisabled || isOtpExpired
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-green-600 hover:bg-purple-800"
//                             }`}
//                         >
//                           {isBtnDisabled ? "Verifying..." : "Verify OTP"}
//                         </button>
//                         <button
//                           type="button"
//                           onClick={handleReSendOtp}
//                           className="px-4 py-2 bg-emerald-600 text-white rounded"
//                         >
//                           Resend OTP
//                         </button>
//                       </>
//                     ) : (
//                       <p className="text-blue-700 font-semibold mt-2 animate-pulse">
//                         Processing... Please wait
//                       </p>
//                     )}
//                   </div>

//                   {errors?.otpSuccess && (
//                     <p className="text-green-500 text-sm">{errors.otpSuccess.message}</p>
//                   )}
//                   {errors?.otpStatus && (
//                     <p className="text-red-500 text-sm">{errors.otpStatus.message}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//             {showPreviewModal && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                 <div className="bg-white w-[80%] h-[90%] rounded-xl shadow-xl flex flex-col">
//                   <div className="flex justify-between items-center p-4 border-b">
//                     <h2 className="font-bold text-lg">Agreement Preview</h2>
//                     <button
//                       onClick={() => setShowPreviewModal(false)}
//                       className="text-red-500 hover:text-red-700 transition-colors"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                   <div className="flex-1 overflow-auto p-4 bg-gray-50">
//                     <iframe
//                       title="Agreement Preview"
//                       srcDoc={previewHtml}
//                       className="w-full h-full border rounded"
//                     />
//                   </div>
//                   <div className="p-3 border-t flex justify-end">
//                     <button
//                       onClick={() => setShowPreviewModal(false)}
//                       className="px-4 py-2 bg-gray-500 text-white rounded"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </form>
//     </div>
//   );
// };

// export default LoadAgreement;