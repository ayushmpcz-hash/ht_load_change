import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setOfficerData } from "../redux/slices/userSlice";
import { HT_LOAD_CHANGE_BASE } from "../api/api";

// console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE  in dummy component')
const Dummy = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const dispatch = useDispatch();
  console.log(empId,'employeee idddddddd')

useEffect(() => {
  if (!empId) {
    navigate("/department-login");
    return;
  }

if (localStorage.getItem("officer_data")) {
  localStorage.removeItem("officer_data");
}


  fetch(`${HT_LOAD_CHANGE_BASE}/officer-flags/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ employee_id: empId })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Dummy Response:", data);

      if (data.status !== "success") {
        navigate("/department-login");
        return;
      }

      // Save only tokens in cookies
      Cookies.set("accessToken", data.tokens.access, { path: "/" });
      Cookies.set("refresh_token", data.tokens.refresh, { path: "/" });

      // Save large data in localStorage
      localStorage.setItem("officer_data", JSON.stringify(data));

      // update redux
      dispatch(setOfficerData(data));
      // console.log(setOfficerData,'officerData')

      // Redirect
      navigate("/dashboard");
    })
    .catch(err => {
      console.error("Dummy Error:", err);
      navigate("/department-login")
    });
}, [empId, navigate, dispatch]);


  return <div>Processing...</div>;
};

export default Dummy;
