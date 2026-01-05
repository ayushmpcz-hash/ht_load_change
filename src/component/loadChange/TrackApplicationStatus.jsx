import { useForm } from 'react-hook-form';
import { sendOtp, verifyOtp } from '../importComponents';
import React, { useId, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setOfficerData, setLoginUser, setLoading, setError as setReduxError } from '../../redux/slices/userSlice.js';
import axios from 'axios';
import {HT_LOAD_CHANGE_BASE} from "../../api/api.js"

const TrackApplicationStatus = React.forwardRef(function TrackApplicationStatus({}, ref) {
  const idApp = useId();
  const idOtp = useId();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  // 🟢 Step 1: Track application and send OTP
  const onSubmitHandle = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${HT_LOAD_CHANGE_BASE}/get-load-change-applications/?application_no=${data.application_no}`
      );

      const { data: { data: { mobile } } } = response;
      setMobileNo(mobile);

      const sentOtp = await sendOtp(mobile);

      if (sentOtp) {
        setShowOtpInput(true);
        // console.log(response.data.data,"response.data.data")
        dispatch(setLoginUser(response.data));
        // setError("otpSuccess", {
        //   type: "manual",
        //   message: `OTP sent successfully to ****${mobile.slice(-4)}`,
        // });
      } else {
        setError("otp", {
          type: "manual",
          message: `Failed to send OTP on ****${mobile.slice(-4)}`,
        });
      }
    } catch (error) {
      console.error(error);
      setError("application_no", {
        type: "manual",
        message: "Something went wrong, please try again!",
      });
      dispatch(setReduxError(error.message));
    } 
  };

  // 🟢 Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault(); // prevent reload

    try {
      // dispatch(setLoading(true));
      const otpValue = getValues("otp");

      if (!otpValue) {
        setError("otp", {
          type: "manual",
          message: "Please enter OTP",
        });
        return;
      }

      const verifyOtpResponse = await verifyOtp(mobileNo, otpValue);

      if (verifyOtpResponse) {
        navigate(`/user-dashboard`);
      } else {
        setError("otp", {
          type: "manual",
          message: "Invalid OTP ❌",
        });
      }
    } catch (error) {
      console.error(error);
      setError("otp", {
        type: "manual",
        message: "Something went wrong, please try again!",
      });
      // dispatch(setReduxError(error.message));
    } 
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandle)}>
      <div className="space-y-12 container mx-auto border my-5 w-100 rounded-md border-gray shadow-md">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="block mb-2 border-b-2 p-2 ">
            <h2 className="text-base font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
              HT NSC Load Change Application
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Track HT NSC Load Change Application Status
            </p>
          </div>

          <div className="body p-4">
            {/* Application Number Section */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold text-gray-900 bg-gray-300 p-3 rounded-md border-gray shadow-md">
                Application No
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-y-8">
                <div>
                  <label htmlFor={idApp} className="block text-sm font-medium text-gray-900">
                    Application No.
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-indigo-600">
                      <input
                        ref={ref}
                        {...register('application_no', { required: 'Please enter Application No' })}
                        id={idApp}
                        type="text"
                        placeholder="Enter Application No"
                        className="block w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                      />
                    </div>
                    {errors.application_no && (
                      <p className="text-red-500 text-sm mt-1">{errors.application_no.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit or OTP Section */}
            <div className="mt-10 flex flex-col justify-center items-center">
              <div className="flex space-x-2 flex-wrap justify-center">
                {!showOtpInput ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`rounded-lg px-4 py-2 duration-300 ${
                      isSubmitting
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-blue-100 hover:bg-red-600"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Track Status"}
                  </button>
                ) : (
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-indigo-600">
                      <input
                        {...register('otp', { required: 'Please enter OTP' })}
                        id={idOtp}
                        type="text"
                        placeholder="Enter OTP"
                        className="block w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                      />
                      <button
                        onClick={handleVerifyOtp}
                        className="bg-black text-white text-sm px-4 py-2 rounded ml-2"
                      >
                        Verify OTP
                      </button>
                    </div>
                    {errors.otpSuccess && (
                      <p className="text-green-500 text-sm mt-1">{errors.otpSuccess.message}</p>
                    )}
                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
});

export default TrackApplicationStatus;
