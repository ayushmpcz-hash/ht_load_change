// import React, { useRef, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';

// const ApplicantStatus = () => {
//   const loadingRef = useRef();
//   const [statusUrl, setStatusUrl] = useState("");
// const { loginUser } = useSelector(state => state.user) || {};
// const items = loginUser?.data;

//  if(!loginUser || !loginUser?.data)  {
//     // Handle case when no user data exists
//     return (
//       <div className="card mt-2 mb-2 bg-white rounded shadow-md p-4">
//         <div className="text-center py-8">
//           <p className="text-gray-500">No user data found</p>
//         </div>
//       </div>
//     );
//   }



//   useEffect(() => {
//     if (items?.application_status_text) {
//       setStatusUrl(items.application_status_text.split(" ").join("_"));
//     }
//   }, [items?.application_status_text]);

//   useEffect(() => {
//     if (loadingRef.current) {
//       loadingRef.current.classList.add('hidden');
//     }
//   }, []);

//   // Format Load Change Type for better display
//   const formatLoadChangeType = (type) => {
//     if (!type) return 'N/A';
//     // Replace underscores with spaces and add proper spacing
//     return type.replace(/_/g, ' ');
//   };

//   console.log(items, 'items inside application');

//   return (
//     <div className="card mt-2 mb-2 bg-white rounded-lg shadow-md">
//       <div className="card-header px-6 py-4 border-b border-gray-300">
//         <h2 className="text-xl font-bold capitalize text-gray-800">
//           Successfully logged in: {items?.consumer_name}
//         </h2>
//       </div>

//       <div className="card-body px-6 pb-6 pt-4">
//         <div className="w-full">
//           <table className="w-full divide-y divide-gray-200">
//             <thead className="bg-[#000080]">
//               <tr>
//                 <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                   App No
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                   Firm Name
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                   Circle
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                   Change Type
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                   Load Change Type
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                   Status
//                 </th>
//                 <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y divide-gray-200">
//               <tr key={0} className="hover:bg-gray-50 transition-colors duration-150">
//                 <td className="px-4 py-3 align-middle">
//                   <div className="text-sm font-semibold text-gray-900 truncate max-w-[120px]" title={items?.application_no}>
//                     {items?.application_no}
//                   </div>
//                 </td>

//                 <td className="px-4 py-3 align-middle">
//                   <div className="text-sm text-gray-900 truncate max-w-[160px]" title={items?.consumer_name}>
//                     {items?.consumer_name}
//                   </div>
//                 </td>

//                 <td className="px-4 py-3 align-middle">
//                   <span className="inline-flex px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[100px]" title={items?.circle}>
//                     {items?.circle}
//                   </span>
//                 </td>

//                 <td className="px-4 py-3 align-middle">
//                   <div className="text-sm text-gray-900 truncate max-w-[140px]" title={items?.type_of_change}>
//                     {items?.type_of_change ? items.type_of_change.replace(/_/g, ' ') : 'N/A'}
//                   </div>
//                 </td>

//                 <td className="px-4 py-3 align-middle">
//                   <div className="text-sm text-gray-900 break-words max-w-[180px] min-w-[150px]" title={items?.lc_type}>
//                     {formatLoadChangeType(items?.lc_type)}
//                   </div>
//                 </td>

//                 <td className="px-4 py-3 align-middle">
//                   <span className="inline-flex px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[220px]" title={items?.application_status_text}>
//                     {items?.application_status_text}
//                   </span>
//                 </td>

//                 <td className="px-4 py-3 align-middle">
//                   {items?.application_status === 1 || 
//                    items?.application_status === 2 || 
//                    items?.application_status === 9 ? (
//                     <NavLink 
//                       to={{ 
//                         pathname: `/user-dashboard/${statusUrl}/${items?.id}`, 
//                       }} 
//                       state={{ items }}
//                       className="inline-flex justify-center"
//                     >
//                       <button className="bg-[#0c0d52] text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
//                         View
//                       </button>
//                     </NavLink>
//                   ) : (
//                     <button 
//                       className="bg-gray-400 text-white px-3 py-1.5 rounded-md text-xs font-medium cursor-not-allowed whitespace-nowrap"
//                       disabled
//                     >
//                       View
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Additional Information Section */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Application Details</h3>
//             <div className="space-y-1 text-sm text-gray-600">
//               <p><span className="font-medium">Application No:</span> {items?.application_no || 'N/A'}</p>
//               <p><span className="font-medium">Consumer ID:</span> {items?.consumer_id || 'N/A'}</p>
//               <p><span className="font-medium">Connection Date:</span> {items?.connection_date || 'N/A'}</p>
//               <p><span className="font-medium">Email:</span> {items?.email || 'N/A'}</p>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Load Details</h3>
//             <div className="space-y-1 text-sm text-gray-600">
//               <p><span className="font-medium">Load Change Type:</span> {formatLoadChangeType(items?.lc_type)}</p>
//               <p><span className="font-medium">Change Type:</span> {items?.type_of_change ? items.type_of_change.replace(/_/g, ' ') : 'N/A'}</p>
//               <p><span className="font-medium">Existing Contract Demand:</span> {items?.existing_contract_demand || 'N/A'} kW</p>
//               <p><span className="font-medium">New Contract Demand:</span> {items?.new_contact_demand || 'N/A'} kW</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplicantStatus;

import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setLoginUser } from "../../../redux/slices/userSlice";
import { NavLink } from 'react-router-dom';
// import { useSelector } from "react-redux";

const ApplicantStatus = () => {
  const loadingRef = useRef();
  const [statusUrl, setStatusUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");


  const dispatch = useDispatch()

  useEffect(() => {
    const savedUser = localStorage.getItem("loginUser");
    if (savedUser) {
      dispatch(setLoginUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
    const savedUser = localStorage.getItem("loginUser");
    if (savedUser) {
      dispatch(setLoginUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  const { loginUser } = useSelector(state => state.user) || {};
  const items = loginUser?.data;

  // useEffect(() => {
  //   if (items?.application_status_text) {
  //     setStatusUrl(items.application_status_text.split(" ").join("_"));
  //   }

  //   // Determine status message based on user data
  //   if (items?.is_regfee_submitted_bypg === null && !items?.tariff_charges) {
  //     setStatusMessage("Pending for application submission");
  //   } else if (items?.is_regfee_submitted_bypg === null) {
  //     setStatusMessage("Pending for registration fee payment");
  //   } else {
  //     setStatusMessage(items?.application_status_text || "Status not available");
  //   }
  // }, [items]);

  useEffect(() => {
  if (items?.application_status_text) {
    setStatusUrl(items.application_status_text.split(" ").join("_"));
  }

  const isRegistrationFeePaid =
    items?.is_regfee_submitted === true ||
    items?.is_regfee_submitted_bypg === true;

  if (!items?.tariff_charges && !isRegistrationFeePaid) {
    setStatusMessage("Pending for application submission");
  } 
  else if (!isRegistrationFeePaid) {
    setStatusMessage("Pending for registration fee payment");
  } 
  else {
    setStatusMessage(items?.application_status_text || "Status not available");
  }
}, [items]);


  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.classList.add('hidden');
    }
  }, []);

  // Format Load Change Type for better display
  const formatLoadChangeType = (type) => {
    if (!type) return 'N/A';
    return type.replace(/_/g, ' ');
  };

  // Format meter details
  const formatMeterDetails = () => {
    const meterDetails = [];
    if (items?.meter_no) meterDetails.push(`Meter No: ${items.meter_no}`);
    if (items?.meter_type) meterDetails.push(`Type: ${items.meter_type}`);
    if (items?.meter_make) meterDetails.push(`Make: ${items.meter_make}`);
    return meterDetails.length > 0 ? meterDetails.join(", ") : "N/A";
  };

  // Get status badge color based on status
  const getStatusBadgeColor = (statusText) => {
    const status = statusText?.toLowerCase();
    if (status?.includes('pending')) return 'bg-yellow-100 text-yellow-800';
    if (status?.includes('approved') || status?.includes('completed')) return 'bg-green-100 text-green-800';
    if (status?.includes('rejected') || status?.includes('failed')) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  console.log(items, 'items inside application');

  return (
    <div className="card mt-2 mb-2 bg-white rounded-lg shadow-md">
      <div className="card-header px-6 py-4 border-b border-gray-300">
        <h2 className="text-xl font-bold capitalize text-gray-800">
          Successfully logged in: {items?.consumer_name}
        </h2>
      </div>

      <div className="card-body px-6 pb-6 pt-4">
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
                  Status
                </th>
                <th className="px-4 py-3 text-md font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              <tr key={0} className="hover:bg-gray-50 transition-colors duration-150">

                <td className="px-4 py-3 align-middle">
                  <span className="inline-flex px-3 py-1.5 text-base font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[100px]" title={items?.circle}>
                    {items?.circle}
                  </span>
                </td>

                <td className="px-4 py-3 align-middle">
                  <span className="inline-flex px-3 py-1.5 text-base font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[100px]" title={items?.circle}>
                    {items?.division}
                  </span>
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="text-base font-semibold text-gray-900 truncate max-w-[120px]" title={items?.application_no}>
                    {items?.application_no}
                  </div>
                </td>

                <td className="px-4 py-3 align-middle">
                  <div className="text-base text-gray-900 truncate max-w-[160px]" title={items?.consumer_name}>
                    {items?.consumer_name}
                  </div>
                </td>

                {/* <td className="px-4 py-3 align-middle">
                  <div className="text-base text-gray-900 truncate max-w-[140px]" title={items?.type_of_change}>
                    {items?.type_of_change ? items.type_of_change.replace(/_/g, ' ') : 'N/A'}
                  </div>
                </td> */}

                <td className="px-4 py-3 align-middle">
                  <div className="text-sm text-gray-900 break-words max-w-[180px] min-w-[150px]" title={items?.lc_type}>
                    {formatLoadChangeType(items?.lc_type)}
                  </div>
                </td>

                <td className="px-4 py-3 align-middle">
                  <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full truncate max-w-[220px] ${getStatusBadgeColor(statusMessage)}`} title={statusMessage}>
                    {statusMessage}
                  </span>
                </td>

                <td className="px-4 py-3 align-middle">
                  {items?.application_status === 1 ||
                    items?.application_status === 2 ||
                    items?.application_status === 9 ? (
                    <NavLink
                      to={{
                        pathname: `/user-dashboard/${statusUrl}/${items?.id}`,
                      }}
                      state={{ items }}
                      className="inline-flex justify-center"
                    >
                      <button className="bg-[#0c0d52] text-white px-3 py-1.5 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
                        View
                      </button>
                    </NavLink>
                  ) : (
                    <button
                      className="bg-gray-400 text-white px-3 py-1.5 rounded-md text-base font-medium cursor-not-allowed whitespace-nowrap"
                      disabled
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Load Details Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4 border-b pb-2">Load Enhancement Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-base text-gray-800">Existing Contract Demand</p>
                <p className="text-sm font-medium">{items?.existing_contract_demand || 'N/A'} kW</p>
              </div>
              <div>
                <p className="text-base text-gray-800">Existing Supply Voltage</p>
                <p className="text-sm font-medium">{items?.existing_supply_voltage || 'N/A'}</p>
              </div>
              <div>
                <p className="text-base text-gray-800">Contract Demand Difference</p>
                <p className="text-sm font-medium">{items?.contract_demand_difference || 'N/A'} kW</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-base text-gray-800">New Contract Demand</p>
                <p className="text-sm font-medium">{items?.new_contact_demand || 'N/A'} kW</p>
              </div>
              <div>
                <p className="text-base text-gray-800">New Supply Voltage</p>
                <p className="text-sm font-medium">{items?.new_supply_voltage || 'N/A'}</p>
              </div>
              <div>
                <p className="text-base text-gray-800">Feeder Name</p>
                <p className="text-sm font-medium">{items?.feeder_name || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-base text-gray-800">Connection Purpose</p>
                <p className="text-sm font-medium">{items?.connection_sub_category || items?.purpose_of_installation_details || 'N/A'}</p>
              </div>
              <div>
                <p className="text-base text-gray-800">Connection Category</p>
                <p className="text-sm font-medium">{items?.connection_category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-base text-gray-800">Connection Type</p>
                <p className="text-sm font-medium">{items?.connection_type || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional User Information Section */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-base text-gray-800">Address</p>
                <p className="text-sm font-medium break-words">{items?.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-base text-gray-800">PAN Card No</p>
                <p className="text-sm font-medium">{items?.pan_card_no || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-base text-gray-800">Mobile Number</p>
                <p className="text-sm font-medium">{items?.mobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-base text-gray-800">Email Address</p>
                <p className="text-sm font-medium truncate">{items?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-base text-gray-800">Account Holder Name</p>
                <p className="text-sm font-medium">{items?.ac_holder_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-base text-gray-800">Bank Name</p>
                <p className="text-sm font-medium">{items?.bank_name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">Meter Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-md text-gray-800">Meter Information</p>
                <p className="text-sm font-medium truncate" title={formatMeterDetails()}>
                  {formatMeterDetails()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-base text-gray-800">CT Ratio</p>
                  <p className="text-sm font-medium">{items?.me_ct_ratio || items?.meter_ct_ratio || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-base text-gray-800">PT Ratio</p>
                  <p className="text-sm font-medium">{items?.me_pt_ratio || items?.meter_pt_ratio || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-base text-gray-800">Meter Accuracy</p>
                  <p className="text-sm font-medium">{items?.meter_accuracy || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-base text-gray-800">Multiplication Factor</p>
                  <p className="text-sm font-medium">{items?.mf || 'N/A'}</p>
                </div>
              </div>
              {items?.me_serial_no && (
                <div>
                  <p className="text-base text-gray-800">ME Serial No</p>
                  <p className="text-base font-medium">{items.me_serial_no}</p>
                </div>
              )}
            </div>
          </div>

          {/* Meter and Billing Details Section */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Current Billing Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-base text-gray-800">Current Bill ID</p>
                <p className="text-sm font-medium">{items?.current_bill_id || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-base text-gray-800">Bill Month</p>
                  <p className="text-sm font-medium">{items?.current_bill_month || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-base text-gray-800">Units Consumed</p>
                  <p className="text-sm font-medium">{items?.current_bill_units || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-base text-gray-800">Net Bill Amount</p>
                <p className="text-sm font-medium text-green-600">
                  ₹ {items?.current_net_bill_amt ? items.current_net_bill_amt.toLocaleString('en-IN') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplicantStatus;