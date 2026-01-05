import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate,Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import {ApplicantBasicDetails,} from "../importComponents.js";
import{HT_LOAD_CHANGE_BASE} from '../../api/api.js'
const LoadConnectionServed = () => {
  const officerData = useSelector((state) => state.user.officerData);
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || {};
  // console.log(items,"items")
   console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE in coonection served')
  const token = Cookies.get("accessToken");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isBtnDisabled, setBtnIsDisabled] = useState(false);

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
  const handleFinalSubmit = async (formData) => {
    try {
      const payload = {
      status:"Accepted",
      application: formData.id,
    };
     
      const { data } = await axios.post(
        `${HT_LOAD_CHANGE_BASE}/connection-served/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Load Released successfully ✅");
      navigate(`/dashboard/respones/${data.data.application}`, { state: data });
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
        HT Load Change Agreement Finalization
      </h2>

      <div className="mt-6 overflow-x-auto">
        {/* ✅ Yahan handleSubmit correctly laga hua hai */}
        <form onSubmit={handleSubmit(handleFinalSubmit)}>
          <div className="body p-4">
            <ApplicantBasicDetails
              htConsumers={items}
              register={register}
              errors={errors}
            />
            {officerData?.employee_detail.role == 3 && (
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
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default LoadConnectionServed;
