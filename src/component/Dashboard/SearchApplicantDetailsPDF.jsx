import React, { use, useEffect, useState } from 'react';
import { useLocation, NavLink, useParams } from 'react-router-dom';
import { getDataForEmpToken } from '../../utils/handlePostApi.js';
import { HT_LOAD_CHANGE_BASE } from '../../api/api.js';
import Cookies from 'js-cookie';
export default function PaddingApplication() {
  const [pendingApplication, setPendingApplication] = useState([]);
  const [applicationStatusName, setApplicationStatusName] = useState([]);
  const [statusUrl, setStatusUrl] = useState();
  const [currentPage, setCurrantPage] = useState(0);
  const token = Cookies.get('accessToken');
  console.log(token, 'token');

  const location = useLocation();
  const { application_no } = useParams();
  const { emp_id, flag_id } = location.state || {};
 useEffect(() => {
  const fetchData = async () => {
    try {
      let response = await fetch(
        `${HT_LOAD_CHANGE_BASE}/connection-served-applications/`,
        {
          method: "POST", // POST call
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // only token pass
          },
        }
      );

      let result = await response.json();
      console.log("API Result:", result);

      setPendingApplication(result.applications);
      // setApplicationStatusName(result.flag);
      // setStatusUrl(result.flag.name.split(' ').join('_'));
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();
}, [token]);

  let PageSize = 10;
  let itemsLength = pendingApplication.length;
  let numOfPages = Math.ceil(itemsLength / PageSize);
  console.log(pendingApplication.length);
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
  return (
    <>
      <div class="card mt-2 mb-2 bg-white rounded shadow-md ">
        <div className="card-header px-4 py-2 border-b border-gray-300">
          <h2 className="text-lg font-bold capitalize ">{applicationStatusName.name}</h2>
        </div>
        <div className="card-body px-4 pb-4 pt-2">

          <div className="tableinfo overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 mb-2">
              <thead className="bg-[#0c0d52] text-white">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white  w-[10%]">
                    Application No
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[30%] max-w-[100px]">
                    Firm Name
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
                    Circle Name
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
                    Division
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
                    Type of change
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
                    Load Change type
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500 uppercase text-white w-[10%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingApplication.slice(Start, End).length > 0 ? (
                  pendingApplication.slice(Start, End).map((items, index) => (
                    <tr key={index} className="transition-all hover:bg-gray-100 hover:shadow-lg">
                      <td className="px-6 py-4 ">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {items.application_no}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 ">
                        <div className="text-sm text-gray-900 word-break">{items.consumer_name}</div>
                      </td>
                      <td className="px-6 py-4 ">
                        <span className="inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          {items.circle}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 ">
                        {items.division}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 ">
                        {items.type_of_change}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 ">
                        {items.lc_type}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-left ">
                        <NavLink
                          to={{ pathname: `/dashboard/download/${items.id}` }}
                          state={{ items }}
                        >
                          <button className="bg-[#0c0d52] text-white px-4 py-2 rounded text-sm hover:bg-[blue]">
                            View Application
                          </button>
                        </NavLink>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div>
            <nav class="Page navigation example mt-2 mb-5">
              <ul className="flex items-center justify-end">
                <li>
                  <button
                    disabled={currentPage === 0}
                    onClick={() => goToPrevPage()}
                    className="border border-gray-300 p-2 rounded text-sm hover:bg-[#0c0d52] hover:text-white hover:border-white min-w-15"
                  >
                    Previous
                  </button>
                </li>
                {[...Array(numOfPages).keys()].map(n => (
                  <li key={n}>
                    <button
                      onClick={() => handlePageChange(n)}
                      className={`border border-gray-300 p-2 rounded text-sm hover:bg-[#0c0d52] hover:text-white hover:border-white
    ${n === currentPage ? 'bg-[#0c0d52] w-10 text-white' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}
    dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    >
                      {n + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    disabled={currentPage === numOfPages - 1}
                    onClick={() => goToNextPage()}
                    className="border border-gray-300 p-2 rounded text-sm hover:bg-[#0c0d52] hover:text-white hover:border-white min-w-15"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
