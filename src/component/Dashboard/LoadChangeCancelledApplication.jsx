import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate,Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import {ApplicantBasicDetails,} from "../importComponents.js";

const LoadChangeCancelledApplication = () => {
  const officerData = useSelector((state) => state.user.officerData);
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || {};
  // console.log(items,"items")
  
  const token = Cookies.get("accessToken");


  // Form
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: items || {},
  });
  // 🔹 Final Submit API Call

  return (
    <>
      <h2 className="text-base font-semibold text-gray-900 bg-gray-300 p-3 rounded-md shadow-md">
        HT Load Change Cancelled Application Details
      </h2>

      <div className="mt-6 overflow-x-auto">
        {/* ✅ Yahan handleSubmit correctly laga hua hai */}
        <form >
          <div className="body p-4">
            <ApplicantBasicDetails
              htConsumers={items}
              register={register}
              errors={errors}
            />
            {/* {officerData?.employee_detail.role == 3 && (
              <>
                <input
                  type="hidden"
                  value={items?.id}
                  {...register("application")}
                />
                 <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 flex flex-col justify-center items-center">
                    <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-baseline">
                        <>
                          <button type="reset" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                            Reset
                          </button>
                          <button
                            type="submit"
                            className={`px-4 py-2 rounded text-white ${
                              isDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-purple-800"
                            }`}
                            disabled={isDisabled}
                          >
                            Load Released
                          </button>
                        </>
                      </div>
                    </div>
                </div>
              </>
            )} */}
          </div>
        </form>
      </div>
    </>
  );
};

export default LoadChangeCancelledApplication;
