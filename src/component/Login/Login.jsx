
// import './login.css';
// import * as yup from "yup";
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { submitFormData, submitFormDataUsingQuery } from '../../utils/handlePostApi.js';
// import { useDispatch } from 'react-redux';
// import { setOfficerData, setLoginUser, setLoading,logout, setError as setReduxError } from '../../redux/slices/userSlice.js';
// import Cookies from 'js-cookie';
// import {HT_LOAD_CHANGE_BASE} from '../../api/api.js'

// const Login = ({ login_by, label }) => {
//   const [errors, setErrors] = useState({});
//   const [isDisabled, setIsDisabled] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   // ✅ Validation schema
//   const schema = yup.object().shape({
//     employee_id: yup.string().required("Login ID is required"),
//     password: yup.string().required("Password is required"),
//   });

//   // ✅ Convert FormData to object
//   const extractFormValues = (formData) =>
//     Object.fromEntries(formData.entries());

//   // ✅ Form Submit
//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const tempObj = extractFormValues(formData);

//     try {
//       // Validate inputs
//       await schema.validate(tempObj, { abortEarly: false });
//       setErrors({});
//       setIsDisabled(true);
//       dispatch(setLoading(true));
//       dispatch(logout());

//       if (location.pathname === "/department-login") {
//         // Department login
//         const response = await submitFormData(formData, `${HT_LOAD_CHANGE_BASE}/officer-flags/`);
//         const result = await response.json();
// console.log(response.headers.get("authorization"))
//         const token = response.headers.get("Authorization");
//         if (token) {
//           const cleanToken = token.replace(/^Bearer\s+/i, "");
//           Cookies.set("accessToken", cleanToken, {
//             expires: 1,
//             secure: window.location.protocol === "https:",
//             sameSite: "Strict",
//             path: "/",
//           });

//           dispatch(setOfficerData(result));
//           navigate("/dashboard");
//         } else {
//           throw new Error("Authorization token missing");
//         }
//       } else {
//         // User login
//         const response = await submitFormDataUsingQuery(
//           tempObj,
//           `${HT_LOAD_CHANGE_BASE}/get-load-change-applications/?`
//         );
//         const result = await response.json();
//         console.log(result,"result")
//         dispatch(setLoginUser(result));
//         navigate(`/user-dashboard`);
//       }
//     } catch (err) {
//       handleFormErrors(err);
//       dispatch(setReduxError(err.message));
//     } finally {
//       dispatch(setLoading(false));
//       setIsDisabled(false);
//     }
//   };


//   const handleFormErrors = (err) => {
//     const newErrors = {};

//     if (err.inner && Array.isArray(err.inner)) {
//       err.inner.forEach((error) => {
//         newErrors[error.path] = error.message;
//       });
//     } else if (err.response) {
//       newErrors.general = err.response.data?.message || "Server error. Please try again.";
//     } else if (err.message) {
//       newErrors.general = err.message;
//     } else {
//       newErrors.general = "Something went wrong. Please try again.";
//     }

//     setErrors(newErrors);
//   };

//   return (
//     <form onSubmit={onSubmitHandler}>
//       <div className="flex items-center justify-center min-h-[464px] bg-gray-100 font-raleway">
//         <div className="w-full max-w-lg bg-white shadow-md rounded-sm border-b-[10px] border-cyan-400 p-5">
//           <div className="text-center mb-4">
//             <h4 className="text-xl font-semibold text-left">{login_by} Login</h4>
//           </div>

//           {/* Login ID */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <input
//               type="text"
//               name="employee_id"
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
//             />
//             {errors?.employee_id && (
//               <span className="text-red-500 text-sm">{errors.employee_id}</span>
//             )}
//           </div>

//           {/* Password */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
//             />
//             {errors?.password && (
//               <span className="text-red-500 text-sm">{errors.password}</span>
//             )}
//           </div>

//           {/* Show Password */}
//           <div className="mb-4">
//             <label className="flex items-center text-sm text-gray-600">
//               <input type="checkbox" className="mr-2" />
//               Show Password
//             </label>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-4 mb-4">
//             <button
//               type="submit"
//               disabled={isDisabled}
//               className={`flex-1 py-2 rounded uppercase text-sm font-semibold transition
//                 ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800 text-white"}`}
//             >
//               {isDisabled ? "Please wait..." : "Login"}
//             </button>
//             <button
//               type="button"
//               className="flex-1 bg-yellow-500 text-white py-2 rounded uppercase text-sm font-semibold hover:bg-yellow-600 transition"
//             >
//               Forget Password
//             </button>
//           </div>

//           {/* General error */}
//           {errors?.general && (
//             <div className="text-center text-sm text-red-500 mt-2">{errors.general}</div>
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