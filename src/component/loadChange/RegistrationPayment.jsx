// import React, { useState, useEffect } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { Button } from "../importComponents";
// // import { useSelector } from 'react-redux';
// import { HT_LOAD_CHANGE_BASE, HT_LOAD_CHANGE_PUBLIC_URL } from "../../api/api.js";

// const LoadChangePay = () => {
//   const [payClicked, setPayClicked] = useState(false);

//   const location = useLocation();
//   const { result, locationData } = location.state || {};
//   const id = result?.data?.application ? result?.data?.application : result?.id
//   const total_pay_amount = result?.data?.total_pay_amount ? result?.data?.total_pay_amount : result?.tariff_charges?.total_pay_amount

//   const [paymentType, setPaymentType] = useState("online");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [challanData, setChallanData] = useState(null);

//   const [isGeneratingDemandNote, setIsGeneratingDemandNote] = useState(false);
//   const [demandNoteData, setDemandNoteData] = useState(null);

//   //   const {
//   //     consumer_name,
//   //   application_no,
//   // } = useSelector(state => state.user.userData);

//   // 🧾 Function: Generate Challan
//   const generateChallan = async () => {
//     if (!id) return;

//     setIsGenerating(true);
//     try {
//       const response = await fetch(
//         `${HT_LOAD_CHANGE_BASE}/GenerateChallanPdf/${id}/`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const res = await response.json();
//       if (res.message === "PDF generated successfully.") {
//         setChallanData(res);
//       } else {
//         console.warn("Challan not generated:", res.message);
//       }
//     } catch (error) {
//       console.error("Error generating challan:", error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // ✅ Function: Generate Demand Note (Same as Challan)
//   const generateDemandNote = async () => {
//     if (!id) return;

//     setIsGeneratingDemandNote(true);
//     try {
//       const response = await fetch(
//         `${HT_LOAD_CHANGE_BASE}/GenerateDemandNote_Sdsac/${id}/`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const res = await response.json();
//       if (res.message === "PDF generated successfully.") {
//         setDemandNoteData(res);
//       } else {
//         console.warn("Demand Note not generated:", res.message);
//         alert(res.message || "Failed to generate Demand Note");
//       }
//     } catch (error) {
//       console.error("Error generating demand note:", error);
//       alert("Error generating Demand Note. Please try again.");
//     } finally {
//       setIsGeneratingDemandNote(false);
//     }
//   };

//   useEffect(() => {
//   const clicked = localStorage.getItem(`regfee_clicked_${id}`);
//   if (clicked === "true") {
//     setPayClicked(true);
//   }
// }, [id]);

//   return (
//     <div className="container mx-auto">
//       <div className="card mt-2 mb-2 bg-white rounded shadow-md">
//         <div className="card-header px-4 py-2 border-b border-gray-300">
//           <h2 className="text-lg font-bold capitalize">Load Change Payment</h2>
//           <h2><strong>Application No. :- {locationData?.data?.application_no || result?.application_no}</strong></h2>
//           <span><strong>Consumer Name :- {locationData?.data?.consumer_name || result?.consumer_name}</strong></span>
//         </div>

//         <div className="card-body px-4 pb-4">
//           <div className="overflow-auto w-full">
//             <table className="min-w-full divide-y divide-gray-200 mt-4 border border-gray-300">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="border border-gray-300">S No.</th>
//                   <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase border border-gray-300">
//                     Particular
//                   </th>
//                   {/* <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase border border-gray-300">
//                     Account Head
//                   </th> */}
//                   <th className="border border-gray-300">Amount</th>
//                   <th className="border border-gray-300">Action</th>
//                   <th className="border border-gray-300">View File</th>
//                 </tr>
//               </thead>

//               <tbody className="bg-white divide-y divide-gray-200">
//                 <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
//                   <td className="px-6 py-4 border border-gray-300">1</td>
//                   <td className="px-6 py-4 border border-gray-300">
//                     Total Payable Amount
//                   </td>
//                   {/* <td className="px-6 py-4 border border-gray-300">
//                     48.48/50.89
//                   </td> */}
//                   <td className="px-6 py-4 text-center border border-gray-300">
//                     {total_pay_amount}
//                   </td>

//                   <td className="px-6 py-4 text-sm font-medium text-center border border-gray-300">
//                     {/* Payment Type Radio */}
//                     <div>
//                       <label className="mr-4">
//                         <input
//                           type="radio"
//                           name="payment_type"
//                           value="online"
//                           checked={paymentType === "online"}
//                           onChange={() => setPaymentType("online")}
//                         />{" "}
//                         Online
//                       </label>
//                       <label>
//                         <input
//                           type="radio"
//                           name="payment_type"
//                           value="offline"
//                           checked={paymentType === "offline"}
//                           onChange={() => setPaymentType("offline")}
//                         />{" "}
//                         Challan
//                       </label>
//                     </div>

//                     {/* Buttons */}
//                     <div className="mt-3">
//                       {paymentType === "online" ? (
//                         // <Link
//                         //   to={`https://htsanyojanuat.mpcz.in:8088/ht-load-change-api/call_lc_regfee/${id}`}
//                         // >
//                         //   <Button label="Pay" className="p-2" />
//                         // </Link>
//                         <a href={`${HT_LOAD_CHANGE_PUBLIC_URL}/ht_load_change/call_lc_regfee/${id}`} target="_blank" rel="noopener noreferrer"
//                           onClick={() => {
//                           setPayClicked(true);
//                           localStorage.setItem(`regfee_clicked_${id}`, "true");
//                         }}
//                         >
//                           <Button
//                             label="Pay"
//                             className="p-2"
//                             disabled={
//                               payClicked                         
//                             }
//                           />
//                         </a>

//                       ) : (
//                         <>
//                           {challanData ? (
//                             <Link
//                               to={`${HT_LOAD_CHANGE_PUBLIC_URL}${challanData?.pdf_url}`}

//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               <Button
//                                 label="Download Challan"
//                                 className="p-2"
//                               />
//                             </Link>
//                           ) : (
//                             <Button
//                               label={
//                                 isGenerating
//                                   ? "Generating..."
//                                   : "Generate Challan"
//                               }
//                               onClick={generateChallan}
//                               disabled={isGenerating}
//                               className="p-2"
//                             />
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </td>

//                   {/* Demand Note */}
//                   {/* <td className="text-center border border-gray-300">
//                     <Link
//                       to={`https://htsanyojanuat.mpcz.in:8088/ht-load-change-api/GenerateDemandNote_Sdsac/${result?.data?.application}/`}
//                     >
//                       <Button label="Demand Note" />
//                     </Link>

//                   </td> */}
//                   {/* ✅ Updated Demand Note Section */}
//                   <td className="text-center border border-gray-300">
//                     {demandNoteData ? (
//                       <Link
//                         to={`${HT_LOAD_CHANGE_PUBLIC_URL}${demandNoteData?.pdf_url}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Button
//                           label="Download Demand Note"
//                           className="p-2"
//                         />
//                       </Link>
//                     ) : (
//                       <Button
//                         label={
//                           isGeneratingDemandNote
//                             ? "Generating..."
//                             : "Generate Demand Note"
//                         }
//                         onClick={generateDemandNote}
//                         disabled={isGeneratingDemandNote}
//                         className="p-2"
//                       />
//                     )}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoadChangePay;

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "../importComponents";
// import { useSelector } from 'react-redux';
import { HT_LOAD_CHANGE_BASE, HT_LOAD_CHANGE_PUBLIC_URL } from "../../api/api.js";
import { getAppAuth } from "../../utils/Storage/Storage.js";

const LoadChangePay = () => {
  const [appData, setAppData] = useState(null);
  const [isPayDisabled, setIsPayDisabled] = useState(false);

    const auth = getAppAuth();
     const applicationNo = auth?.application_no;
     const password = auth?.password;

  const location = useLocation();
  const { result, locationData } = location.state || {};
  const id = result?.data?.application ? result?.data?.application : result?.id
  const total_pay_amount = result?.data?.total_pay_amount ? result?.data?.total_pay_amount : result?.tariff_charges?.total_pay_amount

  const [paymentType, setPaymentType] = useState("online");
  const [isGenerating, setIsGenerating] = useState(false);
  const [challanData, setChallanData] = useState(null);

  const [isGeneratingDemandNote, setIsGeneratingDemandNote] = useState(false);
  const [demandNoteData, setDemandNoteData] = useState(null);

  //   const {
  //     consumer_name,
  //   application_no,
  // } = useSelector(state => state.user.userData);

  const fetchApplicationStatus = async () => {
  if (!applicationNo || !password) {
    console.error("Application credentials missing");
    return;
  }

  try {
    const response = await fetch(
      `${HT_LOAD_CHANGE_BASE}/get-load-change-applications/?application_no=${applicationNo}&password=${password}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const res = await response.json();

    if (res?.data) {
      setAppData(res.data);

      if (res.data.is_regfee_submitted_bypg === true) {
        setIsPayDisabled(true);
      }
    }
  } catch (error) {
    console.error("Failed to fetch application status", error);
  }
};

useEffect(() => {
  fetchApplicationStatus();
}, []);



  // 🧾 Function: Generate Challan
  const generateChallan = async () => {
    if (!id) return;

    setIsGenerating(true);
    try {
      const response = await fetch(
        `${HT_LOAD_CHANGE_BASE}/GenerateChallanPdf/${id}/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const res = await response.json();
      if (res.message === "PDF generated successfully.") {
        setChallanData(res);
      } else {
        console.warn("Challan not generated:", res.message);
      }
    } catch (error) {
      console.error("Error generating challan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Function: Generate Demand Note (Same as Challan)
  const generateDemandNote = async () => {
    if (!id) return;

    setIsGeneratingDemandNote(true);
    try {
      const response = await fetch(
        `${HT_LOAD_CHANGE_BASE}/GenerateDemandNote_Sdsac/${id}/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const res = await response.json();
      if (res.message === "PDF generated successfully.") {
        setDemandNoteData(res);
      } else {
        console.warn("Demand Note not generated:", res.message);
        alert(res.message || "Failed to generate Demand Note");
      }
    } catch (error) {
      console.error("Error generating demand note:", error);
      alert("Error generating Demand Note. Please try again.");
    } finally {
      setIsGeneratingDemandNote(false);
    }
  };

  useEffect(() => {
    const clicked = localStorage.getItem(`regfee_clicked_${id}`);
    if (clicked === "true") {
      setPayClicked(true);
    }
  }, [id]);

  return (
    <div className="container mx-auto">
      <div className="card mt-2 mb-2 bg-white rounded shadow-md">
        <div className="card-header px-4 py-2 border-b border-gray-300">
          <h2 className="text-lg font-bold capitalize">Load Change Payment</h2>
          <h2><strong>Application No. :- {locationData?.data?.application_no || result?.application_no}</strong></h2>
          <span><strong>Consumer Name :- {locationData?.data?.consumer_name || result?.consumer_name}</strong></span>
        </div>

        <div className="card-body px-4 pb-4">
          <div className="overflow-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 mt-4 border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300">S No.</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase border border-gray-300">
                    Particular
                  </th>
                  {/* <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase border border-gray-300">
                    Account Head
                  </th> */}
                  <th className="border border-gray-300">Amount</th>
                  <th className="border border-gray-300">Action</th>
                  <th className="border border-gray-300">View File</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="transition-all hover:bg-gray-100 hover:shadow-lg">
                  <td className="px-6 py-4 border border-gray-300">1</td>
                  <td className="px-6 py-4 border border-gray-300">
                    Total Payable Amount
                  </td>
                  {/* <td className="px-6 py-4 border border-gray-300">
                    48.48/50.89
                  </td> */}
                  <td className="px-6 py-4 text-center border border-gray-300">
                    {total_pay_amount}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-center border border-gray-300">
                    {/* Payment Type Radio */}
                    <div>
                      <label className="mr-4">
                        <input
                          type="radio"
                          name="payment_type"
                          value="online"
                          checked={paymentType === "online"}
                          onChange={() => setPaymentType("online")}
                        />{" "}
                        Online
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="payment_type"
                          value="offline"
                          checked={paymentType === "offline"}
                          onChange={() => setPaymentType("offline")}
                        />{" "}
                        Challan
                      </label>
                    </div>

                    {/* Buttons */}
                    <div className="mt-3">
                      {paymentType === "online" ? (
                        // <Link
                        //   to={`https://htsanyojanuat.mpcz.in:8088/ht-load-change-api/call_lc_regfee/${id}`}
                        // >
                        //   <Button label="Pay" className="p-2" />
                        // </Link>
                        <a
                          href={`${HT_LOAD_CHANGE_PUBLIC_URL}/ht_load_change/call_lc_regfee/${id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            label={
                              isPayDisabled ? "Payment Completed" : "Pay"
                            }
                            className="p-2"
                            disabled={isPayDisabled}
                          />
                        </a>


                      ) : (
                        <>
                          {challanData ? (
                            <Link
                              to={`${HT_LOAD_CHANGE_PUBLIC_URL}${challanData?.pdf_url}`}

                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                label="Download Challan"
                                className="p-2"
                              />
                            </Link>
                          ) : (
                            <Button
                              label={
                                isGenerating
                                  ? "Generating..."
                                  : "Generate Challan"
                              }
                              onClick={generateChallan}
                              disabled={isGenerating}
                              className="p-2"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </td>

                  {/* Demand Note */}
                  {/* <td className="text-center border border-gray-300">
                    <Link
                      to={`https://htsanyojanuat.mpcz.in:8088/ht-load-change-api/GenerateDemandNote_Sdsac/${result?.data?.application}/`}
                    >
                      <Button label="Demand Note" />
                    </Link>

                  </td> */}
                  {/* ✅ Updated Demand Note Section */}
                  <td className="text-center border border-gray-300">
                    {demandNoteData ? (
                      <Link
                        to={`${HT_LOAD_CHANGE_PUBLIC_URL}${demandNoteData?.pdf_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          label="Download Demand Note"
                          className="p-2"
                        />
                      </Link>
                    ) : (
                      <Button
                        label={
                          isGeneratingDemandNote
                            ? "Generating..."
                            : "Generate Demand Note"
                        }
                        onClick={generateDemandNote}
                        disabled={isGeneratingDemandNote}
                        className="p-2"
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 🔴 IMPORTANT NOTE (ENGLISH + HINDI) */}
          <div className="mt-4 p-4 border-l-4 border-red-500 bg-red-50 rounded">
            <p className="text-sm text-red-700 font-semibold">
              Important Note:
            </p>
            <p className="text-sm text-red-600 mt-1">
              If the payment has been deducted against the online application, DO
              NOT make same payment further until the deducted amount is refunded.
            </p>

            <p className="text-sm text-red-700 font-semibold mt-3">
              महत्वपूर्ण टीप:
            </p>
            <p className="text-sm text-red-600 mt-1">
              यदि ऑनलाइन आवेदन के विरुद्ध भुगतान काट लिया गया है, तो कटे हुए
              राशि के वापस मिलने तक उसी भुगतान को फिर से न करें।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadChangePay;

