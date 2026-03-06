// import * as yup from "yup";
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { submitFormData, submitFormDataUsingQuery } from '../../utils/handlePostApi.js';
// import { useDispatch } from 'react-redux';
// import {
//   setOfficerData,
//   setLoginUser,
//   setLoading,
//   logout,
//   setError as setReduxError
// } from '../../redux/slices/userSlice.js';
// import Cookies from 'js-cookie';
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';

// const Login = () => {
//   const [errors, setErrors] = useState({});
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const isDepartment = location.pathname === "/department-login";
   
//   // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE inside officer login')
//   const schema = yup.object().shape({
//     employee_id: yup.string().required("Employee Number is required"),
//     password: yup.string().required("Password is required"),
//   });

//   const extractFormValues = (formData) =>
//     Object.fromEntries(formData.entries());

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const tempObj = extractFormValues(formData);

//     try {
//       await schema.validate(tempObj, { abortEarly: false });
//       setErrors({});
//       setIsDisabled(true);
//       dispatch(setLoading(true));
//       dispatch(logout());

//       if (isDepartment) {
//         const response = await submitFormData(
//           formData,
//           `${HT_LOAD_CHANGE_BASE}/officer-flags/`
//         );

//         const result = await response.json();
//         const token = response.headers.get("Authorization");

//         if (!token) throw new Error("Authorization token missing");

//         Cookies.set("accessToken", token.replace("Bearer ", ""), {
//           expires: 1,
//           secure: true,
//           sameSite: "Strict",
//           path: "/",
//         });

//         dispatch(setOfficerData(result));
//         // 🔥 ADD THESE LINES
//         localStorage.setItem("officer_data", JSON.stringify(result));
//         localStorage.setItem("loginType", "OFFICER");
//         navigate("/dashboard");
//       } else {
//         const response = await submitFormDataUsingQuery(
//           tempObj,
//           `${HT_LOAD_CHANGE_BASE}/get-load-change-applications/?`
//         );
//         const result = await response.json();
//         dispatch(setLoginUser(result));
//         localStorage.setItem("loginUser", JSON.stringify(result));
//         localStorage.setItem("loginType", "APPLICANT");
//         localStorage.removeItem("officer_data"); // safety
//         navigate("/user-dashboard");
//       }
//     } catch (err) {
//       setErrors({ general: err.message });
//       dispatch(setReduxError(err.message));
//     } finally {
//       setIsDisabled(false);
//       dispatch(setLoading(false));
//     }
//   };

//   return (
//     <form onSubmit={onSubmitHandler}>
//       <div className="min-h-[460px] flex items-center justify-center bg-gray-100 font-raleway">
//         <div className="w-full max-w-md bg-white rounded shadow-md border-b-4 border-cyan-400 p-6">

//           {/* 🔷 Heading */}
//           <h2 className="text-lg font-semibold text-gray-800 mb-3">
//             {isDepartment ? "Department Login" : "Applicant Login"}
//           </h2>

//           {/* 🔘 Employee ID */}
//           {/* <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
//             <input
//               type="radio"
//               checked
//               readOnly
//               className="accent-cyan-500"
//             />
//             <span>Employee Id</span>
//           </div> */}

//           {/* Employee Number */}
//           <div className="mb-4">
//             <label className="block text-sm text-gray-700 mb-1">
//               {isDepartment ? " Employee Id" : "Applicant no"}
//             </label>
//             <input
//               type="text"
//               name="employee_id"
//               className="w-full rounded border border-gray-300 px-3 py-2 text-sm
//                          focus:outline-none focus:ring-1 focus:ring-cyan-500"
//             />
//             {errors.employee_id && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.employee_id}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="mb-3">
//             <label className="block text-sm text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               className="w-full rounded border border-gray-300 px-3 py-2 text-sm
//                          focus:outline-none focus:ring-1 focus:ring-cyan-500"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.password}
//               </p>
//             )}
//           </div>

//           {/* Show Password */}
//           <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
//             <input
//               type="checkbox"
//               checked={showPassword}
//               onChange={() => setShowPassword(!showPassword)}
//               className="accent-cyan-500"
//             />
//             <span>Show Password</span>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isDisabled}
//             className={`w-full py-2 rounded text-white font-semibold uppercase transition
//               ${isDisabled
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-cyan-500 hover:bg-cyan-600"
//               }`}
//           >
//             {isDisabled ? "Please wait..." : "Login"}
//           </button>

//           {/* Error */}
//           {errors.general && (
//             <p className="text-center text-red-500 text-sm mt-3">
//               {errors.general}
//             </p>
//           )}
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Login;

import * as yup from "yup";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { submitFormData, submitFormDataUsingQuery } from '../../utils/handlePostApi.js';
import { useDispatch } from 'react-redux';
import {
  setOfficerData,
  setLoginUser,
  setLoading,
  logout,
  setError as setReduxError
} from '../../redux/slices/userSlice.js';
import Cookies from 'js-cookie';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';

const Login = () => {
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isDepartment = location.pathname === "/department-login";
   
  // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE inside officer login')
  const schema = yup.object().shape({
    employee_id: yup.string().required("Employee Number is required"),
    password: yup.string().required("Password is required"),
  });

  const extractFormValues = (formData) =>
    Object.fromEntries(formData.entries());

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tempObj = extractFormValues(formData);

    try {
      await schema.validate(tempObj, { abortEarly: false });
      setErrors({});
      setIsDisabled(true);
      dispatch(setLoading(true));
      dispatch(logout());

      if (isDepartment) {
        const response = await submitFormData(
          formData,
          `${HT_LOAD_CHANGE_BASE}/officer-flags/`
        );

        const result = await response.json();
        const token = response.headers.get("Authorization");

        if (!token) throw new Error("Authorization token missing");

        Cookies.set("accessToken", token.replace("Bearer ", ""), {
          expires: 1,
          secure: true,
          sameSite: "Strict",
          path: "/",
        });

        dispatch(setOfficerData(result));
        // 🔥 ADD THESE LINES
        localStorage.setItem("officer_data", JSON.stringify(result));
        localStorage.setItem("loginType", "OFFICER");
        navigate("/dashboard");
      } else {
        const response = await submitFormDataUsingQuery(
          tempObj,
          `${HT_LOAD_CHANGE_BASE}/get-load-change-applications/?`
        );
        const result = await response.json();
        dispatch(setLoginUser(result));
        localStorage.setItem("loginUser", JSON.stringify(result));
        localStorage.setItem("loginType", "APPLICANT");
        localStorage.removeItem("officer_data"); // safety
        navigate("/user-dashboard");
      }
    } catch (err) {
      setErrors({ general: err.message });
      dispatch(setReduxError(err.message));
    } finally {
      setIsDisabled(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="min-h-[460px] flex items-center justify-center bg-gray-100 font-raleway">
        <div className="w-full max-w-md bg-white rounded shadow-md border-b-4 border-cyan-400 p-6">

          {/* 🔷 Heading */}
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {isDepartment ? "Department Login" : "Applicant Login"}
          </h2>

          {/* 🔘 Employee ID */}
          {/* <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
            <input
              type="radio"
              checked
              readOnly
              className="accent-cyan-500"
            />
            <span>Employee Id</span>
          </div> */}

          {/* Employee Number */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">
              {isDepartment ? " Employee Id" : "Applicant no"}
            </label>
            <input
              type="text"
              name="employee_id"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            {errors.employee_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.employee_id}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Show Password */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="accent-cyan-500"
            />
            <span>Show Password</span>

             {/* Hint Radio */}
            {!isDepartment && (

              <div className="relative group cursor-pointer">

                <label className="flex items-center gap-1">

                  <input type="radio" readOnly />

                  <span className="text-cyan-600 font-medium">
                    Hint
                  </span>

                </label>

                {/* Tooltip */}
                <div
                  className="absolute right-0 mt-2 w-72 bg-gray-800 text-white text-xs
                             rounded p-2 opacity-0 group-hover:opacity-100
                             transition pointer-events-none z-50"
                >
                  Use first 7 digits of Application Number and last 5 digits
                  of Consumer Mobile Number as password.
                </div>

              </div>

            )}
          </div>



          {/* Login Button */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-2 rounded text-white font-semibold uppercase transition
              ${isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
              }`}
          >
            {isDisabled ? "Please wait..." : "Login"}
          </button>

          {/* Error */}
          {errors.general && (
            <p className="text-center text-red-500 text-sm mt-3">
              {errors.general}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;