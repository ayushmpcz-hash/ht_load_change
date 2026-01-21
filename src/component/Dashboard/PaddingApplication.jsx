// import React, { use, useEffect, useState } from 'react';
// import { useLocation, NavLink, useParams } from 'react-router-dom';
// import { getDataForEmpToken } from '../../utils/handlePostApi.js';
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
// import Cookies from 'js-cookie';
// export default function PaddingApplication() {
//   const [pendingApplication, setPendingApplication] = useState([]);
//   const [applicationStatusName, setApplicationStatusName] = useState([]);
//   const [statusUrl, setStatusUrl] = useState();
//   const [currentPage, setCurrantPage] = useState(0);
//   const token = Cookies.get('accessToken');
//   console.log(token, 'token');

//   const location = useLocation();
//   const { application_no } = useParams();
//   const { emp_id, flag_id } = location.state || {};
//   useEffect(() => {
//     let fetchData = async () => {
//       let formData = {
//         employee_id: emp_id,
//         flag_id: flag_id,
//       };
//       let response = await getDataForEmpToken(
//         formData,
//         `${HT_LOAD_CHANGE_BASE}/get-applications-by-flag/`,
//         token
//       );
//       let result = await response.json();
//       console.log(result,'resultttt')
//       setPendingApplication(result.applications);
//       setApplicationStatusName(result.flag);
//       setStatusUrl(result.flag.name.split(' ').join('_'));
//     };
//     fetchData();
//   }, []);

//   let PageSize = 10;
//   let itemsLength = pendingApplication.length;
//   let numOfPages = Math.ceil(itemsLength / PageSize);
//   console.log(pendingApplication,'pending Application ');
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
//   return (
//     <>
//       <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//         <div className="card-header px-4 py-2 border-b border-gray-300">
//           <h2 className="text-lg font-bold capitalize ">{applicationStatusName.name}</h2>
//         </div>
//         <div className="card-body px-4 pb-4 pt-2">

//           <div className="tableinfo overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2">
//               <thead className="bg-[#0c0d52] text-white">
//                 <tr>
//                   <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[10%]">
//                     Application No
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[30%] max-w-[100px]">
//                     Firm Name
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
//                     Circle Name
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
//                     Division
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
//                     Type of change
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
//                     Load Change type
//                   </th>
//                   <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {pendingApplication.slice(Start, End).length > 0 ? (
//                   pendingApplication.slice(Start, End).map((items, index) => (
//                     <tr key={index} className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                       <td className="px-6 py-4 ">
//                         <div className="flex items-center">
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {items.application_no}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 ">
//                         <div className="text-sm text-gray-900 word-break">{items.consumer_name}</div>
//                       </td>
//                       <td className="px-6 py-4 ">
//                         <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
//                           {items.circle}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500 ">
//                         {items.division}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500 ">
//                         {items.type_of_change}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500 ">
//                         {items.lc_type}
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium text-left ">
//                         <NavLink
//                           to={{ pathname: `/dashboard/${statusUrl}/${items.id}` }}
//                           state={{ items }}
//                         >
//                           <button className="bg-[#0c0d52] text-white px-4 py-2 rounded text-sm hover:bg-[blue]">
//                             View Application
//                           </button>
//                         </NavLink>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
//                       No data found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div>
//             <nav class="Page navigation example mt-2 mb-5">
//               <ul className="flex items-center justify-end">
//                 <li>
//                   <button
//                     disabled={currentPage === 0}
//                     onClick={() => goToPrevPage()}
//                     className="border border-gray-300 p-2 rounded text-sm hover:bg-[#0c0d52] hover:text-white hover:border-white min-w-15"
//                   >
//                     Previous
//                   </button>
//                 </li>
//                 {[...Array(numOfPages).keys()].map(n => (
//                   <li key={n}>
//                     <button
//                       onClick={() => handlePageChange(n)}
//                       className={`border border-gray-300 p-2 rounded text-sm hover:bg-[#0c0d52] hover:text-white hover:border-white
//     ${n === currentPage ? 'bg-[#0c0d52] w-10 text-white' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}
//     dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
//                     >
//                       {n + 1}
//                     </button>
//                   </li>
//                 ))}
//                 <li>
//                   <button
//                     disabled={currentPage === numOfPages - 1}
//                     onClick={() => goToNextPage()}
//                     className="border border-gray-300 p-2 rounded text-sm hover:bg-[#0c0d52] hover:text-white hover:border-white min-w-15"
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

//new ui
import React, { useEffect, useState } from 'react';
import { useLocation, NavLink, useParams } from 'react-router-dom';
import { getDataForEmpToken } from '../../utils/handlePostApi.js';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setApplications } from "../../redux/slices/userSlice.js"

export default function PaddingApplication() {
  const [pendingApplication, setPendingApplication] = useState([]);
  const [applicationStatusName, setApplicationStatusName] = useState([]);
  const [statusUrl, setStatusUrl] = useState();
  const [currentPage, setCurrantPage] = useState(0);
  const [loading, setLoading] = useState(true);
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

  let PageSize = 10;
  let itemsLength = pendingApplication.length;
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
    // Replace underscores with spaces and add proper spacing
    return type.replace(/_/g, ' ');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold capitalize text-gray-800">
            {applicationStatusName.name || 'Applications'}
          </h2>
        </div>

        <div className="p-6">
          <div className="w-full">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-[#000080]">
                <tr>
                  <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Circle
                  </th>

                  <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Division
                  </th>

                  <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    App No
                  </th>
                  <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Firm Name
                  </th>

                  {/* <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Change Type
                  </th> */}
                  <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Load Change Type
                  </th>
                  <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#0c0d52] border-t-transparent mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredApplications.length > 0 ? (
                      filteredApplications.slice(Start, End).map((items, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">

                          <td className="px-4 py-3 align-middle">
                            <span className="inline-flex px-3 py-1.5 text-base font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[100px]" title={items.circle}>
                              {items.circle}
                            </span>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <div className="text-base text-gray-900 truncate max-w-[120px]" title={items.division}>
                              {items.division}
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <div className="text-base font-semibold text-gray-900 truncate max-w-[120px]" title={items.application_no}>
                              {items.application_no}
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <div className="text-base text-gray-900 truncate max-w-[160px]" title={items.consumer_name}>
                              {items.consumer_name}
                            </div>
                          </td>


                          {/* <td className="px-4 py-3 align-middle">
                            <div className="text-sm text-gray-900 truncate max-w-[140px]" title={items.type_of_change}>
                              {items.type_of_change ? items.type_of_change.replace(/_/g, ' ') : 'N/A'}
                            </div>
                          </td> */}

                          <td className="px-4 py-3 align-middle">
                            <div className="text-base text-gray-900 break-words max-w-[180px] min-w-[150px]" title={items.lc_type}>
                              {formatLoadChangeType(items.lc_type)}
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            {statusUrl && (
                              <NavLink
                                to={{ pathname: `/dashboard/${statusUrl}/${items.id}` }}
                                state={{ items }}
                                className="inline-flex justify-center"
                              >
                                <button className="bg-[#0c0d52] text-white px-3 py-1.5 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
                                  View
                                </button>
                              </NavLink>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
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

          {!loading && filteredApplications.length > 0 && (
            <div className="mt-6">
              <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    disabled={currentPage === 0}
                    onClick={goToPrevPage}
                    className={`relative inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium ${currentPage === 0
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
                    className={`relative ml-3 inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium ${currentPage === numOfPages - 1
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
                          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${currentPage === 0
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
                            className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg min-w-[36px] justify-center ${n === currentPage
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
                          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${currentPage === numOfPages - 1
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