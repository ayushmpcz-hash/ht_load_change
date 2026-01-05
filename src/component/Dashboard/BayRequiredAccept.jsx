import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { ApplicantBasicDetails } from "../importComponents.js";
import { HT_LOAD_CHANGE_BASE } from "../../api/api.js";

const BayRequiredAccept = () => {
  const officerData = useSelector((state) => state.user.officerData);
  const token = Cookies.get("accessToken");
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || {};

  const [isBtnDisabled, setBtnIsDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });

  // Only proceed if bayRequired is true
  const handleAccept = async () => {
    if (!items?.bayRequired) {
      alert("Bay Required is not applicable for this application.");
      return;
    }

    try {
      setBtnIsDisabled(true);

      const payload = {
        status: "Accepted",
        application: items?.id,
      };

      const { data } = await axios.post(
        `${HT_LOAD_CHANGE_BASE}/bay-required/accept/`, // adjust endpoint
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Application accepted successfully ✅");
      // redirect after success (example)
      navigate(`/dashboard/responses/${data.data.application}`, {
        state: data,
      });

    } catch (error) {
      console.error("API Error:", error);
      alert("Something went wrong ❌");
    } finally {
      setBtnIsDisabled(false);
    }
  };

  return (
    <>
      <h2 className="text-base font-semibold text-gray-900 bg-gray-300 p-3 rounded-md shadow-md">
        Bay Required Approval
      </h2>

      <div className="mt-6 overflow-x-auto">
        {/* Show applicant details */}
        <ApplicantBasicDetails
          htConsumers={items}
          register={register}
          errors={errors}
        />

        {items?.application_status !==28 ? (
          <p className="text-red-500 mt-4 font-semibold">
            * Bay Required is not needed for this application.
          </p>
        ) : (
          <div className="mt-4 flex justify-center items-center">
            <button
              type="button"
              className={`px-6 py-2 rounded text-white ${
                isBtnDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-700"
              }`}
              onClick={handleAccept}
              disabled={isBtnDisabled}
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BayRequiredAccept;
