// //old ui without installment 
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
                    Consumer No
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
                                <div className="text-sm text-gray-900 truncate max-w-[150px]">
                                  {items.consumer_id}
                                </div>                             
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



//new ui with installment features
// import React, { useEffect, useState } from 'react';
// import { useLocation, NavLink, useParams } from 'react-router-dom';
// // import { getDataForEmpToken, postDataForEmpToken } from '../../utils/handlePostApi.js';
// import { getDataForEmpToken } from '../../utils/handlePostApi.js';
// import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
// import Cookies from 'js-cookie';
// import { useDispatch, useSelector } from 'react-redux';
// import { setApplications } from "../../redux/slices/userSlice.js"

// // Tooltip Component
// const Tooltip = ({ children, text, className = "" }) => {
//   const [show, setShow] = useState(false);

//   return (
//     <div className={`relative inline-block ${className}`}>
//       <div
//         onMouseEnter={() => setShow(true)}
//         onMouseLeave={() => setShow(false)}
//         className="cursor-default"
//       >
//         {children}
//       </div>
//       {show && (
//         <div className="absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-normal break-words max-w-xs bottom-full left-0 mb-2">
//           {text}
//           <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//         </div>
//       )}
//     </div>
//   );
// };

// // SD Installment Drawer Component - Fixed Version
// const SDInstallmentDrawer = ({ isOpen, onClose, application, onSuccess }) => {
//   const [sdAmount, setSdAmount] = useState(0);
//   const [installments, setInstallments] = useState([
//     { id: 1, amount: 0, type: 'demand_note', date: '', status: 'pending' },
//     { id: 2, amount: 0, type: 'upcoming_bill', date: '', status: 'pending' },
//     { id: 3, amount: 0, type: 'upcoming_bill', date: '', status: 'pending' }
//   ]);
//   const [otp, setOtp] = useState('');
//   const [showOtpInput, setShowOtpInput] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const token = Cookies.get('accessToken');
//   const user = JSON.parse(Cookies.get('user') || '{}');

//   // Prevent body scroll when drawer is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     if (application && application.tariff_charges) {
//       // CORRECT KEY: total_sd_required from the backend response
//       const sd = application.tariff_charges.total_sd_required || 
//                  application.tariff_charges.total_sd_days_amount || 0;
//       setSdAmount(sd);
      
//       if (sd > 0) {
//         const installmentAmount = Math.ceil(sd / 3);
//         const lastInstallment = sd - (installmentAmount * 2);
//         setInstallments([
//           { id: 1, amount: installmentAmount, type: 'demand_note', date: new Date().toISOString().split('T')[0], status: 'pending' },
//           { id: 2, amount: installmentAmount, type: 'upcoming_bill', date: '', status: 'pending' },
//           { id: 3, amount: lastInstallment > 0 ? lastInstallment : 0, type: 'upcoming_bill', date: '', status: 'pending' }
//         ]);
//       } else {
//         setInstallments([
//           { id: 1, amount: 0, type: 'demand_note', date: new Date().toISOString().split('T')[0], status: 'pending' },
//           { id: 2, amount: 0, type: 'upcoming_bill', date: '', status: 'pending' },
//           { id: 3, amount: 0, type: 'upcoming_bill', date: '', status: 'pending' }
//         ]);
//       }
//     }
//   }, [application]);

//   const handleInstallmentChange = (id, field, value) => {
//     setInstallments(prev => prev.map(inst => 
//       inst.id === id ? { ...inst, [field]: value } : inst
//     ));
//   };

//   const handleSendOtp = async () => {
//     setError('');
//     setLoading(true);
//     try {
//       const formData = {
//         application_id: application.id,
//         mobile_number: user.mobile_no || user.cug_mobile,
//         purpose: 'sd_installment_verification'
//       };
      
//       const response = await postDataForEmpToken(
//         formData,
//         `${HT_LOAD_CHANGE_BASE}/send-sd-installment-otp/`,
//         token
//       );
//       const result = await response.json();
      
//       if (result.success) {
//         setShowOtpInput(true);
//         setSuccess('OTP sent successfully to registered mobile number');
//         setTimeout(() => setSuccess(''), 3000);
//       } else {
//         setError(result.message || 'Failed to send OTP');
//       }
//     } catch (err) {
//       setError('Failed to send OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     for (let inst of installments) {
//       if (inst.type === 'upcoming_bill' && !inst.date) {
//         setError(`Please select a date for installment ${inst.id}`);
//         return;
//       }
//     }
    
//     setError('');
//     setLoading(true);
    
//     try {
//       const formData = {
//         application_id: application.id,
//         total_sd_amount: sdAmount,
//         installments: installments,
//         otp: otp,
//         verified_by: user.id,
//         verified_by_name: user.employee_name
//       };
      
//       const response = await postDataForEmpToken(
//         formData,
//         `${HT_LOAD_CHANGE_BASE}/submit-sd-installment/`,
//         token
//       );
//       const result = await response.json();
      
//       if (result.success) {
//         setSuccess('SD Installment plan created successfully!');
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//         }, 2000);
//       } else {
//         setError(result.message || 'Failed to create installment plan');
//       }
//     } catch (err) {
//       setError('Failed to submit. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Backdrop - only covers the main content */}
//       <div 
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//         style={{ 
//           zIndex: 9998,
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)'
//         }}
//         onClick={onClose}
//       />
      
//       {/* Drawer */}
//       <div 
//         className="fixed right-0 top-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
//         style={{ 
//           zIndex: 9999,
//           position: 'fixed',
//           top: 0,
//           right: 0,
//           bottom: 0,
//           width: '100%',
//           maxWidth: '32rem'
//         }}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="sticky top-0 px-6 py-4 bg-[#000080] text-white flex justify-between items-center">
//             <div>
//               <h2 className="text-xl font-semibold">SD Installment Plan</h2>
//               <p className="text-sm opacity-90 mt-1">Application: {application?.application_no}</p>
//             </div>
//             <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Body */}
//           <div className="flex-1 px-6 py-6">
//             {error && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                 {error}
//               </div>
//             )}
//             {success && (
//               <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
//                 {success}
//               </div>
//             )}

//             {/* Application Details */}
//             <div className="bg-gray-50 rounded-lg p-4 mb-6">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3">Application Details</h3>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <span className="text-gray-500">Firm Name:</span>
//                   <p className="font-medium text-gray-900">{application?.consumer_name}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Consumer No:</span>
//                   <p className="font-medium text-gray-900">{application?.consumer_no}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Total SD Amount:</span>
//                   <p className="font-semibold text-blue-600 text-lg">₹{sdAmount.toLocaleString()}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Load Change Type:</span>
//                   <p className="font-medium text-gray-900">{application?.lc_type?.replace(/_/g, ' ')}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Installment Details */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Installment Breakdown</h3>
//               <div className="space-y-4">
//                 {installments.map((installment, idx) => (
//                   <div key={installment.id} className="border border-gray-200 rounded-lg p-4 bg-white">
//                     <div className="flex items-center justify-between mb-3">
//                       <h4 className="font-semibold text-gray-800">
//                         Installment {idx + 1}
//                         {installment.type === 'demand_note' && (
//                           <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">1st Demand Note</span>
//                         )}
//                         {installment.type === 'upcoming_bill' && (
//                           <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Upcoming Bill</span>
//                         )}
//                       </h4>
//                       <span className="text-sm font-semibold text-blue-600">₹{installment.amount.toLocaleString()}</span>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
//                         <input
//                           type="number"
//                           value={installment.amount}
//                           onChange={(e) => handleInstallmentChange(installment.id, 'amount', parseInt(e.target.value) || 0)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-sm"
//                         />
//                       </div>
                      
//                       {installment.type === 'upcoming_bill' && (
//                         <div>
//                           <label className="block text-xs text-gray-500 mb-1">Select Bill Month</label>
//                           <input
//                             type="month"
//                             value={installment.date}
//                             onChange={(e) => handleInstallmentChange(installment.id, 'date', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-sm"
//                           />
//                           <p className="text-xs text-gray-400 mt-1">Select the bill month for this installment</p>
//                         </div>
//                       )}
                      
//                       {installment.type === 'demand_note' && (
//                         <div>
//                           <label className="block text-xs text-gray-500 mb-1">Demand Note Date</label>
//                           <input
//                             type="date"
//                             value={installment.date}
//                             onChange={(e) => handleInstallmentChange(installment.id, 'date', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-sm"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-xs text-yellow-800">
//                   ℹ️ First installment will be added to the first demand note. 
//                   Remaining two installments will be adjusted in upcoming bills.
//                 </p>
//               </div>
//             </div>

//             {/* OTP Section */}
//             <div className="border-t border-gray-200 pt-6 pb-8">
//               {!showOtpInput ? (
//                 <button
//                   onClick={handleSendOtp}
//                   disabled={loading}
//                   className="w-full bg-[#000080] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? 'Sending OTP...' : 'Send OTP for Verification'}
//                 </button>
//               ) : (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
//                     <input
//                       type="text"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                       placeholder="Enter 6-digit OTP"
//                       maxLength="6"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-center text-lg tracking-wider"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">OTP has been sent to registered mobile number</p>
//                   </div>
                  
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setShowOtpInput(false)}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                     >
//                       Back
//                     </button>
//                     <button
//                       onClick={handleSubmit}
//                       disabled={loading || otp.length !== 6}
//                       className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? 'Submitting...' : 'Submit & Create Plan'}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // pending application tables 
// export default function PaddingApplication() {
//   const [mobileNo, setMobileNo] = useState('');
//   const [pendingApplication, setPendingApplication] = useState([]);
//   const [applicationStatusName, setApplicationStatusName] = useState([]);
//   const [statusUrl, setStatusUrl] = useState();
//   const [currentPage, setCurrantPage] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [showPaymentColumn, setShowPaymentColumn] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const token = Cookies.get('accessToken');
//   const user = JSON.parse(Cookies.get('user') || '{}');
//   // Check if user has GM role
//   const officerData = useSelector(state => state.user.officerData);
//   const isGM = officerData?.employee_detail.role === 3;
//   const isRegistrationFeeFlag =
//   applicationStatusName?.name === 'pending for registration fee payment';
//   const dispatch = useDispatch();
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
//     if (officerData?.employee_detail?.cug_mobile) {
//       setMobileNo(officerData.employee_detail.cug_mobile);
//     }
//   }, [officerData]);

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

//         // Check if any application has bank_response with transaction_date (successful transaction)
//         const hasPaymentDate = result.applications?.some(app => {
//           if (app.bank_response && app.bank_response.transaction_date) {
//             const isSuccessful = app.bank_response.auth_status === '0300' ||
//               app.bank_response.transaction_error_type === 'success';
//             return isSuccessful;
//           }
//           return false;
//         });

//         setShowPaymentColumn(hasPaymentDate);

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

//   // Check if application has tariff_charges data with valid SD amount
//   const hasTariffCharges = (app) => {
//     return app.tariff_charges && 
//            app.tariff_charges.total_sd_required > 0;
//   };

//   // Get Payment Date - ONLY from bank_response.transaction_date
//   const getPaymentDate = (app) => {
//     if (app.bank_response && app.bank_response.transaction_date) {
//       const isSuccessful = app.bank_response.auth_status === '0300' ||
//         app.bank_response.transaction_error_type === 'success';

//       if (isSuccessful) {
//         return formatDate(app.bank_response.transaction_date.split('T')[0]);
//       }
//     }
//     return null;
//   };

//   // Format date to DD-MM-YYYY
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const [year, month, day] = dateString.split('-');
//     return `${day}-${month}-${year}`;
//   };

//   let PageSize = 10;
//   let itemsLength = filteredApplications.length;
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
//     return type.replace(/_/g, ' ');
//   };

//   // Determine column span based on payment column visibility and GM role
//   const getColumnSpan = () => {
//     let baseSpan = showPaymentColumn ? 7 : 6;
//     if (isGM && isRegistrationFeeFlag) baseSpan += 1; // Add one more column for SD Installment button
//     return baseSpan;
//   };

//   const handleOpenDrawer = (application) => {
//     setSelectedApplication(application);
//     setIsDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setIsDrawerOpen(false);
//     setSelectedApplication(null);
//   };

//   const handleInstallmentSuccess = () => {
//     // Refresh data or show success message
//     alert('SD Installment plan created successfully!');
//   };

//   return (
//     <>
//       <div className="bg-white rounded-lg shadow-md w-full">
//         <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg sm:text-xl font-bold capitalize text-gray-800">
//             {applicationStatusName.name || 'Applications'}
//           </h2>
//         </div>

//         <div className="p-3 sm:p-4 md:p-6">
//           {/* Desktop/Tablet View */}
//           <div className="hidden md:block w-full overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-[#000080]">
//                 <tr>
//                   <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Circle
//                   </th>
//                   <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Division
//                   </th>
//                   <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     App No
//                   </th>
//                   <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Firm Name
//                   </th>
//                   {showPaymentColumn && (
//                     <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                       Payment Date
//                     </th>
//                   )}
//                   <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Load Change Type
//                   </th>
//                   <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                     Action
//                   </th>
//                   {isGM && isRegistrationFeeFlag && (
//                     <th className="px-3 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                       SD Installment
//                     </th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={getColumnSpan()} className="px-6 py-16 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#0c0d52] border-t-transparent mb-4"></div>
//                         <p className="text-gray-600 font-medium">Loading applications...</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   <>
//                     {filteredApplications.length > 0 ? (
//                       filteredApplications.slice(Start, End).map((items, index) => {
//                         const paymentDate = getPaymentDate(items);
//                         const hasTariff = hasTariffCharges(items);
//                         return (
//                           <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
//                             <td className="px-3 py-3 align-middle">
//                               <span className="inline-flex px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[100px]" title={items.circle}>
//                                 {items.circle}
//                               </span>
//                             </td>
//                             <td className="px-3 py-3 align-middle">
//                               <Tooltip text={items.division || ''}>
//                                 <div className="text-sm text-gray-900 truncate max-w-[120px]">
//                                   {items.division}
//                                 </div>
//                               </Tooltip>
//                             </td>
//                             <td className="px-3 py-3 align-middle">
//                               <Tooltip text={items.application_no || ''}>
//                                 <div className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
//                                   {items.application_no}
//                                 </div>
//                               </Tooltip>
//                             </td>
//                             <td className="px-3 py-3 align-middle">
//                               <Tooltip text={items.consumer_name || ''}>
//                                 <div className="text-sm text-gray-900 truncate max-w-[150px]">
//                                   {items.consumer_name}
//                                 </div>
//                               </Tooltip>
//                             </td>
//                             {showPaymentColumn && (
//                               <td className="px-3 py-3 align-middle">
//                                 {paymentDate ? (
//                                   <div className="text-sm font-medium text-blue-600 whitespace-nowrap">
//                                     {paymentDate}
//                                   </div>
//                                 ) : (
//                                   <span className="text-sm text-gray-400">—</span>
//                                 )}
//                                </td>
//                             )}
//                             <td className="px-3 py-3 align-middle">
//                               <Tooltip text={formatLoadChangeType(items.lc_type) || ''}>
//                                 <div className="text-sm text-gray-900 truncate max-w-[150px]">
//                                   {formatLoadChangeType(items.lc_type)}
//                                 </div>
//                               </Tooltip>
//                              </td>
//                             <td className="px-3 py-3 align-middle">
//                               {statusUrl && (
//                                 <NavLink
//                                   to={{ pathname: `/dashboard/${statusUrl}/${items.id}` }}
//                                   state={{ items }}
//                                   className="inline-flex justify-center"
//                                 >
//                                   <button className="bg-[#0c0d52] text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
//                                     View
//                                   </button>
//                                 </NavLink>
//                               )}
//                              </td>
//                             {isGM && isRegistrationFeeFlag && (
//                               <td className="px-3 py-3 align-middle">
//                                 {hasTariff ? (
//                                   <button
//                                     onClick={() => handleOpenDrawer(items)}
//                                     className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200 whitespace-nowrap"
//                                   >
//                                     SD EMI
//                                   </button>
//                                 ) : (
//                                   <Tooltip text="Please calculate tariff charges first before applying for SD installment">
//                                     <button className="bg-gray-300 text-gray-500 px-3 py-1.5 rounded-md text-sm font-medium cursor-not-allowed whitespace-nowrap">
//                                       SD EMI
//                                     </button>
//                                   </Tooltip>
//                                 )}
//                                </td>
//                             )}
//                            </tr>
//                         );
//                       })
//                     ) : (
//                       <tr>
//                         <td colSpan={getColumnSpan()} className="px-6 py-12 text-center">
//                           <div className="flex flex-col items-center justify-center">
//                             <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                             </svg>
//                             <p className="text-gray-500 text-lg font-medium">No applications found</p>
//                             <p className="text-gray-400 mt-1">Try adjusting your search or filter</p>
//                           </div>
//                          </td>
//                        </tr>
//                     )}
//                   </>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile View - Card Layout */}
//           <div className="block md:hidden space-y-4">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-16">
//                 <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#0c0d52] border-t-transparent mb-4"></div>
//                 <p className="text-gray-600 font-medium">Loading applications...</p>
//               </div>
//             ) : (
//               <>
//                 {filteredApplications.length > 0 ? (
//                   filteredApplications.slice(Start, End).map((items, index) => {
//                     const paymentDate = getPaymentDate(items);
//                     const hasTariff = hasTariffCharges(items);
//                     return (
//                       <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
//                         <div className="flex justify-between items-start mb-3">
//                           <div>
//                             <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
//                               {items.circle}
//                             </span>
//                             <div className="mt-2">
//                               <span className="text-md text-gray-500">App No:</span>
//                               <Tooltip text={items.application_no || ''}>
//                                 <div className="text-md font-semibold text-gray-900 truncate max-w-[200px]">
//                                   {items.application_no}
//                                 </div>
//                               </Tooltip>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             {statusUrl && (
//                               <NavLink
//                                 to={{ pathname: `/dashboard/${statusUrl}/${items.id}` }}
//                                 state={{ items }}
//                               >
//                                 <button className="bg-[#0c0d52] text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
//                                   View
//                                 </button>
//                               </NavLink>
//                             )}
//                             {isGM && isRegistrationFeeFlag && (
//                               hasTariff ? (
//                                 <button
//                                   onClick={() => handleOpenDrawer(items)}
//                                   className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
//                                 >
//                                   SD EMI
//                                 </button>
//                               ) : (
//                                 <Tooltip text="Please calculate tariff charges first before applying for SD installment">
//                                   <button className="bg-gray-300 text-gray-500 px-3 py-1.5 rounded-md text-sm font-medium cursor-not-allowed">
//                                     SD EMI
//                                   </button>
//                                 </Tooltip>
//                               )
//                             )}
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-3">
//                           <div>
//                             <span className="text-md text-gray-500">Division</span>
//                             <Tooltip text={items.division || ''}>
//                               <div className="text-md font-medium text-gray-900 truncate">
//                                 {items.division}
//                               </div>
//                             </Tooltip>
//                           </div>

//                           <div>
//                             <span className="text-md text-gray-500">Firm Name</span>
//                             <Tooltip text={items.consumer_name || ''}>
//                               <div className="text-md font-medium text-gray-900 truncate">
//                                 {items.consumer_name}
//                               </div>
//                             </Tooltip>
//                           </div>

//                           {showPaymentColumn && (
//                             <div className="col-span-2 sm:col-span-1">
//                               <span className="text-md text-gray-500">Payment Date</span>
//                               <div className={`text-md font-medium ${paymentDate ? 'text-blue-600' : 'text-gray-400'}`}>
//                                 {paymentDate || '—'}
//                               </div>
//                             </div>
//                           )}

//                           <div className="col-span-2">
//                             <span className="text-xs text-gray-500">Load Change Type</span>
//                             <Tooltip text={formatLoadChangeType(items.lc_type) || ''}>
//                               <div className="text-xs font-medium text-gray-900 truncate">
//                                 {formatLoadChangeType(items.lc_type)}
//                               </div>
//                             </Tooltip>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="flex flex-col items-center justify-center py-12">
//                     <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//                     </svg>
//                     <p className="text-gray-500 text-lg font-medium">No applications found</p>
//                     <p className="text-gray-400 mt-1">Try adjusting your search or filter</p>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Pagination */}
//           {!loading && filteredApplications.length > 0 && (
//             <div className="mt-6">
//               <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-4 sm:px-6">
//                 <div className="flex flex-1 justify-between sm:hidden">
//                   <button
//                     disabled={currentPage === 0}
//                     onClick={goToPrevPage}
//                     className={`relative inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium ${currentPage === 0
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
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
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
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
//                               ? 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
//                               : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
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
//                                 ? 'z-10 bg-[#0c0d52] text-white border border-[#0c0d52]'
//                                 : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
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
//                               ? 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
//                               : 'text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
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

//       {/* SD Installment Drawer */}
//       <SDInstallmentDrawer
//         isOpen={isDrawerOpen}
//         onClose={handleCloseDrawer}
//         application={selectedApplication}
//         onSuccess={handleInstallmentSuccess}
//       />
//     </>
//   );
// }
