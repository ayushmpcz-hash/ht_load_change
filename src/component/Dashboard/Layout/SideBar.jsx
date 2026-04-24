import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { setOfficerData, setLoginUser,logout } from '../../../redux/slices/userSlice'; // path adjust if needed
import {HT_NSC_DASHBOARD_URL} from '../../../api/api'
const Sidebar = () => {
  const officerData = useSelector((state) => state.user.officerData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
  const savedOfficer = localStorage.getItem("officer_data");

  if (savedOfficer && !officerData) {
    dispatch(setOfficerData(JSON.parse(savedOfficer)));
  }
}, [dispatch, officerData]);

useEffect(() => {
  const savedUser = localStorage.getItem("login_user");

  if (savedUser) {
    dispatch(setLoginUser(JSON.parse(savedUser)));
  }
}, [dispatch]);



  useEffect(() => {
    const savedState = localStorage.getItem('isSidebarOpen');
    if (savedState !== null) setIsSidebarOpen(JSON.parse(savedState));
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('isSidebarOpen', JSON.stringify(newState));
  };


//   const handleLogout = () => {
//   Cookies.remove('accessToken', { path: '/' });
//   Cookies.remove('refresh_token', { path: '/' });

//   localStorage.removeItem("officer_data");

//   dispatch(logout()); // ✅ ONLY THIS

//   navigate('/department-login', { replace: true });
// };

const handleLogout = () => {

  const officerData = localStorage.getItem("officer_data");
  const applicantData = localStorage.getItem("loginUser");

  // console.log(officerData, "Officer Data");
  // console.log(applicantData, "Applicant Data");

  //  console.log(import.meta.env.MODE, 'logout env')
  // console.log(import.meta.env, 'logout env')

  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refresh_token", { path: "/" });

  localStorage.clear();

  dispatch(logout());

  // Officer logout
  if (officerData) {

    window.location.href =
      `${HT_NSC_DASHBOARD_URL}/officerLogin`;
  }
  // Applicant logout
  else if (applicantData) {

    navigate("/applicant-login", { replace: true });

  }
};

  return (
    <>
      <aside
        className={`fixed inset-y-0 z-10 flex flex-col w-64 max-h-screen overflow-hidden border-r shadow-lg transition-all bg-[#0000bb] text-white transform lg:static lg:z-auto lg:shadow-none ${
          !isSidebarOpen ? '-translate-x-full lg:translate-x-0 lg:w-20' : ''
        }`}
      >
        <div className={`flex items-center justify-between h-16 border-b border-white p-2 ${!isSidebarOpen ? 'lg:justify-center' : ''}`}>
          <span className="text-xl font-semibold leading-8 tracking-wider uppercase whitespace-nowrap">
            HT-<span className={!isSidebarOpen ? 'lg:hidden' : ''}>Load-Change</span>
          </span>
          <button onClick={toggleSidebar} className="rounded-md lg:hidden">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-hidden hover:overflow-y-auto">
          <ul className="block w-full h-full">
            {officerData ? (
              <li className='block'>
                <Link to={"/dashboard"} className={`flex items-center p-2 border-b border-gray-100 space-x-2 hover:bg-white hover:text-black ${!isSidebarOpen ? 'justify-center' : ''}`}>
                  <span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  {isSidebarOpen && <span className='text-lg'>Officer Dashboard</span>}
                </Link>
              </li>
            ) : (
              <li className='block'>
                <Link to={"/user-dashboard"} className={`flex items-center p-2 border-b border-gray-100 space-x-2 hover:bg-white hover:text-black ${!isSidebarOpen ? 'justify-center' : ''}`}>
                  <span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  {isSidebarOpen && <span className='text-lg'>User Dashboard</span>}
                </Link>
              </li>
            )}


              <li className='block'>
                <Link to={"/dashboard/download_pdf"} className={`flex items-center p-2 border-b border-gray-100 space-x-2 hover:bg-white hover:text-black ${!isSidebarOpen ? 'justify-center' : ''}`}>
                  <span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  {isSidebarOpen && <span className='text-md'>Download PDF</span>}
                </Link>
              </li>

          </ul>
        </nav>

        <div className="border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-start w-full px-4 py-2 space-x-1 cursor-pointer hover:bg-white hover:text-black transition"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span className='text-lg'>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from "react-redux";
// import Cookies from 'js-cookie';
// import { setOfficerData, setLoginUser, logout } from '../../../redux/slices/userSlice'; // path adjust if needed
// import { HT_NSC_DASHBOARD_URL } from '../../../api/api'
// const Sidebar = () => {
//   const officerData = useSelector((state) => state.user.officerData);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   useEffect(() => {
//     const savedOfficer = localStorage.getItem("officer_data");

//     if (savedOfficer && !officerData) {
//       dispatch(setOfficerData(JSON.parse(savedOfficer)));
//     }
//   }, [dispatch, officerData]);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("login_user");

//     if (savedUser) {
//       dispatch(setLoginUser(JSON.parse(savedUser)));
//     }
//   }, [dispatch]);



//   useEffect(() => {
//     const savedState = localStorage.getItem('isSidebarOpen');
//     if (savedState !== null) setIsSidebarOpen(JSON.parse(savedState));
//   }, []);

//   const toggleSidebar = () => {
//     const newState = !isSidebarOpen;
//     setIsSidebarOpen(newState);
//     localStorage.setItem('isSidebarOpen', JSON.stringify(newState));
//   };


//   //   const handleLogout = () => {
//   //   Cookies.remove('accessToken', { path: '/' });
//   //   Cookies.remove('refresh_token', { path: '/' });

//   //   localStorage.removeItem("officer_data");

//   //   dispatch(logout()); // ✅ ONLY THIS

//   //   navigate('/department-login', { replace: true });
//   // };

//   const handleLogout = () => {

//     const officerData = localStorage.getItem("officer_data");
//     const applicantData = localStorage.getItem("loginUser");

//     // console.log(officerData, "Officer Data");
//     // console.log(applicantData, "Applicant Data");

//     //  console.log(import.meta.env.MODE, 'logout env')
//     // console.log(import.meta.env, 'logout env')

//     Cookies.remove("accessToken", { path: "/" });
//     Cookies.remove("refresh_token", { path: "/" });

//     localStorage.clear();

//     dispatch(logout());

//     // Officer logout
//     if (officerData) {

//       window.location.href =
//         `${HT_NSC_DASHBOARD_URL}/officerLogin`;
//     }
//     // Applicant logout
//     else if (applicantData) {

//       navigate("/applicant-login", { replace: true });

//     }
//   };

//   return (
//     <>
//       <aside
//         className={`fixed inset-y-0 z-10 flex flex-col w-64 max-h-screen overflow-hidden border-r shadow-lg transition-all bg-[#0000bb] text-white transform lg:static lg:z-auto lg:shadow-none ${!isSidebarOpen ? '-translate-x-full lg:translate-x-0 lg:w-20' : ''
//           }`}
//       >
//         <div className={`flex items-center justify-between h-16 border-b border-white p-2 ${!isSidebarOpen ? 'lg:justify-center' : ''}`}>
//           <span className="text-xl font-semibold leading-8 tracking-wider uppercase whitespace-nowrap">
//             HT-<span className={!isSidebarOpen ? 'lg:hidden' : ''}>Load-Change</span>
//           </span>
//           <button onClick={toggleSidebar} className="rounded-md lg:hidden">
//             <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <nav className="flex-1 overflow-hidden hover:overflow-y-auto">
//           <ul className="block w-full h-full">
//             {officerData ? (
//                <>
//                          <li className='block'>
//                 <Link to={"/dashboard"} className={`flex items-center p-2 border-b border-gray-100 space-x-2 hover:bg-white hover:text-black ${!isSidebarOpen ? 'justify-center' : ''}`}>
//                   <span>
//                     <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                     </svg>
//                   </span>
//                   {isSidebarOpen && <span className='text-lg'>Officer Dashboard</span>}
//                 </Link>
//               </li>
//               <li className='block'>
//                   <Link
//                     to={"/dashboard/reports"}
//                     className={`flex items-center p-2 border-b border-gray-100 space-x-2 hover:bg-white hover:text-black ${!isSidebarOpen ? 'justify-center' : ''}`}
//                   >
//                     <span>
//                       📊
//                     </span>
//                     {isSidebarOpen && <span className='text-md'>Reports</span>}
//                   </Link>
//                 </li>
//                </>
//             ) : (
//               <li className='block'>
//                 <Link to={"/user-dashboard"} className={`flex items-center p-2 border-b border-gray-100 space-x-2 hover:bg-white hover:text-black ${!isSidebarOpen ? 'justify-center' : ''}`}>
//                   <span>
//                     <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                     </svg>
//                   </span>
//                   {isSidebarOpen && <span className='text-lg'>User Dashboard</span>}
//                 </Link>
//               </li>
//             )}


//             <li className='block'>
//               <Link to={"/dashboard/download_pdf"} className={`flex items-center p-2 border-b border-gray-100 space-x-2 hover:bg-white hover:text-black ${!isSidebarOpen ? 'justify-center' : ''}`}>
//                 <span>
//                   <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                   </svg>
//                 </span>
//                 {isSidebarOpen && <span className='text-md'>Download PDF</span>}
//               </Link>
//             </li>

//           </ul>
//         </nav>

//         <div className="border-t border-gray-100">
//           <button
//             onClick={handleLogout}
//             className="flex items-center justify-start w-full px-4 py-2 space-x-1 cursor-pointer hover:bg-white hover:text-black transition"
//             type="button"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             {isSidebarOpen && <span className='text-lg'>Logout</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;


