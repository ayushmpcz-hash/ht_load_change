
// import React, { useRef, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Link, NavLink } from 'react-router-dom';

// const ApplicantStatus = () => {
//   const loadingRef = useRef();
//   const [statusUrl, setStatusUrl] = useState("")
//   const loginUser = useSelector(state => state.user.loginUser);
//   if (!loginUser.data) {

//   }
//   let items = loginUser.data




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
//   console.log(items,'itemss inside application')

//   return (

//     <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
//       <div className="card-header px-4 py-2 border-b border-gray-300">
//         <h2 className="text-lg font-bold capitalize ">Successfully login :{items?.consumer_name}</h2>
//       </div>
//       <div className="card-body px-4 pb-4 pt-2">
//         <div className="tableinfo overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2">
//             <thead className="bg-[#0c0d52] text-white">
//               <tr>
//                 <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[10%]">Application No</th>
//                 <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[20%]">firm Name</th>
//                 <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[10%]">Circle Name</th>
//                 <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[10%]">Type of change</th>
//                 <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[20%]">Load Change type</th>
//                 <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[20%]">Status</th>
//                 <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[10%]">Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">

//               <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {items?.application_no}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{items?.consumer_name}</div>

//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{items?.circle}</span>
//                 </td>

//                 <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{items?.type_of_change}</td>
//                 <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{items?.lc_type}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{items?.application_status_text}</span>
//                 </td>
//                 {items?.application_status === 1 ? (
//                   <td className="px-6 py-4  text-sm font-medium text-right whitespace-nowrap">
//                     <NavLink to={{ pathname: `/user-dashboard/${statusUrl}/${items?.id}`, }} state={{ items }}
//                     >
//                       <button className="bg-[#0c0d52] text-white px-4 py-2 rounded text-sm hover:bg-[blue]">
//                         View Application
//                       </button>
//                     </NavLink>
//                   </td>
//                 ) : items?.application_status === 2 ? (
//                   <td className="px-6 py-4  text-sm font-medium text-right whitespace-nowrap">
//                     <NavLink to={{ pathname: `/user-dashboard/${statusUrl}/${items?.id}`, }} state={{ items }}
//                     >
//                       <button className="bg-[#0c0d52] text-white px-4 py-2 rounded text-sm hover:bg-[blue]">
//                         View Application
//                       </button></NavLink>
//                   </td>


//                 ) : items?.application_status === 9 ? (
//                   <td className="px-6 py-4  text-sm font-medium text-right whitespace-nowrap">
//                     <NavLink to={{ pathname: `/user-dashboard/${statusUrl}/${items?.id}`, }} state={{ items }}
//                     >
//                       <button className="bg-[#0c0d52] text-white px-4 py-2 rounded text-sm hover:bg-[blue]">
//                         View Application
//                       </button></NavLink>
//                   </td>

//                 )
//                 //  : items?.application_status === 11 ? (
//                 //       <td className="px-6 py-4  text-sm font-medium text-right whitespace-nowrap">
//                 //     <NavLink to={{ pathname: `/user-dashboard/${statusUrl}/${items?.id}`, }} state={{ items }}
//                 //     >
//                 //       <button className="bg-[#0c0d52] text-white px-4 py-2 rounded text-sm hover:bg-[blue]">
//                 //         View Application
//                 //       </button></NavLink>
//                 //   </td>
//                 // )
//                 :(
//                   <td className="px-6 py-4  text-sm font-medium text-right whitespace-nowrap">

//                     <button className="bg-[#0c0d52] text-white px-4 py-2 rounded text-sm hover:bg-[blue]">
//                       View Application
//                     </button>
//                   </td>

//                 )}

//               </tr>

//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplicantStatus;

import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const ApplicantStatus = () => {
  const loadingRef = useRef();
  const [statusUrl, setStatusUrl] = useState("");
  const loginUser = useSelector(state => state.user.loginUser);
  
  if (!loginUser.data) {
    // Handle case when no user data exists
    return (
      <div className="card mt-2 mb-2 bg-white rounded shadow-md p-4">
        <div className="text-center py-8">
          <p className="text-gray-500">No user data found</p>
        </div>
      </div>
    );
  }
  
  let items = loginUser.data;

  useEffect(() => {
    if (items?.application_status_text) {
      setStatusUrl(items.application_status_text.split(" ").join("_"));
    }
  }, [items?.application_status_text]);

  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.classList.add('hidden');
    }
  }, []);
  
  // Format Load Change Type for better display
  const formatLoadChangeType = (type) => {
    if (!type) return 'N/A';
    // Replace underscores with spaces and add proper spacing
    return type.replace(/_/g, ' ');
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
                <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                  App No
                </th>
                <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                  Firm Name
                </th>
                <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                  Circle
                </th>
                <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                  Change Type
                </th>
                <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                  Load Change Type
                </th>
                <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium text-left text-white uppercase tracking-wider whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              <tr key={0} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 align-middle">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-[120px]" title={items?.application_no}>
                    {items?.application_no}
                  </div>
                </td>
                
                <td className="px-4 py-3 align-middle">
                  <div className="text-sm text-gray-900 truncate max-w-[160px]" title={items?.consumer_name}>
                    {items?.consumer_name}
                  </div>
                </td>
                
                <td className="px-4 py-3 align-middle">
                  <span className="inline-flex px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[100px]" title={items?.circle}>
                    {items?.circle}
                  </span>
                </td>
                
                <td className="px-4 py-3 align-middle">
                  <div className="text-sm text-gray-900 truncate max-w-[140px]" title={items?.type_of_change}>
                    {items?.type_of_change ? items.type_of_change.replace(/_/g, ' ') : 'N/A'}
                  </div>
                </td>
                
                <td className="px-4 py-3 align-middle">
                  <div className="text-sm text-gray-900 break-words max-w-[180px] min-w-[150px]" title={items?.lc_type}>
                    {formatLoadChangeType(items?.lc_type)}
                  </div>
                </td>
                
                <td className="px-4 py-3 align-middle">
                  <span className="inline-flex px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full truncate max-w-[220px]" title={items?.application_status_text}>
                    {items?.application_status_text}
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
                      <button className="bg-[#0c0d52] text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
                        View
                      </button>
                    </NavLink>
                  ) : (
                    <button 
                      className="bg-gray-400 text-white px-3 py-1.5 rounded-md text-xs font-medium cursor-not-allowed whitespace-nowrap"
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
        
        {/* Additional Information Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Application Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Application No:</span> {items?.application_no || 'N/A'}</p>
              <p><span className="font-medium">Consumer ID:</span> {items?.consumer_id || 'N/A'}</p>
              <p><span className="font-medium">Connection Date:</span> {items?.connection_date || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {items?.email || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Load Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Load Change Type:</span> {formatLoadChangeType(items?.lc_type)}</p>
              <p><span className="font-medium">Change Type:</span> {items?.type_of_change ? items.type_of_change.replace(/_/g, ' ') : 'N/A'}</p>
              <p><span className="font-medium">Existing Contract Demand:</span> {items?.existing_contract_demand || 'N/A'} kW</p>
              <p><span className="font-medium">New Contract Demand:</span> {items?.new_contact_demand || 'N/A'} kW</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantStatus;