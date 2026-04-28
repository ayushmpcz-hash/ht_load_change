// import React, { useRef, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';
// import { HT_NSC_DASHBOARD_URL, HT_LOAD_CHANGE_BASE } from '../../api/api'


// const ApplicationStatus = () => {
//   const [loading, setLoading] = useState(true);
//   const officerData = useSelector(state => state.user.officerData);
//   // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE in Application Status component')
//   // console.log(HT_NSC_DASHBOARD_URL,'HT_NSC_DASHBOARD_URL in ApplicationStatus component')
//   useEffect(() => {
//     // Simulate loading or wait for officerData
//     if (officerData) {
//       setLoading(false);
//     }
//   }, [officerData]);

//   const handleGoToHTNSC = async () => {
//     try {
//       const token = officerData?.tokens?.access;

//       if (!token) {
//         alert("Token not found!");
//         return;
//       }

//       const res = await fetch(`${HT_LOAD_CHANGE_BASE}/officer/token-info/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(res, 'responseeeeee')
//       const data = await res.json();
//       console.log(data, 'dataaa tokennnnnnnnn')
//       if (data.status === "success") {
//         const empId = String(data.employee_login_id);
//         window.location.href = `${HT_NSC_DASHBOARD_URL}/officerLoginhtload/${empId}`;

//       } else {
//         alert("Token validation failed!");
//       }
//     } catch (err) {
//       console.error("API error:", err);
//       alert("Something went wrong");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
//       </div>
//     );
//   }

//   return (
//     <main className="flex-1 min-h-screen bg-gray-50 p-4 md:p-6">

//       {/* Header */}
//       <div className="mb-3">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 bg-white rounded-lg shadow-sm" style={{ backgroundColor: "#e6ebfaff" }}>
//           <p className="text-md text-gray-900 font-semibold">
//             Successfully logged in :
//             <span className="font-semibold ml-1">
//               {officerData?.employee_detail?.employee_name} ({officerData?.employee_detail?.designation})
//             </span>
//           </p>

//           <button
//             onClick={handleGoToHTNSC}
//             className="px-5 py-2 text-white font-medium rounded-md hover:opacity-90"
//             style={{ backgroundColor: '#10358C' }}
//           >
//             HT-NSC Dashboard
//           </button>
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {officerData?.flags?.map((items) => {

//           let statusText = items.application_status || "";

//           if (statusText === "pending for agreement finalization") {
//             statusText = "Proceed after providing E-stamp by Applicant";
//           } else if (statusText === "connection served") {
//             statusText = "Load Released (Closed)";
//           } else {
//             statusText = statusText.replace(/pending For/gi, "").trim();
//           }


//           // ✅ DESIGNATION MANIPULATION
//           let designationText = items.designation || "";

//           if (
//             items.application_status.includes("pending for transco approval") ||
//             items.application_status.includes("Pending for Under Process in EDCRA")
//           ) {
//             designationText = "TRANSCO COMPANY / Regional CGM";
//           }


//           return (
//             <div
//               key={items.id}
//               className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-[210px]"
//             >

//               {/* STATUS */}
//               <div
//                 className="h-1/3 flex items-center justify-center px-3 text-center text-white font-semibold text-md capitalize"
//                 style={{ backgroundColor: "#1f57d8ff" }}
//               >
//                 {statusText}
//               </div>


//               {/* COUNT */}
//               <div className="h-1/3 flex items-center justify-center">

//                 <NavLink
//                   to="/dashboard/padding_Application"
//                   state={{
//                     emp_id: officerData.employee_detail.employee_login_id,
//                     flag_id: items.id,
//                   }}
//                   className="w-full text-center"
//                 >
//                   <span className="text-4xl font-bold text-gray-800 hover:text-blue-600">
//                     {items.count}
//                   </span>
//                 </NavLink>

//               </div>


//               {/* DESIGNATION */}
//               <div
//                 className="h-1/3 flex items-center justify-center px-3 text-center text-white text-md font-medium"
//                 style={{ backgroundColor: "#4478f3ff" }}
//               >
//                 {designationText}
//               </div>

//             </div>
//           );

//         })}
//       </div>

//     </main>
//   );
// };

// export default ApplicationStatus;

import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { HT_NSC_DASHBOARD_URL, HT_LOAD_CHANGE_BASE } from '../../api/api'


const ApplicationStatus = () => {
  const [loading, setLoading] = useState(true);
  const officerData = useSelector(state => state.user.officerData);
  // console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE in Application Status component')
  // console.log(HT_NSC_DASHBOARD_URL,'HT_NSC_DASHBOARD_URL in ApplicationStatus component')
  useEffect(() => {
    // Simulate loading or wait for officerData
    if (officerData) {
      setLoading(false);
    }
  }, [officerData]);

  const handleGoToHTNSC = async () => {
    try {
      const token = officerData?.tokens?.access;

      if (!token) {
        alert("Token not found!");
        return;
      }

      const res = await fetch(`${HT_LOAD_CHANGE_BASE}/officer/token-info/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(res, 'responseeeeee')
      const data = await res.json();
      console.log(data, 'dataaa tokennnnnnnnn')
      if (data.status === "success") {
        const empId = String(data.employee_login_id);
        window.location.href = `${HT_NSC_DASHBOARD_URL}/officerLoginhtload/${empId}`;

      } else {
        alert("Token validation failed!");
      }
    } catch (err) {
      console.error("API error:", err);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 bg-white rounded-lg shadow-sm" style={{ backgroundColor: "#e6ebfaff" }}>
          <p className="text-md text-gray-900 font-semibold">
            Successfully logged in :
            <span className="font-semibold ml-1">
              {officerData?.employee_detail?.employee_name} ({officerData?.employee_detail?.designation})
            </span>
          </p>

          <button
            onClick={handleGoToHTNSC}
            className="px-5 py-2 text-white font-medium rounded-md hover:opacity-90"
            style={{ backgroundColor: '#10358C' }}
          >
            HT-NSC Dashboard
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {officerData?.flags?.map((items) => {

          let statusText = items.application_status || "";

          // ✅ STATUS MAPPING
          if (statusText === "pending for agreement finalization") {
            statusText = "Proceed after providing E-stamp by Applicant";

          } else if (statusText === "connection served") {
            statusText = "Load Released (Closed)";

          } else if (statusText.toLowerCase().includes("pending for transco approval")) {
            statusText = "EDCRA APPROVAL";
          } else if (
            statusText.toLowerCase().includes("pending application received from edcra")
          ) {
            statusText =
              "Pending for forwarding to GM for processing after received from EDCRA";

          } else {
            statusText = statusText.replace(/pending For/gi, "").trim();
          }


          // ✅ DESIGNATION FIX (IMPORTANT)
          let designationText = items?.designation || "N/A";

          // Custom override
          if (
            items?.application_status?.toLowerCase().includes("pending for transco approval") ||
            items?.application_status?.toLowerCase().includes("under process in edcra")
          ) {
            designationText = "TRANSCO COMPANY / Regional CGM";
          }

          return (
            <div
              key={items.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-[210px]"
            >

              {/* STATUS */}
              <div
                className="h-1/3 flex items-center justify-center px-3 text-center text-white font-semibold text-md capitalize"
                style={{ backgroundColor: "#1f57d8ff" }}
              >
                {statusText}
              </div>


              {/* COUNT */}
              <div className="h-1/3 flex items-center justify-center">

                <NavLink
                  to="/dashboard/padding_Application"
                  state={{
                    emp_id: officerData.employee_detail.employee_login_id,
                    flag_id: items.id,
                  }}
                  className="w-full text-center"
                >
                  <span className="text-4xl font-bold text-gray-800 hover:text-blue-600">
                    {items.count}
                  </span>
                </NavLink>

              </div>


              {/* DESIGNATION */}
              <div
                className="h-1/3 flex items-center justify-center px-3 text-center text-white text-md font-medium"
                style={{ backgroundColor: "#4478f3ff" }}
              >
                {designationText}
              </div>

            </div>
          );

        })}
      </div>

    </main>
  );
};

export default ApplicationStatus;





