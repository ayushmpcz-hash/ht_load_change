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
//  useEffect(() => {
//   const fetchData = async () => {
//     try {
//       let response = await fetch(
//         `${HT_LOAD_CHANGE_BASE}/connection-served-applications/`,
//         {
//           method: "POST", // POST call
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // only token pass
//           },
//         }
//       );

//       let result = await response.json();
//       console.log("API Result:", result);

//       setPendingApplication(result.applications);
//       // setApplicationStatusName(result.flag);
//       // setStatusUrl(result.flag.name.split(' ').join('_'));
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

//   fetchData();
// }, [token]);

//   let PageSize = 10;
//   let itemsLength = pendingApplication.length;
//   let numOfPages = Math.ceil(itemsLength / PageSize);
//   console.log(pendingApplication.length);
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
//                           to={{ pathname: `/dashboard/download/${items.id}` }}
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
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { HT_LOAD_CHANGE_BASE } from "../../api/api";

const DownloadAllPdf = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  
  // Consumer side statuses that need to be grouped
  const CONSUMER_SIDE_STATUSES = [
    "pending for application resubmission",
    "pending for registration fee payment",
    "pending for demand note payment"
  ];

  // Filter states
  const [filters, setFilters] = useState({
    circle: "",
    division: "",
    application_no: "",
    lc_type: "",
    consumer_name: "",
    application_status_text: "",
    dateFrom: "",
    dateTo: ""
  });

  // Dropdown options
  const [filterOptions, setFilterOptions] = useState({
    circles: [],
    divisions: [],
    lcTypes: [],
    statuses: []
  });

  const DOCUMENT_BASE_URL = "https://htsanyojan.mpcz.in:8089";
  const token = Cookies.get("accessToken");

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Remove "pending for" prefix from status
  const trimStatusText = (status) => {
    if (!status) return '';
    return status.replace(/^pending for\s+/i, '');
  };

  // Check if status is from consumer side
  const isConsumerSideStatus = (status) => {
    if (!status) return false;
    const statusLower = status.toLowerCase();
    return CONSUMER_SIDE_STATUSES.some(s => statusLower.includes(s));
  };

  // Get status color with different colors for consumer vs discom
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    if (isConsumerSideStatus(status)) {
      return 'bg-purple-100 text-purple-800'; // Consumer side status
    }
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800'; // Discom pending
    if (statusLower.includes('approved')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('rejected')) return 'bg-red-100 text-red-800';
    if (statusLower.includes('completed') || statusLower.includes('served')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Format LC type for display
  const formatLCType = (type) => {
    if (!type) return 'Load Change';
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Get all statuses including grouped consumer status and discom pending status
  const getAllStatusOptions = (apps) => {
    const allStatuses = [...new Set(apps.map(app => app.application_status_text).filter(Boolean))];
    
    // Check if we have any consumer side statuses
    const hasConsumerSide = allStatuses.some(s => 
      CONSUMER_SIDE_STATUSES.some(cs => s.toLowerCase().includes(cs))
    );
    
    // Check if we have any discom side statuses (all except consumer side)
    const hasDiscomSide = allStatuses.some(s => 
      !CONSUMER_SIDE_STATUSES.some(cs => s.toLowerCase().includes(cs))
    );
    
    const options = [];
    
    // Add grouped options
    if (hasConsumerSide) {
      options.push({ value: 'CONSUMER_SIDE_GROUP', label: '📱 Application from Consumer Side', isGroup: true });
    }
    
    if (hasDiscomSide) {
      options.push({ value: 'DISCOM_SIDE_GROUP', label: '⚡ Pending from Discom Side', isGroup: true });
    }
    
    // Add individual statuses
    options.push(...allStatuses.map(s => ({ value: s, label: s, isGroup: false })));
    
    return options;
  };

  // ================= API CALL =================
  const fetchAllDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${HT_LOAD_CHANGE_BASE}/api/application-documents/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const apps = data.data || [];
      setApplications(apps);
      setFilteredApplications(apps);
      
      // Extract filter options
      const circles = [...new Set(apps.map(app => app.circle).filter(Boolean))];
      const divisions = [...new Set(apps.map(app => app.division).filter(Boolean))];
      const lcTypes = [...new Set(apps.map(app => app.lc_type).filter(Boolean))];
      const statuses = getAllStatusOptions(apps);
      
      setFilterOptions({ circles, divisions, lcTypes, statuses });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...applications];

    // Text/Select filters
    if (filters.circle) {
      filtered = filtered.filter(app => app.circle === filters.circle);
    }
    if (filters.division) {
      filtered = filtered.filter(app => app.division === filters.division);
    }
    if (filters.application_no) {
      filtered = filtered.filter(app => 
        app.application_no?.toLowerCase().includes(filters.application_no.toLowerCase())
      );
    }
    if (filters.consumer_name) {
      filtered = filtered.filter(app => 
        app.consumer_name?.toLowerCase().includes(filters.consumer_name.toLowerCase())
      );
    }
    if (filters.lc_type) {
      filtered = filtered.filter(app => app.lc_type === filters.lc_type);
    }
    
    // Status filter with group handling
    if (filters.application_status_text) {
      if (filters.application_status_text === 'CONSUMER_SIDE_GROUP') {
        filtered = filtered.filter(app => 
          CONSUMER_SIDE_STATUSES.some(s => 
            app.application_status_text?.toLowerCase().includes(s)
          )
        );
      } else if (filters.application_status_text === 'DISCOM_SIDE_GROUP') {
        // Show all applications EXCEPT the consumer side statuses
        filtered = filtered.filter(app => 
          !CONSUMER_SIDE_STATUSES.some(s => 
            app.application_status_text?.toLowerCase().includes(s)
          )
        );
      } else {
        filtered = filtered.filter(app => app.application_status_text === filters.application_status_text);
      }
    }

    // Date range filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(app => {
        const appDate = new Date(app.application_date);
        return appDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(app => {
        const appDate = new Date(app.application_date);
        return appDate <= toDate;
      });
    }

    setFilteredApplications(filtered);
  }, [filters, applications]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      circle: "",
      division: "",
      application_no: "",
      lc_type: "",
      consumer_name: "",
      application_status_text: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getDocumentUrl = (fileUrl) => {
    if (!fileUrl) return null;
    return fileUrl.startsWith("http")
      ? fileUrl
      : `${DOCUMENT_BASE_URL}${fileUrl}`;
  };

  // Group documents by stage from the actual API response
  const getDocumentsByStage = (app) => {
    if (!app.documents || !Array.isArray(app.documents)) return [];
    return app.documents.map(stageGroup => ({
      stage: stageGroup.stage,
      files: stageGroup.files || []
    }));
  };

  // Get icon for stage
  const getStageIcon = (stage) => {
    const icons = {
      'ConsumerDetails': '📋',
      'Survey': '🔍',
      'HTLoadChangeLoadSanction': '📑',
      'BiCellResponse': '🔄',
      'AgreementDetails': '📝',
      'DemandNoteGeneration': '💰',
      'default': '📄'
    };
    return icons[stage] || icons.default;
  };

  // Get display name for stage
  const getStageDisplayName = (stage) => {
    const names = {
      'ConsumerDetails': 'Consumer Details',
      'Survey': 'Survey Documents',
      'HTLoadChangeLoadSanction': 'Load Sanction',
      'BiCellResponse': 'Bi-Cell Response',
      'AgreementDetails': 'Agreement Details',
      'DemandNoteGeneration': 'Demand Note'
    };
    return names[stage] || stage;
  };

  // Get display name for field
  const getFieldDisplayName = (fieldName) => {
    const names = {
      'registration_pdf': 'Registration PDF',
      'regfee_receipt_pdf': 'Registration Fee Receipt',
      'reg_invoice_pdf': 'Registration Invoice',
      'demandnote_sdsac': 'SDSAC Demand Note',
      'demandnote_estimate': 'Estimate Demand Note',
      'sdsac_challan': 'SDSAC Challan',
      'sdsac_receipt_pdf': 'SDSAC Receipt',
      'bank_docs': 'Bank Documents',
      'gst_doc': 'GST Document',
      'pan_card_doc': 'PAN Card',
      'upload_file': 'Uploaded File',
      'survey_checklist_pdf': 'Survey Checklist',
      'ndf_upload_estimate_docs': 'NDF Upload Estimate',
      'draft_agreement_pdf': 'Draft Agreement',
      'agreement_doc': 'Agreement Document',
      'supplement_draft_agreement': 'Supplement Draft Agreement',
      'commissioning_report_upload': 'Commissioning Report',
      'extension_work_estimate_docs': 'Extension Work Estimate',
      'estimate_invoice_pdf': 'Estimate Invoice',
      'estimate_challan': 'Estimate Challan',
      'gm_upload_pdf': 'GM Upload'
    };
    return names[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Truncate text with ellipsis
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Tooltip component
  const TooltipWrapper = ({ children, text, className = "" }) => (
    <div className={`group relative inline-block w-full ${className}`}>
      {children}
      {text && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title Section - Increased font sizes */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0c0d52] flex items-center gap-2 border-b-2 border-[#0c0d52] pb-2">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Load Change Applications
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Total Applications: <span className="font-semibold">{filteredApplications.length}</span> / {applications.length}
          </p>
        </div>

        {/* Filters Section - Enhanced with date range */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-[#0c0d52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-base sm:text-lg font-medium text-gray-700">Filter Applications</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Circle Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Circle</label>
              <select
                name="circle"
                value={filters.circle}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0c0d52] focus:border-[#0c0d52]"
              >
                <option value="">All Circles</option>
                {filterOptions.circles.map(circle => (
                  <option key={circle} value={circle}>{circle}</option>
                ))}
              </select>
            </div>

            {/* Division Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Division</label>
              <select
                name="division"
                value={filters.division}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0c0d52] focus:border-[#0c0d52]"
              >
                <option value="">All Divisions</option>
                {filterOptions.divisions.map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>

            {/* Application No Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Application No.</label>
              <input
                type="text"
                name="application_no"
                value={filters.application_no}
                onChange={handleFilterChange}
                placeholder="Search by App No."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0c0d52] focus:border-[#0c0d52]"
              />
            </div>

            {/* LC Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">LC Type</label>
              <select
                name="lc_type"
                value={filters.lc_type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0c0d52] focus:border-[#0c0d52]"
              >
                <option value="">All Types</option>
                {filterOptions.lcTypes.map(type => (
                  <option key={type} value={type}>{formatLCType(type)}</option>
                ))}
              </select>
            </div>

            {/* Status Filter - With grouped options */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select
                name="application_status_text"
                value={filters.application_status_text}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0c0d52] focus:border-[#0c0d52]"
              >
                <option value="">All Status</option>
                {filterOptions.statuses.map((status, index) => {
                  if (typeof status === 'object') {
                    return (
                      <option 
                        key={status.value} 
                        value={status.value} 
                        className={status.isGroup ? 
                          (status.value === 'CONSUMER_SIDE_GROUP' ? 'font-semibold text-purple-600' : 'font-semibold text-yellow-600') 
                          : ''}
                      >
                        {status.label}
                      </option>
                    );
                  }
                  return <option key={index} value={status}>{status}</option>;
                })}
              </select>
            </div>

            {/* Consumer Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Consumer Name</label>
              <input
                type="text"
                name="consumer_name"
                value={filters.consumer_name}
                onChange={handleFilterChange}
                placeholder="Search by Name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0c0d52] focus:border-[#0c0d52]"
              />
            </div>

            {/* Date From Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date From</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0c0d52] focus:border-[#0c0d52]"
              />
            </div>

            {/* Date To Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date To</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                min={filters.dateFrom}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0c0d52] focus:border-[#0c0d52]"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Active Filters Summary */}
          {(filters.circle || filters.division || filters.application_no || filters.lc_type || 
            filters.consumer_name || filters.application_status_text || filters.dateFrom || filters.dateTo) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Active Filters: {filteredApplications.length} applications found
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c0d52]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table - Responsive with better spacing */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] lg:min-w-full table-auto">
                <thead className="bg-[#0c0d52] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-[60px]">S.No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-[130px]">Circle</th>
                    {/* <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-[130px]">Division</th> */}
                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-[140px]">App. No.</th>
                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-[110px]">App. Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-[160px]">LC Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-[200px]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-[220px]">Consumer Name</th>
                    <th className="px-4 py-3 text-center text-sm font-medium uppercase tracking-wider w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-sm text-gray-500">
                        No applications found matching the filters
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app, index) => (
                      <tr 
                        key={app.application_no || index} 
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                        
                        {/* Circle with Tooltip */}
                        <td className="px-4 py-3">
                          <TooltipWrapper text={app.circle || '-'}>
                            <span className="text-sm text-gray-600 block truncate max-w-[110px]">
                              {app.circle || '-'}
                            </span>
                          </TooltipWrapper>
                        </td>
                        
                        {/* Division with Tooltip */}
                        {/* <td className="px-4 py-3">
                          <TooltipWrapper text={app.division || '-'}>
                            <span className="text-sm text-gray-600 block truncate max-w-[110px]">
                              {app.division || '-'}
                            </span>
                          </TooltipWrapper>
                        </td> */}
                        
                        {/* Application No with Tooltip */}
                        <td className="px-4 py-3">
                          <TooltipWrapper text={app.application_no}>
                            <span className="font-mono text-sm font-medium text-[#0c0d52] block truncate max-w-[120px]">
                              {app.application_no}
                            </span>
                          </TooltipWrapper>
                        </td>
                        
                        {/* Application Date */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(app.application_date)}
                          </span>
                        </td>
                        
                        {/* LC Type with Tooltip */}
                        <td className="px-4 py-3">
                          <TooltipWrapper text={formatLCType(app.lc_type)}>
                            <span className="text-sm text-gray-600 block truncate max-w-[140px]">
                              {formatLCType(app.lc_type)}
                            </span>
                          </TooltipWrapper>
                        </td>
                        
                        {/* Status with trimmed text and different colors */}
                        <td className="px-4 py-3">
                          <TooltipWrapper text={app.application_status_text || 'N/A'}>
                            <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(app.application_status_text)} truncate block max-w-[180px]`}>
                              {trimStatusText(app.application_status_text) || 'N/A'}
                            </span>
                          </TooltipWrapper>
                        </td>
                        
                        {/* Consumer Name with Tooltip */}
                        <td className="px-4 py-3">
                          <TooltipWrapper text={app.consumer_name}>
                            <span className="text-sm text-gray-800 block truncate max-w-[200px]">
                              {truncateText(app.consumer_name, 25)}
                            </span>
                          </TooltipWrapper>
                        </td>
                        
                        {/* Documents Button - Better sized */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="inline-flex items-center justify-center gap-1 bg-[#0c0d52] hover:bg-[#1a1b6e] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap min-w-[90px]"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>View</span>
                            <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                              {app.documents?.reduce((acc, stage) => acc + (stage.files?.length || 0), 0) || 0}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer with Record Count */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredApplications.length} of {applications.length} records
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal with Enhanced PDF Viewer */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="bg-[#0c0d52] text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold truncate">Documents - {selectedApp.application_no}</h3>
                  <p className="text-xs text-blue-100 mt-0.5 truncate">{selectedApp.consumer_name}</p>
                  <div className="flex items-center gap-2 text-xs text-blue-200">
                    <span className="truncate">{selectedApp.circle}</span>
                    <span>-</span>
                    <span className="truncate">{selectedApp.division}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-white hover:bg-white/20 rounded p-1 transition-colors flex-shrink-0 ml-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedApp.application_status_text)}`}>
                  {trimStatusText(selectedApp.application_status_text) || 'N/A'}
                </span>
                <span className="text-sm font-medium text-gray-600 ml-2">LC Type:</span>
                <span className="text-sm text-gray-800">{formatLCType(selectedApp.lc_type)}</span>
                <span className="text-sm font-medium text-gray-600 ml-2">Date:</span>
                <span className="text-sm text-gray-800">{formatDate(selectedApp.application_date)}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-160px)] bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getDocumentsByStage(selectedApp).map((stageGroup, idx) => {
                  if (!stageGroup.files || stageGroup.files.length === 0) return null;

                  return (
                    <div key={idx} className="bg-white rounded border border-gray-200 overflow-hidden">
                      {/* Stage Header */}
                      <button
                        onClick={() => toggleSection(stageGroup.stage)}
                        className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 flex items-center justify-between border-b border-gray-200"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-base">{getStageIcon(stageGroup.stage)}</span>
                          <span className="text-sm font-medium text-[#0c0d52] truncate">
                            {getStageDisplayName(stageGroup.stage)}
                          </span>
                          <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            {stageGroup.files.length}
                          </span>
                        </div>
                        <svg 
                          className={`w-4 h-4 transform transition-transform flex-shrink-0 ${
                            expandedSections[stageGroup.stage] ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Stage Items */}
                      {expandedSections[stageGroup.stage] && (
                        <div className="p-2 space-y-2">
                          {stageGroup.files.map((file, fileIdx) => {
                            const fileUrl = getDocumentUrl(file.file_url);
                            const fileExtension = file.file_name?.split('.').pop()?.toUpperCase() || 'PDF';

                            return (
                              <div 
                                key={fileIdx} 
                                className="flex items-center justify-between p-2 hover:bg-blue-50 rounded border border-gray-100"
                              >
                                <div className="flex-1 min-w-0 mr-2">
                                  <TooltipWrapper text={getFieldDisplayName(file.field_name)}>
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                      {getFieldDisplayName(file.field_name)}
                                    </p>
                                  </TooltipWrapper>
                                  <TooltipWrapper text={file.file_name}>
                                    <p className="text-xs text-gray-500 truncate">
                                      {file.file_name}
                                    </p>
                                  </TooltipWrapper>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                    {fileExtension}
                                  </span>
                                  <button
                                    onClick={() => {
                                      if (fileUrl) {
                                        window.open(fileUrl, '_blank', 'noopener,noreferrer');
                                      }
                                    }}
                                    className="text-sm bg-[#0c0d52] hover:bg-[#1a1b6e] text-white px-3 py-1 rounded"
                                  >
                                    View
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* No Documents Message */}
              {(!selectedApp.documents || selectedApp.documents.length === 0 || 
                selectedApp.documents.every(stage => !stage.files || stage.files.length === 0)) && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-base text-gray-500">No documents available for this application</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadAllPdf;