// import React, { useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Link, NavLink } from 'react-router-dom';

// const ApplicationStatus = () => {
//   const loadingRef = useRef();
//   const officerData = useSelector(state => state.user.officerData);
//   // const userData = useSelector(state => state.user.userData);
//   // const loginUser = useSelector(state => state.user.loginUser);
//   console.log(officerData, 'officerData inside application status');
//   // console.log(userData,"userData")
//   // console.log(loginUser,"loginUser")

//   useEffect(() => {
//     if (loadingRef.current) {
//       loadingRef.current.classList.add('hidden');
//     }
//   }, []);

//   return (
//     <main className="flex-1 max-h-full p-5 overflow-y-auto">
//       <div
//         ref={loadingRef}
//         className="fixed inset-0 z-50 flex items-center justify-center text-white bg-black bg-opacity-50"
//         style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
//       >
//         Loading.....
//       </div>
//       <div className=" bg-linear-to-r from-cyan-500 to-blue-500">
//         <h4 className="text-sm/6 text-black font-semibold whitespace-nowrap p-4">
//           Successfully login :{officerData?.employee_detail?.employee_name}
//         </h4>
//       </div>

//       <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//         <div className="card-header px-4 py-2 border-b border-gray-300">
//           <h2 className='text-lg font-bold capitalize '>
//             Card header
//           </h2>
//         </div>
//         <div className="card-body px-4 pb-4">
//           <div className="grid grid-cols-1 mt-6 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {officerData?.flags?.map((items, index) => (
//               <div
//                 key={index}
//                 className="rounded-sm shadow-sm hover:shadow-lg transition-shadow border-black-900 "
//               >
//                 <div className="flex items-start justify-between border-b border-gray-200 p-2">
//                   <div className="text-lg font-semibold  ">{items.designation}</div>

//                   <div className="mt-2">
//                     <span className="px-2 py-1 text-sm text-white bg-green-300 rounded">
//                       {' '}
//                       <NavLink
//                         to="/dashboard/padding_Application"
//                         state={{
//                           emp_id: officerData.employee_detail.employee_login_id,
//                           flag_id: items.id,
//                         }}
//                       >
//                         {items.count}
//                       </NavLink>
//                     </span>
//                     {/* <span>from 2019</span> */}
//                   </div>
//                 </div>

//                 <div className="flex items-start justify-between p-2 pt-4 pb-4">
//                   <div>
//                     {items.application_status === 'pending for agreement finalization' ? (
//                       <span className="text-gray-400 text-sm capitalize">
//                         Proceed after providing E-stamp by Applicant
//                       </span>
//                     ) : items.application_status === 'connection served' ? (
//                       <span className="text-gray-400 text-sm font-semibold capitalize">
//                         {' '}
//                         Load Released
//                       </span>
//                     ) : (
//                       <span className="text-gray-400 text-sm font-semibold capitalize">
//                         {items.application_status}
//                       </span>
//                     )}
//                   </div>
//                   {/* <div className="w-10 h-10 bg-gray-200 rounded">{items.designation}</div> */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ApplicationStatus;

//code with correct nevigation
// import React, { useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Link, NavLink } from 'react-router-dom';

// const ApplicationStatus = () => {
//   const loadingRef = useRef();
//   const officerData = useSelector(state => state.user.officerData);
//   // const userData = useSelector(state => state.user.userData);
//   // const loginUser = useSelector(state => state.user.loginUser);
//   console.log(officerData, 'officerData inside application status');
//   // console.log(userData,"userData")
//   // console.log(loginUser,"loginUser")

//   useEffect(() => {
//     if (loadingRef.current) {
//       loadingRef.current.classList.add('hidden');
//     }
//   }, []);

//   const handleGoToHTNSC = async () => {
//     try {
//       const token = officerData?.tokens?.access;

//       if (!token) {
//         alert("Token not found!");
//         return;
//       }

//       const res = await fetch("http://127.0.0.1:8000/ht_load_change/officer/token-info/", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();
//       console.log("HTNSC Response:", data);

//       if (data.status === "success") {
//         // SUCCESS → Officer ke login id ke basis par redirect
//         const empId = String(data.employee_login_id)

//         console.log("succefully nevigate")
//         console.log(empId,'empId')
//         window.location.href = `/officerLoginhtload/${empId}`;
//       } else {
//         alert("Token validation failed!");
//       }
//     } catch (err) {
//       console.error("API error:", err);
//       alert("Something went wrong");
//     }
//   };


//   return (
//     <main className="flex-1 max-h-full p-5 overflow-y-auto">
//       <div
//         ref={loadingRef}
//         className="fixed inset-0 z-50 flex items-center justify-center text-white bg-black bg-opacity-50"
//         style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
//       >
//         Loading.....
//       </div>
//       <div className=" bg-linear-to-r from-cyan-500 to-blue-500">
//         <h4 className="text-sm/6 text-black font-semibold whitespace-nowrap p-4">
//           Successfully login :{officerData?.employee_detail?.employee_name}
//         </h4>
//       </div>

//       <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//         <div className="card-header px-4  flex py-2 border-b border-gray-300">
//           <h2 className='text-lg font-bold capitalize '>
//             Card header
//           </h2>

//             {/* 🔵 Go to HT-NSC button */}
//         <button
//           onClick={handleGoToHTNSC}
//           className="bg-blue-600 text-white px-4 py-1 px-5 rounded hover:bg-blue-700"
//         >
//           Go To HT-NSC Dashboard
//         </button>
//         </div>

      
//         <div className="card-body px-4 pb-4">
//           <div className="grid grid-cols-1 mt-6 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {officerData?.flags?.map((items, index) => (
//               <div
//                 key={index}
//                 className="rounded-sm shadow-sm hover:shadow-lg transition-shadow border-black-900 "
//               >
//                 <div className="flex items-start justify-between border-b border-gray-200 p-2">
//                   <div className="text-lg font-semibold  ">{items.designation}</div>

//                   <div className="mt-2">
//                     <span className="px-2 py-1 text-sm text-white bg-green-300 rounded">
//                       {' '}
//                       <NavLink
//                         to="/dashboard/padding_Application"
//                         state={{
//                           emp_id: officerData.employee_detail.employee_login_id,
//                           flag_id: items.id,
//                         }}
//                       >
//                         {items.count}
//                       </NavLink>
//                     </span>
//                     {/* <span>from 2019</span> */}
//                   </div>
//                 </div>

//                 <div className="flex items-start justify-between p-2 pt-4 pb-4">
//                   <div>
//                     {items.application_status === 'pending for agreement finalization' ? (
//                       <span className="text-gray-400 text-sm capitalize">
//                         Proceed after providing E-stamp by Applicant
//                       </span>
//                     ) : items.application_status === 'connection served' ? (
//                       <span className="text-gray-400 text-sm font-semibold capitalize">
//                         {' '}
//                         Load Released
//                       </span>
//                     ) : (
//                       <span className="text-gray-400 text-sm font-semibold capitalize">
//                         {items.application_status}
//                       </span>
//                     )}
//                   </div>
//                   {/* <div className="w-10 h-10 bg-gray-200 rounded">{items.designation}</div> */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ApplicationStatus;


//with new ui 
import React, { useRef, useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { HT_NSC_DASHBOARD_URL,HT_LOAD_CHANGE_BASE } from '../../api/api'


const ApplicationStatus = () => {
  const [loading, setLoading] = useState(true);
  const officerData = useSelector(state => state.user.officerData);
console.log(HT_LOAD_CHANGE_BASE,'HT_LOAD_CHANGE_BASE in Application Status component')
console.log(HT_NSC_DASHBOARD_URL,'HT_NSC_DASHBOARD_URL in ApplicationStatus component')
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
      console.log(res,'responseeeeee')
      const data = await res.json();
      console.log(data,'dataaa tokennnnnnnnn')
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 bg-white rounded-lg shadow-sm">
          <p className="text-md text-gray-600">
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
        {officerData?.flags?.map((items, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* Top */}
            <div
              className="px-4 py-3 text-center text-white font-semibold text-sm"
              style={{ backgroundColor: '#789ef8ff' }}
            >
              {items.designation}
            </div>

            {/* Middle */}
            <div className="flex-1 flex items-center justify-center p-8">
              <NavLink
                to="/dashboard/padding_Application"
                state={{
                  emp_id: officerData.employee_detail.employee_login_id,
                  flag_id: items.id,
                }}
                className="w-full text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800 hover:text-blue-600">
                    {items.count}
                  </span>
                  {/* <span className="text-sm text-gray-500 mt-2">Applications</span> */}
                </div>
              </NavLink>
            </div>

            {/* Bottom */}
            <div
              className="px-4 flex items-center justify-center text-center min-h-[56px]"
              style={{ backgroundColor: '#1f57d8ff' }}
            >
              {items.application_status === 'pending for agreement finalization' ? (
                <span className="text-white text-sm font-medium">
                  Proceed after providing E-stamp by Applicant
                </span>
              ) : items.application_status === 'connection served' ? (
                <span className="text-white text-sm font-medium">
                  Load Released
                </span>
              ) : (
                <span className="text-white text-sm font-medium capitalize">
                  {items.application_status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ApplicationStatus;
