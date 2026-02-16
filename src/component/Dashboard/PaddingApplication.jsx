// import React, { useEffect, useState } from 'react';
// import { useLocation, NavLink, useParams } from 'react-router-dom';
// import { getDataForEmpToken } from '../../utils/handlePostApi.js';
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
// import Cookies from 'js-cookie';
// import { useDispatch, useSelector } from 'react-redux';
// import { setApplications } from "../../redux/slices/userSlice.js"

// export default function PaddingApplication() {
//   const [pendingApplication, setPendingApplication] = useState([]);
//   const [applicationStatusName, setApplicationStatusName] = useState([]);
//   const [statusUrl, setStatusUrl] = useState();
//   const [currentPage, setCurrantPage] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const token = Cookies.get('accessToken');

//   console.log(HT_LOAD_CHANGE_BASE, "HT_LOAD_CHANGE_BASE inside pending application")

//   const dispatch = useDispatch()
//   const applications = useSelector(state => state.user.applications);
//   const searchText = useSelector(state => state.user.searchText);

//   const location = useLocation();
//   const { application_no } = useParams();
//   const { emp_id, flag_id } = location.state || {};

//   const filteredApplications = applications.filter(app =>
//     app.application_no?.toLowerCase().includes(searchText.toLowerCase()) ||
//     app.consumer_name?.toLowerCase().includes(searchText.toLowerCase())
//   );

//   useEffect(() => {
//     let fetchData = async () => {
//       setLoading(true);
//       try {
//         let formData = {
//           employee_id: emp_id,
//           flag_id: flag_id,
//         };
//         let response = await getDataForEmpToken(
//           formData,
//           `${HT_LOAD_CHANGE_BASE}/get-applications-by-flag/`,
//           token
//         );
//         let result = await response.json();
//         setPendingApplication(result.applications || []);
//         setApplicationStatusName(result.flag || {});
//         dispatch(setApplications(result.applications));
//         if (result.flag && result.flag.name) {
//           setStatusUrl(result.flag.name.split(' ').join('_'));
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setPendingApplication([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (emp_id && flag_id) {
//       fetchData();
//     } else {
//       setLoading(false);
//     }
//   }, [emp_id, flag_id, token]);

//   let PageSize = 10;
//   let itemsLength = pendingApplication.length;
//   let numOfPages = Math.ceil(itemsLength / PageSize);
//   let Start = currentPage * PageSize;
//   let End = Start + PageSize;

//   function handlePageChange(n) {
//     setCurrantPage(n);
//   }

//   const goToPrevPage = () => {
//     setCurrantPage(prev => prev - 1);
//   };

//   const goToNextPage = () => {
//     setCurrantPage(prev => prev + 1);
//   };

//   // Format Load Change Type for better display
//   const formatLoadChangeType = (type) => {
//     if (!type) return 'N/A';
//     // Replace underscores with spaces and add proper spacing
//     return type.replace(/_/g, ' ');
//   };

//   return (
//     <>
//       <div className="bg-white rounded-lg shadow-md">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-xl font-bold capitalize text-gray-800">
//             {applicationStatusName.name || 'Applications'}
//           </h2>
//         </div>

//         <div className="p-6">
//           <div className="w-full">
//             <table className="w-full divide-y divide-gray-200">
//               <thead className="bg-[#000080]">
//                 <tr>
//                   <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Circle
//                   </th>

//                   <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Division
//                   </th>

//                   <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     App No
//                   </th>
//                   <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Firm Name
//                   </th>

//                   {/* <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Change Type
//                   </th> */}
//                   <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Load Change Type
//                   </th>
//                   <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-16 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#0c0d52] border-t-transparent mb-4"></div>
//                         <p className="text-gray-600 font-medium">Loading applications...</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   <>
//                     {filteredApplications.length > 0 ? (
//                       filteredApplications.slice(Start, End).map((items, index) => (
//                         <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">

//                           <td className="px-4 py-3 align-middle">
//                             <span className="inline-flex px-3 py-1.5 text-base font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[100px]" title={items.circle}>
//                               {items.circle}
//                             </span>
//                           </td>

//                           <td className="px-4 py-3 align-middle">
//                             <div className="text-base text-gray-900 truncate max-w-[120px]" title={items.division}>
//                               {items.division}
//                             </div>
//                           </td>

//                           <td className="px-4 py-3 align-middle">
//                             <div className="text-base font-semibold text-gray-900 truncate max-w-[120px]" title={items.application_no}>
//                               {items.application_no}
//                             </div>
//                           </td>

//                           <td className="px-4 py-3 align-middle">
//                             <div className="text-base text-gray-900 truncate max-w-[160px]" title={items.consumer_name}>
//                               {items.consumer_name}
//                             </div>
//                           </td>


//                           {/* <td className="px-4 py-3 align-middle">
//                             <div className="text-sm text-gray-900 truncate max-w-[140px]" title={items.type_of_change}>
//                               {items.type_of_change ? items.type_of_change.replace(/_/g, ' ') : 'N/A'}
//                             </div>
//                           </td> */}

//                           <td className="px-4 py-3 align-middle">
//                             <div className="text-base text-gray-900 break-words max-w-[180px] min-w-[150px]" title={items.lc_type}>
//                               {formatLoadChangeType(items.lc_type)}
//                             </div>
//                           </td>

//                           <td className="px-4 py-3 align-middle">
//                             {statusUrl && (
//                               <NavLink
//                                 to={{ pathname: `/dashboard/${statusUrl}/${items.id}` }}
//                                 state={{ items }}
//                                 className="inline-flex justify-center"
//                               >
//                                 <button className="bg-[#0c0d52] text-white px-3 py-1.5 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
//                                   View
//                                 </button>
//                               </NavLink>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="7" className="px-6 py-12 text-center">
//                           <div className="flex flex-col items-center justify-center">
//                             <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                             </svg>
//                             <p className="text-gray-500 text-lg font-medium">No applications found</p>
//                             <p className="text-gray-400 mt-1">Try adjusting your search or filter</p>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {!loading && filteredApplications.length > 0 && (
//             <div className="mt-6">
//               <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-4 sm:px-6">
//                 <div className="flex flex-1 justify-between sm:hidden">
//                   <button
//                     disabled={currentPage === 0}
//                     onClick={goToPrevPage}
//                     className={`relative inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium ${currentPage === 0
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
//                       }`}
//                   >
//                     Previous
//                   </button>
//                   <div className="flex items-center">
//                     <span className="text-sm text-gray-700 mx-4">
//                       Page <span className="font-bold">{currentPage + 1}</span> of <span className="font-bold">{numOfPages}</span>
//                     </span>
//                   </div>
//                   <button
//                     disabled={currentPage === numOfPages - 1}
//                     onClick={goToNextPage}
//                     className={`relative ml-3 inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium ${currentPage === numOfPages - 1
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
//                       }`}
//                   >
//                     Next
//                   </button>
//                 </div>

//                 <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-gray-700">
//                       Showing <span className="font-semibold">{Start + 1}</span> to{' '}
//                       <span className="font-semibold">
//                         {End > itemsLength ? itemsLength : End}
//                       </span>{' '}
//                       of <span className="font-semibold">{itemsLength}</span> results
//                     </p>
//                   </div>

//                   <div>
//                     <ul className="flex items-center space-x-1">
//                       <li>
//                         <button
//                           disabled={currentPage === 0}
//                           onClick={goToPrevPage}
//                           className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${currentPage === 0
//                             ? 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
//                             : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
//                             }`}
//                         >
//                           ← Previous
//                         </button>
//                       </li>

//                       <li className="flex items-center space-x-1">
//                         {[...Array(numOfPages).keys()].map(n => (
//                           <button
//                             key={n}
//                             onClick={() => handlePageChange(n)}
//                             className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg min-w-[36px] justify-center ${n === currentPage
//                               ? 'z-10 bg-[#0c0d52] text-white border border-[#0c0d52]'
//                               : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
//                               }`}
//                           >
//                             {n + 1}
//                           </button>
//                         ))}
//                       </li>

//                       <li>
//                         <button
//                           disabled={currentPage === numOfPages - 1}
//                           onClick={goToNextPage}
//                           className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${currentPage === numOfPages - 1
//                             ? 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
//                             : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
//                             }`}
//                         >
//                           Next →
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </nav>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useLocation, NavLink, useParams } from 'react-router-dom';
import { getDataForEmpToken } from '../../utils/handlePostApi.js';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setApplications } from "../../redux/slices/userSlice.js"

// Tooltip Component
const Tooltip = ({ children, text, className = "" }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-default"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-normal break-words max-w-xs bottom-full left-0 mb-2">
          {text}
          <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default function PaddingApplication() {
  const [pendingApplication, setPendingApplication] = useState([]);
  const [applicationStatusName, setApplicationStatusName] = useState([]);
  const [statusUrl, setStatusUrl] = useState();
  const [currentPage, setCurrantPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentColumn, setShowPaymentColumn] = useState(false);
  const token = Cookies.get('accessToken');

  console.log(HT_LOAD_CHANGE_BASE, "HT_LOAD_CHANGE_BASE inside pending application")

  const dispatch = useDispatch()
  const applications = useSelector(state => state.user.applications);
  const searchText = useSelector(state => state.user.searchText);

  const location = useLocation();
  const { application_no } = useParams();
  const { emp_id, flag_id } = location.state || {};

  const filteredApplications = applications.filter(app =>
    app.application_no?.toLowerCase().includes(searchText.toLowerCase()) ||
    app.consumer_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    let fetchData = async () => {
      setLoading(true);
      try {
        let formData = {
          employee_id: emp_id,
          flag_id: flag_id,
        };
        let response = await getDataForEmpToken(
          formData,
          `${HT_LOAD_CHANGE_BASE}/get-applications-by-flag/`,
          token
        );
        let result = await response.json();
        setPendingApplication(result.applications || []);
        setApplicationStatusName(result.flag || {});
        dispatch(setApplications(result.applications));
        
        // Check if any application has bank_response with transaction_date (successful transaction)
        const hasPaymentDate = result.applications?.some(app => {
          if (app.bank_response && app.bank_response.transaction_date) {
            const isSuccessful = app.bank_response.auth_status === '0300' || 
                               app.bank_response.transaction_error_type === 'success';
            return isSuccessful;
          }
          return false;
        });
        
        setShowPaymentColumn(hasPaymentDate);
        
        if (result.flag && result.flag.name) {
          setStatusUrl(result.flag.name.split(' ').join('_'));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPendingApplication([]);
      } finally {
        setLoading(false);
      }
    };

    if (emp_id && flag_id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [emp_id, flag_id, token]);

  // Get Payment Date - ONLY from bank_response.transaction_date
  const getPaymentDate = (app) => {
    // Check if bank_response exists and has transaction_date
    if (app.bank_response && app.bank_response.transaction_date) {
      // Check if it's a successful transaction
      const isSuccessful = app.bank_response.auth_status === '0300' || 
                         app.bank_response.transaction_error_type === 'success';
      
      if (isSuccessful) {
        return formatDate(app.bank_response.transaction_date.split('T')[0]);
      }
    }
    
    // No payment date found - return null (column will show —)
    return null;
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  let PageSize = 10;
  let itemsLength = filteredApplications.length;
  let numOfPages = Math.ceil(itemsLength / PageSize);
  let Start = currentPage * PageSize;
  let End = Start + PageSize;

  function handlePageChange(n) {
    setCurrantPage(n);
  }

  const goToPrevPage = () => {
    setCurrantPage(prev => prev - 1);
  };

  const goToNextPage = () => {
    setCurrantPage(prev => prev + 1);
  };

  // Format Load Change Type for better display
  const formatLoadChangeType = (type) => {
    if (!type) return 'N/A';
    return type.replace(/_/g, ' ');
  };

  // Determine column span based on payment column visibility
  const getColumnSpan = () => {
    return showPaymentColumn ? 7 : 6; // Circle, Division, App No, Firm Name, Payment Date, Load Change Type, Action
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md w-full">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold capitalize text-gray-800">
            {applicationStatusName.name || 'Applications'}
          </h2>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* Desktop/Tablet View */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#000080]">
                <tr>
                  <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Circle
                  </th>
                  <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Division
                  </th>
                  <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    App No
                  </th>
                  <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Firm Name
                  </th>
                  {/* Payment Date column - Only show if bank_response has transaction_date */}
                  {showPaymentColumn && (
                    <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                      Payment Date
                    </th>
                  )}
                  <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Load Change Type
                  </th>
                  <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={getColumnSpan()} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#0c0d52] border-t-transparent mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredApplications.length > 0 ? (
                      filteredApplications.slice(Start, End).map((items, index) => {
                        const paymentDate = getPaymentDate(items);
                        return (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-3 py-3 align-middle">
                              <span className="inline-flex px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[100px]" title={items.circle}>
                                {items.circle}
                              </span>
                            </td>
                            
                            <td className="px-3 py-3 align-middle">
                              <Tooltip text={items.division || ''}>
                                <div className="text-sm text-gray-900 truncate max-w-[120px]">
                                  {items.division}
                                </div>
                              </Tooltip>
                            </td>
                            
                            <td className="px-3 py-3 align-middle">
                              <Tooltip text={items.application_no || ''}>
                                <div className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                                  {items.application_no}
                                </div>
                              </Tooltip>
                            </td>
                            
                            <td className="px-3 py-3 align-middle">
                              <Tooltip text={items.consumer_name || ''}>
                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                  {items.consumer_name}
                                </div>
                              </Tooltip>
                            </td>
                            
                            {/* Payment Date cell - Only render if column is visible */}
                            {showPaymentColumn && (
                              <td className="px-3 py-3 align-middle">
                                {paymentDate ? (
                                  <div className="text-sm font-medium text-blue-600 whitespace-nowrap">
                                    {paymentDate}
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">—</span>
                                )}
                              </td>
                            )}
                            
                            <td className="px-3 py-3 align-middle">
                              <Tooltip text={formatLoadChangeType(items.lc_type) || ''}>
                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                  {formatLoadChangeType(items.lc_type)}
                                </div>
                              </Tooltip>
                            </td>
                            
                            <td className="px-3 py-3 align-middle">
                              {statusUrl && (
                                <NavLink
                                  to={{ pathname: `/dashboard/${statusUrl}/${items.id}` }}
                                  state={{ items }}
                                  className="inline-flex justify-center"
                                >
                                  <button className="bg-[#0c0d52] text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
                                    View
                                  </button>
                                </NavLink>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={getColumnSpan()} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">No applications found</p>
                            <p className="text-gray-400 mt-1">Try adjusting your search or filter</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Card Layout */}
          <div className="block md:hidden space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#0c0d52] border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-medium">Loading applications...</p>
              </div>
            ) : (
              <>
                {filteredApplications.length > 0 ? (
                  filteredApplications.slice(Start, End).map((items, index) => {
                    const paymentDate = getPaymentDate(items);
                    return (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              {items.circle}
                            </span>
                            <div className="mt-2">
                              <span className="text-md text-gray-500">App No:</span>
                              <Tooltip text={items.application_no || ''}>
                                <div className="text-md font-semibold text-gray-900 truncate max-w-[200px]">
                                  {items.application_no}
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                          {statusUrl && (
                            <NavLink
                              to={{ pathname: `/dashboard/${statusUrl}/${items.id}` }}
                              state={{ items }}
                            >
                              <button className="bg-[#0c0d52] text-white px-4 py-2 rounded-md text-md font-medium hover:bg-blue-700 transition-colors duration-200">
                                View
                              </button>
                            </NavLink>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-md text-gray-500">Division</span>
                            <Tooltip text={items.division || ''}>
                              <div className="text-md font-medium text-gray-900 truncate">
                                {items.division}
                              </div>
                            </Tooltip>
                          </div>
                          
                          <div>
                            <span className="text-md text-gray-500">Firm Name</span>
                            <Tooltip text={items.consumer_name || ''}>
                              <div className="text-md font-medium text-gray-900 truncate">
                                {items.consumer_name}
                              </div>
                            </Tooltip>
                          </div>
                          
                          {/* Payment Date - Only show if column is visible */}
                          {showPaymentColumn && (
                            <div className="col-span-2 sm:col-span-1">
                              <span className="text-md text-gray-500">Payment Date</span>
                              <div className={`text-md font-medium ${paymentDate ? 'text-blue-600' : 'text-gray-400'}`}>
                                {paymentDate || '—'}
                              </div>
                            </div>
                          )}
                          
                          <div className="col-span-2">
                            <span className="text-xs text-gray-500">Load Change Type</span>
                            <Tooltip text={formatLoadChangeType(items.lc_type) || ''}>
                              <div className="text-xs font-medium text-gray-900 truncate">
                                {formatLoadChangeType(items.lc_type)}
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No applications found</p>
                    <p className="text-gray-400 mt-1">Try adjusting your search or filter</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredApplications.length > 0 && (
            <div className="mt-6">
              <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    disabled={currentPage === 0}
                    onClick={goToPrevPage}
                    className={`relative inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium ${
                      currentPage === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mx-4">
                      Page <span className="font-bold">{currentPage + 1}</span> of <span className="font-bold">{numOfPages}</span>
                    </span>
                  </div>
                  <button
                    disabled={currentPage === numOfPages - 1}
                    onClick={goToNextPage}
                    className={`relative ml-3 inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium ${
                      currentPage === numOfPages - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>

                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-semibold">{Start + 1}</span> to{' '}
                      <span className="font-semibold">
                        {End > itemsLength ? itemsLength : End}
                      </span>{' '}
                      of <span className="font-semibold">{itemsLength}</span> results
                    </p>
                  </div>

                  <div>
                    <ul className="flex items-center space-x-1">
                      <li>
                        <button
                          disabled={currentPage === 0}
                          onClick={goToPrevPage}
                          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                            currentPage === 0
                              ? 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
                              : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
                          }`}
                        >
                          ← Previous
                        </button>
                      </li>

                      <li className="flex items-center space-x-1">
                        {[...Array(numOfPages).keys()].map(n => (
                          <button
                            key={n}
                            onClick={() => handlePageChange(n)}
                            className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg min-w-[36px] justify-center ${
                              n === currentPage
                                ? 'z-10 bg-[#0c0d52] text-white border border-[#0c0d52]'
                                : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {n + 1}
                          </button>
                        ))}
                      </li>

                      <li>
                        <button
                          disabled={currentPage === numOfPages - 1}
                          onClick={goToNextPage}
                          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                            currentPage === numOfPages - 1
                              ? 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
                              : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
                          }`}
                        >
                          Next →
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
}