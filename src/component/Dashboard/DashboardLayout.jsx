// import React from 'react';
// import Sidebar from './Layout/SideBar'
// import Header from './Layout/Header';
// import Footer from './layout/Footer';
// import MainContent from './layout/MainContent';
// import { Outlet } from 'react-router-dom';

// const DashboardLayout = () => {
//   return (
//     <div className="flex h-screen overflow-y-hidden">
//       <Sidebar />
//       <div className="flex flex-col flex-1 h-full overflow-hidden lg:w-75">
//         <Header />
//         <div className='p-4 overflow-x-hidden overflow-y-auto h-screen '>
//         <Outlet></Outlet>
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import React, { useEffect } from 'react';
import Sidebar from './Layout/SideBar';
import Header from './Layout/Header';
import Footer from './layout/Footer';
import { Outlet } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setOfficerData } from "../../redux/slices/userSlice";
import Cookies from 'js-cookie';

const DashboardLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
  const saved = localStorage.getItem("officer_data");

  if (saved) {
    const parsed = JSON.parse(saved);
    dispatch(setOfficerData(parsed));
  }
}, []);


  return (
    <div className="flex h-screen overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden lg:w-75">
        <Header />
        <div className='p-4 overflow-x-hidden overflow-y-auto h-screen'>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
